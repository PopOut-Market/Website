import {
  getSharePreviewSupabaseClient,
  isSharePreviewSupabaseConfigured,
  sharePreviewSupabaseUrl,
} from "@/lib/supabase/share-preview-client";
import { siteUrl } from "@/lib/seo";

/**
 * Data layer for the `/l/<token>` share landing route.
 *
 * The ONLY read is `get_share_preview(p_share_token text)`, an anon-callable
 * STABLE SECURITY DEFINER RPC returning at most one row of exactly four columns.
 * It is deliberately narrow — no seller, no coordinates, no post id — so the
 * public share card cannot leak anything the listing page would not show. Do not
 * widen this to a table read; the underlying tables are RLS-locked to anon.
 *
 * The RPC's own visibility gate already drops taken-down, deleted, banned-seller
 * and deleted-seller listings, which is why "unknown token" and "removed
 * listing" arrive here identically as zero rows — exactly the behaviour we want,
 * since the card must never hint that a listing existed or why it went away.
 */

/** Share tokens are 24 lowercase hex chars, generated app-side. */
const SHARE_TOKEN_PATTERN = /^[0-9a-f]{24}$/;

/** Crawlers abandon slow pages, and a share link must never hang on the database. */
const RPC_TIMEOUT_MS = 3000;

const PHOTO_BUCKET = "post_images";

/**
 * Requested card size. The transform crops toward this box but never upscales,
 * so a small source photo yields something smaller — which is why the emitted
 * markup does NOT declare og:image:width/height. Asking for the full 1200x630
 * simply takes the largest crop each photo can actually supply.
 */
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

export type SharePreview = {
  title: string;
  /** null when the RPC returned something that is not a usable number — never guess a price. */
  priceCents: number | null;
  suburbName: string | null;
  photoPath: string | null;
};

export function isValidShareToken(token: string): boolean {
  return SHARE_TOKEN_PATTERN.test(token);
}

type SharePreviewRow = {
  title: string | null;
  price_cents: number | null;
  suburb_name: string | null;
  photo_path: string | null;
};

function isSharePreviewRow(value: unknown): value is SharePreviewRow {
  return typeof value === "object" && value !== null && "title" in value;
}

/**
 * Returns the listing behind a share token, or `null` for every "no card"
 * case — unknown token, removed listing, malformed token, unconfigured
 * environment, or a database error. Callers must treat all of them the same.
 */
export async function fetchSharePreview(token: string): Promise<SharePreview | null> {
  if (!isValidShareToken(token)) return null;
  if (!isSharePreviewSupabaseConfigured()) return null;

  try {
    const supabase = getSharePreviewSupabaseClient();
    const { data, error } = await supabase
      .rpc("get_share_preview", { p_share_token: token })
      .abortSignal(AbortSignal.timeout(RPC_TIMEOUT_MS));

    if (error) return null;

    const row = Array.isArray(data) ? data[0] : data;
    if (!isSharePreviewRow(row)) return null;

    const title = row.title?.trim() ?? "";
    if (title.length === 0) return null;

    // A non-numeric price must NOT collapse to 0 — that would advertise a paid
    // listing as "Free" in someone's chat thread. Drop the price instead.
    const priceCents =
      typeof row.price_cents === "number" && Number.isFinite(row.price_cents)
        ? row.price_cents
        : null;
    const suburbName = row.suburb_name?.trim() || null;
    const photoPath = row.photo_path?.trim() || null;

    return { title, priceCents, suburbName, photoPath };
  } catch {
    // Timeout, network failure, bad config — degrade to the generic card rather
    // than 500-ing a link that is already sitting in someone's chat thread.
    return null;
  }
}

/**
 * `$50` for whole dollars, `$12.50` otherwise, `Free` at zero. Always AUD.
 *
 * Note this is intentionally NOT the site's `formatMoney()` helper: that one is
 * locale-aware and renders `FREE` in caps with no cents. The share card is a
 * fixed en-AU string embedded in an Open Graph tag — one canonical rendering
 * regardless of who opens the link.
 */
export function formatSharePrice(cents: number): string {
  if (!Number.isFinite(cents) || cents <= 0) return "Free";
  const wholeDollars = cents % 100 === 0;
  const fractionDigits = wholeDollars ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(fractionDigits)}`;
  }
}

/**
 * `og:description` — `<price> · <suburb>`. `suburb_name` comes from a LEFT JOIN
 * and can be null, and the price is dropped rather than guessed if it did not
 * come back as a number, so either half may be missing. Returns "" when both
 * are; the caller substitutes the generic tagline.
 */
export function formatShareDescription(preview: SharePreview): string {
  const parts: string[] = [];
  if (preview.priceCents !== null) parts.push(formatSharePrice(preview.priceCents));
  if (preview.suburbName) parts.push(preview.suburbName);
  return parts.join(" · ");
}

/** Absolute URL of the site's own 1200x630 share card, used whenever there is no listing photo. */
export function fallbackShareImageUrl(): string {
  return `${siteUrl().replace(/\/$/, "")}/opengraph-image`;
}

/**
 * Public URL for a listing photo, sized for a share card.
 *
 * Uses Supabase Storage's image-transform endpoint rather than the raw object
 * URL, because stored photos are `.webp` and several of the crawlers we serve
 * (WhatsApp, KakaoTalk, Facebook) render WebP unreliably or not at all — a
 * blank thumbnail on exactly the channels this app is shared through. The
 * add-on is enabled on both the staging and production projects.
 *
 * `format=origin` is load-bearing despite its name: without it the transform
 * content-negotiates on the request's `Accept` header and hands WebP straight
 * back to any fetcher that advertises it, re-creating the problem. With it the
 * response is deterministically JPEG or PNG whatever the crawler asks for
 * (verified against both projects).
 *
 * Set `SHARE_OG_IMAGE_MODE=object` to fall back to the plain public object URL
 * (`/storage/v1/object/public/...`) if the transform add-on is ever turned off.
 * That mode serves the original `.webp` bytes and carries the WebP caveat above.
 */
export function shareImageUrl(photoPath: string | null): string {
  if (!photoPath) return fallbackShareImageUrl();

  const origin = sharePreviewSupabaseUrl();
  if (!origin) return fallbackShareImageUrl();

  const objectPath = photoPath
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  if (process.env.SHARE_OG_IMAGE_MODE === "object") {
    return `${origin}/storage/v1/object/public/${PHOTO_BUCKET}/${objectPath}`;
  }

  const query = `width=${OG_IMAGE_WIDTH}&height=${OG_IMAGE_HEIGHT}&resize=cover&quality=80&format=origin`;
  return `${origin}/storage/v1/render/image/public/${PHOTO_BUCKET}/${objectPath}?${query}`;
}

/**
 * Canonical share URL.
 *
 * Uses the site's canonical host — `siteUrl()`, i.e. www — rather than the apex
 * the app shares. Netlify 301s apex to www, so a crawler that followed the link
 * is already on www; pointing `og:url` back at the apex would make the share
 * object canonicalize to a URL that immediately redirects. Every other page on
 * this site canonicalizes to www too.
 *
 * The token is percent-encoded: a valid 24-hex token is unchanged, and a junk
 * path segment cannot smuggle anything into the emitted URL.
 */
export function shareCanonicalUrl(token: string): string {
  return `${siteUrl().replace(/\/$/, "")}/l/${encodeURIComponent(token)}`;
}
