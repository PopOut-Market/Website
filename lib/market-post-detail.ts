/** Max listings shown in “More from this seller” on the post detail page. */
export const MARKET_POST_DETAIL_OTHER_ITEMS_MAX = 6;

/** Single listing for the market detail route (`/market/p/[postId]`). */
export type SellerOtherItem = {
  id: string;
  title: string;
  priceLabel: string;
  imageUrl: string | null;
};

export type MarketPostDetail = {
  id: string;
  title: string;
  priceLabel: string;
  sellerLabel: string;
  sellerAvatarUrl: string | null;
  sellerVerifiedSuburbLabel: string | null;
  sellerVerifiedAtLabel: string | null;
  distanceLabel: string;
  meetupPoint: { lat: number; lng: number } | null;
  imageUrl: string | null;
  photoUrls: string[];
  isNew: boolean;
  areaLabel: string | null;
  listedAtLabel: string | null;
  description: string | null;
  meetupLabel: string | null;
  categoryLabel: string | null;
  statusLabel: string;
  deliveryLabel: string;
  offerLabel: string;
  otherItems: SellerOtherItem[];
};
