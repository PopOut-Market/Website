import { MarketPageContent } from "@/components/market-page-content";
import { MarketServerListings } from "@/components/market-server-listings";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedMetadata, localizedTitle, localizedDescription } from "@/lib/site-seo-copy";
import { COPY } from "@/lib/site-i18n";
import { SITE_ORIGIN } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import { fetchFeedListings, formatPriceLabel } from "@/lib/supabase/server-feed";
import type { MarketProduct } from "@/lib/market-product";
import type { Metadata } from "next";
import { Suspense } from "react";

const PATH = "/market";
// Must equal `PAGE_SIZE` in components/market-feed.tsx. The server render IS
// page 1; a different number here means the grid visibly changes length the
// moment the client's own fetch lands.
const SSR_LISTING_COUNT = 25;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return localizedMetadata(PATH, locale);
}

export default async function MarketPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  const t = COPY[locale];

  const listings = await fetchFeedListings({ locale, limit: SSR_LISTING_COUNT });
  // Shape the server rows the way the client feed already expects, so seeding it
  // is a straight assignment and the server and client renders agree.
  const initialItems: MarketProduct[] = listings.map((l) => ({
    id: l.id,
    title: l.title,
    priceLabel: formatPriceLabel(locale, l.priceCents, t.homeMarketFilterGiveaway),
    distanceLabel: "",
    sellerLabel: t.marketDemoSeller,
    isNew: false,
    suburbLabel: l.suburbName,
    imageUrl: l.imageUrl,
    meetupPoint: null,
  }));

  const canonical = `${SITE_ORIGIN}${toLocalePath(PATH, locale)}`;
  const heading = localizedTitle(PATH, locale)?.split("|")[0]?.trim() || t.marketPageTitle;
  const intro = localizedDescription(PATH, locale) ?? t.homeMarketSubtitle;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    url: canonical,
    name: heading,
    description: intro,
    inLanguage: locale,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
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
      <MarketServerListings locale={locale} heading={heading} intro={intro} />
      <Suspense fallback={null}>
        {/* The server-fetched listings are handed to the real feed rather than
            printed a second time above it — see market-server-listings.tsx. */}
        <MarketPageContent initialItems={initialItems} />
      </Suspense>
    </>
  );
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";

// Prerendered and refreshed hourly. The interactive suburb picker below reads
// `useSearchParams` inside a Suspense boundary, which stays client-side.
export const dynamic = "force-static";
export const revalidate = 3600;
