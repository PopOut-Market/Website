import { SiteChrome } from "@/components/site-chrome";
import { getServerLocale } from "@/lib/server-locale";
import type { ReactNode } from "react";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const locale = await getServerLocale();
  return <SiteChrome initialLocale={locale}>{children}</SiteChrome>;
}
