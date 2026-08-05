import {
  getSharePreviewSupabaseClient,
  isSharePreviewSupabaseConfigured,
  sharePreviewSupabaseUrl,
} from "@/lib/supabase/share-preview-client";
import { siteUrl } from "@/lib/seo";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Data layer for the `/l/<token>` share landing route.
 *
 * One address family, two kinds of thing behind it: a marketplace listing or a
 * community post. Three anon-callable STABLE SECURITY DEFINER RPCs, read in a
 * fixed order:
 *
 *   1. `resolve_share_link(p_share_token text)` -> (kind, target_id)
 *   2. then EXACTLY ONE of
 *        `get_share_preview(p_share_token text)`           (listing)
 *        `get_community_share_preview(p_share_token text)` (community post)
 *
 * **Resolve first, then fetch the matching preview. Never try one preview and
 * fall back to the other when it comes back empty.** An ordered guess-chain is
 * forbidden by community-share.md 3.30: two independent visibility gates mean a
 * listing that is merely hidden could fall through and be rendered as whatever
 * the second lookup happened to find, so an address could show the wrong kind of
 * thing entirely. The resolver is the only authority on which kind a token is.
 *
 * Each RPC is deliberately narrow — no seller, no author, no coordinates, no id
 * — so a public share card cannot leak anything its own page would not show. The
 * community preview returns exactly three columns (title, suburb, first photo),
 * which is the database enforcing its half of the privacy contract in
 * community-share.md 3.33: never the body, replies, poll options or anything
 * about the author. Do not widen any of this to a table read; the underlying
 * tables are RLS-locked to anon.
 *
 * Every visibility gate lives server-side, which is why "unknown token",
 * "removed listing" and "unpublished post" all arrive here identically as zero
 * rows — exactly the behaviour we want, since the card must never hint that
 * something existed or why it went away.
 */

/** Share tokens are 24 lowercase hex chars, generated app-side. */
const SHARE_TOKEN_PATTERN = /^[0-9a-f]{24}$/;

/**
 * Crawlers abandon slow pages, and a share link must never hang on the database.
 *
 * This is a budget for the WHOLE resolve-then-fetch sequence, not per call — one
 * deadline is created up front and handed to both RPCs. Giving each its own
 * would quietly double the worst case the moment a second read was added, which
 * is exactly the kind of regression a crawler notices and nobody else does.
 */
const RPC_TIMEOUT_MS = 3000;

/**
 * Requested card size. The transform crops toward this box but never upscales,
 * so a small source photo yields something smaller — which is why the emitted
 * markup does NOT declare og:image:width/height. Asking for the full 1200x630
 * simply takes the largest crop each photo can actually supply.
 */
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

export type ShareKind = "listing" | "community_post";

export type ListingSharePreview = {
  kind: "listing";
  title: string;
  /** null when the RPC returned something that is not a usable number — never guess a price. */
  priceCents: number | null;
  suburbName: string | null;
  photoPath: string | null;
};

/**
 * A community post's shareable surface, in full. There is deliberately no field
 * for the body, replies, poll options or the author — see the privacy contract
 * at the top of this file. If a future card needs more, that is a spec change
 * first, not a widening here.
 */
export type CommunitySharePreview = {
  kind: "community_post";
  title: string;
  /** The post's neighbourhood. This is what the card and `og:description` show. */
  suburbName: string | null;
  photoPath: string | null;
};

export type SharePreview = ListingSharePreview | CommunitySharePreview;

/**
 * Storage bucket per kind. **This is the trap in this file.** Listing photos
 * live in `post_images` and community photos in `community_post_images`, and the
 * path shape inside them is identical — so a wrong-bucket URL is perfectly
 * well-formed, resolves to a 404, and shows up as a blank thumbnail in someone's
 * chat thread with nothing logged anywhere. The bucket is therefore derived from
 * the resolved kind and never assumed.
 */
const PHOTO_BUCKETS: Record<ShareKind, string> = {
  listing: "post_images",
  community_post: "community_post_images",
};

export function isValidShareToken(token: string): boolean {
  return SHARE_TOKEN_PATTERN.test(token);
}

type SharePreviewRow = {
  title: string | null;
  price_cents?: number | null;
  suburb_name: string | null;
  photo_path: string | null;
};

function isSharePreviewRow(value: unknown): value is SharePreviewRow {
  return typeof value === "object" && value !== null && "title" in value;
}

/** Supabase returns a set-returning RPC as an array and a scalar one as a bare value. */
function firstRow(data: unknown): unknown {
  return Array.isArray(data) ? data[0] : data;
}

type ShareLinkRow = { kind: string | null };

/**
 * Which kind of thing a token addresses, or null when it addresses nothing we
 * can render — unknown, empty or ambiguous address, or an unrecognised kind.
 *
 * An unrecognised `kind` string is treated as "no card" rather than guessed at.
 * If a third kind is ever added to the resolver, this returns null until this
 * file knows about it, which renders the generic card — the safe direction.
 */
async function resolveShareKind(
  supabase: SupabaseClient,
  token: string,
  deadline: AbortSignal,
): Promise<ShareKind | null> {
  const { data, error } = await supabase
    .rpc("resolve_share_link", { p_share_token: token })
    .abortSignal(deadline);

  if (error) return null;

  const row = firstRow(data);
  if (typeof row !== "object" || row === null || !("kind" in row)) return null;

  const kind = (row as ShareLinkRow).kind?.trim();
  return kind === "listing" || kind === "community_post" ? kind : null;
}

async function fetchListingPreview(
  supabase: SupabaseClient,
  token: string,
  deadline: AbortSignal,
): Promise<ListingSharePreview | null> {
  const { data, error } = await supabase
    .rpc("get_share_preview", { p_share_token: token })
    .abortSignal(deadline);

  if (error) return null;

  const row = firstRow(data);
  if (!isSharePreviewRow(row)) return null;

  const title = row.title?.trim() ?? "";
  if (title.length === 0) return null;

  // A non-numeric price must NOT collapse to 0 — that would advertise a paid
  // listing as "Free" in someone's chat thread. Drop the price instead.
  const priceCents =
    typeof row.price_cents === "number" && Number.isFinite(row.price_cents)
      ? row.price_cents
      : null;

  return {
    kind: "listing",
    title,
    priceCents,
    suburbName: row.suburb_name?.trim() || null,
    photoPath: row.photo_path?.trim() || null,
  };
}

async function fetchCommunityPreview(
  supabase: SupabaseClient,
  token: string,
  deadline: AbortSignal,
): Promise<CommunitySharePreview | null> {
  const { data, error } = await supabase
    .rpc("get_community_share_preview", { p_share_token: token })
    .abortSignal(deadline);

  if (error) return null;

  const row = firstRow(data);
  if (!isSharePreviewRow(row)) return null;

  const title = row.title?.trim() ?? "";
  if (title.length === 0) return null;

  return {
    kind: "community_post",
    title,
    suburbName: row.suburb_name?.trim() || null,
    photoPath: row.photo_path?.trim() || null,
  };
}

/**
 * Returns whatever a share token addresses — a listing or a community post — or
 * `null` for every "no card" case: unknown token, removed listing, unpublished
 * or taken-down post, malformed token, unconfigured environment, or a database
 * error. Callers must treat all of them the same.
 */
export async function fetchSharePreview(token: string): Promise<SharePreview | null> {
  if (!isValidShareToken(token)) return null;
  if (!isSharePreviewSupabaseConfigured()) return null;

  try {
    const supabase = getSharePreviewSupabaseClient();
    // One deadline for the pair, so adding the resolver did not double the time
    // a crawler can be made to wait.
    const deadline = AbortSignal.timeout(RPC_TIMEOUT_MS);

    const kind = await resolveShareKind(supabase, token, deadline);
    if (!kind) return null;

    return kind === "listing"
      ? fetchListingPreview(supabase, token, deadline)
      : fetchCommunityPreview(supabase, token, deadline);
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
 * `og:description`.
 *
 * For a listing: `<price> · <suburb>`. `suburb_name` comes from a LEFT JOIN and
 * can be null, and the price is dropped rather than guessed if it did not come
 * back as a number, so either half may be missing.
 *
 * For a community post: **the neighbourhood alone, never an excerpt.** A post
 * has no price, and pulling a line of the body in to fill the space is exactly
 * what the privacy contract forbids — the body is not in `CommunitySharePreview`
 * at all, so there is nothing here to leak even by accident.
 *
 * Returns "" when nothing is available; the caller substitutes the generic
 * tagline rather than emitting a blank description.
 */
export function formatShareDescription(preview: SharePreview): string {
  const parts: string[] = [];
  if (preview.kind === "listing" && preview.priceCents !== null) {
    parts.push(formatSharePrice(preview.priceCents));
  }
  if (preview.suburbName) parts.push(preview.suburbName);
  return parts.join(" · ");
}

/** Absolute URL of the site's own 1200x630 share card, used whenever there is no listing photo. */
export function fallbackShareImageUrl(): string {
  return `${siteUrl().replace(/\/$/, "")}/opengraph-image`;
}

/**
 * Public URL for a share card's photo, from the bucket that matches its kind.
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
export function sharePreviewImageUrl(preview: SharePreview): string {
  const { photoPath } = preview;
  if (!photoPath) return fallbackShareImageUrl();

  const origin = sharePreviewSupabaseUrl();
  if (!origin) return fallbackShareImageUrl();

  // Derived from the resolved kind, never assumed — see PHOTO_BUCKETS.
  const bucket = PHOTO_BUCKETS[preview.kind];

  const objectPath = photoPath
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  if (process.env.SHARE_OG_IMAGE_MODE === "object") {
    return `${origin}/storage/v1/object/public/${bucket}/${objectPath}`;
  }

  const query = `width=${OG_IMAGE_WIDTH}&height=${OG_IMAGE_HEIGHT}&resize=cover&quality=80&format=origin`;
  return `${origin}/storage/v1/render/image/public/${bucket}/${objectPath}?${query}`;
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
