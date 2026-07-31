import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client for the `/l/<token>` share landing route.
 *
 * Share tokens landed in production on 2026-07-28, so this route now reads the
 * same project as the rest of the site:
 *   EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY
 *   NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * There is deliberately NO per-route override tier. Earlier `SHARE_SUPABASE_*`
 * and bare `SUPABASE_*` tiers existed to point this route at v2 staging while
 * tokens lived only there; a leftover staging `SHARE_SUPABASE_URL` in Netlify
 * then made every production share link render the generic card, silently,
 * because a token that does not exist and a misconfigured project are
 * indistinguishable downstream. Reintroducing an override recreates that trap.
 * Point the whole site at another project if you need to test against one.
 *
 * The EXPO_PUBLIC_ pair is read from the real runtime environment; the
 * NEXT_PUBLIC_ pair is inlined at build time by `next.config.ts`, which copies
 * the Expo values into it. That inlining is the safety net here — Netlify env
 * vars scoped to builds only are absent from the function runtime, so the
 * baked NEXT_PUBLIC_ tier is what this route actually resolves in production.
 * Both keys are anon keys, public-by-design.
 */

function clean(value: string | undefined): string {
  return value?.trim() ?? "";
}

/**
 * Resolve the URL and the key together, as a PAIR, from the first tier that
 * supplies BOTH.
 *
 * Resolving them independently would let a half-set pair cross the streams — a
 * URL from one project with a key from another. Supabase answers that
 * combination with a 401, which this route swallows into the generic card, so
 * every share link on the site would quietly render "no such listing" with no
 * error anywhere. Pairing makes a partial set fall through cleanly to the next
 * complete tier instead.
 */
function resolveSharePreviewCredentials(): { url: string; anonKey: string } {
  const tiers: Array<[string, string]> = [
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
