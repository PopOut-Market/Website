/** Normalized item for the Market grid (demo or Supabase). */
export type MarketProduct = {
  id: string;
  title: string;
  priceLabel: string;
  distanceLabel: string;
  sellerLabel: string;
  isNew: boolean;
  /** The listing's own suburb (RPC `suburb_name`) — each card shows its own, not the browsed one. */
  suburbLabel?: string | null;
  /** Public URL for Next/Image, or null for placeholder. */
  imageUrl: string | null;
  /** Parsed meet-up coordinates when available (used with browser geolocation for km). */
  meetupPoint?: { lat: number; lng: number } | null;
};
