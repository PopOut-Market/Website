import { AboutPageContent } from "@/components/about-page-content";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return localizedMetadata("/about", locale);
}

export default function AboutPage() {
  return <AboutPageContent />;
}
