/**
 * Human-facing label for a market suburb. The stored value stays as the frozen
 * `MARKET_SUBURBS` entry (geo-SEO) — this only changes displayed text.
 *
 * "Melbourne CBD" -> "CBD, Melbourne"; every other suburb gets a ", Melbourne"
 * suffix, skipped when the name already contains "Melbourne" (e.g. North Melbourne)
 * to avoid "North Melbourne, Melbourne".
 */
export function suburbDisplayLabel(area: string): string {
  const base = area === "Melbourne CBD" ? "CBD" : area;
  return base.includes("Melbourne") ? base : `${base}, Melbourne`;
}
