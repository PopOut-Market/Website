import { TermsPageContent } from "@/components/terms-page-content";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return { ...localizedMetadata("/terms", locale), title: "Terms of Use" };
}

export default function TermsPage() {
  return <TermsPageContent />;
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
