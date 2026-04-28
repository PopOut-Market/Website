import type { MetadataRoute } from "next";
import { localeSegments, siteUrl } from "@/lib/seo";

const INDEXABLE_PATHS = [
  "/",
  "/about",
  "/faq",
  "/market",
  "/melbourne-second-hand-app",
  "/melbourne-second-hand-market",
  "/melbourne-cbd-second-hand-marketplace",
  "/comparison",
  "/comparison/gumtree",
  "/comparison/facebook-marketplace",
  "/melbourne-suburbs",
  "/melbourne-suburbs/melbourne-cbd",
  "/melbourne-suburbs/carlton",
  "/melbourne-suburbs/parkville",
  "/melbourne-suburbs/southbank",
  "/melbourne-suburbs/docklands",
  "/melbourne-suburbs/fitzroy",
  "/melbourne-suburbs/north-melbourne",
  "/melbourne-suburbs/south-wharf",
  "/melbourne-graduation-move-out-guide-2026",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteUrl().replace(/\/$/, "");
  const locales = localeSegments();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of INDEXABLE_PATHS) {
    entries.push({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: path === "/" || path === "/market" ? "daily" : "weekly",
      priority: path === "/" ? 1 : path === "/market" ? 0.9 : 0.7,
    });

    for (const seg of locales) {
      const localized = path === "/" ? `/${seg}` : `/${seg}${path}`;
      entries.push({
        url: `${base}${localized}`,
        lastModified: now,
        changeFrequency: path === "/" || path === "/market" ? "daily" : "weekly",
        priority: path === "/" ? 1 : path === "/market" ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
