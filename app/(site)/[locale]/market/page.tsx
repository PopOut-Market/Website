import { MarketPageContent } from "@/components/market-page-content";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return localizedMetadata("/market", locale);
}

export default function MarketPage() {
  return (
    <Suspense fallback={null}>
      <MarketPageContent />
    </Suspense>
  );
}
