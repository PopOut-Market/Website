import { ChildSafetyPageContent } from "@/components/child-safety-page-content";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return { ...localizedMetadata("/child-safety", locale), title: "Child Safety" };
}

export default function ChildSafetyPage() {
  return <ChildSafetyPageContent />;
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
