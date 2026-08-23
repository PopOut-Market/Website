import { AsianGroceryGuideContent } from "@/components/asian-grocery-guide-content";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { GUIDE_COPY, GUIDE_LOCALES, isGuideLocale } from "@/lib/grocery-guide-copy";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedAlternatesFor, OG_IMAGE, SITE_ORIGIN } from "@/lib/seo";
import { COPY } from "@/lib/site-i18n";
import { toLocalePath } from "@/lib/site-locale-routing";
import { fetchGuideShops } from "@/lib/supabase/server-shops";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const PATH = "/melbourne-cbd-asian-grocery-guide";

/**
 * Melbourne CBD Asian grocery guide.
 *
 * Ships in four locales only (see `lib/grocery-guide-copy.ts`), so the other four
 * `notFound()` rather than serving English prose under a localised title. The
 * homepage link to this page is hidden in those locales for the same reason —
 * a dead link is worse than a missing one.
 */

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  if (!isGuideLocale(locale)) return {};
  const copy = GUIDE_COPY[locale];
  const selfPath = toLocalePath(PATH, locale);

  return {
    title: { absolute: copy.title },
    // No count and no date in static metadata: both are read live and would
    // silently drift out of step with the page without a deploy.
    description: copy.description,
    alternates: {
      canonical: selfPath,
      languages: localizedAlternatesFor(PATH, GUIDE_LOCALES),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SITE_ORIGIN}${selfPath}`,
      type: "article",
      siteName: "PopOut Market",
      images: [OG_IMAGE],
    },
  };
}

export default async function Page({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  if (!isGuideLocale(locale)) notFound();

  const t = COPY[locale];
  const copy = GUIDE_COPY[locale];
  const shops = await fetchGuideShops(300);

  // A failed read is NOT an empty directory. Throwing here makes Next keep
  // serving the last good prerender instead of caching a 404 for a URL that is
  // in the sitemap in four locales and carries this page's hreflang cluster.
  if (shops === null) {
    throw new Error("Shop directory unavailable; keeping the previous render.");
  }

  // Genuinely empty: the directory is the page, so there is no page to show.
  if (shops.length === 0) notFound();

  const canonical = `${SITE_ORIGIN}${toLocalePath(PATH, locale)}`;

  // ItemList + GroceryStore, built from the live rows and carrying ONLY name and
  // address — the two things the directory actually holds. No aggregateRating,
  // no openingHours, no telephone, no priceRange: every one of those would be
  // invented, and inventing them in structured data is worse than in prose.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    url: canonical,
    name: copy.h1,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: shops.length,
      itemListOrder: "https://schema.org/ItemListUnordered",
      itemListElement: shops.map((shop, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "GroceryStore",
          name: shop.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: shop.address,
            addressLocality: shop.suburb ?? "Melbourne",
            addressRegion: "VIC",
            addressCountry: "AU",
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "PopOut Market", path: "/" },
          { name: t.marketPageTitle, path: "/market" },
          { name: copy.h1, path: PATH },
        ]}
        locale={locale}
      />
      <AsianGroceryGuideContent shops={shops} locale={locale} />
    </>
  );
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";

export const dynamic = "force-static";
// 300s. Shorter than the rest of the site on purpose: this page publishes real
// street addresses of named private businesses, and the operator's remedy for a
// withdrawn one is immediate. See lib/supabase/server-shops.ts.
export const revalidate = 300;
