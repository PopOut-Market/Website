import { TermsPageContent } from "@/components/terms-page-content";
import { getServerLocale } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { ...localizedMetadata("/terms", locale), title: "Terms of Use" };
}

export default function TermsPage() {
  return <TermsPageContent />;
}
