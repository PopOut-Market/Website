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

/** Persists the Market area picker across navigation (e.g. post detail → back). */
export const MARKET_SUBURB_STORAGE_KEY = "popout-market-suburb";

export function isMarketSuburb(value: string): value is MarketSuburb {
  return (MARKET_SUBURBS as readonly string[]).includes(value);
}

export function readStoredMarketSuburb(): MarketSuburb | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(MARKET_SUBURB_STORAGE_KEY);
    if (raw && isMarketSuburb(raw)) {
      return raw;
    }
  } catch {
    /* ignore quota / private mode */
  }
  return null;
}

export function writeStoredMarketSuburb(suburb: MarketSuburb): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(MARKET_SUBURB_STORAGE_KEY, suburb);
  } catch {
    /* ignore */
  }
}
