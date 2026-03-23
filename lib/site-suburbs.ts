/** Suburbs shown on the home hero rotation and the Market area picker (8 areas). */
export const MARKET_SUBURBS = [
  "Melbourne CBD",
  "Carlton",
  "Parkville",
  "Southbank",
  "Docklands",
  "Fitzory",
  "North Melbourne",
  "South Wharf",
] as const;

export type MarketSuburb = (typeof MARKET_SUBURBS)[number];

export const DEFAULT_MARKET_SUBURB: MarketSuburb = "Melbourne CBD";
