import type { SupabaseClient } from "@supabase/supabase-js";
import { parseMeetupLocationPoint } from "@/lib/geo/meetup-point";
import { formatMarketDistanceKm } from "@/lib/market-distance";
import { MARKET_POST_DETAIL_OTHER_ITEMS_MAX, type MarketPostDetail } from "@/lib/market-post-detail";
import { marketSuburbFromDbId } from "@/lib/market-suburb-ids";
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

function formatListedAt(locale: Locale, iso: string | undefined): string | null {
  if (!iso) {
    return null;
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  try {
    return new Intl.DateTimeFormat(NUMBER_LOCALE[locale], {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toISOString();
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

function idForPostsEq(postId: string): string | number {
  const t = postId.trim();
  if (/^\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n)) {
      return n;
    }
  }
  return t;
}

function deliveryLabelFromMoreDetails(more: unknown): "yes" | "no" | "unknown" {
  if (!more || typeof more !== "object") {
    return "unknown";
  }
  const o = more as Record<string, unknown>;
  for (const key of ["is_deliverable", "deliverable", "can_deliver", "delivery_available"] as const) {
    const v = o[key];
    if (typeof v === "boolean") {
      return v ? "yes" : "no";
    }
    if (v === "true") {
      return "yes";
    }
    if (v === "false") {
      return "no";
    }
  }
  return "unknown";
}

type PostDetailRow = {
  id: number | string;
  seller_id?: string | null;
  raw_title: string;
  price_cents: number;
  currency?: string | null;
  status?: string | null;
  accept_offers?: boolean | null;
  category_id?: number | null;
  thumbnail_path?: string | null;
  created_at?: string;
  updated_at?: string | null;
  bumped_at?: string | null;
  meetup_location?: unknown;
  raw_meetup_label?: string | null;
  raw_description?: string | null;
  suburb_id?: number | null;
  more_details?: unknown;
  profiles?: unknown;
};

function isPostDetailRow(v: unknown): v is PostDetailRow {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  const idOk = typeof o.id === "string" || typeof o.id === "number";
  return idOk && typeof o.raw_title === "string" && typeof o.price_cents === "number";
}

type PhotoRow = {
  storage_path?: string | null;
};

type OtherPostRow = {
  id: number | string;
  raw_title: string;
  price_cents: number;
  currency?: string | null;
  thumbnail_path?: string | null;
  updated_at?: string | null;
};

function isOtherPostRow(v: unknown): v is OtherPostRow {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  const idOk = typeof o.id === "string" || typeof o.id === "number";
  return idOk && typeof o.raw_title === "string" && typeof o.price_cents === "number";
}

function profileField(profiles: unknown, key: string): string | null {
  if (!profiles || typeof profiles !== "object") {
    return null;
  }
  const single = Array.isArray(profiles) ? profiles[0] : profiles;
  if (!single || typeof single !== "object") {
    return null;
  }
  const p = single as Record<string, unknown>;
  const v = p[key];
  if (typeof v === "string" && v.trim().length > 0) {
    return v.trim();
  }
  return null;
}

function profileNumberField(profiles: unknown, key: string): number | null {
  if (!profiles || typeof profiles !== "object") {
    return null;
  }
  const single = Array.isArray(profiles) ? profiles[0] : profiles;
  if (!single || typeof single !== "object") {
    return null;
  }
  const p = single as Record<string, unknown>;
  const v = p[key];
  if (typeof v === "number" && Number.isFinite(v)) {
    return v;
  }
  return null;
}

type LegacyDetailRow = {
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

function isLegacyDetailRow(v: unknown): v is LegacyDetailRow {
  if (!v || typeof v !== "object") {
    return false;
  }
  const o = v as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.title === "string" && typeof o.price_cents === "number";
}

function mapPostRowToDetail(
  raw: PostDetailRow,
  options: { locale: Locale; sellerFallback: string; kmSuffix: string },
): MarketPostDetail {
  const currency = (raw.currency ?? "AUD").toString();
  let isNew = false;
  if (raw.created_at) {
    const created = new Date(raw.created_at).getTime();
    if (!Number.isNaN(created)) {
      isNew = Date.now() - created < 3 * 24 * 60 * 60 * 1000;
    }
  }
  const suburbId = raw.suburb_id;
  const areaLabel =
    typeof suburbId === "number" && Number.isFinite(suburbId)
      ? marketSuburbFromDbId(suburbId)
      : null;
  const verifiedSuburbId = profileNumberField(raw.profiles, "verified_suburb_id");
  const sellerVerifiedSuburbLabel =
    verifiedSuburbId !== null ? marketSuburbFromDbId(verifiedSuburbId) ?? `#${verifiedSuburbId}` : null;
  const sellerVerifiedAtLabel = formatListedAt(
    options.locale,
    profileField(raw.profiles, "suburb_verified_at") ?? undefined,
  );
  const statusRaw = (raw.status ?? "").toString().trim();
  const statusLabel = statusRaw.length > 0 ? statusRaw : "unknown";
  const deliveryLabel = deliveryLabelFromMoreDetails(raw.more_details);
  const offerLabel = raw.accept_offers ? "yes" : "no";
  const categoryLabel =
    typeof raw.category_id === "number" && Number.isFinite(raw.category_id)
      ? `#${raw.category_id}`
      : null;
  const meetupPoint = parseMeetupLocationPoint(raw.meetup_location);
  return {
    id: String(raw.id),
    title: raw.raw_title,
    priceLabel: formatMoney(options.locale, raw.price_cents, currency),
    sellerLabel: sellerLabelFromProfile(raw.profiles, options.sellerFallback),
    sellerAvatarUrl: profileField(raw.profiles, "avatar_url"),
    sellerVerifiedSuburbLabel,
    sellerVerifiedAtLabel,
    distanceLabel: formatMarketDistanceKm(null, options.kmSuffix),
    meetupPoint,
    imageUrl: getPostImageUrl(raw.thumbnail_path, raw.updated_at),
    photoUrls: [],
    isNew,
    areaLabel,
    listedAtLabel: formatListedAt(options.locale, raw.created_at),
    description: raw.raw_description?.trim() || null,
    meetupLabel: raw.raw_meetup_label?.trim() || null,
    categoryLabel,
    statusLabel,
    deliveryLabel,
    offerLabel,
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
    const table = marketListingsTableName();
    const postId = options.postId.trim();
    if (!postId) {
      return { detail: null, errorMessage: null };
    }

    if (table !== "posts") {
      const { data, error } = await client
        .from(table)
        .select(
          "id,title,price_cents,currency,thumbnail_path,seller_nickname,distance_meters,is_new,created_at,updated_at",
        )
        .eq("id", postId)
        .maybeSingle();

      if (error) {
        return { detail: null, errorMessage: error.message };
      }
      if (!data || !isLegacyDetailRow(data)) {
        return { detail: null, errorMessage: null };
      }
      const currency = (data.currency ?? "AUD").toString();
      const seller =
        data.seller_nickname && data.seller_nickname.trim().length > 0
          ? data.seller_nickname.trim()
          : options.sellerFallback;
      let isNew = !!data.is_new;
      if (data.created_at && !isNew) {
        const created = new Date(data.created_at).getTime();
        if (!Number.isNaN(created)) {
          isNew = Date.now() - created < 3 * 24 * 60 * 60 * 1000;
        }
      }
      return {
        detail: {
          id: data.id,
          title: data.title,
          priceLabel: formatMoney(options.locale, data.price_cents, currency),
          sellerLabel: seller,
          sellerAvatarUrl: null,
          sellerVerifiedSuburbLabel: null,
          sellerVerifiedAtLabel: null,
          distanceLabel: formatMarketDistanceKm(data.distance_meters, options.kmSuffix),
          meetupPoint: null,
          imageUrl: getPostImageUrl(data.thumbnail_path, data.updated_at),
          photoUrls: [],
          isNew,
          areaLabel: null,
          listedAtLabel: formatListedAt(options.locale, data.created_at),
          description: null,
          meetupLabel: null,
          categoryLabel: null,
          statusLabel: "unknown",
          deliveryLabel: "unknown",
          offerLabel: "unknown",
          otherItems: [],
        },
        errorMessage: null,
      };
    }

    const statuses = marketPostStatuses();
    const idEq = idForPostsEq(postId);

    const baseSelect = `
      id,
      seller_id,
      raw_title,
      price_cents,
      currency,
      status,
      accept_offers,
      category_id,
      thumbnail_path,
      created_at,
      updated_at,
      bumped_at,
      meetup_location,
      raw_meetup_label,
      raw_description,
      suburb_id,
      more_details
    `;
    const withProfilesSelect = `
      ${baseSelect},
      profiles!posts_seller_id_fkey(nickname,avatar_url,verified_suburb_id,suburb_verified_at)
    `;

    let query = client.from("posts").select(withProfilesSelect).eq("id", idEq);

    if (statuses.length === 1) {
      query = query.eq("status", statuses[0]!);
    } else if (statuses.length > 1) {
      query = query.in("status", statuses);
    }

    const firstRes = await query.maybeSingle();
    let data: unknown = firstRes.data;
    let error = firstRes.error;

    if (error && isProfilesJoinError(error.message)) {
      let fallbackQuery = client.from("posts").select(baseSelect).eq("id", idEq);
      if (statuses.length === 1) {
        fallbackQuery = fallbackQuery.eq("status", statuses[0]!);
      } else if (statuses.length > 1) {
        fallbackQuery = fallbackQuery.in("status", statuses);
      }
      const fallbackRes = await fallbackQuery.maybeSingle();
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      return { detail: null, errorMessage: error.message };
    }
    if (!data || !isPostDetailRow(data)) {
      return { detail: null, errorMessage: null };
    }

    const detail = mapPostRowToDetail(data, options);
    const pid = Number(detail.id);
    if (Number.isFinite(pid)) {
      const { data: photosData } = await client
        .from("post_photos")
        .select("storage_path,sort_order")
        .eq("post_id", pid)
        .order("sort_order", { ascending: true })
        .limit(12);
      const photos = Array.isArray(photosData) ? (photosData as PhotoRow[]) : [];
      const urls = photos
        .map((p) => getPostImageUrl(p.storage_path ?? null, data.updated_at))
        .filter((u): u is string => typeof u === "string" && u.length > 0);
      if (urls.length > 0) {
        detail.photoUrls = urls;
        detail.imageUrl = urls[0] ?? detail.imageUrl;
      } else if (detail.imageUrl) {
        detail.photoUrls = [detail.imageUrl];
      }
    }

    const sellerId = data.seller_id?.toString().trim();
    if (sellerId) {
      let otherQuery = client
        .from("posts")
        .select("id,raw_title,price_cents,currency,thumbnail_path,updated_at")
        .eq("seller_id", sellerId)
        .neq("id", idEq)
        .limit(MARKET_POST_DETAIL_OTHER_ITEMS_MAX)
        .order("bumped_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (statuses.length === 1) {
        otherQuery = otherQuery.eq("status", statuses[0]!);
      } else if (statuses.length > 1) {
        otherQuery = otherQuery.in("status", statuses);
      }
      const { data: otherData } = await otherQuery;
      const rows = Array.isArray(otherData) ? otherData : [];
      detail.otherItems = rows
        .filter(isOtherPostRow)
        .map((r) => ({
          id: String(r.id),
          title: r.raw_title,
          priceLabel: formatMoney(options.locale, r.price_cents, (r.currency ?? "AUD").toString()),
          imageUrl: getPostImageUrl(r.thumbnail_path, r.updated_at),
        }));
    }

    return { detail, errorMessage: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { detail: null, errorMessage: msg };
  }
}
