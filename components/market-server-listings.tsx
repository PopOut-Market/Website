import Link from "next/link";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_CATEGORIES, CATEGORY_COPY } from "@/lib/market-categories";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

/**
 * The server-rendered head of `/market`: the real `<h1>`, the page's intro, and
 * the category navigation.
 *
 * It used to also render a plain text list of 24 listings. That is gone, and the
 * reason is worth keeping: the listings are now seeded straight into the
 * interactive `MarketFeed` below (see its `initialItems` prop), so the page has
 * **one** list rather than a crawler copy stacked on top of a human copy. The
 * old arrangement printed the same two dozen items twice on one screen, which
 * read as a data dump and was the first thing anyone noticed about the page.
 *
 * What stays here is what genuinely belongs above the feed: a heading that
 * describes the page (the feed's own heading is an area picker, which is a
 * control, not a title), a sentence of context, and links into the ten category
 * pages so the cluster is reachable from the page it belongs to.
 */
export function MarketServerListings({
  locale,
  heading,
  intro,
}: {
  locale: Locale;
  heading: string;
  intro: string;
}) {
  // `browseByCategory`, NOT `otherCategories`. The latter is written for a
  // category page, where the list genuinely is "the other categories"; on
  // /market it produced the heading "Other categories in Melbourne" above a list
  // of every category, which reads as nonsense.
  const categoriesHeading = CATEGORY_COPY[locale].browseByCategory;

  return (
    <section className={`${SHELL_X} w-full bg-surface-base pt-8`}>
      <div className={INNER_MAX}>
        <h1 className="text-balance text-2xl font-bold tracking-tight text-black sm:text-3xl">
          {heading}
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-black/60">{intro}</p>

        <nav aria-label={categoriesHeading} className="mt-6">
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
