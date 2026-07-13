import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";
import { paidCountsByOwner } from "@/lib/supabase/reward-paid-counts";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/**
 * Read-only: how many listings each seller has actually been PAID for
 * (owner_id -> count of status='approved' claims).
 *
 * This is a LABEL, not a control. `admin_review_claim` enforces the 6-listing cap
 * itself — it counts the seller's `listing_approved` ledger rows under an advisory
 * lock and, past the cap, credits nothing and writes `status='closed_at_cap'`
 * instead. A client cannot make it overpay. So this route only decides whether the
 * reward-review page's approve button reads "+10 coins" or "no coins"; if it is
 * stale or unavailable, the button still works and the receipt still tells the
 * truth (the page renders that from the RPC's own `credited` flag).
 *
 * `status='approved'` means COINS WERE PAID — `closed_at_cap` (fine listing, seller
 * already at the cap) is deliberately a different value, so it is not counted here
 * and never consumes a reward slot.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;

  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Missing server key." }, { status: 500 });
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const result = await paidCountsByOwner(sb);
  if (!result.ok) {
    return NextResponse.json({ error: `Query failed: ${result.error}` }, { status: 500 });
  }

  // Drop the synthetic "(unknown)" bucket — the page keys strictly on a real
  // owner_id, and a claim with none simply has no cap to preview.
  const { "(unknown)": _unknown, ...counts } = result.data.counts;

  return NextResponse.json({ counts });
}
