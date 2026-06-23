import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/**
 * Read-only: returns the number of already-APPROVED reward claims per seller
 * (owner_id -> count). The reward-review page uses this to soft-cap approvals at
 * 6 per user. This is advisory only — the real write still goes through the
 * SECURITY DEFINER `admin_review_claim` RPC, which does not (yet) enforce the
 * cap. Enforce hard in that RPC for a guarantee.
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

  const { data, error } = await sb
    .from("reward_listing_claims")
    .select("owner_id")
    .eq("status", "approved");

  if (error) {
    return NextResponse.json({ error: `Query failed: ${error.message}` }, { status: 500 });
  }

  const counts: Record<string, number> = {};
  (data ?? []).forEach((r: { owner_id: string | null }) => {
    if (r.owner_id) counts[r.owner_id] = (counts[r.owner_id] ?? 0) + 1;
  });

  return NextResponse.json({ counts });
}
