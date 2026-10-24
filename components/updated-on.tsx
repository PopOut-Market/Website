import type { Locale } from "@/lib/site-i18n";

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

const FORMAT: Record<Locale, (y: number, m: number, d: number) => string> = {
  en: (y, m, d) => `Updated ${d} ${MONTHS_EN[m - 1]} ${y}`,
  "zh-Hans": (y, m, d) => `更新于 ${y}年${m}月${d}日`,
  "zh-Hant": (y, m, d) => `更新於 ${y}年${m}月${d}日`,
  ko: (y, m, d) => `최종 업데이트 ${y}년 ${m}월 ${d}일`,
  ja: (y, m, d) => `更新日 ${y}年${m}月${d}日`,
  vi: (y, m, d) => `Cập nhật ngày ${d} tháng ${m} năm ${y}`,
  fr: (y, m, d) => `Mis à jour le ${d === 1 ? "1er" : d} ${MONTHS_FR[m - 1]} ${y}`,
  es: (y, m, d) => `Actualizado el ${d} de ${MONTHS_ES[m - 1]} de ${y}`,
};

/**
 * The visible "Updated <date>" line on authored pages. The date comes from
 * lib/content-dates.ts, the same source as the page's JSON-LD `dateModified` and
 * the sitemap's `lastmod`.
 *
 * Formatted by hand rather than with Intl: several pages render this inside a
 * client component, and the browser's date data can differ from the server's
 * ("Sep" against "Sept"), which fails hydration. Takes a date only (YYYY-MM-DD);
 * live pages carry a timestamp and show no visible date.
 */
export function UpdatedOn({
  iso,
  locale,
  className = "mt-2 text-sm text-gray-600",
}: {
  iso: string;
  locale: Locale;
  className?: string;
}) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`UpdatedOn: expected YYYY-MM-DD, got ${iso}`);
  const [y, m, d] = match.slice(1).map(Number);
  return (
    <p className={className}>
      <time dateTime={iso}>{FORMAT[locale](y, m, d)}</time>
    </p>
  );
}
