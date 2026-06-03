import type { SupabaseClient } from "@supabase/supabase-js";
import { formatMarketDistanceKm } from "@/lib/market-distance";
import {
  MARKET_POST_DETAIL_OTHER_ITEMS_MAX,
  type MarketPostDetail,
  type SellerOtherItem,
} from "@/lib/market-post-detail";
import { marketSuburbFromDbId } from "@/lib/market-suburb-ids";
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

/** English ordinal suffix: 1→st, 2→nd, 3→rd, 11–13→th, else th. */
function ordinalSuffix(day: number): string {
  const tens = day % 100;
  if (tens >= 11 && tens <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * Day + month only (no time, no year), localized. English uses the Australian
 * ordinal form ("29th April"); other locales use their native day–month order
 * via Intl ("29 avril", "4月29日", "4월 29일").
 */
function formatListedAt(locale: Locale, iso: string | null | undefined): string | null {
  if (!iso) {
    return null;
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  try {
    if (locale === "en") {
      const day = d.getDate();
      const month = new Intl.DateTimeFormat("en-AU", { month: "long" }).format(d);
      return `${day}${ordinalSuffix(day)} ${month}`;
    }
    return new Intl.DateTimeFormat(NUMBER_LOCALE[locale], {
      day: "numeric",
      month: "long",
    }).format(d);
  } catch {
    return null;
  }
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

/**
 * The website reads post details the same way the mobile app does: via the
 * `get_post_detail` + `get_seller_other_posts` SECURITY DEFINER RPCs (granted
 * to anon). They return localized, public-safe rows; for an anonymous caller
 * the auth.uid()-dependent fields (interest, distance, caller suburb) come
 * back null/false. See `fetch-market-listings.ts` for the feed equivalent.
 */

/** Row shape returned by `get_post_detail` (28 columns). */
type PostDetailRow = {
  id: number | string;
  seller_id?: string | null;
  status?: string | null;
  price_cents: number;
  accept_offers?: boolean | null;
  created_at?: string | null;
  title?: string | null;
  description?: string | null;
  meetup_label?: string | null;
  category_slug?: string | null;
  category_name?: string | null;
  photo_paths?: string[] | null;
  seller_nickname?: string | null;
  seller_default_avatar?: string | null;
  seller_verified_suburb_name?: string | null;
  seller_verified_freshness?: string | null;
  seller_is_new_user?: boolean | null;
  seller_recently_online?: boolean | null;
  meetup_lat?: number | null;
  meetup_lng?: number | null;
  has_meetup_location?: boolean | null;
  distance_from_suburb_centroid_m?: number | null;
  caller_verified_suburb_name?: string | null;
  is_interested?: boolean | null;
  interest_count?: number | null;
  listing_suburb_id?: number | null;
  listing_suburb_name?: string | null;
  listing_suburb_centroid_lat?: number | null;
  listing_suburb_centroid_lng?: number | null;
};

function isPostDetailRow(v: unknown): v is PostDetailRow {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  const idOk = typeof o.id === "string" || typeof o.id === "number";
  return idOk && typeof o.price_cents === "number";
}

/** Row shape returned by `get_seller_other_posts` (5 columns). */
type OtherPostRow = {
  id: number | string;
  price_cents: number;
  thumbnail_path?: string | null;
  updated_at?: string | null;
  title?: string | null;
};

function isOtherPostRow(v: unknown): v is OtherPostRow {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  const idOk = typeof o.id === "string" || typeof o.id === "number";
  return idOk && typeof o.price_cents === "number";
}

/** p_post_id is a bigint; send a number when the id is purely numeric. */
function postIdArg(postId: string): string | number {
  if (/^\d+$/.test(postId)) {
    const n = Number(postId);
    if (Number.isSafeInteger(n)) {
      return n;
    }
  }
  return postId;
}

function photoUrlsFrom(paths: string[] | null | undefined): string[] {
  if (!Array.isArray(paths)) {
    return [];
  }
  return paths
    .map((p) => getPostImageUrl(p, null))
    .filter((u): u is string => typeof u === "string" && u.length > 0);
}

function mapPostRowToDetail(
  raw: PostDetailRow,
  options: { locale: Locale; sellerFallback: string; kmSuffix: string },
): MarketPostDetail {
  const seller = raw.seller_nickname?.trim();
  const photoUrls = photoUrlsFrom(raw.photo_paths);
  const meetupPoint =
    raw.has_meetup_location && typeof raw.meetup_lat === "number" && typeof raw.meetup_lng === "number"
      ? { lat: raw.meetup_lat, lng: raw.meetup_lng }
      : null;
  const areaLabel =
    raw.listing_suburb_name?.trim() ||
    (typeof raw.listing_suburb_id === "number" && Number.isFinite(raw.listing_suburb_id)
      ? marketSuburbFromDbId(raw.listing_suburb_id)
      : null);
  const statusRaw = (raw.status ?? "").toString().trim();

  return {
    id: String(raw.id),
    title: (raw.title ?? "").toString(),
    priceLabel: formatMoney(options.locale, raw.price_cents),
    sellerLabel: seller && seller.length > 0 ? seller : options.sellerFallback,
    // The backend exposes only a default-avatar key (not a URL), so no image here.
    sellerAvatarUrl: null,
    sellerVerifiedSuburbLabel: raw.seller_verified_suburb_name?.trim() || null,
    sellerVerifiedAtLabel: raw.seller_verified_freshness?.trim() || null,
    distanceLabel: formatMarketDistanceKm(raw.distance_from_suburb_centroid_m ?? null, options.kmSuffix),
    meetupPoint,
    suburbId:
      typeof raw.listing_suburb_id === "number" && Number.isFinite(raw.listing_suburb_id)
        ? raw.listing_suburb_id
        : null,
    suburbCentroid:
      typeof raw.listing_suburb_centroid_lat === "number" &&
      typeof raw.listing_suburb_centroid_lng === "number"
        ? { lat: raw.listing_suburb_centroid_lat, lng: raw.listing_suburb_centroid_lng }
        : null,
    imageUrl: photoUrls[0] ?? null,
    photoUrls,
    isNew: isRecent(raw.created_at),
    areaLabel: areaLabel ?? null,
    listedAtLabel: formatListedAt(options.locale, raw.created_at),
    description: raw.description?.trim() || null,
    meetupLabel: raw.meetup_label?.trim() || null,
    categoryLabel: raw.category_name?.trim() || null,
    statusLabel: statusRaw.length > 0 ? statusRaw : "unknown",
    // get_post_detail does not return delivery info.
    deliveryLabel: "unknown",
    offerLabel: raw.accept_offers ? "yes" : "no",
    otherItems: [],
  };
}

export async function fetchMarketPostDetail(
  client: SupabaseClient,
  options: {
    postId: string;
    locale: Locale;
    sellerFallback: string;
    kmSuffix: string;
  },
): Promise<{ detail: MarketPostDetail | null; errorMessage: string | null }> {
  try {
    const postId = options.postId.trim();
    if (!postId) {
      return { detail: null, errorMessage: null };
    }

    const { data, error } = await client.rpc("get_post_detail", {
      p_post_id: postIdArg(postId),
      p_locale: options.locale,
    });

    if (error) {
      return { detail: null, errorMessage: error.message };
    }

    const row = Array.isArray(data) ? data[0] : data;
    // Empty = not found / not available / blocked — treat as a clean 404.
    if (!row || !isPostDetailRow(row)) {
      return { detail: null, errorMessage: null };
    }

    const detail = mapPostRowToDetail(row, options);

    const sellerId = row.seller_id?.toString().trim();
    if (sellerId) {
      const { data: otherData } = await client.rpc("get_seller_other_posts", {
        p_seller_id: sellerId,
        p_exclude_post_id: postIdArg(postId),
        p_locale: options.locale,
        p_limit: MARKET_POST_DETAIL_OTHER_ITEMS_MAX,
      });
      const otherRows = Array.isArray(otherData) ? otherData : [];
      detail.otherItems = otherRows.filter(isOtherPostRow).map(
        (r): SellerOtherItem => ({
          id: String(r.id),
          title: (r.title ?? "").toString(),
          priceLabel: formatMoney(options.locale, r.price_cents),
          imageUrl: getPostImageUrl(r.thumbnail_path, r.updated_at),
        }),
      );
    }

    return { detail, errorMessage: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { detail: null, errorMessage: msg };
  }
}
