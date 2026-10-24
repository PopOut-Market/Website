import { formatDay } from "@/lib/locale-format";
import type { Locale } from "@/lib/site-i18n";

const LABEL: Record<Locale, string> = {
  en: "Updated",
  "zh-Hans": "更新于",
  "zh-Hant": "更新於",
  ko: "최종 업데이트",
  ja: "更新日",
  vi: "Cập nhật",
  fr: "Mis à jour le",
  es: "Actualizado el",
};

/**
 * The visible "Updated <date>" line on authored pages. The date comes from
 * lib/content-dates.ts, the same source as the page's JSON-LD `dateModified` and
 * the sitemap's `lastmod`.
 *
 * Formatted by hand (lib/locale-format.ts) rather than with Intl: several pages
 * render this inside a client component, where the browser's date data can
 * differ from the server's and fail hydration. Takes a date only (YYYY-MM-DD);
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
      <time dateTime={iso}>{`${LABEL[locale]} ${formatDay(y, m, d, locale)}`}</time>
    </p>
  );
}
