import { SiteChrome } from "@/components/site-chrome";
import { HtmlLang } from "@/components/html-lang";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { LOCALE_SEGMENT_TO_CODE, htmlLang } from "@/lib/site-locale-routing";
import type { ReactNode } from "react";

// Pre-render one static variant per locale; reject unknown locale segments (404)
// instead of rendering them dynamically.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LOCALE_SEGMENT_TO_CODE).map((locale) => ({ locale }));
}

export default async function SiteLocaleLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const locale = await localeFromParams(params);
  return (
    <>
      <HtmlLang lang={htmlLang(locale)} />
      <SiteChrome initialLocale={locale}>{children}</SiteChrome>
    </>
  );
}
