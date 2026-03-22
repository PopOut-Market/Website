import {
  M_PLUS_Rounded_1c,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Noto_Sans_TC,
  Nunito,
} from "next/font/google";
import type { Locale } from "./site-i18n";

export const fontLatinRounded = Nunito({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});
export const fontZhHans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["500", "700"],
});
export const fontZhHant = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["500", "700"],
});
export const fontKoreanRounded = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["500", "700"],
});
export const fontJapaneseRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const LOCALE_FONT_CLASS: Record<Locale, string> = {
  en: fontLatinRounded.className,
  "zh-Hans": fontZhHans.className,
  "zh-Hant": fontZhHant.className,
  ko: fontKoreanRounded.className,
  ja: fontJapaneseRounded.className,
  vi: fontLatinRounded.className,
  fr: fontLatinRounded.className,
  es: fontLatinRounded.className,
};
