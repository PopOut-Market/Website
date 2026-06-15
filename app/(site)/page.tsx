import { HomePageContent } from "@/components/home-page-content";
import { getServerLocale } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import {
  APP_STORE_URL,
  FOOTER_CONTACT_EMAIL,
  FOOTER_SOCIAL_LINKEDIN_DEFAULT,
  FOOTER_SOCIAL_REDNOTE_DEFAULT,
} from "@/lib/site-config";
import type { Metadata } from "next";

// Real, verifiable external identifiers (App Store + social profiles + ACN +
// address) are the strongest trust signals AI assistants use to recognise and
// cite an entity. operatingSystem is iOS-only until the Android app ships.
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "PopOut Market",
      url: "https://www.popoutmarket.com.au/",
      inLanguage: "en-AU",
      publisher: {
        "@type": "Organization",
        name: "PopOut Market",
        logo: {
          "@type": "ImageObject",
          url: "https://www.popoutmarket.com.au/favicon.png",
        },
      },
    },
    {
      "@type": "Organization",
      name: "PopOut Market",
      legalName: "POPOUT MARKET PTY LTD",
      url: "https://www.popoutmarket.com.au/",
      logo: "https://www.popoutmarket.com.au/favicon.png",
      email: FOOTER_CONTACT_EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "1003/151 City Rd",
        addressLocality: "Southbank",
        addressRegion: "VIC",
        postalCode: "3006",
        addressCountry: "AU",
      },
      areaServed: {
        "@type": "City",
        name: "Melbourne",
      },
      sameAs: [
        APP_STORE_URL,
        FOOTER_SOCIAL_LINKEDIN_DEFAULT,
        FOOTER_SOCIAL_REDNOTE_DEFAULT,
      ],
    },
    {
      "@type": "MobileApplication",
      name: "PopOut Market",
      applicationCategory: "MarketplaceApplication",
      operatingSystem: "iOS",
      url: "https://www.popoutmarket.com.au/",
      downloadUrl: APP_STORE_URL,
      installUrl: APP_STORE_URL,
      areaServed: {
        "@type": "City",
        name: "Melbourne",
      },
      availableLanguage: ["en", "zh-Hans", "zh-Hant", "ko", "ja", "vi", "fr", "es"],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "AUD",
      },
      featureList: [
        "Melbourne suburb-based listing discovery",
        "Multilingual buyer and seller communication",
        "Second-hand trading workflow for local meetups",
        "Student-friendly posting and move-out selling support",
      ],
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return localizedMetadata("/", locale);
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HomePageContent />
    </>
  );
}
