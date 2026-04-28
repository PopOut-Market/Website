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
    },
  ],
};

export const metadata: Metadata = {
  title: "PopOut Market | Melbourne Neighbourhood Second-Hand Marketplace",
  description:
    "Buy and sell second-hand items across Melbourne with suburb-first discovery, multilingual communication, and safer meetup workflows designed for local communities.",
  keywords: [
    "Melbourne second hand marketplace",
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
