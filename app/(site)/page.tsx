import { HomePageContent } from "@/components/home-page-content";
import { localizedAlternates } from "@/lib/seo";
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

export const metadata: Metadata = {
  title: "PopOut Market | Melbourne Second-Hand App & Neighbourhood Marketplace",
  description:
    "PopOut Market is a Melbourne second-hand app and neighbourhood marketplace for buying and selling locally, with suburb-first discovery, multilingual communication, and safer meetup workflows.",
  keywords: [
    "Melbourne second hand marketplace",
    "Melbourne second hand app",
    "Melbourne second hand market",
    "buy and sell in Melbourne",
    "student second hand app Melbourne",
    "safe second hand trading",
    "multilingual marketplace app",
  ],
  alternates: {
    canonical: "/",
    languages: localizedAlternates("/"),
  },
  openGraph: {
    title: "PopOut Market | Melbourne Neighbourhood Marketplace",
    description:
      "Neighbourhood-first second-hand trading in Melbourne with multilingual support and safer meetups.",
    type: "website",
    url: "https://www.popoutmarket.com.au/en",
  },
};

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
