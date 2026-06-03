import type { SupabaseClient } from "@supabase/supabase-js";

/** A live service-area suburb from `public.suburbs` (read-only consumer). */
export type ActiveSuburb = {
  id: number;
  name: string;
  /** [lat, lng] centroid, or null if unparseable. The map fits to the boundary anyway. */
  center: [number, number] | null;
};

/** GeoJSON Point (object or string) -> [lat, lng]. */
function parseCenter(raw: unknown): [number, number] | null {
  let obj: unknown = raw;
  if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (obj && typeof obj === "object" && "coordinates" in obj) {
    const coords = (obj as { coordinates: unknown }).coordinates;
    if (
      Array.isArray(coords) &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      return [coords[1], coords[0]]; // GeoJSON [lng,lat] -> [lat,lng]
    }
  }
  return null;
}

/**
 * Path A from the shared-backend contract: the live service-area suburbs
 * (`is_active = true`), ordered by name. Read-only — never write to `suburbs`.
 */
export async function fetchActiveSuburbs(
  client: SupabaseClient,
): Promise<ActiveSuburb[]> {
  const { data, error } = await client
    .from("suburbs")
    .select("id, name, center")
    .eq("is_active", true)
    .order("name");
  if (error) {
    throw new Error(error.message);
  }

  const rows = Array.isArray(data) ? data : [];
  const out: ActiveSuburb[] = [];
  for (const row of rows) {
    const r = row as { id?: unknown; name?: unknown; center?: unknown };
    const id = typeof r.id === "number" ? r.id : Number(r.id);
    const name = typeof r.name === "string" ? r.name.trim() : "";
    if (!Number.isFinite(id) || id <= 0 || !name) {
      continue;
    }
    out.push({ id, name, center: parseCenter(r.center) });
  }
  return out;
}

/**
 * Resolves a stored / `?area=` name against the live list. Tolerates the frozen
 * UI misspelling "Fitzory" -> DB "Fitzroy" so older links still restore.
 */
export function matchSuburbByName(
  suburbs: ActiveSuburb[],
  name: string,
): ActiveSuburb | null {
  const key = name.trim().toLowerCase();
  const wanted = key === "fitzory" ? "fitzroy" : key;
  return suburbs.find((s) => s.name.trim().toLowerCase() === wanted) ?? null;
}
