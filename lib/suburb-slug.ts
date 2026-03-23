import type { MarketSuburb } from "@/lib/site-suburbs";

/** DB `suburb_slug` values — keep in sync with Supabase rows. */
const SLUG_BY_SUBURB: Record<MarketSuburb, string> = {
  "Melbourne CBD": "melbourne-cbd",
  Carlton: "carlton",
  Parkville: "parkville",
  Southbank: "southbank",
  Docklands: "docklands",
  Fitzory: "fitzory",
  "North Melbourne": "north-melbourne",
  "South Wharf": "south-wharf",
};

export function marketSuburbToSlug(suburb: MarketSuburb): string {
  return SLUG_BY_SUBURB[suburb];
}
