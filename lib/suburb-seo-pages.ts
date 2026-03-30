import type { MarketSuburb } from "@/lib/site-suburbs";

const SUBURB_SEO_PATHS: Record<MarketSuburb, string> = {
  "Melbourne CBD": "/melbourne-suburbs/melbourne-cbd",
  Carlton: "/melbourne-suburbs/carlton",
  Parkville: "/melbourne-suburbs/parkville",
  Southbank: "/melbourne-suburbs/southbank",
  Docklands: "/melbourne-suburbs/docklands",
  Fitzory: "/melbourne-suburbs/fitzroy",
  "North Melbourne": "/melbourne-suburbs/north-melbourne",
  "South Wharf": "/melbourne-suburbs/south-wharf",
};

export function suburbSeoPath(suburb: MarketSuburb): string {
  return SUBURB_SEO_PATHS[suburb];
}
