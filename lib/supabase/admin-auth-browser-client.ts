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
 * Where the admin session is kept.
 *
 * **Production uses `sessionStorage`**, deliberately: closing the tab ends the
 * session, so an admin console left open on a shared or unattended machine does
 * not stay signed in indefinitely. Refreshing keeps it.
 *
 * **Local development uses `localStorage`** instead, because `sessionStorage` is
 * scoped to a single tab: opening the dashboard in a new tab, or restarting the
 * dev server and reopening it, meant signing in again every time.
 *
 * This is safe to ship. `process.env.NODE_ENV` is statically substituted by Next
 * at build time, so in a production build the condition folds to `false` and the
 * localStorage branch is removed from the bundle entirely — production cannot
 * take this path even by accident.
 */
const IS_DEV = process.env.NODE_ENV === "development";

function backingStore(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return IS_DEV ? window.localStorage : window.sessionStorage;
  } catch {
    // Private mode / storage disabled. Returning null degrades to an in-memory
    // session for this page rather than throwing on every auth call.
    return null;
  }
}

const sessionStorageAdapter = {
  getItem: (key: string) => backingStore()?.getItem(key) ?? null,
  setItem: (key: string, value: string) => {
    try {
      backingStore()?.setItem(key, value);
    } catch {
      /* quota or disabled storage — the session simply does not persist */
    }
  },
  removeItem: (key: string) => {
    try {
      backingStore()?.removeItem(key);
    } catch {
      /* ignore */
    }
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
