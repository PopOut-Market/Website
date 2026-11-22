import type { Metadata } from "next";
import { downloadCopy } from "./download-copy";
import { LOCALES, type Locale } from "./site-i18n";
import { DEFAULT_LOCALE, localeFromSegment, localeSegment } from "./site-locale-routing";

export const DOWNLOAD_PATH = "/download";
export const WECHAT_DOWNLOAD_PATH = "/download/wechat";
export const WIDE_ART = "/images/download/popout-route-v3.png";
export const APP_ICON = "/images/download/popout-app-icon.png";
const ogLocale: Record<Locale, string> = {
  en: "en_AU",
  ko: "ko_KR",
  "zh-Hans": "zh_CN",
  "zh-Hant": "zh_TW",
  ja: "ja_JP",
  vi: "vi_VN",
  fr: "fr_FR",
  es: "es_ES",
};

export function downloadUrl(locale: Locale, square = false) {
  return `${square ? WECHAT_DOWNLOAD_PATH : DOWNLOAD_PATH}?lang=${encodeURIComponent(locale)}`;
}

export function downloadView(view: string[] = []) {
  if (!view.length || (view.length === 1 && view[0] === "wechat")) {
    return { locale: DEFAULT_LOCALE, square: view[0] === "wechat" };
  }
  const locale = localeFromSegment(view[0]);
  if (!locale || view.length > 2 || (view.length === 2 && view[1] !== "wechat")) return null;
  return { locale, square: view[1] === "wechat" };
}

export const downloadPaths = LOCALES.flatMap(({ code }) => [
  { view: [localeSegment(code)] },
  { view: [localeSegment(code), "wechat"] },
]);

export function downloadMetadata(locale: Locale, square: boolean): Metadata {
  const copy = downloadCopy[locale];
  const image = square
    ? { url: APP_ICON, width: 1024, height: 1024, alt: "PopOut" }
    : { url: WIDE_ART, width: 1200, height: 630, alt: "PopOut" };
  return {
    title: copy.title,
    description: copy.intro,
    alternates: {
      canonical: downloadUrl(locale),
      languages: Object.fromEntries(LOCALES.map(({ code }) => [code, downloadUrl(code)])),
    },
    ...(square ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: "PopOut Market",
      title: copy.title,
      description: copy.summary,
      locale: ogLocale[locale],
      url: downloadUrl(locale, square),
      images: [image],
    },
    twitter: {
      card: square ? "summary" : "summary_large_image",
      title: copy.title,
      description: copy.summary,
      images: [image],
    },
  };
}
