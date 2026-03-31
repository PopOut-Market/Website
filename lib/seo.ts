const LOCALE_SEGMENTS = ["en", "zh-cn", "zh-tw", "ko", "ja", "vi", "fr", "es"] as const;

export function localizedAlternates(path: string): Record<string, string> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
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
