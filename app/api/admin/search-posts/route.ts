import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * Listing-moderation search — find a listing by title or seller so the operator
 * can grab its ID for the restrict / reinstate flow.
 *
 * Service-role behind `requireAdmin` (validates the caller's bearer token and
 * checks `reward_admins`). Reads `posts` + `profiles`, both RLS-locked to anon.
 *
 * Why service-role and not the anon `get_post_detail`/`get_home_feed` RPCs: the
 * whole point of this search is to FIND listings to moderate, including ones
 * those RPCs deliberately hide — restricted, sold, or otherwise unavailable.
 * Service-role bypasses RLS, so every listing is searchable regardless of state.
 *
 * Query params:
 *   q      — search text (>= 2 non-space chars; ILIKE-escaped, matched anywhere)
 *   mode   — "title" (posts.raw_title) | "seller" (profiles.nickname); default title
 *   offset — page offset (>= 0); page size is PAGE_SIZE
 */

const PAGE_SIZE = 25;
/** Cap on how many nickname-matched sellers a "seller" search fans out over. */
const MAX_SELLERS = 200;
const MIN_QUERY_LEN = 2;

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

/**
 * Escape a user string for safe use inside an ILIKE `%…%` pattern so wildcards
 * are neutralised instead of matching everything. We escape `%`, `_`, `\` (SQL
 * ILIKE wildcards) AND `*` — PostgREST accepts `*` as an alias for `%` in the
 * `ilike` operator value, so an un-escaped `*` would otherwise force a match-all.
 */
function ilikePattern(raw: string): string {
  const escaped = raw.replace(/[\\%_*]/g, (ch) => `\\${ch}`);
  return `%${escaped}%`;
}

type PostRow = {
  id: number | string;
  raw_title: string | null;
  price_cents: number | null;
  status: string | null;
  thumbnail_path: string | null;
  updated_at: string | null;
  created_at: string | null;
  seller_id: string | null;
};

type SearchResult = {
  id: string;
  title: string | null;
  priceCents: number | null;
  status: string | null;
  sellerId: string | null;
  sellerNickname: string | null;
  thumbnailPath: string | null;
  updatedAt: string | null;
  createdAt: string | null;
};

const POST_COLUMNS =
  "id, raw_title, price_cents, status, thumbnail_path, updated_at, created_at, seller_id";

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const mode = url.searchParams.get("mode") === "seller" ? "seller" : "title";
  const offsetRaw = Number.parseInt(url.searchParams.get("offset") ?? "0", 10);
  const offset = Number.isFinite(offsetRaw) && offsetRaw > 0 ? offsetRaw : 0;

  if (q.length < MIN_QUERY_LEN) {
    return NextResponse.json(
      { error: `Enter at least ${MIN_QUERY_LEN} characters to search.` },
      { status: 400 },
    );
  }

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

  const pattern = ilikePattern(q);

  try {
    let rows: PostRow[] = [];
    // sellerId -> nickname, for stamping results (populated per branch).
    const nicknameById = new Map<string, string | null>();

    if (mode === "seller") {
      // Two-step (mirrors the accounts route, which reads profiles separately
      // rather than embedding): resolve matching sellers, then page their posts.
      const { data: sellers, error: sellerErr } = await sb
        .from("profiles")
        .select("id, nickname")
        .ilike("nickname", pattern)
        .limit(MAX_SELLERS);
      if (sellerErr) throw sellerErr;

      const sellerRows = (sellers ?? []) as { id: string; nickname: string | null }[];
      for (const s of sellerRows) nicknameById.set(s.id, s.nickname);
      const sellerIds = sellerRows.map((s) => s.id);

      if (sellerIds.length > 0) {
        const { data, error } = await sb
          .from("posts")
          .select(POST_COLUMNS)
          .in("seller_id", sellerIds)
          // Secondary sort on the unique id keeps page boundaries stable when
          // several posts share a created_at timestamp (else offset paging can
          // duplicate or skip rows across pages).
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(offset, offset + PAGE_SIZE - 1);
        if (error) throw error;
        rows = (data ?? []) as PostRow[];
      }
    } else {
      const { data, error } = await sb
        .from("posts")
        .select(POST_COLUMNS)
        .ilike("raw_title", pattern)
        // Stable secondary sort on the unique id (see seller branch).
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      rows = (data ?? []) as PostRow[];

      // Resolve nicknames for just this page's sellers.
      const ids = [...new Set(rows.map((r) => r.seller_id).filter((v): v is string => !!v))];
      if (ids.length > 0) {
        const { data: profs } = await sb.from("profiles").select("id, nickname").in("id", ids);
        for (const p of (profs ?? []) as { id: string; nickname: string | null }[]) {
          nicknameById.set(p.id, p.nickname);
        }
      }
    }

    const results: SearchResult[] = rows.map((r) => ({
      id: String(r.id),
      title: r.raw_title,
      priceCents: typeof r.price_cents === "number" ? r.price_cents : null,
      status: r.status,
      sellerId: r.seller_id,
      sellerNickname: r.seller_id ? (nicknameById.get(r.seller_id) ?? null) : null,
      thumbnailPath: r.thumbnail_path,
      updatedAt: r.updated_at,
      createdAt: r.created_at,
    }));

    return NextResponse.json({
      results,
      mode,
      query: q,
      offset,
      hasMore: rows.length === PAGE_SIZE,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Search failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
