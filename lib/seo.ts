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

export function localeSegments(): readonly string[] {
  return LOCALE_SEGMENTS;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.popoutmarket.com.au";
}

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
  alt: "PopOut Market — Melbourne's second-hand marketplace",
} as const;
