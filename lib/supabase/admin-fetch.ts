import { getAdminAuthBrowserClient } from "@/lib/supabase/admin-auth-browser-client";

/**
 * Browser helper for calling protected `/api/admin/*` routes. Attaches the
 * current admin's Supabase access token as a Bearer header so the server can
 * verify the caller (see lib/supabase/admin-server-auth.ts). Use this instead
 * of a bare `fetch` for every admin API call.
 */
export async function adminApiFetch(input: string, init?: RequestInit): Promise<Response> {
  const { data } = await getAdminAuthBrowserClient().auth.getSession();
  const token = data.session?.access_token;
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
