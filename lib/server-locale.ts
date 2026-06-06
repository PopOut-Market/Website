import { headers } from "next/headers";
import type { Locale } from "@/lib/site-i18n";
import { DEFAULT_LOCALE, LOCALE_HEADER, isLocale } from "@/lib/site-locale-routing";

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
