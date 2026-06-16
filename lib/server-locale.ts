import { headers } from "next/headers";
import type { Locale } from "@/lib/site-i18n";
import {
  DEFAULT_LOCALE,
  LOCALE_HEADER,
  isLocale,
  localeFromSegment,
} from "@/lib/site-locale-routing";

/** Shape of the `[locale]` dynamic route param (Next 15+ passes params async). */
export type LocaleParams = { params: Promise<{ locale: string }> };

/**
 * Resolve the active locale from the `[locale]` route segment. This is static —
 * it does NOT read headers — so pages that use it can be statically generated
 * per locale via generateStaticParams.
 */
export async function localeFromParams(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  return localeFromSegment(locale) ?? DEFAULT_LOCALE;
}

/**
 * Resolve the active locale on the server from the header the middleware sets on
 * each localized rewrite. Used by the root layout (html lang), the site layout
 * (SiteChrome initialLocale), and per-page generateMetadata so the initial
 * server-rendered HTML is localized for crawlers — not just after client hydration.
 *
 * Reading headers() opts these routes into dynamic rendering, which is required
 * because one underlying route serves many locales via middleware rewrite.
 */
export async function getServerLocale(): Promise<Locale> {
  const headerList = await headers();
  const value = headerList.get(LOCALE_HEADER);
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
