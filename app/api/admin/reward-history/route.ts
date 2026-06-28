import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * Reward APPROVAL history (read-only, service-role behind requireAdmin).
 *
 * The reward-review page's live queue only shows status='pending' claims (via the
 * gated `admin_list_pending_claims` RPC). This route is the complement: it returns
 * the already-APPROVED `reward_listing_claims`, newest-first, plus a summary of how
 * many listings each seller has had approved and the overall totals.
 *
 * Notes:
 * - `owner_id` and `post_id` embed cleanly (FKs exist). `decided_by` has NO FK to
 *   profiles, so reviewer nicknames are resolved via a separate profiles lookup.
 * - Summary totals are computed from a full lightweight owner_id scan so they stay
 *   accurate even when the detailed list is capped at LIMIT.
 */

const LIMIT = 300;

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

type PostEmbed =
  | { raw_title: string | null; price_cents: number | null; thumbnail_path: string | null }
  | { raw_title: string | null; price_cents: number | null; thumbnail_path: string | null }[]
  | null;
function post1(p: PostEmbed) {
  return Array.isArray(p) ? (p[0] ?? null) : p;
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;

  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase admin is not configured on the server." },
      { status: 500 },
    );
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // Accurate totals + per-seller counts across ALL approved claims (cheap scan).
    const { data: allApproved, error: countErr } = await sb
      .from("reward_listing_claims")
      .select("owner_id")
      .eq("status", "approved");
    if (countErr) {
      return NextResponse.json(
        { error: `Supabase query failed: ${countErr.message || "(empty)"}` },
        { status: 500 },
      );
    }
    const perOwner = new Map<string, number>();
    for (const r of (allApproved ?? []) as { owner_id: string | null }[]) {
      const id = r.owner_id ?? "(unknown)";
      perOwner.set(id, (perOwner.get(id) ?? 0) + 1);
    }
    const totalApproved = (allApproved ?? []).length;
    const sellersApproved = perOwner.size;

    // Detailed, newest-first slice with post info.
    const { data: rows, error: rowsErr } = await sb
      .from("reward_listing_claims")
      .select(
        "id, owner_id, post_id, decided_at, decided_by, post:posts!post_id(raw_title, price_cents, thumbnail_path)",
      )
      .eq("status", "approved")
      .order("decided_at", { ascending: false })
      .limit(LIMIT);
    if (rowsErr) {
      return NextResponse.json(
        { error: `Supabase query failed: ${rowsErr.message || "(empty)"}` },
        { status: 500 },
      );
    }

    type Row = {
      id: number;
      owner_id: string | null;
      post_id: number | null;
      decided_at: string | null;
      decided_by: string | null;
      post: PostEmbed;
    };
    const detail = (rows ?? []) as Row[];

    // Resolve nicknames for every seller (perOwner keys) + every reviewer (decided_by).
    const ids = new Set<string>();
    for (const id of perOwner.keys()) if (id && id !== "(unknown)") ids.add(id);
    for (const r of detail) if (r.decided_by) ids.add(r.decided_by);
    const nickById = new Map<string, string | null>();
    if (ids.size) {
      const { data: profs } = await sb
        .from("profiles")
        .select("id, nickname")
        .in("id", [...ids]);
      for (const p of (profs ?? []) as { id: string; nickname: string | null }[]) {
        nickById.set(p.id, p.nickname);
      }
    }

    const approved = detail.map((r) => {
      const p = post1(r.post);
      return {
        claimId: r.id,
        ownerId: r.owner_id,
        nickname: (r.owner_id && nickById.get(r.owner_id)) || "Unknown",
        postId: r.post_id,
        title: p?.raw_title ?? null,
        priceCents: p?.price_cents ?? null,
        thumbnailPath: p?.thumbnail_path ?? null,
        decidedAt: r.decided_at,
        reviewer: r.decided_by ? (nickById.get(r.decided_by) ?? null) : null,
      };
    });

    const perSeller = [...perOwner.entries()]
      .map(([ownerId, count]) => ({
        ownerId,
        nickname: (ownerId !== "(unknown)" && nickById.get(ownerId)) || "Unknown",
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      approved,
      truncated: detail.length === LIMIT && totalApproved > LIMIT,
      summary: { totalApproved, sellersApproved, perSeller },
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
