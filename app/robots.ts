import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl().replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/market` is the live, user-generated listing feed + per-listing detail
        // pages. Those rows (seller name, suburb, price, description) are public
        // in-app, but we don't want compliant crawlers / AI bots bulk-indexing
        // them off the website. All marketing + suburb SEO landing pages stay
        // crawlable. (This stops well-behaved bots only; abusive scrapers are
        // handled by rate limiting + Supabase-side controls.)
        // `/*/market` matches the locale-prefixed live URLs (/en/market,
        // /zh-cn/market/p/123, …); `/market` covers the bare path.
        disallow: [
          "/admin",
          "/admin-super",
          "/api",
          "/_next",
          "/market",
          "/*/market",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
