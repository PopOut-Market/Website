"use client";

import type { SiteCopy } from "@/lib/site-i18n";

/**
 * Page controls for the listing grid.
 *
 * ## Why the numbers stop where they do
 *
 * `get_home_feed` returns rows, not a total, so there is no honest way to render
 * "1 2 3 … 44". What this control knows is: the pages already visited, and
 * whether the page just fetched had a full set of rows (which is how the feed
 * detects there is another one). So the numbers grow as you move forward, and
 * the control never claims a page it has not confirmed exists.
 *
 * That is a deliberate trade. Rendering a guessed page count would be the kind of
 * small invented number this site has been systematically removing.
 *
 * ## Design
 *
 * Built from the site's own tokens rather than a new look: `rounded-xl` (never
 * full pills — that is the house rule for buttons), the flat brand orange for the
 * current page, and the same neutral outline the secondary buttons use. The
 * current page is a `<span aria-current="page">`, not a button, so it is not a
 * control that does nothing.
 */

const BASE =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";
const IDLE = `${BASE} border border-gray-400 bg-white text-gray-900 hover:border-brand-500 active:bg-gray-100`;
const CURRENT = `${BASE} bg-brand-500 text-white`;
const DISABLED = `${BASE} border border-black/5 bg-white text-black/25`;

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-4 w-4">
      <path
        fillRule="evenodd"
        d={
          dir === "left"
            ? "M12.79 5.23a.75.75 0 0 1 .02 1.06L9.06 10l3.75 3.71a.75.75 0 1 1-1.06 1.06l-4.24-4.24a.75.75 0 0 1 0-1.06l4.24-4.24a.75.75 0 0 1 1.04 0Z"
            : "M7.21 5.23a.75.75 0 0 0-.02 1.06L10.94 10l-3.75 3.71a.75.75 0 1 0 1.06 1.06l4.24-4.24a.75.75 0 0 0 0-1.06L8.25 5.23a.75.75 0 0 0-1.04 0Z"
        }
        clipRule="evenodd"
      />
    </svg>
  );
}

export function MarketPagination({
  page,
  knownPages,
  hasNext,
  busy,
  onGo,
  t,
}: {
  /** 1-indexed. */
  page: number;
  /** Highest page confirmed to exist. */
  knownPages: number;
  hasNext: boolean;
  busy: boolean;
  onGo: (page: number) => void;
  t: SiteCopy;
}) {
  if (knownPages <= 1 && !hasNext) return null;

  // A window around the current page, so a long session does not grow a row of
  // thirty buttons. First and last of the known range are always reachable.
  const last = Math.max(knownPages, hasNext ? page + 1 : page);
  const window = new Set<number>([1, last, page, page - 1, page + 1]);
  const numbers = [...window].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b);

  const prevDisabled = page <= 1 || busy;
  const nextDisabled = !hasNext || busy;

  return (
    <nav aria-label={t.marketPaginationAria} className="mt-6 flex justify-center pb-4">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <button
            type="button"
            onClick={() => onGo(page - 1)}
            disabled={prevDisabled}
            aria-label={t.marketPagePrev}
            className={prevDisabled ? DISABLED : IDLE}
          >
            <Chevron dir="left" />
            <span className="ml-1 hidden sm:inline">{t.marketPagePrev}</span>
          </button>
        </li>

        {numbers.map((n, i) => {
          const gap = i > 0 && n - numbers[i - 1]! > 1;
          return (
            <li key={n} className="flex items-center gap-2">
              {gap ? (
                <span aria-hidden className="px-0.5 text-sm text-black/30">
                  …
                </span>
              ) : null}
              {n === page ? (
                <span aria-current="page" className={CURRENT}>
                  {n}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onGo(n)}
                  disabled={busy}
                  aria-label={t.marketPageNumberAria.replace("{page}", String(n))}
                  className={busy ? DISABLED : IDLE}
                >
                  {n}
                </button>
              )}
            </li>
          );
        })}

        <li>
          <button
            type="button"
            onClick={() => onGo(page + 1)}
            disabled={nextDisabled}
            aria-label={t.marketPageNext}
            className={nextDisabled ? DISABLED : IDLE}
          >
            <span className="mr-1 hidden sm:inline">{t.marketPageNext}</span>
            <Chevron dir="right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
