import { HomePageContent } from "@/components/home-page-content";
import { getServerLocale } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

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
      url: "https://www.popoutmarket.com.au/",
      logo: "https://www.popoutmarket.com.au/favicon.png",
      areaServed: {
        "@type": "City",
        name: "Melbourne",
      },
    },
    {
      "@type": "MobileApplication",
      name: "PopOut Market",
      applicationCategory: "MarketplaceApplication",
      operatingSystem: "iOS, Android",
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
