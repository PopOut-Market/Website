import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function supabasePublicUrl(): string {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  ).trim();
}

function supabasePublicAnonKey(): string {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  ).trim();
}

export function isSupabaseBrowserConfigured(): boolean {
  const url = supabasePublicUrl();
  const key = supabasePublicAnonKey();
  return url.length > 0 && key.length > 0 && url.startsWith("http");
}

/**
 * Singleton browser client. Only call when `isSupabaseBrowserConfigured()` is true.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!isSupabaseBrowserConfigured()) {
    throw new Error(
      "Supabase URL or anon key is missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_ equivalents) in .env and restart the dev server.",
    );
  }
  if (!browserClient) {
    browserClient = createClient(supabasePublicUrl(), supabasePublicAnonKey(), {
      auth: {
        storageKey: "popout-website-supabase",
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return browserClient;
}

/** Main feed table: your real `posts` table by default; set to `web_market_posts` only for the flat demo schema. */
export function marketListingsTableName(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_MARKET_TABLE ?? "posts";
}

/**
 * Optional filter on `posts.status` — values must exist on your `post_status` enum or Postgres errors.
 * If unset/empty, the query does **not** filter by status (rely on RLS to hide non-public rows).
 * In SQL: `select unnest(enum_range(null::post_status));` to list valid labels.
 */
export function marketPostStatuses(): string[] {
  const raw =
    process.env.NEXT_PUBLIC_SUPABASE_POST_STATUSES ??
    process.env.NEXT_PUBLIC_SUPABASE_POST_STATUS ??
    "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Public bucket for `posts.thumbnail_path` — matches Expo `src/lib/storage.ts` (`post_images`). */
export function marketImagesBucketName(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_MARKET_IMAGES_BUCKET ?? "post_images";
}
