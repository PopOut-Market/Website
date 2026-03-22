export type FeedFilter =
  | "for_you"
  | "freebies"
  | "under_10"
  | "electronics"
  | "home-kitchen"
  | "furniture"
  | "fashion"
  | "beauty"
  | "books-education"
  | "sports-outdoors"
  | "mobility"
  | "hobbies-collectibles"
  | "kids-baby"
  | "other";

export type LocaleCode =
  | "en"
  | "zh-Hans"
  | "zh-Hant"
  | "ko"
  | "ja"
  | "vi"
  | "fr"
  | "es";

export type LatLng = { lat: number; lng: number } | null;

export type SuburbItem = {
  id: string;
  name: string;
  center: LatLng;
};

export type PostsQueryParams = {
  suburbId: string;
  locale: string;
  filter: FeedFilter;
  page: number;
  limit: number;
};

export type PostListItem = {
  id: string;
  title: string;
  priceCents: number;
  currency: string;
  priceLabel: string;
  thumbnailUrl: string | null;
  distanceMeters: number | null;
  suburbName: string | null;
  distanceOrSuburb: string;
  updatedAt: string | null;
};

export type PostsListResponse = {
  items: PostListItem[];
  page: number;
  limit: number;
  hasMore: boolean;
};

export type PostDetailImage = {
  url: string;
  sortOrder: number;
};

export type PostDetail = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  priceLabel: string;
  condition: string;
  quantity: string;
  locationLabel: string;
  latLng: LatLng;
  images: PostDetailImage[];
  categorySlug: string | null;
  categoryName: string | null;
  isDeliverable: boolean;
  acceptOffers: boolean;
  photoCount: number;
  interestCount: number;
  updatedAt: string | null;
};

export type PostDetailResponse = {
  item: PostDetail;
};

export type SuburbsResponse = {
  items: SuburbItem[];
};
