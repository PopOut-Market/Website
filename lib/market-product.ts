/** Normalized item for the Market grid (demo or Supabase). */
export type MarketProduct = {
  id: string;
  title: string;
  priceLabel: string;
  distanceLabel: string;
  sellerLabel: string;
  isNew: boolean;
  /** Public URL for Next/Image, or null for placeholder. */
  imageUrl: string | null;
  /** Parsed meet-up coordinates when available (used with browser geolocation for km). */
  meetupPoint?: { lat: number; lng: number } | null;
};
