import type { Locale } from "./site-i18n";

type FontConfig = {
  className: string;
};

const fontLatinRounded: FontConfig = {
  className: "font-latin-rounded",
};

const fontZhHans: FontConfig = {
  className: "font-zh-hans",
};

const fontZhHant: FontConfig = {
  className: "font-zh-hant",
};

const fontKoreanRounded: FontConfig = {
  className: "font-korean-rounded",
};

const fontJapaneseRounded: FontConfig = {
  className: "font-japanese-rounded",
};

export { fontLatinRounded };

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
