import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client for the `/l/<token>` share landing route.
 *
 * Deliberately SEPARATE from `browser-client.ts`. The rest of the site reads the
 * live market from the production project, but share tokens currently only exist
 * in the v2 staging project — so the share route needs its own pointer, and
 * pointing the shared client at staging would empty out every market page.
 *
 * Resolution order lets you override just this route and otherwise inherit:
 *   SHARE_SUPABASE_URL / SHARE_SUPABASE_ANON_KEY   <- staging, while tokens live there
 *   SUPABASE_URL / SUPABASE_ANON_KEY               <- plain names, if you prefer them
 *   EXPO_PUBLIC_* / NEXT_PUBLIC_*                  <- whatever the rest of the site uses
 *
 * Once share tokens exist in production, clear the SHARE_* pair and this route
 * follows the site's main project with no code change.
 *
 * These are read at runtime and never inlined into the client bundle: the route
 * that uses them is a server Route Handler, and the names carry no NEXT_PUBLIC_
 * prefix. The anon key is public-by-design in any case.
 */

function clean(value: string | undefined): string {
  return value?.trim() ?? "";
}

/**
 * Resolve the URL and the key together, as a PAIR, from the first tier that
 * supplies BOTH.
 *
 * Resolving them independently would let a half-set override cross the streams —
 * e.g. `SHARE_SUPABASE_URL` pointed at staging while the key fell through to the
 * production tier. Supabase answers that combination with a 401, which this
 * route swallows into the generic card, so every share link on the site would
 * quietly render "no such listing" with no error anywhere. Pairing makes a
 * partial override fall through cleanly to the next complete tier instead.
 */
function resolveSharePreviewCredentials(): { url: string; anonKey: string } {
  const tiers: Array<[string, string]> = [
    [clean(process.env.SHARE_SUPABASE_URL), clean(process.env.SHARE_SUPABASE_ANON_KEY)],
    [clean(process.env.SUPABASE_URL), clean(process.env.SUPABASE_ANON_KEY)],
    [clean(process.env.EXPO_PUBLIC_SUPABASE_URL), clean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)],
    [clean(process.env.NEXT_PUBLIC_SUPABASE_URL), clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)],
  ];
  for (const [url, anonKey] of tiers) {
    if (url.length > 0 && anonKey.length > 0) {
      return { url: url.replace(/\/$/, ""), anonKey };
    }
  }
  return { url: "", anonKey: "" };
}

export function sharePreviewSupabaseUrl(): string {
  return resolveSharePreviewCredentials().url;
}

export function isSharePreviewSupabaseConfigured(): boolean {
  const { url, anonKey } = resolveSharePreviewCredentials();
  return url.startsWith("http") && anonKey.length > 0;
}

let shareClient: SupabaseClient | null = null;

/** Singleton. Only call when `isSharePreviewSupabaseConfigured()` is true. */
export function getSharePreviewSupabaseClient(): SupabaseClient {
  if (!shareClient) {
    const { url, anonKey } = resolveSharePreviewCredentials();
    shareClient = createClient(url, anonKey, {
      auth: {
        // No user ever signs in on this route; it calls one anon-callable
        // SECURITY DEFINER RPC and nothing else.
        storageKey: "popout-website-share-preview",
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return shareClient;
}
