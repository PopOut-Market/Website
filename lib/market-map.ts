import type { MarketSuburb } from "@/lib/site-suburbs";

/**
 * Suburb centroids (lat, lng) — used to centre the Leaflet map before the live
 * boundary loads / when no boundary is returned. Keyed by the exact picker labels
 * in `MARKET_SUBURBS` (incl. the frozen "Fitzory").
 */
export const SUBURB_COORDS: Record<MarketSuburb, [number, number]> = {
  "Melbourne CBD": [-37.8136, 144.9631],
  Carlton: [-37.8001, 144.9674],
  Parkville: [-37.7853, 144.952],
  Southbank: [-37.8226, 144.9648],
  Docklands: [-37.8149, 144.946],
  Fitzory: [-37.7983, 144.9784],
  "North Melbourne": [-37.805, 144.943],
  "South Wharf": [-37.8255, 144.953],
};
