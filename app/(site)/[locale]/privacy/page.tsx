import { PrivacyPageContent } from "@/components/privacy-page-content";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return { ...localizedMetadata("/privacy", locale), title: "Privacy Policy" };
}

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
