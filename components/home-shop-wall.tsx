"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { EASE_POP } from "@/lib/motion";
import type { GuideShop } from "@/lib/supabase/server-shops";

/**
 * Fourteen real shopfronts.
 *
 * These photographs are the section. They are street-level shots of real shops,
 * visually unlike anything else on the page, and they land immediately after two
 * illustrated demos — that contrast is what stops the page dying halfway down.
 * Not a widget, not a map.
 *
 * **There is no basemap and no Leaflet here.** A map plate was designed and cut:
 * a tile layer on the site's most LCP-sensitive page, to communicate "Melbourne
 * CBD", which the heading and the paragraph already say. The map idea is carried
 * instead by the copy and by the pin-drop motion — and by the fact that these
 * crops literally *are* the app's map-pin images.
 *
 * **Tiles are not links.** No per-shop page exists, and fourteen links to one
 * destination is link soup.
 *
 * On screen: photo, name, street address. Nothing else. No price (forbidden
 * outright), and no rating, "open now", distance or opening hours — the app holds
 * none of those for these shops, so every one of them would be invented.
 */

/**
 * `", Melbourne VIC 3000"` is identical on all fourteen and sits under a heading
 * that already says Melbourne, so it is pure noise that also wrecks the two-line
 * caption. Display only — the stored address is never modified.
 */
function shortAddress(address: string): string {
  return address.replace(/,\s*(?:Melbourne|Docklands)\s+VIC\s+\d{4}\s*$/i, "");
}

export function HomeShopWall({
  shops,
  show,
  labelledBy,
}: {
  shops: GuideShop[];
  show: boolean;
  labelledBy: string;
}) {
  // No skeletons, no placeholders, no layout jump. When the directory is
  // unreachable (a preview deploy without the service-role key) the section
  // renders exactly as it did before this component existed.
  if (shops.length === 0) return null;

  return (
    <ul
      aria-labelledby={labelledBy}
      // TRAP: `overflow-x: auto` computes `overflow-y` to `auto`, so the tiles'
      // -10px start offset would create a vertical scrollbar inside the mobile
      // strip. The `py-3` absorbs it. Do not tighten that padding.
      className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-7"
    >
      {shops.map((shop, i) => (
        <Reveal
          as="li"
          key={shop.id}
          show={show}
          // The pin drop: every other reveal on this page moves up, these move
          // DOWN with one gentle overshoot, so fourteen photographs read as
          // fourteen pins landing. The only use of EASE_POP on the site.
          distance="drop"
          easing={EASE_POP}
          delayMs={120 + Math.min(i, 5) * 70}
          className="shrink-0 basis-[132px] snap-start sm:basis-auto"
        >
          <figure className="group">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-[transform,border-color] duration-[180ms] ease-out group-hover:-translate-y-0.5 group-hover:border-brand-500">
              {shop.pinUrl ? (
                <Image
                  src={shop.pinUrl}
                  // Decorative: the shop's name is right underneath in text, so
                  // an alt repeating it would be read twice by a screen reader.
                  alt=""
                  fill
                  sizes="(max-width: 640px) 132px, (max-width: 1024px) 22vw, 148px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <figcaption className="mt-2">
              <p className="line-clamp-2 text-[0.8rem] font-semibold leading-snug text-black">
                {shop.name}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[0.7rem] leading-snug text-black/45">
                {shortAddress(shop.address)}
              </p>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
