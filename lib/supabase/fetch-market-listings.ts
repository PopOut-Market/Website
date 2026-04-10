import type { SupabaseClient } from "@supabase/supabase-js";
import { parseMeetupLocationPoint } from "@/lib/geo/meetup-point";
import { formatMarketDistanceKm } from "@/lib/market-distance";
import type { MarketProduct } from "@/lib/market-product";
import { marketSuburbDbId } from "@/lib/market-suburb-ids";
import type { MarketSuburb } from "@/lib/site-suburbs";
import type { Locale } from "@/lib/site-i18n";
import { marketListingsTableName, marketPostStatuses } from "@/lib/supabase/browser-client";
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

function formatMoney(locale: Locale, cents: number, currency: string): string {
  const cur = currency.trim().length >= 3 ? currency.trim().slice(0, 3) : "AUD";
  try {
    return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
      maximumFractionDigits: 0,
    }).format(cents / 100);
  }
}

function sellerLabelFromProfile(profiles: unknown, fallback: string): string {
  if (!profiles || typeof profiles !== "object") {
    return fallback;
  }
  const single = Array.isArray(profiles) ? profiles[0] : profiles;
  if (!single || typeof single !== "object") {
    return fallback;
  }
  const p = single as Record<string, unknown>;
  for (const key of ["nickname", "full_name", "display_name", "username"] as const) {
    const s = p[key];
    if (typeof s === "string" && s.trim().length > 0) {
      return s.trim();
    }
  }
  return fallback;
}

function isProfilesJoinError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    (m.includes("could not embed") && m.includes("profiles")) ||
    (m.includes("relationship") && m.includes("profiles"))
  );
}

type LegacyListingRow = {
  id: string;
  title: string;
  price_cents: number;
  currency?: string | null;
  thumbnail_path?: string | null;
  seller_nickname?: string | null;
  distance_meters?: number | null;
  is_new?: boolean | null;
  created_at?: string;
  updated_at?: string | null;
};

function isLegacyListingRow(v: unknown): v is LegacyListingRow {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.title === "string" && typeof o.price_cents === "number";
}

type PostRow = {
  id: number | string;
  raw_title: string;
  price_cents: number;
  currency?: string | null;
  thumbnail_path?: string | null;
  created_at?: string;
  updated_at?: string | null;
  bumped_at?: string | null;
  meetup_location?: unknown;
  profiles?: unknown;
};

function isPostRow(v: unknown): v is PostRow {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  const idOk = typeof o.id === "string" || typeof o.id === "number";
  return idOk && typeof o.raw_title === "string" && typeof o.price_cents === "number";
}

async function fetchLegacyFlatListings(
  client: SupabaseClient,
  options: {
    suburbSlug: string;
    locale: Locale;
    sellerFallback: string;
    kmSuffix: string;
    limit: number;
  },
): Promise<{ products: MarketProduct[]; errorMessage: string | null }> {
  const table = marketListingsTableName();
  const { data, error } = await client
    .from(table)
    .select(
      "id,title,price_cents,currency,thumbnail_path,seller_nickname,distance_meters,is_new,created_at,updated_at",
    )
    .eq("suburb_slug", options.suburbSlug)
    .order("created_at", { ascending: false })
    .limit(options.limit);

  if (error) {
    return { products: [], errorMessage: error.message };
  }

  const rows = Array.isArray(data) ? data : [];
  const products: MarketProduct[] = [];

  for (const raw of rows) {
    if (!isLegacyListingRow(raw)) {
      continue;
    }
    const currency = (raw.currency ?? "AUD").toString();
    const seller =
      raw.seller_nickname && raw.seller_nickname.trim().length > 0
        ? raw.seller_nickname.trim()
        : options.sellerFallback;

    let isNew = !!raw.is_new;
    if (raw.created_at && !isNew) {
      const created = new Date(raw.created_at).getTime();
      if (!Number.isNaN(created)) {
        isNew = Date.now() - created < 3 * 24 * 60 * 60 * 1000;
      }
    }

    products.push({
      id: raw.id,
      title: raw.title,
      priceLabel: formatMoney(options.locale, raw.price_cents, currency),
      distanceLabel: formatMarketDistanceKm(raw.distance_meters, options.kmSuffix),
      sellerLabel: seller,
      isNew,
      imageUrl: getPostImageUrl(raw.thumbnail_path, raw.updated_at),
    });
  }

  return { products, errorMessage: null };
}

/**
 * Real app: `public.posts` filtered by `suburb_id` (see lib/market-suburb-ids.ts). Status filter optional.
 * Legacy: flat `web_market_posts` with `suburb_slug` text column.
 */
export async function fetchMarketListings(
  client: SupabaseClient,
  options: {
    /** Picker value — resolves to `suburb_id` via lib/market-suburb-ids.ts */
    marketSuburb: MarketSuburb;
    suburbSlug: string;
    suburbLabel: string;
    locale: Locale;
    sellerFallback: string;
    kmSuffix: string;
    limit?: number;
  },
): Promise<{ products: MarketProduct[]; errorMessage: string | null }> {
  try {
    const table = marketListingsTableName();
    const limit = options.limit ?? 60;

    if (table !== "posts") {
      return await fetchLegacyFlatListings(client, {
        suburbSlug: options.suburbSlug,
        locale: options.locale,
        sellerFallback: options.sellerFallback,
        kmSuffix: options.kmSuffix,
        limit,
      });
    }

    const suburbId = marketSuburbDbId(options.marketSuburb);
    if (suburbId === null) {
      return { products: [], errorMessage: null };
    }

    const statuses = marketPostStatuses();

    const baseSelect = `
      id,
      raw_title,
      price_cents,
      currency,
      thumbnail_path,
      created_at,
      updated_at,
      bumped_at,
      meetup_location
    `;
    const withProfilesSelect = `
      ${baseSelect},
      profiles!posts_seller_id_fkey(nickname)
    `;

    let query = client.from("posts").select(withProfilesSelect).eq("suburb_id", suburbId).limit(limit);

    if (statuses.length === 1) {
      query = query.eq("status", statuses[0]!);
    } else if (statuses.length > 1) {
      query = query.in("status", statuses);
    }

    query = query
      .order("bumped_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    const firstRes = await query;
    let data: unknown = firstRes.data;
    let error = firstRes.error;

    if (error && isProfilesJoinError(error.message)) {
      let fallbackQuery = client.from("posts").select(baseSelect).eq("suburb_id", suburbId).limit(limit);
      if (statuses.length === 1) {
        fallbackQuery = fallbackQuery.eq("status", statuses[0]!);
      } else if (statuses.length > 1) {
        fallbackQuery = fallbackQuery.in("status", statuses);
      }
      fallbackQuery = fallbackQuery
        .order("bumped_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      const fallbackRes = await fallbackQuery;
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      return { products: [], errorMessage: error.message };
    }

    const rows = Array.isArray(data) ? data : [];
    const products: MarketProduct[] = [];

    for (const raw of rows) {
      if (!isPostRow(raw)) {
        continue;
      }
      const currency = (raw.currency ?? "AUD").toString();
      let isNew = false;
      if (raw.created_at) {
        const created = new Date(raw.created_at).getTime();
        if (!Number.isNaN(created)) {
          isNew = Date.now() - created < 3 * 24 * 60 * 60 * 1000;
        }
      }

      const meetupPoint = parseMeetupLocationPoint(raw.meetup_location);
      products.push({
        id: String(raw.id),
        title: raw.raw_title,
        priceLabel: formatMoney(options.locale, raw.price_cents, currency),
        distanceLabel: formatMarketDistanceKm(null, options.kmSuffix),
        sellerLabel: sellerLabelFromProfile(raw.profiles, options.sellerFallback),
        isNew,
        imageUrl: getPostImageUrl(raw.thumbnail_path, raw.updated_at),
        meetupPoint,
      });
    }

    return { products, errorMessage: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { products: [], errorMessage: msg };
  }
}

/** Hero carousel: a small random sample from recent listings (browser client + RLS). */
export type HeroCarouselListing = {
  id: string;
  title: string;
  priceLabel: string;
  imageUrl: string | null;
};

const HERO_CAROUSEL_POOL_LIMIT = 60;
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
 * Fetches a pool of recent `posts` (or legacy flat table) rows, shuffles, returns up to 10.
 * Matches `fetchMarketListings` table/status conventions; no suburb filter.
 */
export async function fetchHeroCarouselListings(
  client: SupabaseClient,
  options: { locale: Locale },
): Promise<{ listings: HeroCarouselListing[]; errorMessage: string | null }> {
  try {
    const table = marketListingsTableName();
    const pool = HERO_CAROUSEL_POOL_LIMIT;
    const pick = HERO_CAROUSEL_COUNT;

    if (table !== "posts") {
      const { data, error } = await client
        .from(table)
        .select("id,title,price_cents,currency,thumbnail_path,created_at,updated_at")
        .order("created_at", { ascending: false })
        .limit(pool);

      if (error) {
        return { listings: [], errorMessage: error.message };
      }

      const rows = Array.isArray(data) ? data : [];
      const candidates: HeroCarouselListing[] = [];
      for (const raw of rows) {
        if (!isLegacyListingRow(raw)) {
          continue;
        }
        const currency = (raw.currency ?? "AUD").toString();
        candidates.push({
          id: raw.id,
          title: raw.title,
          priceLabel: formatMoney(options.locale, raw.price_cents, currency),
          imageUrl: getPostImageUrl(raw.thumbnail_path, raw.updated_at),
        });
      }
      shuffleInPlace(candidates);
      return { listings: candidates.slice(0, pick), errorMessage: null };
    }

    const statuses = marketPostStatuses();
    const baseSelect = `
      id,
      raw_title,
      price_cents,
      currency,
      thumbnail_path,
      created_at,
      updated_at,
      bumped_at
    `;

    let query = client.from("posts").select(baseSelect).limit(pool);
    if (statuses.length === 1) {
      query = query.eq("status", statuses[0]!);
    } else if (statuses.length > 1) {
      query = query.in("status", statuses);
    }
    query = query
      .order("bumped_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      return { listings: [], errorMessage: error.message };
    }

    const rows = Array.isArray(data) ? data : [];
    const candidates: HeroCarouselListing[] = [];
    for (const raw of rows) {
      if (!isPostRow(raw)) {
        continue;
      }
      const currency = (raw.currency ?? "AUD").toString();
      candidates.push({
        id: String(raw.id),
        title: raw.raw_title,
        priceLabel: formatMoney(options.locale, raw.price_cents, currency),
        imageUrl: getPostImageUrl(raw.thumbnail_path, raw.updated_at),
      });
    }
    shuffleInPlace(candidates);
    return { listings: candidates.slice(0, pick), errorMessage: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { listings: [], errorMessage: msg };
  }
}
