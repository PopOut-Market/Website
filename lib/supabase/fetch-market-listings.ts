import type { SupabaseClient } from "@supabase/supabase-js";
import { formatMarketDistanceKm } from "@/lib/market-distance";
import type { MarketProduct } from "@/lib/market-product";
import type { Locale } from "@/lib/site-i18n";
import { getPostImageUrl } from "@/lib/supabase/post-image-url";

const NUMBER_LOCALE: Record<Locale, string> = {
  en: "en-AU",
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
  ko: "ko-KR",
  ja: "ja-JP",
  vi: "vi-VN",
  fr: "fr-FR",
  es: "es-ES",
};

/** Prices are always AUD on this marketplace (the backend dropped the currency column). */
function formatMoney(locale: Locale, cents: number): string {
  if (!cents || cents <= 0) {
    return "FREE";
  }
  try {
    return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
      maximumFractionDigits: 0,
    }).format(cents / 100);
  }
}

/**
 * The website reads listings the same way the mobile app does: through the
 * `get_home_feed` SECURITY DEFINER RPC (granted to anon), which joins
 * `posts` + `post_i18n` and returns localized, public-safe rows. We never read
 * the locked-down tables directly. See also `fetch-market-post-detail.ts`.
 */

/** Default home chip used by the app; the only other valid filters are `freebies` / `under_10`. */
const HOME_FEED_FILTER = "for_you";
/** `get_home_feed` rejects `p_limit > 50` (INVALID_LIMIT). */
const MARKET_FEED_LIMIT = 50;
/** Melbourne CBD (`suburbs.id`); the feed also returns nearby suburbs, so this is a broad Melbourne pool. */
const HERO_DEFAULT_SUBURB_ID = 244;

/** Row shape returned by `get_home_feed` (16 columns). */
type HomeFeedRow = {
  id: number | string;
  seller_id?: string | null;
  price_cents: number;
  photo_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  thumbnail_path?: string | null;
  category_slug?: string | null;
  title?: string | null;
  description?: string | null;
  suburb_name?: string | null;
  seller_nickname?: string | null;
  post_lat?: number | null;
  post_lng?: number | null;
  has_meetup_location?: boolean | null;
  has_local_listing?: boolean | null;
};

function isHomeFeedRow(v: unknown): v is HomeFeedRow {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  const idOk = typeof o.id === "string" || typeof o.id === "number";
  return idOk && typeof o.price_cents === "number";
}

/** Per-call shuffle seed for the feed (mirrors the app's `p_jitter_seed`). */
function randomJitterSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

function meetupPointFrom(
  lat: number | null | undefined,
  lng: number | null | undefined,
  hasMeetup: boolean | null | undefined,
): { lat: number; lng: number } | null {
  if (hasMeetup && typeof lat === "number" && typeof lng === "number") {
    return { lat, lng };
  }
  return null;
}

function isRecent(createdAt: string | null | undefined): boolean {
  if (!createdAt) {
    return false;
  }
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) {
    return false;
  }
  return Date.now() - created < 3 * 24 * 60 * 60 * 1000;
}

function toMarketProduct(
  raw: HomeFeedRow,
  options: { locale: Locale; sellerFallback: string; kmSuffix: string },
): MarketProduct {
  const seller = raw.seller_nickname?.trim();
  return {
    id: String(raw.id),
    title: (raw.title ?? "").toString(),
    priceLabel: formatMoney(options.locale, raw.price_cents),
    distanceLabel: formatMarketDistanceKm(null, options.kmSuffix),
    sellerLabel: seller && seller.length > 0 ? seller : options.sellerFallback,
    isNew: isRecent(raw.created_at),
    suburbLabel: raw.suburb_name?.trim() || null,
    imageUrl: getPostImageUrl(raw.thumbnail_path, raw.updated_at),
    meetupPoint: meetupPointFrom(raw.post_lat, raw.post_lng, raw.has_meetup_location),
  };
}

/**
 * Market grid for a suburb. Calls `get_home_feed` (suburb + nearby) with the
 * `for_you` filter, exactly like the app's home feed.
 */
export async function fetchMarketListings(
  client: SupabaseClient,
  options: {
    /** `public.suburbs.id` to filter the feed by. */
    suburbId: number;
    locale: Locale;
    sellerFallback: string;
    kmSuffix: string;
    /** Rows already fetched (page offset). */
    offset: number;
    /** Page size (the RPC rejects > 50). */
    limit: number;
    /** Stable shuffle seed — constant across a session's pages, rotated on refresh. */
    jitterSeed: number;
  },
): Promise<{
  products: MarketProduct[];
  /** Whether the browsed suburb itself has matching listings (drives the "nearby" notice). */
  hasLocalListing: boolean | null;
  errorMessage: string | null;
}> {
  try {
    const suburbId = options.suburbId;
    if (!Number.isFinite(suburbId) || suburbId <= 0) {
      return { products: [], hasLocalListing: null, errorMessage: null };
    }

    const limit = Math.min(Math.max(1, options.limit), MARKET_FEED_LIMIT);
    const { data, error } = await client.rpc("get_home_feed", {
      p_suburb_id: suburbId,
      p_locale: options.locale,
      p_filter: HOME_FEED_FILTER,
      p_offset: Math.max(0, options.offset),
      p_limit: limit,
      p_jitter_seed: options.jitterSeed,
    });

    if (error) {
      return { products: [], hasLocalListing: null, errorMessage: error.message };
    }

    const rows = (Array.isArray(data) ? data : []).filter(isHomeFeedRow);
    // The RPC broadcasts has_local_listing onto every row; read it off the first.
    const hasLocalListing =
      typeof rows[0]?.has_local_listing === "boolean" ? rows[0]!.has_local_listing : null;
    const products = rows.map((raw) => toMarketProduct(raw, options));
    return { products, hasLocalListing, errorMessage: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { products: [], hasLocalListing: null, errorMessage: msg };
  }
}

/** Hero carousel: a small random sample from recent listings. */
export type HeroCarouselListing = {
  id: string;
  title: string;
  priceLabel: string;
  imageUrl: string | null;
};

const HERO_CAROUSEL_POOL_LIMIT = MARKET_FEED_LIMIT;
const HERO_CAROUSEL_COUNT = 10;

function shuffleInPlace<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = items[i]!;
    const b = items[j]!;
    items[i] = b;
    items[j] = a;
  }
}

/**
 * Pulls a pool of Melbourne-CBD-and-nearby listings via `get_home_feed`,
 * shuffles, and returns up to 10. No suburb filter exists for "everywhere",
 * so we anchor on the CBD pool (which already includes nearby suburbs).
 */
export async function fetchHeroCarouselListings(
  client: SupabaseClient,
  options: { locale: Locale },
): Promise<{ listings: HeroCarouselListing[]; errorMessage: string | null }> {
  try {
    const { data, error } = await client.rpc("get_home_feed", {
      p_suburb_id: HERO_DEFAULT_SUBURB_ID,
      p_locale: options.locale,
      p_filter: HOME_FEED_FILTER,
      p_offset: 0,
      p_limit: HERO_CAROUSEL_POOL_LIMIT,
      p_jitter_seed: randomJitterSeed(),
    });

    if (error) {
      return { listings: [], errorMessage: error.message };
    }

    const rows = Array.isArray(data) ? data : [];
    const candidates: HeroCarouselListing[] = rows.filter(isHomeFeedRow).map((raw) => ({
      id: String(raw.id),
      title: (raw.title ?? "").toString(),
      priceLabel: formatMoney(options.locale, raw.price_cents),
      imageUrl: getPostImageUrl(raw.thumbnail_path, raw.updated_at),
    }));
    shuffleInPlace(candidates);
    return { listings: candidates.slice(0, HERO_CAROUSEL_COUNT), errorMessage: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { listings: [], errorMessage: msg };
  }
}
