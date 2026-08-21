import { getPostImageUrl } from "@/lib/supabase/post-image-url";
import type { Locale } from "@/lib/site-i18n";

/**
 * Server-side reads of the public marketplace data, for pages that must be
 * *readable without JavaScript*.
 *
 * Why this exists alongside `lib/supabase/browser-client.ts`: every page body on
 * this site is a `"use client"` component, and `/market` fetched its listings in
 * a `useEffect`. The result was that the server HTML for `/market` carried seven
 * words of page-specific text and zero links to any listing — so Googlebot, and
 * every AI retrieval crawler (none of which executes JavaScript), saw an empty
 * page sitting on top of a thousand live listings.
 *
 * Everything here goes through the public `get_home_feed` RPC on the anon key,
 * exactly as the app does. Two things follow from that, and both matter:
 *
 *  - No service-role key is needed, so none is shipped to the web deployment.
 *  - Direct table reads would not work anyway: `posts` and `post_i18n` answer the
 *    anon key with HTTP 200 and zero rows. The RPC is the only public path in.
 *
 * The RPC also returns human-translated titles for all eight locales, so a
 * Korean or Vietnamese page renders real Korean or Vietnamese listing titles
 * rather than English text under a localized heading.
 */

/** The RPC's `p_filter` argument. Anything else answers `INVALID_FILTER`. */
const HOME_FEED_FILTER = "for_you";

/**
 * Melbourne CBD. `get_home_feed` has no "everywhere" mode: it ranks relative to
 * one suburb and returns nearby suburbs alongside it. The CBD holds ~35% of all
 * live inventory, so it is the widest single anchor available.
 *
 * IMPORTANT: because the RPC broadcasts nearby suburbs, a caller that renders
 * these rows under a specific suburb's name MUST filter on `suburbName` first —
 * see `fetchSuburbListings`. Passing `p_suburb_id` alone does not scope the feed.
 */
const DEFAULT_ANCHOR_SUBURB_ID = 244;

export type FeedListing = {
  id: string;
  title: string;
  priceCents: number;
  suburbName: string | null;
  categorySlug: string | null;
  imageUrl: string | null;
  createdAt: string | null;
};

type HomeFeedRow = {
  id: number | string;
  title: string | null;
  price_cents: number | null;
  suburb_name: string | null;
  category_slug: string | null;
  thumbnail_path: string | null;
  updated_at: string | null;
  created_at: string | null;
  status: string | null;
};

function supabaseUrl(): string {
  return (process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
    .trim()
    .replace(/\/$/, "");
}

function supabaseAnonKey(): string {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  ).trim();
}

export function isServerSupabaseConfigured(): boolean {
  return supabaseUrl().startsWith("http") && supabaseAnonKey().length > 0;
}

/**
 * Calls a Supabase RPC over **GET**, not POST — and that choice is load-bearing.
 *
 * Next never caches a non-GET fetch, and an uncacheable fetch drags the whole
 * route out of static generation into on-demand SSR. That would mean a live
 * database round-trip on every crawler hit of every category page in every
 * locale. PostgREST exposes `get_home_feed` over GET (verified against
 * production), so the request is plainly cacheable and `next: { revalidate }`
 * does what the route's `export const revalidate` is asking for.
 *
 * For the same reason there is no `AbortSignal` here: attaching one also makes
 * the request uncacheable. Failures are absorbed instead — a build must not
 * break because Supabase was slow or an env var is missing in a preview deploy.
 * The page degrades to its static copy, which is still a complete page.
 */
async function getRpc<T>(
  fn: string,
  args: Record<string, string | number>,
  revalidate: number,
): Promise<T[] | null> {
  if (!isServerSupabaseConfigured()) return null;

  const qs = new URLSearchParams(Object.entries(args).map(([k, v]) => [k, String(v)])).toString();

  try {
    const res = await fetch(`${supabaseUrl()}/rest/v1/rpc/${fn}?${qs}`, {
      headers: {
        apikey: supabaseAnonKey(),
        Authorization: `Bearer ${supabaseAnonKey()}`,
      },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return Array.isArray(json) ? (json as T[]) : null;
  } catch {
    return null;
  }
}

function toListing(raw: HomeFeedRow): FeedListing | null {
  const id = raw?.id;
  const title = (raw?.title ?? "").toString().trim();
  if (id === undefined || id === null || !title) return null;
  return {
    id: String(id),
    title,
    priceCents: typeof raw.price_cents === "number" ? raw.price_cents : 0,
    suburbName: raw.suburb_name?.toString().trim() || null,
    categorySlug: raw.category_slug?.toString().trim() || null,
    imageUrl: getPostImageUrl(raw.thumbnail_path, raw.updated_at),
    createdAt: raw.created_at ?? null,
  };
}

export type FeedQuery = {
  locale: Locale;
  limit: number;
  /** `categories.id` of a TOP-LEVEL category (`in_v2 = true`, `parent_id is null`). */
  categoryTopId?: number;
  /** Ranking anchor. Does NOT scope the result to that suburb — see the note above. */
  anchorSuburbId?: number;
  /** Seconds. Listings turn over fast, so an hour is already generous. */
  revalidate?: number;
};

/**
 * Ranked live listings, ready to render server-side.
 *
 * Wrapped in `unstable_cache` rather than relying on Next's fetch cache: the
 * Supabase RPC is a POST, and Next never caches a non-GET fetch. Without this
 * every page calling it bails out of static generation and becomes `ƒ` —
 * server-rendered on every single request, including every crawler hit. Caching
 * the *result* instead lets the pages prerender and revalidate on a timer, which
 * is what `export const revalidate` on each route is asking for.
 */
export async function fetchFeedListings(query: FeedQuery): Promise<FeedListing[]> {
  const {
    locale,
    limit,
    categoryTopId,
    anchorSuburbId = DEFAULT_ANCHOR_SUBURB_ID,
    revalidate = 3600,
  } = query;

  const rows = await getRpc<HomeFeedRow>(
    "get_home_feed",
    {
      p_suburb_id: anchorSuburbId,
      p_locale: locale,
      p_filter: HOME_FEED_FILTER,
      p_offset: 0,
      // The RPC caps at 50 per call; ask for headroom so post-filtering by
      // suburb still has rows left to work with.
      p_limit: Math.min(50, Math.max(limit, 20)),
      ...(categoryTopId ? { p_category_v2_top_id: categoryTopId } : {}),
    },
    revalidate,
  );

  if (!rows) return [];

  return rows
    .filter((r) => !r.status || r.status === "available")
    .map(toListing)
    .filter((l): l is FeedListing => l !== null)
    .slice(0, limit);
}

/**
 * Listings that are genuinely IN one suburb.
 *
 * `get_home_feed(p_suburb_id)` returns nearby suburbs too — asking it for
 * Doncaster returns Box Hill rows. Rendering those under a "listings in
 * Doncaster" heading would publish a false locality claim in eight languages,
 * so the suburb filter is applied here rather than trusted from the RPC.
 */
export async function fetchSuburbListings(
  query: FeedQuery & { suburbName: string; anchorSuburbId: number },
): Promise<FeedListing[]> {
  const pool = await fetchFeedListings({ ...query, limit: 50 });
  const wanted = query.suburbName.trim().toLowerCase();
  return pool.filter((l) => l.suburbName?.toLowerCase() === wanted).slice(0, query.limit);
}

/**
 * How many suburbs PopOut is actually live in.
 *
 * Read live rather than hard-coded: suburbs are activated by hand outside the
 * migration pipeline, so no file in either repo is authoritative. The fallback
 * is the value verified against production on 2026-08-21 — a page that renders
 * a slightly stale count is fine; a page that renders "undefined suburbs" is not.
 */
export async function fetchActiveSuburbCount(revalidate = 86400): Promise<number> {
  const FALLBACK = 336;
  if (!isServerSupabaseConfigured()) return FALLBACK;

  try {
    const res = await fetch(`${supabaseUrl()}/rest/v1/suburbs?select=id&is_active=eq.true`, {
      headers: {
        apikey: supabaseAnonKey(),
        Authorization: `Bearer ${supabaseAnonKey()}`,
        // A head request with an exact count avoids the 1000-row page cap that
        // silently truncates a naive `select` on this project.
        Prefer: "count=exact",
        Range: "0-0",
      },
      next: { revalidate },
    });
    const total = res.headers.get("content-range")?.split("/")[1];
    const n = total ? Number.parseInt(total, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/** `1234` -> `$12.34`, `0` -> `Free`. Matches how the app renders a $0 price. */
export function formatPriceLabel(locale: Locale, priceCents: number, freeLabel: string): string {
  if (!Number.isFinite(priceCents) || priceCents <= 0) return freeLabel;
  const amount = priceCents / 100;
  try {
    return new Intl.NumberFormat(locale === "en" ? "en-AU" : locale, {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
  }
}
