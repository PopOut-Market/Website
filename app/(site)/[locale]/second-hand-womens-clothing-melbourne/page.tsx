import { CategoryPageContent } from "@/components/category-page-content";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { categoryByPath, categoryCopy } from "@/lib/market-categories";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedAlternates, SITE_ORIGIN, OG_IMAGE } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import { fetchFeedListings, formatPriceLabel } from "@/lib/supabase/server-feed";
import { COPY } from "@/lib/site-i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const PATH = "/second-hand-womens-clothing-melbourne";
const LISTING_COUNT = 24;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const category = categoryByPath(PATH);
  if (!category) return {};
  const copy = categoryCopy(category, locale);
  const selfPath = toLocalePath(PATH, locale);

  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: { canonical: selfPath, languages: localizedAlternates(PATH) },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SITE_ORIGIN}${selfPath}`,
      type: "website",
      siteName: "PopOut Market",
      images: [OG_IMAGE],
    },
  };
}

export default async function Page({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  const category = categoryByPath(PATH);
  if (!category) notFound();

  const t = COPY[locale];
  const copy = categoryCopy(category, locale);
  const listings = await fetchFeedListings({
    locale,
    limit: LISTING_COUNT,
    categoryTopId: category.topId,
  });
  const priceLabels = listings.map((l) =>
    formatPriceLabel(locale, l.priceCents, t.homeMarketFilterGiveaway),
  );

  const canonical = `${SITE_ORIGIN}${toLocalePath(PATH, locale)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    url: canonical,
    name: copy.h1,
    description: copy.description,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    // Emitted only when there is real inventory behind it.
    ...(listings.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: listings.length,
            itemListElement: listings.map((l, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_ORIGIN}${toLocalePath(`/market/p/${encodeURIComponent(l.id)}`, locale)}`,
              item: {
                "@type": "Product",
                name: l.title,
                itemCondition: "https://schema.org/UsedCondition",
                offers: {
                  "@type": "Offer",
                  price: (l.priceCents / 100).toFixed(2),
                  priceCurrency: "AUD",
                  availability: "https://schema.org/InStock",
                },
              },
            })),
          },
        }
      : {}),
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
      <CategoryPageContent category={category} listings={listings} priceLabels={priceLabels} />
    </>
  );
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";

// Prerendered per locale, refreshed hourly so the listings stay real without
// making the page dynamic for visitors or crawlers. `force-static` is required:
// without it Next 16 serves this route on demand and every crawler hit becomes a
// live database round-trip.
export const dynamic = "force-static";
export const revalidate = 3600;
