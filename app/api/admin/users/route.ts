import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * "User management": every still-existing user (is_deleted = false), with the
 * aggregates needed to triage/sort them — post count, sold count, reports against
 * them (+ how many were actioned), and reports they filed against others — plus a
 * per-user breakdown (available + sold listings, and the reports against them) for
 * the expanded detail view. Service-role behind requireAdmin.
 *
 * Volume note: aggregation is done in JS over a few small full-table reads
 * (profiles / posts / post_reports / user_reports / suburbs). Negligible at
 * current scale (~100 users, ~350 posts, a few reports). If posts grow into the
 * tens of thousands, move this aggregation into a DB view/RPC.
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

// Report status that counts as "successfully reported" (the report was upheld).
const ACTIONED = "actioned";

type ProfileRow = {
  id: string;
  nickname: string | null;
  created_at: string;
  last_active_at: string | null;
  is_banned: boolean | null;
  is_deleted: boolean | null;
  language: string | null;
  verified_suburb_id: number | null;
};
type PostRow = {
  id: number;
  seller_id: string | null;
  raw_title: string | null;
  price_cents: number | null;
  status: string | null;
  thumbnail_path: string | null;
  created_at: string;
};
type PostReportRow = {
  id: string;
  reporter_id: string | null;
  post_id: number;
  reason: string;
  status: string;
  created_at: string;
};
type UserReportRow = {
  id: string;
  reporter_id: string | null;
  reported_id: string | null;
  reason: string;
  status: string;
  created_at: string;
};
type ReportAgainst = {
  id: string;
  kind: "post" | "user";
  reason: string;
  status: string;
  createdAt: string;
};

const byNewest = (a: { created_at: string }, b: { created_at: string }) =>
  b.created_at.localeCompare(a.created_at);

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
    const [profRes, postRes, postRepRes, userRepRes, subRes] = await Promise.all([
      sb
        .from("profiles")
        .select(
          "id, nickname, created_at, last_active_at, is_banned, is_deleted, language, verified_suburb_id",
        ),
      sb.from("posts").select("id, seller_id, raw_title, price_cents, status, thumbnail_path, created_at"),
      sb.from("post_reports").select("id, reporter_id, post_id, reason, status, created_at"),
      sb.from("user_reports").select("id, reporter_id, reported_id, reason, status, created_at"),
      sb.from("suburbs").select("id, name"),
    ]);

    const firstErr =
      profRes.error ?? postRes.error ?? postRepRes.error ?? userRepRes.error ?? subRes.error;
    if (firstErr) {
      return NextResponse.json(
        { error: `Supabase query failed: ${firstErr.message || "(empty)"}` },
        { status: 500 },
      );
    }

    const suburbName = new Map<number, string>();
    for (const s of (subRes.data ?? []) as { id: number; name: string }[]) suburbName.set(s.id, s.name);

    // Index posts by seller, and post_id -> owner (to attribute post reports).
    const posts = (postRes.data ?? []) as PostRow[];
    const postsBySeller = new Map<string, PostRow[]>();
    const postOwner = new Map<number, string>();
    for (const p of posts) {
      if (!p.seller_id) continue;
      postOwner.set(p.id, p.seller_id);
      const arr = postsBySeller.get(p.seller_id);
      if (arr) arr.push(p);
      else postsBySeller.set(p.seller_id, [p]);
    }

    const postReports = (postRepRes.data ?? []) as PostReportRow[];
    const userReports = (userRepRes.data ?? []) as UserReportRow[];

    // Reports FILED BY a user (as reporter), across both report tables.
    const reportedByCount = new Map<string, number>();
    for (const r of [...postReports, ...userReports]) {
      if (r.reporter_id) reportedByCount.set(r.reporter_id, (reportedByCount.get(r.reporter_id) ?? 0) + 1);
    }

    // Reports AGAINST a user — post reports attributed via the post's owner, plus
    // direct user reports.
    const against = new Map<string, ReportAgainst[]>();
    const pushAgainst = (uid: string, item: ReportAgainst) => {
      const a = against.get(uid);
      if (a) a.push(item);
      else against.set(uid, [item]);
    };
    for (const r of postReports) {
      const owner = postOwner.get(r.post_id);
      if (owner) {
        pushAgainst(owner, {
          id: r.id,
          kind: "post",
          reason: r.reason,
          status: r.status,
          createdAt: r.created_at,
        });
      }
    }
    for (const r of userReports) {
      if (r.reported_id) {
        pushAgainst(r.reported_id, {
          id: r.id,
          kind: "user",
          reason: r.reason,
          status: r.status,
          createdAt: r.created_at,
        });
      }
    }

    const mapPost = (p: PostRow) => ({
      id: p.id,
      title: p.raw_title,
      priceCents: p.price_cents,
      status: p.status,
      thumbnailPath: p.thumbnail_path,
      createdAt: p.created_at,
    });

    const users = ((profRes.data ?? []) as ProfileRow[])
      .filter((p) => !p.is_deleted)
      .map((p) => {
        const mine = postsBySeller.get(p.id) ?? [];
        const available = mine.filter((x) => x.status === "available").sort(byNewest);
        const sold = mine.filter((x) => x.status === "sold").sort(byNewest);
        const reportsAgainst = (against.get(p.id) ?? []).sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        );
        const reportedSuccessful = reportsAgainst.filter((r) => r.status === ACTIONED).length;
        return {
          id: p.id,
          nickname: p.nickname || "(no name)",
          createdAt: p.created_at,
          lastActiveAt: p.last_active_at ?? null,
          isBanned: !!p.is_banned,
          language: p.language ?? null,
          suburb: p.verified_suburb_id ? (suburbName.get(p.verified_suburb_id) ?? null) : null,
          counts: {
            posts: available.length + sold.length,
            available: available.length,
            sold: sold.length,
            reportedAgainst: reportsAgainst.length,
            reportedSuccessful,
            reportedBy: reportedByCount.get(p.id) ?? 0,
          },
          availablePosts: available.map(mapPost),
          soldPosts: sold.map(mapPost),
          reportsAgainst,
        };
      });

    return NextResponse.json({ users, generatedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
