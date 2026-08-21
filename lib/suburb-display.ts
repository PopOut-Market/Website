/**
 * Suburb keys that are misspelled in the frozen `MARKET_SUBURBS` list.
 *
 * "Fitzory" is a typo for the real Melbourne suburb **Fitzroy**. The key itself
 * cannot simply be renamed: it is the value in existing `?area=Fitzory` links,
 * in `lib/market-suburb-ids.ts`, in `lib/suburb-slug.ts`, and in the alias
 * `lib/supabase/fetch-active-suburbs.ts` uses to map the UI key onto the DB's
 * `FITZROY`. So the key stays frozen and only the label a human (or a crawler,
 * or an AI) reads is corrected here.
 *
 * This matters beyond tidiness: the misspelling was being published as a place
 * name in JSON-LD and in body copy across all eight locales, teaching anything
 * that ingests the site that "Fitzory" is a Melbourne suburb.
 */
const SUBURB_DISPLAY_OVERRIDES: Record<string, string> = {
  Fitzory: "Fitzroy",
};

/** The correctly-spelled, human-facing name of a market suburb, with no city suffix. */
export function suburbDisplayName(area: string): string {
  return SUBURB_DISPLAY_OVERRIDES[area] ?? area;
}

/**
 * Human-facing label for a market suburb. The stored value stays as the frozen
 * `MARKET_SUBURBS` entry (geo-SEO) — this only changes displayed text.
 *
 * "Melbourne CBD" -> "CBD, Melbourne"; every other suburb gets a ", Melbourne"
 * suffix, skipped when the name already contains "Melbourne" (e.g. North Melbourne)
 * to avoid "North Melbourne, Melbourne".
 */
export function suburbDisplayLabel(area: string): string {
  const name = suburbDisplayName(area);
  const base = name === "Melbourne CBD" ? "CBD" : name;
  return base.includes("Melbourne") ? base : `${base}, Melbourne`;
}
