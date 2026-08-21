import { HomePageContent } from "@/components/home-page-content";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import { COPY } from "@/lib/site-i18n";
import { SITE_ORIGIN } from "@/lib/seo";
import { organizationNode, webSiteNode, mobileAppNode } from "@/lib/jsonld";
import { toLocalePath } from "@/lib/site-locale-routing";
import {
  fetchActiveSuburbCount,
  fetchFeedListings,
  formatPriceLabel,
} from "@/lib/supabase/server-feed";
import type { Metadata } from "next";

const HOME_LISTING_COUNT = 6;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return localizedMetadata("/", locale);
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  const t = COPY[locale];

  // Server-rendered so the listings exist in the HTML for crawlers that never
  // run JavaScript — which is all of them except Googlebot's renderer.
  const [listings, suburbCount] = await Promise.all([
    fetchFeedListings({ locale, limit: HOME_LISTING_COUNT }),
    fetchActiveSuburbCount(),
  ]);

  const priceLabels = listings.map((l) =>
    formatPriceLabel(locale, l.priceCents, t.homeMarketFilterGiveaway),
  );

  const canonical = `${SITE_ORIGIN}${toLocalePath("/", locale)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      webSiteNode(locale),
      organizationNode(),
      mobileAppNode(),
      {
        "@type": "WebPage",
        "@id": canonical,
        url: canonical,
        name: t.heroTitle,
        description: t.heroLead,
        inLanguage: locale,
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        about: { "@id": `${SITE_ORIGIN}/#app` },
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
      // Only emitted when there is real inventory behind it. An empty ItemList,
      // or one built from invented demo items, is worse than none.
      ...(listings.length > 0
        ? [
            {
              "@type": "ItemList",
              name: t.homeMarketTitle.replace(/\*/g, ""),
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
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageContent listings={listings} priceLabels={priceLabels} suburbCount={suburbCount} />
    </>
  );
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";

// Prerendered at build and refreshed hourly: still a static file at the edge for
// every visitor and every crawler, just not a frozen one. `force-static` is
// required — without it Next 16 renders this route on demand, which would mean a
// live database round-trip on every crawler hit.
export const dynamic = "force-static";
export const revalidate = 3600;
