import { AboutPageContent } from "@/components/about-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PopOut Market | Melbourne Neighbourhood Second-Hand Marketplace",
  description:
    "Learn how PopOut Market helps Melbourne locals and international students buy and sell second-hand items with suburb-first discovery, multilingual communication, and safer meetup workflows.",
  keywords: [
    "Melbourne second hand marketplace",
    "sell second hand in Melbourne",
    "student second hand app Melbourne",
    "safe second hand trading Melbourne",
    "multilingual marketplace app",
  ],
  alternates: {
    canonical: "/about",
    languages: {
      en: "/en/about",
      "zh-CN": "/zh-cn/about",
      "zh-TW": "/zh-tw/about",
      ko: "/ko/about",
      ja: "/ja/about",
      vi: "/vi/about",
      fr: "/fr/about",
      es: "/es/about",
      "x-default": "/en/about",
    },
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
