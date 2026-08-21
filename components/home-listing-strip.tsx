"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteShell } from "@/components/site-chrome-context";
import type { FeedListing } from "@/lib/supabase/server-feed";
import { suburbDisplayName } from "@/lib/suburb-display";

/**
 * Real listings, server-rendered.
 *
 * This replaces a hard-coded showcase of eight invented items — "iPhone 14 Pro
 * $890", "Smart Watch $210", a fake chat between "Tom" and "Soojung" — which was
 * roughly 40% of the homepage's visible characters and was the *only* inventory
 * a non-JavaScript crawler ever saw. The rows here come from `get_home_feed` at
 * render time, already translated into the page's locale by the database.
 *
 * Titles are user-submitted, so each card carries `rel="nofollow"` on its link
 * and the listing pages themselves are `noindex, follow`.
 */
export function HomeListingStrip({
  listings,
  priceLabels,
}: {
  listings: FeedListing[];
  priceLabels: string[];
}) {
  const { localizePath, t } = useSiteShell();

  if (listings.length === 0) {
    // No invented fallback. An empty strip is honest; fake stock is not.
    return null;
  }

  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
      aria-label={t.marketFeedListAria}
    >
      {listings.map((listing, i) => (
        <li key={listing.id}>
          <Link
            href={localizePath(`/market/p/${encodeURIComponent(listing.id)}`)}
            rel="nofollow"
            className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            <div
              className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-surface-raised"
              aria-label={listing.imageUrl ? undefined : t.marketPostNoImageAria}
            >
              {listing.imageUrl ? (
                <Image
                  src={listing.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 180px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-0.5 p-2.5">
              <p className="line-clamp-2 min-h-[2.4rem] text-[0.8rem] font-semibold leading-snug text-black sm:text-sm">
                {listing.title}
              </p>
              <p className="text-sm font-bold tabular-nums text-black">{priceLabels[i]}</p>
              {listing.suburbName ? (
                <p className="truncate text-[0.7rem] text-black/45">
                  {suburbDisplayName(listing.suburbName)}
                </p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
