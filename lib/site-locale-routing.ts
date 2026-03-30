import type { Locale } from "@/lib/site-i18n";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_SEGMENT_TO_CODE = {
  en: "en",
  "zh-cn": "zh-Hans",
  "zh-tw": "zh-Hant",
  ko: "ko",
  ja: "ja",
  vi: "vi",
  fr: "fr",
  es: "es",
} as const satisfies Record<string, Locale>;

export type LocaleSegment = keyof typeof LOCALE_SEGMENT_TO_CODE;

const CODE_TO_SEGMENT: Record<Locale, LocaleSegment> = {
  en: "en",
  "zh-Hans": "zh-cn",
  "zh-Hant": "zh-tw",
  ko: "ko",
  ja: "ja",
  vi: "vi",
  fr: "fr",
  es: "es",
};

export function localeFromSegment(segment: string | null | undefined): Locale | null {
  if (!segment) return null;
  const normalized = segment.toLowerCase();
  return LOCALE_SEGMENT_TO_CODE[normalized as LocaleSegment] ?? null;
}

export function localeSegment(locale: Locale): LocaleSegment {
  return CODE_TO_SEGMENT[locale];
}

export function localeFromPathname(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return localeFromSegment(first);
}

export function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (!localeFromSegment(parts[0])) return pathname || "/";
  const rest = parts.slice(1).join("/");
  return rest ? `/${rest}` : "/";
}

export function toLocalePath(pathname: string, locale: Locale): string {
  const base = stripLocalePrefix(pathname);
  const seg = localeSegment(locale);
  return base === "/" ? `/${seg}` : `/${seg}${base}`;
}
