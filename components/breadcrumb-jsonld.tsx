import { siteUrl } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

type Crumb = { name: string; path: string };

/**
 * Emits BreadcrumbList JSON-LD with absolute, locale-prefixed (www) URLs, so
 * Google can show a breadcrumb trail in search results. Server component —
 * render it inside a page (no visible UI).
 */
export function BreadcrumbJsonLd({ items, locale }: { items: Crumb[]; locale: Locale }) {
  const base = siteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${toLocalePath(c.path, locale)}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
