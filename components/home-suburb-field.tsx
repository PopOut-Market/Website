"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { useSiteShell } from "@/components/site-chrome-context";
import { STAGGER_DENSE_CAP, STAGGER_DENSE_MS } from "@/lib/motion";
import { MARKET_SUBURBS, type MarketSuburb } from "@/lib/site-suburbs";
import { suburbDisplayName } from "@/lib/suburb-display";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";

/**
 * A sample of real suburb names, to make the coverage claim concrete.
 *
 * **336 is an abstraction; Nunawading is not.** A reader from Werribee South or
 * Mernda finding their own suburb on the page learns more from that than from
 * the number above it.
 *
 * Why 32 and not 336: 336 chips is ~12 KB gzipped and 336 more nodes to style
 * and lay out, on eight prerendered pages, for a wall of text nobody reads. The
 * "see every Melbourne suburb" link sits directly below and carries the rest.
 *
 * There is deliberately **no "+304 more" chip**. It would put a second number on
 * screen that can drift out of step with the heading, and it would cost a copy
 * key in eight languages. Cutting it removes the divergence risk by design.
 */

const SAMPLE_SIZE = 32;

/** The suburbs that have their own landing page, so their chip can be a link. */
const LINKED = new Set<string>(MARKET_SUBURBS);

/**
 * Deterministic — never `Math.random()`.
 *
 * These pages are prerendered, so a random sample would make the server HTML and
 * the client's first render disagree and React would throw a hydration mismatch.
 * A fixed stride over the alphabetical remainder also gives an A-to-W spread
 * rather than 24 names starting with "A".
 */
function sampleNames(all: string[]): string[] {
  const linked = MARKET_SUBURBS.map((s) => s as string).filter((s) =>
    all.some((n) => n.toLowerCase() === suburbDisplayName(s).toLowerCase()),
  );
  const rest = all.filter(
    (n) => !linked.some((s) => suburbDisplayName(s).toLowerCase() === n.toLowerCase()),
  );
  const slots = Math.max(0, SAMPLE_SIZE - linked.length);
  const picked =
    slots > 0 && rest.length > 0
      ? Array.from(
          { length: Math.min(slots, rest.length) },
          (_, i) => rest[Math.floor((i * rest.length) / Math.min(slots, rest.length))]!,
        )
      : [];
  return [...linked, ...picked];
}

const CHIP_BASE =
  "inline-flex rounded-full border border-black/5 bg-white px-3 py-1.5 text-[0.8rem]";

export function HomeSuburbField({ names, show }: { names: string[]; show: boolean }) {
  const { localizePath } = useSiteShell();

  // Empty when the read failed or the row count did not reconcile. The section
  // then shows its heading, paragraph and CTA and simply omits the field.
  if (names.length === 0) return null;

  const sample = sampleNames(names);
  if (sample.length === 0) return null;

  return (
    <ul className="mt-8 flex flex-wrap justify-center gap-2">
      {sample.map((name, i) => {
        const isLinked = LINKED.has(name);
        const label = suburbDisplayName(name);
        return (
          <Reveal
            as="li"
            key={`${name}-${i}`}
            show={show}
            delayIndex={i}
            distance="sm"
            // The one documented exception to the 70ms/5 stagger. At 70ms a dense
            // wrapped field lands in six visible blocks; at 28ms it reads as one
            // wave. Nothing else on the site uses these values.
            staggerMs={STAGGER_DENSE_MS}
            staggerCap={STAGGER_DENSE_CAP}
          >
            {isLinked ? (
              <Link
                href={localizePath(suburbSeoPath(name as MarketSuburb))}
                className={`${CHIP_BASE} font-semibold text-black/80 transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700`}
              >
                {label}
              </Link>
            ) : (
              <span className={`${CHIP_BASE} text-black/55`}>{label}</span>
            )}
          </Reveal>
        );
      })}
    </ul>
  );
}
