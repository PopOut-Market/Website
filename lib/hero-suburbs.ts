/**
 * The suburbs that rotate through the homepage `<h1>`.
 *
 * Melbourne CBD leads because it is where the product actually is: it holds
 * about a third of all live listings, every shop in the directory, and it is the
 * fallback suburb the app itself opens on. The rest are its immediate
 * neighbours, so the sequence reads as one recognisable part of the city rather
 * than a random tour of 336 names.
 *
 * Every entry was confirmed `is_active = true` in the live `suburbs` table on
 * 2026-08-22. **Do not add a suburb without checking that** — the H1 is the
 * page's biggest claim about where PopOut operates, and a name here that the app
 * does not serve is a false one.
 *
 * South Wharf is deliberately absent despite being adjacent and having its own
 * landing page: it has never held a single listing, so headlining it would
 * promise a market that is not there.
 *
 * Names stay in English in every locale. They are proper nouns, the site's own
 * suburb pages title them this way ("Carlton 二手交易"), and the app's suburb
 * picker shows them in Latin script too.
 */
export const HERO_SUBURBS = [
  "Melbourne CBD",
  "Southbank",
  "Docklands",
  "Carlton",
  "Fitzroy",
  "North Melbourne",
  "East Melbourne",
  "West Melbourne",
  "Parkville",
  "South Yarra",
] as const;
