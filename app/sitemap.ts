import type { MetadataRoute } from "next";
import { localeSegments, siteUrl } from "@/lib/seo";
import { INDEXABLE_PATHS } from "@/lib/content-dates";

// Which paths are indexable and when each one's content last changed live in
// lib/content-dates.ts, so the sitemap's `lastmod`, each page's JSON-LD
// `dateModified` and the visible "Updated" line all read the same date.

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

    for (const seg of entry.locales ?? locales) {
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
