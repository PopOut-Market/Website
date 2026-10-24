import { MARKET_CATEGORIES } from "@/lib/market-categories";

/**
 * When each indexable page's content last changed — the one source for the
 * sitemap's `lastmod`, each page's JSON-LD `dateModified`, and the visible
 * "Updated" line. Keeping them in one place is the point: three hand-kept copies
 * of the same date drift apart (the graduation guide said 2026-09-07 in its
 * JSON-LD while the sitemap said 2026-09-06).
 *
 * How often a path's content genuinely changes drives both `changeFrequency`
 * and `lastModified`, and it is the reason `lastModified` is not `new Date()`
 * for every URL. Stamping every URL with the build time told crawlers that all
 * 240 pages changed on every deploy — a false freshness signal at scale, which
 * teaches a crawler to ignore `lastmod` on this domain.
 *
 * - `live`   — renders Supabase data and revalidates. Genuinely changes as often
 *              as the marketplace does, so the render time is honest here.
 * - `static` — authored copy. It changed when someone edited it, so it carries
 *              the date of the last substantive content edit, set by hand below.
 */
export type Freshness = "live" | "static";

export type IndexablePath = {
  path: string;
  freshness: Freshness;
  /** ISO date of the last substantive content edit. Only used when `static`. */
  contentUpdated: string;
  priority: number;
  /** Locale segments this path exists in. Defaults to all of them. */
  locales?: readonly string[];
};

/** Bump these when you materially rewrite a static page's copy. */
export const REPOSITIONING_EDIT = "2026-08-21";
export const LAST_SEO_PASS = "2026-06-17";
/**
 * 2026-09-06: the pass that removed advice naming filters the app does not have
 * (delivery, student-posted, condition, recency) from the eight suburb pages, the
 * unverifiable "more Australian cities coming soon" clause from the region and
 * app pages, and the banned "verify their identity" wording from /child-safety.
 * Body copy changed on every page carrying this date, so it is a real edit, not a
 * touch — the whole point of hand-maintaining these (see the header note).
 */
export const CLAIM_CORRECTION_EDIT = "2026-09-06";
/**
 * 2026-10-24, the October refresh: /about gained the paragraph naming the store
 * app "PopOut" and its maker; /faq answer 5 stopped saying neighbours post prices
 * on a shop map (shop posts left the map in production on 2026-10-03); /privacy
 * added Plausible Analytics. Pages that only had the app's name corrected keep
 * their earlier date.
 */
export const OCTOBER_REFRESH_EDIT = "2026-10-24";

export const INDEXABLE_PATHS: IndexablePath[] = [
  { path: "/", freshness: "live", contentUpdated: REPOSITIONING_EDIT, priority: 1 },
  { path: "/market", freshness: "live", contentUpdated: REPOSITIONING_EDIT, priority: 0.9 },

  // Category pages — each renders a live, category-scoped feed.
  ...MARKET_CATEGORIES.map((c) => ({
    path: c.path,
    freshness: "live" as const,
    contentUpdated: REPOSITIONING_EDIT,
    priority: 0.8,
  })),

  // Ships in 4 locales only — see lib/grocery-guide-copy.ts. Emitting the other
  // four here would put URLs in the sitemap that deliberately 404.
  {
    path: "/melbourne-cbd-asian-grocery-guide",
    freshness: "live",
    contentUpdated: REPOSITIONING_EDIT,
    priority: 0.8,
    locales: ["en", "zh-cn", "zh-tw", "ko"],
  },

  { path: "/about", freshness: "static", contentUpdated: OCTOBER_REFRESH_EDIT, priority: 0.7 },
  { path: "/faq", freshness: "static", contentUpdated: OCTOBER_REFRESH_EDIT, priority: 0.7 },

  {
    path: "/melbourne-second-hand-app",
    freshness: "static",
    contentUpdated: CLAIM_CORRECTION_EDIT,
    priority: 0.7,
  },
  {
    path: "/melbourne-second-hand-market",
    freshness: "static",
    contentUpdated: LAST_SEO_PASS,
    priority: 0.7,
  },
  {
    path: "/melbourne-second-hand-marketplace",
    freshness: "static",
    contentUpdated: LAST_SEO_PASS,
    priority: 0.7,
  },
  {
    path: "/melbourne-cbd-second-hand-marketplace",
    freshness: "static",
    contentUpdated: LAST_SEO_PASS,
    priority: 0.7,
  },

  { path: "/comparison", freshness: "static", contentUpdated: REPOSITIONING_EDIT, priority: 0.7 },
  {
    path: "/comparison/gumtree",
    freshness: "static",
    contentUpdated: REPOSITIONING_EDIT,
    priority: 0.7,
  },
  {
    path: "/comparison/facebook-marketplace",
    freshness: "static",
    contentUpdated: REPOSITIONING_EDIT,
    priority: 0.7,
  },

  { path: "/melbourne-suburbs", freshness: "static", contentUpdated: LAST_SEO_PASS, priority: 0.7 },
  ...[
    "melbourne-cbd",
    "carlton",
    "parkville",
    "southbank",
    "docklands",
    "fitzroy",
    "north-melbourne",
    "south-wharf",
    "inner-north",
    "inner-east",
    "inner-south",
    "eastern",
    "south-east",
    "bayside",
    "northern",
    "north-west",
    "western",
  ].map((slug) => ({
    path: `/melbourne-suburbs/${slug}`,
    freshness: "static" as const,
    contentUpdated: CLAIM_CORRECTION_EDIT,
    priority: 0.6,
  })),

  // Simplified-Chinese body, canonicalised to /zh-cn (see the page's `alternates`).
  // Submitting the other seven locale URLs asks for a crawl of pages that point
  // straight back here. They stay reachable and 200 — just not advertised.
  {
    path: "/melbourne-graduation-move-out-guide-2026",
    freshness: "static",
    contentUpdated: CLAIM_CORRECTION_EDIT,
    priority: 0.6,
    locales: ["zh-cn"],
  },

  // Indexable, factual, and among the pages people most often ask an assistant
  // about an unfamiliar app. They were live and reachable but absent from the
  // sitemap, so nothing pointed a crawler at them.
  { path: "/privacy", freshness: "static", contentUpdated: OCTOBER_REFRESH_EDIT, priority: 0.4 },
  { path: "/terms", freshness: "static", contentUpdated: LAST_SEO_PASS, priority: 0.4 },
  {
    path: "/child-safety",
    freshness: "static",
    contentUpdated: CLAIM_CORRECTION_EDIT,
    priority: 0.4,
  },
  { path: "/contact", freshness: "static", contentUpdated: LAST_SEO_PASS, priority: 0.4 },
];

/**
 * The date a page's content last changed, for JSON-LD `dateModified` and the
 * visible "Updated" line. Live pages report the moment this render happened —
 * the build or the latest revalidation — which is when their data was read.
 * Static pages report their hand-kept content date.
 */
export function dateModifiedFor(path: string, now: Date = new Date()): string {
  const entry = INDEXABLE_PATHS.find((p) => p.path === path);
  if (!entry) throw new Error(`dateModifiedFor: ${path} is not in INDEXABLE_PATHS`);
  return entry.freshness === "live" ? now.toISOString() : entry.contentUpdated;
}
