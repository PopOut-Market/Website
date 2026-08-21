"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { HomeListingStrip } from "@/components/home-listing-strip";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SECONDARY_PILL_CLASS, SHELL_X } from "@/lib/site-config";
import { MARKET_CATEGORIES, CATEGORY_COPY, type MarketCategory } from "@/lib/market-categories";
import type { FeedListing } from "@/lib/supabase/server-feed";
import Link from "next/link";

/**
 * One second-hand category, filled with live listings.
 *
 * The listings are the point. A templated paragraph about "second-hand furniture
 * in Melbourne" is something a language model can write without retrieving
 * anything, which is exactly the kind of page that stopped working; a page
 * carrying twenty real titles, real prices and real suburbs, refreshed hourly
 * and translated by the database into the reader's language, is not.
 *
 * If the feed returns nothing the page still renders its heading, intro and the
 * cross-links, and simply shows no grid. It never invents stock to fill space.
 */
export function CategoryPageContent({
  category,
  listings,
  priceLabels,
}: {
  category: MarketCategory;
  listings: FeedListing[];
  priceLabels: string[];
}) {
  const { locale, localizePath, t } = useSiteShell();
  const frame = CATEGORY_COPY[locale];
  const name = category.name[locale];
  const fill = (s: string) => s.replaceAll("{cat}", name);

  const others = MARKET_CATEGORIES.filter((c) => c.path !== category.path);

  return (
    <div className={`${SHELL_X} flex min-h-0 flex-1 flex-col pb-16 pt-8 sm:pb-24 sm:pt-10`}>
      <div className={INNER_MAX}>
        <BackNavLink href={localizePath("/market")}>{t.suburbBackToHub}</BackNavLink>

        <h1 className="mt-8 text-balance text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {fill(frame.h1)}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/60">
          {fill(frame.intro)}
        </p>

        <div className="mt-8">
          <HomeListingStrip listings={listings} priceLabels={priceLabels} />
        </div>

        <div className="mt-8">
          <Link
            href={localizePath("/market")}
            className={`${SECONDARY_PILL_CLASS} px-6 py-3 text-sm sm:text-base`}
          >
            {frame.browseAll}
          </Link>
        </div>

        {/* Cross-mesh. Every category links to every other one, so the cluster is
            reachable without the sitemap and no page in it is an orphan — which
            is what happened to the four `melbourne-second-hand-*` pages. */}
        <section className="mt-14 border-t border-black/5 pt-8">
          <h2 className="text-lg font-semibold text-black sm:text-xl">{frame.otherCategories}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.path}>
                <Link
                  href={localizePath(c.path)}
                  className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                >
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
