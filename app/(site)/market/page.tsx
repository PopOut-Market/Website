import { MarketPageContent } from "@/components/market-page-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Melbourne Market Listings | PopOut Market",
  description:
    "Browse second-hand listings by Melbourne suburb, compare nearby items, and connect with local buyers and sellers in your preferred language.",
  keywords: [
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
