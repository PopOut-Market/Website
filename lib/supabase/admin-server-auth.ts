import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Server-side authorization gate for every `/api/admin/*` route. These routes
 * use the Supabase service-role key (which bypasses RLS), so they MUST verify
 * the caller. The admin dashboard signs in with phone-based SMS OTP and sends
 * the admin's Supabase access token as `Authorization: Bearer <jwt>` (see
 * lib/supabase/admin-fetch.ts).
 *
 * Authorization model:
 *   1. Validate the bearer token -> resolve the Supabase user id.
 *   2. Confirm that user id exists in the RLS-locked `reward_admins` table,
 *      read with the service-role client (only the server can read it).
 *   Fail-closed: a missing row (or a lookup error) denies. There is NO
 *   "any authenticated user" fallback.
 *
 * This gate only affects `/api/admin/*`. It does NOT touch public pages or the
 * market feed (which regular visitors browse without logging in).
 */

// Column in `reward_admins` holding the auth user's id (FK to auth.users.id).
const ADMIN_ID_COLUMN = "user_id";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function deny(status: number, message: string): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export type AdminIdentity = { userId: string; phone: string | null; email: string | null };

/**
 * Returns the authorized admin's identity, or a `NextResponse`
 * (401/403/429/500) to return immediately. Usage:
 *   const gate = await requireAdmin(req);
 *   if (gate instanceof NextResponse) return gate;
 */
export async function requireAdmin(req: Request): Promise<AdminIdentity | NextResponse> {
  const rl = rateLimit(`admin:${clientIp(req)}`, 60, 60_000);
  if (!rl.ok) {
    const res = deny(429, "Too many requests.");
    res.headers.set("Retry-After", String(rl.retryAfterSec));
    return res;
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) return deny(401, "Missing bearer token.");

  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return deny(500, "Supabase admin is not configured on the server.");
  }

  // Service-role client: validates the caller's token AND reads the RLS-locked
  // reward_admins allowlist. Never exposed to the browser.
  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userErr } = await sb.auth.getUser(token);
  const user = userData?.user;
  if (userErr || !user?.id) return deny(401, "Invalid or expired session.");

  const { data: row, error: lookupErr } = await sb
    .from("reward_admins")
    .select(ADMIN_ID_COLUMN)
    .eq(ADMIN_ID_COLUMN, user.id)
    .maybeSingle();

  // Fail closed: a lookup error or a missing row both deny.
  if (lookupErr || !row) return deny(403, "Not authorized.");

  return { userId: user.id, phone: user.phone ?? null, email: user.email ?? null };
}
