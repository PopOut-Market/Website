import { MarketPageContent } from "@/components/market-page-content";
import { getServerLocale } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return localizedMetadata("/market", locale);
}

export default function MarketPage() {
  return (
    <Suspense fallback={null}>
      <MarketPageContent />
    </Suspense>
  );
}
