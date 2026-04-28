import { MarketPageContent } from "@/components/market-page-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Melbourne Second-Hand Market | PopOut Market",
  description:
    "Browse Melbourne second-hand listings by suburb, compare nearby items, and use PopOut Market as a local second-hand trading platform for Melbourne city and CBD communities.",
  keywords: [
    "Melbourne second hand market",
    "Melbourne second hand app",
    "Melbourne market listings",
    "second hand market Melbourne",
    "buy and sell nearby Melbourne",
    "Melbourne suburb marketplace",
  ],
  alternates: {
    canonical: "/market",
    languages: localizedAlternates("/market"),
  },
};

export default function MarketPage() {
  return (
    <Suspense fallback={null}>
      <MarketPageContent />
    </Suspense>
  );
}
