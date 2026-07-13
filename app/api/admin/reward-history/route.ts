import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * Reward DECISION history (read-only, service-role behind requireAdmin).
 *
 * The reward-review page's live queue only shows status='pending' claims (via the
 * gated `admin_list_pending_claims` RPC). This route is the complement: every
 * claim that has been SETTLED, newest-first.
 *
 * Two things it deliberately does NOT do:
 *
 * 1. It does not filter the detail list to `status = 'approved'`. It used to, so
 *    the reason code and internal note an operator was COMPELLED to enter on a
 *    denial could never be read back — an audit trail nobody can read is not an
 *    audit trail. The list is now "anything that isn't pending", which is robust
 *    to the exact terminal vocabulary the RPCs write (`rejected` vs `denied`,
 *    `cancelled` vs `voided`) without this route having to guess it.
 *
 * 2. It does not let that widening leak into the CAP. `summary` — the per-seller
 *    counts the review page uses to decide who is at the 6-listing cap — stays
 *    strictly `status = 'approved'`, because that status is what "coins were
 *    actually paid" means. A no-coins clear (`approved_unpaid`) must never
 *    consume a reward slot, and it doesn't: it isn't 'approved'.
 *
 * Notes:
 * - `owner_id` and `post_id` embed cleanly (FKs exist). `decided_by` has NO FK to
 *   profiles, so reviewer nicknames are resolved via a separate profiles lookup.
 * - The detail rows are selected with `*` and the reason-code column is picked
 *   defensively at runtime: its name lives in the mobile app's schema, and naming
 *   it wrong here would fail the whole query rather than just omitting a field.
 */

const LIMIT = 300;

/** Candidate column names for the deny reason, in preference order. */
const REASON_KEYS = ["reject_code", "reason_code", "decline_code", "code"] as const;

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

function pickReason(row: Record<string, unknown>): string | null {
  for (const key of REASON_KEYS) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return null;
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
    // PAID claims only — this is the reward cap, and it must not count no-coins
    // clears. Kept as a full lightweight scan so the totals stay exact even when
    // the detail list below is capped at LIMIT.
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

    // Every SETTLED claim, newest-first — approvals, no-coins clears, denials,
    // and cancellations alike.
    const { data: rows, error: rowsErr } = await sb
      .from("reward_listing_claims")
      .select("*, post:posts!post_id(raw_title, price_cents, thumbnail_path)")
      .neq("status", "pending")
      // nullsFirst:false matters — Postgres sorts NULLs FIRST on DESC by default,
      // so any settled claim with no decided_at (e.g. cancelled by a restriction
      // that didn't stamp one) would otherwise lead the "newest first" list.
      .order("decided_at", { ascending: false, nullsFirst: false })
      .limit(LIMIT);
    if (rowsErr) {
      return NextResponse.json(
        { error: `Supabase query failed: ${rowsErr.message || "(empty)"}` },
        { status: 500 },
      );
    }

    type Row = Record<string, unknown> & {
      id: number;
      owner_id: string | null;
      post_id: number | null;
      status: string | null;
      decided_at: string | null;
      decided_by: string | null;
      post: PostEmbed;
    };
    const detail = (rows ?? []) as Row[];

    // Nicknames for every seller (perOwner keys), every seller in the detail list,
    // and every reviewer (decided_by).
    const ids = new Set<string>();
    for (const id of perOwner.keys()) if (id && id !== "(unknown)") ids.add(id);
    for (const r of detail) {
      if (r.owner_id) ids.add(r.owner_id);
      if (r.decided_by) ids.add(r.decided_by);
    }
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

    const decisions = detail.map((r) => {
      const p = post1(r.post);
      return {
        claimId: r.id,
        ownerId: r.owner_id,
        nickname: (r.owner_id && nickById.get(r.owner_id)) || "Unknown",
        postId: r.post_id,
        title: p?.raw_title ?? null,
        priceCents: p?.price_cents ?? null,
        thumbnailPath: p?.thumbnail_path ?? null,
        status: r.status,
        rejectCode: pickReason(r),
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
      decisions,
      truncated: detail.length === LIMIT,
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
