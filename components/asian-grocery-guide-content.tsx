"use client";

import Image from "next/image";
import Link from "next/link";
import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X, FOOTER_CONTACT_EMAIL } from "@/lib/site-config";
import { GUIDE_COPY, type GuideLocale } from "@/lib/grocery-guide-copy";
import { groupShopsByStreet } from "@/lib/grocery-guide-streets";
import type { GuideShop } from "@/lib/supabase/server-shops";

/**
 * The Melbourne CBD Asian grocery guide.
 *
 * ## Why this page exists
 *
 * SERP research found this the softest cluster in the whole audit: the strongest
 * English competitor lists five stores and was last updated in 2021, the
 * suburb-level results are directory scrapers and a business-for-sale ad, and no
 * one in any language aggregates Australia's physical Asian grocers. PopOut
 * already has the material — a hand-built directory with street-level photographs
 * — and already ships the languages the audience reads in.
 *
 * ## The rules this page is built to, and why each one is here
 *
 * - **No prices, ever.** Publishing an independent grocer's prices without that
 *   merchant opting in is on the absolute no-go list. It is also the one thing
 *   that would turn a directory page into a comparator, with everything that
 *   follows from that.
 * - **No opening hours, phone numbers, ratings, reviews, "known for" tags, owner
 *   names or shop size.** The app holds none of it. Every one would be invented,
 *   and a wrong opening hour wastes a real person's trip.
 * - **Nothing enriched from Google Maps, Street View, Yelp or a shop's own site.**
 * - **Neither chain supermarket in the directory is named anywhere on this page,
 *   not even to say they are excluded.** Naming a retailer you do not cover is
 *   the specific thing comparator guidance warns about.
 * - **The non-affiliation notice sits above the first shop, in body text.**
 *   Footer or terms placement is expressly *not* prominent disclosure. It must
 *   never be moved into a footer, an accordion, or fine print.
 * - **No count and no date in the title, H1 or static metadata.** Both are read
 *   live and can change without a deploy; baking them in guarantees they drift.
 * - **One page, not fourteen.** A URL per shop would be 14 x 4 near-empty pages.
 */

export function AsianGroceryGuideContent({
  shops,
  locale,
}: {
  shops: GuideShop[];
  locale: GuideLocale;
}) {
  const { localizePath, t } = useSiteShell();
  const copy = GUIDE_COPY[locale];

  const suburbList = [...new Set(shops.map((s) => s.suburb).filter(Boolean))].join(" · ");
  const fill = (s: string) =>
    s
      .replaceAll("{n}", String(shops.length))
      .replaceAll("{suburbList}", suburbList || "Melbourne CBD")
      .replaceAll("{email}", FOOTER_CONTACT_EMAIL);

  const groups = groupShopsByStreet(shops, copy.headings.elsewhere);

  return (
    <div className={`${SHELL_X} flex min-h-0 flex-1 flex-col pb-16 pt-8 sm:pb-24 sm:pt-10`}>
      <div className={INNER_MAX}>
        <BackNavLink href={localizePath("/")}>{t.footerBackHome}</BackNavLink>

        <h1 className="mt-8 text-balance text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {copy.h1}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/65">{fill(copy.intro)}</p>

        {/* DISCLOSURE — body text, above the first shop, never collapsed.
            Position is not a style choice; see the header comment. */}
        <section
          aria-label={copy.headings.aboutThisList}
          className="mt-7 max-w-3xl rounded-2xl border border-black/5 bg-gray-50 p-5 text-[0.95rem] leading-relaxed text-black/70 shadow-card"
        >
          {fill(copy.disclosure)
            .split("\n\n")
            .map((para, i) => (
              <p key={i} className={i > 0 ? "mt-3" : undefined}>
                {para}
              </p>
            ))}
        </section>

        {/* THE LIST — above all prose. A reader who came for shops gets shops. */}
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            {copy.headings.shopList}
          </h2>
          <p className="mt-2 text-sm text-black/45">{fill(copy.listLabel)}</p>
          <p className="mt-1 text-sm text-black/45">{copy.orderingNote}</p>

          {groups.map((group) => (
            <div key={group.street} className="mt-8">
              <h3 className="text-base font-semibold text-black/80">{group.street}</h3>
              <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.shops.map((shop) => (
                  <li
                    key={shop.id}
                    className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card"
                  >
                    {shop.photoUrl ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-raised">
                        <Image
                          src={shop.photoUrl}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="p-4">
                      <p className="text-[0.95rem] font-semibold leading-snug text-black">
                        {shop.name}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-black/55">{shop.address}</p>
                      <p className="mt-2 text-xs text-black/35">{copy.shopKindLabel}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="mt-6 text-xs text-black/40">{copy.photoCredit}</p>
        </section>

        {/* CORRECTIONS / REMOVAL — the route a named business needs. */}
        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            {copy.headings.shopOwners}
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-black/65">
            {fill(copy.correctionsBody)}
          </p>
        </section>

        {/* IN THE APP — last and short. */}
        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            {copy.headings.inApp}
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-black/65">{copy.inAppBody}</p>
        </section>

        <nav aria-label={copy.headings.relatedLinks} className="mt-12 border-t border-black/5 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50">
            {copy.headings.relatedLinks}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[
              { path: "/melbourne-suburbs/melbourne-cbd", label: copy.related.cbd },
              { path: "/melbourne-suburbs/docklands", label: copy.related.docklands },
              { path: "/market", label: copy.related.market },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  href={localizePath(link.path)}
                  className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
