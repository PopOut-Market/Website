import { ChildSafetyPageContent } from "@/components/child-safety-page-content";
import { getServerLocale } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { ...localizedMetadata("/child-safety", locale), title: "Child Safety" };
}

export default function ChildSafetyPage() {
  return <ChildSafetyPageContent />;
}
