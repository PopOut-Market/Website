import { formatCount, formatMonth } from "@/lib/locale-format";
import type { Locale } from "@/lib/site-i18n";

/**
 * Counts the site states about itself, each with the month it was true and where
 * it came from. They live here rather than in lib/site-i18n.ts so each number
 * sits in one place and always travels with its date: the copy there is a
 * template with {asOf}, {neighbours} and {items}. These are floors, never
 * rounded up. Re-check against the app before raising one, and move `asOf` with
 * it.
 */
export const SITE_STATS = {
  asOf: { year: 2026, month: 10 },
  /**
   * Registered accounts. The owner-confirmed registration count was "just under
   * 1,500" on 2026-10-15 (app-v2 docs/features/shop-ownership.md on origin/main);
   * Eric put it at "over a thousand" on 2026-10-24.
   */
  neighbours: 1000,
  /**
   * Items listed since launch. 2,019 listings had been translated into eight
   * languages by 2026-09-01 (app-v2 docs); Eric put the total at "over 2,000" on
   * 2026-10-24.
   */
  itemsListed: 2000,
} as const;

/** Fill a stats template ({asOf}, {neighbours}, {items}) for one locale. */
export function fillStats(template: string, locale: Locale): string {
  return template
    .replaceAll("{asOf}", formatMonth(SITE_STATS.asOf.year, SITE_STATS.asOf.month, locale))
    .replaceAll("{neighbours}", formatCount(SITE_STATS.neighbours, locale))
    .replaceAll("{items}", formatCount(SITE_STATS.itemsListed, locale));
}
