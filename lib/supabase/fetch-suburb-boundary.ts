import type { SupabaseClient } from "@supabase/supabase-js";

/** GeoJSON geometry as returned by the app's `get_suburb_boundary` RPC. */
export type SuburbBoundary =
  | { type: "MultiPolygon"; coordinates: number[][][][] }
  | { type: "Polygon"; coordinates: number[][][] };

/**
 * Path B from the shared-backend contract: a single suburb's boundary, simplified
 * (~11 m) and active-only. Returns null when the id isn't an active service area.
 *
 * Read-only consumer — never write to `public.suburbs` or add RPCs here; route any
 * backend change back to the app-v2 repo.
 */
export async function fetchSuburbBoundary(
  client: SupabaseClient,
  suburbId: number,
): Promise<SuburbBoundary | null> {
  const { data, error } = await client.rpc("get_suburb_boundary", {
    p_suburb_id: suburbId,
  });
  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }

  // RPC returns a GeoJSON *string*; tolerate a pre-parsed object too.
  let parsed: unknown;
  try {
    parsed = typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return null;
  }

  if (
    parsed &&
    typeof parsed === "object" &&
    "type" in parsed &&
    "coordinates" in parsed &&
    ((parsed as { type: string }).type === "MultiPolygon" ||
      (parsed as { type: string }).type === "Polygon")
  ) {
    return parsed as SuburbBoundary;
  }
  return null;
}
