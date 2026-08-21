import Link from "next/link";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_CATEGORIES, CATEGORY_COPY } from "@/lib/market-categories";
import { toLocalePath } from "@/lib/site-locale-routing";
import { suburbDisplayName } from "@/lib/suburb-display";
import type { FeedListing } from "@/lib/supabase/server-feed";
import type { Locale } from "@/lib/site-i18n";

/**
 * The server-rendered half of `/market`.
 *
 * `/market` sat at priority 0.9 in the sitemap while its server HTML carried
 * seven words of page-specific text, zero links to any listing and no
 * structured data — because the feed is a `"use client"` component fetching in
 * a `useEffect`. Googlebot could not even reach the JavaScript, since
 * `robots.txt` disallowed `/_next`; no AI retrieval crawler executes JS at all.
 * So roughly 1,100 live listings were invisible to every machine that matters.
 *
 * This is a plain server component: a real `<h1>`, real listing links, and the
 * category cross-mesh. The interactive suburb picker and its live feed still
 * mount underneath and still own the experience for a human with JavaScript.
 * Nothing here duplicates that behaviour — it just makes the page legible
 * without it.
 *
 * Listing links carry `rel="nofollow"` and listing pages are `noindex, follow`:
 * the goal is for a crawler to see that real inventory exists and how it is
 * described, not to push ~8,800 short-lived listing URLs into the index.
 */
export function MarketServerListings({
  locale,
  heading,
  intro,
  listings,
  priceLabels,
  noImageLabel,
}: {
  locale: Locale;
  heading: string;
  intro: string;
  listings: FeedListing[];
  priceLabels: string[];
  noImageLabel: string;
}) {
  const categoriesHeading = CATEGORY_COPY[locale].otherCategories;

  return (
    <section className={`${SHELL_X} w-full bg-surface-base pt-8`}>
      <div className={INNER_MAX}>
        <h1 className="text-balance text-2xl font-bold tracking-tight text-black sm:text-3xl">
          {heading}
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-black/60">{intro}</p>

        {listings.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((l, i) => (
              <li key={l.id} className="min-w-0 text-sm leading-snug">
                <Link
                  href={toLocalePath(`/market/p/${encodeURIComponent(l.id)}`, locale)}
                  rel="nofollow"
                  className="text-black/70 underline-offset-2 hover:text-brand-700 hover:underline"
                >
                  <span className="line-clamp-1">{l.title}</span>
                </Link>{" "}
                <span className="tabular-nums text-black/45">{priceLabels[i]}</span>
                {l.suburbName ? (
                  <span className="text-black/35"> · {suburbDisplayName(l.suburbName)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-black/45">{noImageLabel}</p>
        )}

        <nav aria-label={categoriesHeading} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
            {categoriesHeading}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {MARKET_CATEGORIES.map((c) => (
              <li key={c.path}>
                <Link
                  href={toLocalePath(c.path, locale)}
                  className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                >
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
