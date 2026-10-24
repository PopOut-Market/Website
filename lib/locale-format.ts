import type { Locale } from "@/lib/site-i18n";

/**
 * Dates and counts written out by hand for each locale, so the server render and
 * the browser's hydration produce the same text. Intl output depends on the
 * runtime's ICU data ("Sep" against "Sept", U+00A0 against U+202F as the French
 * thousands separator), and a client component that formats with it can fail
 * hydration in one browser and not another.
 */

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** "6 September 2026", "2026年9月6日", "ngày 6 tháng 9 năm 2026"… */
export function formatDay(y: number, m: number, d: number, locale: Locale): string {
  switch (locale) {
    case "en":
      return `${d} ${MONTHS_EN[m - 1]} ${y}`;
    case "zh-Hans":
    case "zh-Hant":
    case "ja":
      return `${y}年${m}月${d}日`;
    case "ko":
      return `${y}년 ${m}월 ${d}일`;
    case "vi":
      return `ngày ${d} tháng ${m} năm ${y}`;
    case "fr":
      return `${d === 1 ? "1er" : d} ${MONTHS_FR[m - 1]} ${y}`;
    case "es":
      return `${d} de ${MONTHS_ES[m - 1]} de ${y}`;
  }
}

/** "October 2026", "2026年10月", "tháng 10/2026"… */
export function formatMonth(y: number, m: number, locale: Locale): string {
  switch (locale) {
    case "en":
      return `${MONTHS_EN[m - 1]} ${y}`;
    case "zh-Hans":
    case "zh-Hant":
    case "ja":
      return `${y}年${m}月`;
    case "ko":
      return `${y}년 ${m}월`;
    case "vi":
      return `tháng ${m}/${y}`;
    case "fr":
      return `${MONTHS_FR[m - 1]} ${y}`;
    case "es":
      return `${MONTHS_ES[m - 1]} de ${y}`;
  }
}

/**
 * Whole numbers with each locale's thousands separator: "2,000", "2.000",
 * "2 000" (narrow no-break space). Spanish leaves four-digit numbers ungrouped,
 * as the RAE recommends.
 */
export function formatCount(n: number, locale: Locale): string {
  const digits = String(Math.trunc(n));
  if (locale === "es" && digits.length <= 4) return digits;
  const sep = locale === "fr" ? " " : locale === "vi" || locale === "es" ? "." : ",";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}
