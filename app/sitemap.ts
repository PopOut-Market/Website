import type { MetadataRoute } from "next";
import { localeSegments, siteUrl } from "@/lib/seo";
import { MARKET_CATEGORIES } from "@/lib/market-categories";

/**
 * How often a path's content genuinely changes. This drives both
 * `changeFrequency` and `lastModified`, and it is the reason `lastModified` is
 * no longer `new Date()` for every URL.
 *
 * Stamping every URL with the build time told crawlers that all 240 pages
 * changed on every deploy. That is a false freshness signal at scale, it makes
 * the sitemap useless as a crawl-prioritisation hint, and it teaches a crawler
 * to ignore `lastmod` on this domain — which then costs us the signal on the
 * pages where it is true.
 *
 * - `live`   — renders Supabase data and revalidates hourly. Genuinely changes
 *              as often as the marketplace does, so build time is honest here.
 * - `static` — authored copy. It changed when someone edited it, so it carries
 *              the date of the last substantive content edit, set by hand below.
 */
type Freshness = "live" | "static";

type IndexablePath = {
  path: string;
  freshness: Freshness;
  /** ISO date of the last substantive content edit. Only used when `static`. */
  contentUpdated: string;
  priority: number;
};

/** Bump this when you materially rewrite a static page's copy. */
const REPOSITIONING_EDIT = "2026-08-21";
const LAST_SEO_PASS = "2026-06-17";

const INDEXABLE_PATHS: IndexablePath[] = [
  { path: "/", freshness: "live", contentUpdated: REPOSITIONING_EDIT, priority: 1 },
  { path: "/market", freshness: "live", contentUpdated: REPOSITIONING_EDIT, priority: 0.9 },

  // Category pages — each renders a live, category-scoped feed.
  ...MARKET_CATEGORIES.map((c) => ({
    path: c.path,
    freshness: "live" as const,
    contentUpdated: REPOSITIONING_EDIT,
    priority: 0.8,
  })),

  { path: "/about", freshness: "static", contentUpdated: REPOSITIONING_EDIT, priority: 0.7 },
  { path: "/faq", freshness: "static", contentUpdated: REPOSITIONING_EDIT, priority: 0.7 },

  {
    path: "/melbourne-second-hand-app",
    freshness: "static",
    contentUpdated: LAST_SEO_PASS,
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
    contentUpdated: LAST_SEO_PASS,
    priority: 0.6,
  })),

  {
    path: "/melbourne-graduation-move-out-guide-2026",
    freshness: "static",
    contentUpdated: LAST_SEO_PASS,
    priority: 0.6,
  },

  // Indexable, factual, and among the pages people most often ask an assistant
  // about an unfamiliar app. They were live and reachable but absent from the
  // sitemap, so nothing pointed a crawler at them.
  { path: "/privacy", freshness: "static", contentUpdated: REPOSITIONING_EDIT, priority: 0.4 },
  { path: "/terms", freshness: "static", contentUpdated: LAST_SEO_PASS, priority: 0.4 },
  { path: "/child-safety", freshness: "static", contentUpdated: LAST_SEO_PASS, priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const buildTime = new Date();
  const base = siteUrl().replace(/\/$/, "");
  const locales = localeSegments();
  const entries: MetadataRoute.Sitemap = [];

  // Only emit locale-prefixed URLs. The un-prefixed form (e.g. `/about`) 308-
  // redirects to `/en/about` in middleware, so listing it here would fill the
  // sitemap with redirecting URLs — Google files those under "Page with
  // redirect" and never indexes them. Every URL below returns 200 directly.
  for (const entry of INDEXABLE_PATHS) {
    const lastModified =
      entry.freshness === "live" ? buildTime : new Date(`${entry.contentUpdated}T00:00:00Z`);

    for (const seg of locales) {
      const localized = entry.path === "/" ? `/${seg}` : `/${seg}${entry.path}`;
      entries.push({
        url: `${base}${localized}`,
        lastModified,
        changeFrequency: entry.freshness === "live" ? "daily" : "monthly",
        priority: entry.priority,
      });
    }
  }

  return entries;
}
