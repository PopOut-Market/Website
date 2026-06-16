import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Server-side authorization gate for every `/api/admin/*` route. These routes
 * use the Supabase service-role key (which bypasses RLS), so they MUST verify
 * the caller. The admin dashboard sends the admin's Supabase access token as
 * `Authorization: Bearer <jwt>` (see lib/supabase/admin-fetch.ts).
 *
 * Two modes:
 *  - ADMIN_EMAILS set   -> full lockdown: valid token AND email on the allowlist.
 *  - ADMIN_EMAILS unset -> authenticated-only: a valid signed-in Supabase
 *                          session is required (this closes the anonymous data
 *                          leak), but no email allowlist is applied. The admin
 *                          dashboard already requires login, so this adds no
 *                          friction. Set ADMIN_EMAILS later to upgrade.
 *
 * This gate only affects `/api/admin/*`. It does NOT touch public pages or the
 * market feed (which regular visitors browse without logging in).
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function adminEmailAllowlist(): Set<string> {
  return new Set(
    env("ADMIN_EMAILS")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

function deny(status: number, message: string): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Returns `{ email }` for an authorized admin, or a `NextResponse` (401/403/429/500)
 * to return immediately. Usage:
 *   const gate = await requireAdmin(req);
 *   if (gate instanceof NextResponse) return gate;
 */
export async function requireAdmin(req: Request): Promise<{ email: string } | NextResponse> {
  const rl = rateLimit(`admin:${clientIp(req)}`, 60, 60_000);
  if (!rl.ok) {
    const res = deny(429, "Too many requests.");
    res.headers.set("Retry-After", String(rl.retryAfterSec));
    return res;
  }

  const allowlist = adminEmailAllowlist();

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) return deny(401, "Missing bearer token.");

  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = env("EXPO_PUBLIC_SUPABASE_ANON_KEY") || env("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return deny(500, "Supabase is not configured on the server.");
  }

  const sb = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await sb.auth.getUser(token);
  const email = data.user?.email?.toLowerCase() ?? "";
  if (error || !email) return deny(401, "Invalid or expired session.");
  if (allowlist.size > 0 && !allowlist.has(email)) {
    return deny(403, "Not authorized.");
  }

  return { email };
}
