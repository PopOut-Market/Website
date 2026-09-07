import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { fetchAllRows } from "@/lib/supabase/admin-fetch-all";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * "Suburb map": every active service-area suburb, its boundary, and how many
 * live users have verified into it — the data behind the choropleth on
 * /admin-super/dashboard/user-map. Service-role behind requireAdmin (a normal
 * session hits RLS on `profiles` and sees only its own row).
 *
 * Boundaries come from the app's read-only `get_active_suburb_boundaries()` RPC
 * (SECURITY DEFINER, already ST_Simplify'd ~11 m) rather than a table read,
 * because PostgREST hands a PostGIS `geography` column back as hex EWKB — the
 * RPC is the only thing that emits GeoJSON. Never write to `public.suburbs` or
 * add RPCs here; route backend changes back to the app-v2 repo.
 *
 * Counting rule: a user is counted in `profiles.verified_suburb_id` — the suburb
 * their last location check confirmed — and only while `is_deleted` is not true,
 * which is the same population the User management tab lists (banned users are
 * still real accounts sitting in a suburb, so they stay in and are also reported
 * separately). Users who have never passed a location check have no suburb at
 * all and are returned as `unassigned` instead of being dropped silently.
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

type BoundaryRow = {
  id: number;
  name: string;
  center_lat: number | null;
  center_lng: number | null;
  boundary_geojson: string | null;
};
type ProfileRow = { verified_suburb_id: number | null; is_banned: boolean | null };

/** GeoJSON geometry as the RPC emits it (a string we parse once, server-side). */
type Geometry =
  | { type: "MultiPolygon"; coordinates: number[][][][] }
  | { type: "Polygon"; coordinates: number[][][] };

function parseGeometry(raw: string | null): Geometry | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { type?: string };
    if (parsed?.type === "MultiPolygon" || parsed?.type === "Polygon") {
      return parsed as Geometry;
    }
  } catch {
    /* a malformed geometry drops that one suburb's shape, not the whole map */
  }
  return null;
}

/**
 * Boundaries are static (they change only when the app team edits the service
 * area) but weigh ~450 KB, so they are cached per server instance. User counts
 * are never cached — they are the point of the page.
 */
const BOUNDARY_TTL_MS = 30 * 60 * 1000;
let boundaryCache: { rows: BoundaryRow[]; at: number } | null = null;

async function loadBoundaries(sb: SupabaseClient): Promise<BoundaryRow[]> {
  const now = Date.now();
  if (boundaryCache && now - boundaryCache.at < BOUNDARY_TTL_MS) {
    return boundaryCache.rows;
  }
  const { data, error } = await sb.rpc("get_active_suburb_boundaries");
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as BoundaryRow[];
  boundaryCache = { rows, at: now };
  return rows;
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
    const [boundaries, profRes, { count: activeSuburbCount }] = await Promise.all([
      loadBoundaries(sb),
      fetchAllRows(() =>
        sb
          .from("profiles")
          .select("id, verified_suburb_id, is_banned")
          // `not.is.true` (not `eq false`) so a NULL `is_deleted` still counts as
          // a live user — same rule as /api/admin/users.
          .not("is_deleted", "is", true)
          .order("id"),
      ),
      sb.from("suburbs").select("*", { count: "exact", head: true }).eq("is_active", true),
    ]);

    if (profRes.error) {
      return NextResponse.json(
        { error: `Supabase query failed: ${profRes.error.message || "(empty)"}` },
        { status: 500 },
      );
    }

    const profiles = (profRes.data ?? []) as ProfileRow[];
    const userCount = new Map<number, number>();
    const bannedCount = new Map<number, number>();
    let unassigned = 0;
    for (const p of profiles) {
      const id = p.verified_suburb_id;
      if (!id) {
        unassigned += 1;
        continue;
      }
      userCount.set(id, (userCount.get(id) ?? 0) + 1);
      if (p.is_banned) bannedCount.set(id, (bannedCount.get(id) ?? 0) + 1);
    }

    const suburbs = boundaries
      .map((row) => ({
        id: row.id,
        name: row.name,
        lat: row.center_lat,
        lng: row.center_lng,
        users: userCount.get(row.id) ?? 0,
        banned: bannedCount.get(row.id) ?? 0,
        geometry: parseGeometry(row.boundary_geojson),
      }))
      .filter((s) => s.geometry !== null);

    // Users whose suburb is set but is no longer an active service area — they
    // exist in the totals yet have nothing to paint, so say so rather than let
    // the map's numbers quietly disagree with User management.
    const mapped = new Set(boundaries.map((b) => b.id));
    let outsideServiceArea = 0;
    for (const [id, n] of userCount) if (!mapped.has(id)) outsideServiceArea += n;

    return NextResponse.json({
      suburbs,
      totalUsers: profiles.length,
      unassigned,
      outsideServiceArea,
      // PostgREST truncates any single response at 1000 rows and says nothing,
      // and a `Range` header is ignored on an RPC call — so the only way to know
      // the boundary list is complete is to compare it against a real count.
      truncated: typeof activeSuburbCount === "number" && boundaries.length < activeSuburbCount,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
