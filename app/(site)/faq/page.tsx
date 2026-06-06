import { FaqPageContent } from "@/components/faq-page-content";
import { getServerLocale } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return localizedMetadata("/faq", locale);
}

export default function FaqPage() {
  return <FaqPageContent />;
}
