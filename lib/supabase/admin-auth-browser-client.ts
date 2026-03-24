import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminAuthBrowserClient: SupabaseClient | null = null;

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

export function isAdminAuthConfigured(): boolean {
  const url = supabasePublicUrl();
  const key = supabasePublicAnonKey();
  return url.length > 0 && key.length > 0 && url.startsWith("http");
}

/**
 * Uses sessionStorage so that closing the browser tab clears the session,
 * requiring re-login next time. Refreshing the page keeps the session alive.
 */
const sessionStorageAdapter = {
  getItem: (key: string) =>
    typeof window !== "undefined" ? sessionStorage.getItem(key) : null,
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") sessionStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") sessionStorage.removeItem(key);
  },
};

export function getAdminAuthBrowserClient(): SupabaseClient {
  if (!isAdminAuthConfigured()) {
    throw new Error(
      "Supabase URL or anon key is missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_ equivalents) in .env and restart the dev server.",
    );
  }

  if (!adminAuthBrowserClient) {
    adminAuthBrowserClient = createClient(supabasePublicUrl(), supabasePublicAnonKey(), {
      auth: {
        storageKey: "popout-admin-auth",
        storage: sessionStorageAdapter,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return adminAuthBrowserClient;
}
