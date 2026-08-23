import type { GuideShop } from "@/lib/supabase/server-shops";

/**
 * Groups shops by the street their address names.
 *
 * Street grouping is the one organising idea this page can offer that is both
 * genuinely useful and derivable from data it already has. Five of the fourteen
 * shops are on Elizabeth Street; someone walking there wants them together, not
 * scattered through an alphabetical list.
 *
 * Two things it deliberately does not do:
 *
 * - **No ordering by preference.** Groups come out in size order (the street you
 *   would walk first), and shops inside a group are alphabetical. Neither is a
 *   ranking, and the page says so.
 * - **No street it cannot prove.** The street is parsed from the stored address
 *   and nothing else. Anything that does not parse cleanly falls into one
 *   "elsewhere" group rather than being guessed at.
 */

export type StreetGroup = { street: string; shops: GuideShop[] };

/**
 * Pull the street name out of an Australian address line.
 *
 * Handles the shapes actually present in the directory today:
 *   "79-81 Franklin St, Melbourne VIC 3000"          -> Franklin St
 *   "Shop LG08, 211 La Trobe St, Melbourne VIC 3000" -> La Trobe St
 *   "2/440 Elizabeth St, Melbourne VIC 3000"         -> Elizabeth St
 *   "Shops 1 and 2/97-105 Franklin St, ..."          -> Franklin St
 * Anything else returns null and is grouped under "elsewhere" — never guessed.
 */
export function streetOf(address: string): string | null {
  for (const part of address.split(",")) {
    const match = part
      .trim()
      // strip any leading unit/shop/level prefix and street number
      .replace(/^(?:shops?|suite|unit|level|lg)\s*[\w-]*\s*(?:and\s*\d+)?[/,]?\s*/i, "")
      .replace(/^[\d]+[a-z]?(?:\s*[-–]\s*[\d]+[a-z]?)?\/?\s*/i, "")
      .replace(/^[\d]+[a-z]?(?:\s*[-–]\s*[\d]+[a-z]?)?\s*/i, "")
      .match(
        /^([A-Za-z][A-Za-z' ]*?\s(?:St|Street|Rd|Road|Ave|Avenue|Ln|Lane|Pl|Place|Sq|Square|Way|Tce|Terrace|Pde|Parade))\b/,
      );
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

export function groupShopsByStreet(shops: GuideShop[], elsewhereLabel: string): StreetGroup[] {
  const byStreet = new Map<string, GuideShop[]>();
  const elsewhere: GuideShop[] = [];

  for (const shop of shops) {
    const street = streetOf(shop.address);
    if (!street) {
      elsewhere.push(shop);
      continue;
    }
    const list = byStreet.get(street);
    if (list) list.push(shop);
    else byStreet.set(street, [shop]);
  }

  const groups: StreetGroup[] = [...byStreet.entries()]
    .map(([street, list]) => ({
      street,
      shops: [...list].sort((a, b) => a.name.localeCompare(b.name, "en")),
    }))
    // Biggest cluster first — the street worth walking. Ties broken by name so
    // the order is stable across renders and identical on server and client.
    .sort((a, b) => b.shops.length - a.shops.length || a.street.localeCompare(b.street, "en"));

  if (elsewhere.length > 0) {
    groups.push({
      street: elsewhereLabel,
      shops: [...elsewhere].sort((a, b) => a.name.localeCompare(b.name, "en")),
    });
  }

  return groups;
}
