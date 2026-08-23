const LOCALE_SEGMENTS = ["en", "zh-cn", "zh-tw", "ko", "ja", "vi", "fr", "es"] as const;

export function localizedAlternates(path: string): Record<string, string> {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return {
    en: `/en${normalized}`,
    "zh-CN": `/zh-cn${normalized}`,
    "zh-TW": `/zh-tw${normalized}`,
    ko: `/ko${normalized}`,
    ja: `/ja${normalized}`,
    vi: `/vi${normalized}`,
    fr: `/fr${normalized}`,
    es: `/es${normalized}`,
    "x-default": `/en${normalized}`,
  };
}

/**
 * hreflang for a page that does NOT ship in all eight locales.
 *
 * Some pages are mostly authored prose rather than database rows, and shipping
 * those in a language nobody has written costs more than it earns: an English
 * body under a Japanese title is worse than no Japanese page at all, and it is
 * the exact pattern Google's scaled-content-abuse policy names when it lists
 * "automated transformations like ... translating".
 *
 * The alternates must then list ONLY the locales that really exist, or hreflang
 * points crawlers at URLs that 404. `x-default` stays on `en`.
 */
export function localizedAlternatesFor(
  path: string,
  locales: readonly SeoLocale[],
): Record<string, string> {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const out: Record<string, string> = {};
  for (const locale of locales) {
    out[HREFLANG_BY_LOCALE[locale]] = `/${SEGMENT_BY_LOCALE[locale]}${normalized}`;
  }
  out["x-default"] = `/en${normalized}`;
  return out;
}

/** The locale codes used across the site, as `lib/site-i18n.ts` spells them. */
export type SeoLocale = "en" | "zh-Hans" | "zh-Hant" | "ko" | "ja" | "vi" | "fr" | "es";

const HREFLANG_BY_LOCALE: Record<SeoLocale, string> = {
  en: "en",
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
  ko: "ko",
  ja: "ja",
  vi: "vi",
  fr: "fr",
  es: "es",
};

const SEGMENT_BY_LOCALE: Record<SeoLocale, string> = {
  en: "en",
  "zh-Hans": "zh-cn",
  "zh-Hant": "zh-tw",
  ko: "ko",
  ja: "ja",
  vi: "vi",
  fr: "fr",
  es: "es",
};

export function localeSegments(): readonly string[] {
  return LOCALE_SEGMENTS;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.popoutmarket.com.au";
}

/**
 * Canonical origin for JSON-LD `@id` values — deliberately NOT `siteUrl()`.
 *
 * An `@id` is an entity's stable identifier across the whole graph and across
 * time. Deriving it from an env var means a preview deploy would mint a second,
 * competing node for the same company, which is exactly the entity-splitting
 * this graph exists to prevent. Page URLs use `siteUrl()`; identities use this.
 */
export const SITE_ORIGIN = "https://www.popoutmarket.com.au";

/**
 * Shared social share image (served by app/opengraph-image.tsx). Must be set
 * explicitly on any page that defines its own `openGraph`, because an explicit
 * openGraph block suppresses Next's automatic og:image from the file convention.
 * Relative URL resolves against metadataBase (the www host).
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "PopOut Market — the neighbourhood app for Melbourne",
} as const;
