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
 * `next build` anywhere but Netlify production: GitHub CI, deploy previews, a
 * local build. Request-time revalidation is never a build, and a production
 * build sets `CONTEXT=production`, so both keep treating a failed read as fatal.
 *
 * Keep the service-role key out of CI regardless: the repo is public, and a
 * fork's pull request could print any secret its build is handed.
 */
function isNonProductionBuild(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" && process.env.CONTEXT !== "production"
  );
}

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
  const read = await fetchGuideShops(300);

  // A failed read is NOT an empty directory. Throwing here makes Next keep
  // serving the last good prerender instead of caching a 404 for a URL that is
  // in the sitemap in four locales and carries this page's hreflang cluster.
  //
  // Except in a non-production build: there is no previous render to keep,
  // and the throw failed the entire build over a directory those builds often
  // cannot read. CI has no key at all, and the Netlify deploy-preview key cannot
  // read `guide_shops`. Such a build renders an empty directory instead;
  // server-shops has already logged why the read failed. It must not 404: the
  // homepage links here and CI checks every internal link.
  if (read === null) {
    if (!isNonProductionBuild()) {
      throw new Error("Shop directory unavailable; keeping the previous render.");
    }
    console.warn(
      `[grocery-guide] Non-production build: ${toLocalePath(PATH, locale)} renders an empty directory.`,
    );
  }

  // Genuinely empty: the directory is the page, so there is no page to show.
  if (read?.length === 0) notFound();
  const shops = read ?? [];

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
