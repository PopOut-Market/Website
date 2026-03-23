import { MARKET_SUBURBS, type MarketSuburb } from "@/lib/site-suburbs";

/**
 * Maps UI suburbs → `posts.suburb_id` (public.suburbs.id).
 * Synced with `suburbs` names: DOCKLANDS, NORTH MELBOURNE, FITZROY→picker "Fitzory", MELBOURNE CBD, etc.
 *
 * Optional `.env` override (valid JSON one line):
 *   NEXT_PUBLIC_MARKET_SUBURB_IDS={"Melbourne CBD":244,...}
 */
const BASE_IDS: Record<MarketSuburb, number> = {
  "Melbourne CBD": 244,
  Carlton: 593,
  Parkville: 492,
  Southbank: 703,
  Docklands: 160,
  Fitzory: 225,
  "North Melbourne": 217,
  "South Wharf": 333,
};

function resolvedSuburbIds(): Record<MarketSuburb, number> {
  const envRaw = process.env.NEXT_PUBLIC_MARKET_SUBURB_IDS?.trim();
  if (!envRaw) {
    return { ...BASE_IDS };
  }
  try {
    const parsed = JSON.parse(envRaw) as Record<string, unknown>;
    const out = { ...BASE_IDS };
    for (const suburb of MARKET_SUBURBS) {
      const v = parsed[suburb];
      if (typeof v === "number" && Number.isFinite(v)) {
        out[suburb] = v;
      }
    }
    return out;
  } catch {
    return { ...BASE_IDS };
  }
}

export function marketSuburbDbId(suburb: MarketSuburb): number | null {
  const v = resolvedSuburbIds()[suburb];
  return v ?? null;
}

/** Reverse map: `posts.suburb_id` → picker label when it matches configured IDs. */
export function marketSuburbFromDbId(suburbId: number): MarketSuburb | null {
  const map = resolvedSuburbIds();
  for (const suburb of MARKET_SUBURBS) {
    if (map[suburb] === suburbId) {
      return suburb;
    }
  }
  return null;
}
