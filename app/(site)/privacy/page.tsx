import { PrivacyPageContent } from "@/components/privacy-page-content";
import { getServerLocale } from "@/lib/server-locale";
import { localizedMetadata } from "@/lib/site-seo-copy";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { ...localizedMetadata("/privacy", locale), title: "Privacy Policy" };
}

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
