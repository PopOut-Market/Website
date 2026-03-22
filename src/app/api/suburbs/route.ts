import { NextResponse } from "next/server";

import { parseEwkbPoint } from "@/lib/ewkb";
import { getSupabaseAdmin } from "@/lib/getSupabaseAdmin";
import type { SuburbItem, SuburbsResponse } from "@/types/post";

function parseCenter(center: unknown): { lat: number; lng: number } | null {
  if (!center) return null;
  if (typeof center === "string") return parseEwkbPoint(center);

  if (
    typeof center === "object" &&
    center !== null &&
    "coordinates" in center &&
    Array.isArray((center as { coordinates?: unknown }).coordinates)
  ) {
    const coords = (center as { coordinates: unknown[] }).coordinates;
    if (coords.length >= 2) {
      const lng = Number(coords[0]);
      const lat = Number(coords[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
}

export async function GET() {
  const { data, error } = await getSupabaseAdmin
    .from("suburbs")
    .select("id,name,center")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items: SuburbItem[] = (data ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name ?? "Unknown"),
    center: parseCenter(row.center),
  }));

  const response: SuburbsResponse = { items };
  return NextResponse.json(response, { status: 200 });
}
