import type { Metadata } from "next";
import { downloadCopy } from "./download-copy";
import { LOCALES, type Locale } from "./site-i18n";
import { DEFAULT_LOCALE, localeFromSegment, localeSegment } from "./site-locale-routing";

export const DOWNLOAD_PATH = "/download";
export type DownloadChannel = "wechat" | "instagram";
export const WIDE_ART = "/images/download/popout-dm-map-tag-v5.jpg";
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

export function downloadChannel(segment?: string): DownloadChannel | null {
  return segment === "wechat" || segment === "instagram" ? segment : null;
}

export function downloadChannelForAgent(userAgent: string): DownloadChannel | null {
  if (/MicroMessenger|WeChat|Weixin/i.test(userAgent)) return "wechat";
  if (/\bInstagram(?:[ /]|$)/i.test(userAgent)) return "instagram";
  // A system share sheet can fetch the card before the user picks a destination.
  // Some Apple preview UAs even embed Meta's crawler name in a Safari UA.
  if (/CFNetwork|LinkPresentation|Twitterbot|Applebot/i.test(userAgent)) return null;
  if (/^facebookexternalhit\//i.test(userAgent)) return "instagram";
  return null;
}

export function downloadUrl(locale: Locale, channel: DownloadChannel | null = null) {
  return `${DOWNLOAD_PATH}${channel ? "/" + channel : ""}?lang=${encodeURIComponent(locale)}`;
}

export function downloadView(view: string[] = []) {
  const alias = downloadChannel(view[0]);
  if (view.length === 0 || (view.length === 1 && alias)) {
    return { locale: DEFAULT_LOCALE, channel: alias };
  }
  const locale = localeFromSegment(view[0]);
  const channel = downloadChannel(view[1]);
  if (!locale || view.length > 2 || (view.length === 2 && !channel)) return null;
  return { locale, channel };
}

export const downloadPaths = [[], ...LOCALES.map(({ code }) => [localeSegment(code)])].flatMap(
  (prefix) => [prefix, [...prefix, "wechat"], [...prefix, "instagram"]].map((view) => ({ view })),
);

export function downloadMetadata(locale: Locale, channel: DownloadChannel | null): Metadata {
  const square = channel !== "instagram";
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
    ...(channel ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: "PopOut Market",
      title: copy.title,
      description: copy.summary,
      locale: ogLocale[locale],
      url: downloadUrl(locale, channel ?? "wechat"),
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
