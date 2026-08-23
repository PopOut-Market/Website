"use client";

import { MarketPagination } from "@/components/market-pagination";
import { toLocalePath } from "@/lib/site-locale-routing";
import { MarketProductCard } from "@/components/market-product-card";
import { createMockMarketProducts } from "@/lib/market-mock";
import type { MarketProduct } from "@/lib/market-product";
import type { Locale, SiteCopy } from "@/lib/site-i18n";
import { fetchMarketListings } from "@/lib/supabase/fetch-market-listings";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/browser-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MarketFeedProps = {
  suburbId: number;
  suburbName: string;
  locale: Locale;
  t: SiteCopy;
  /**
   * Listings fetched on the server for the default suburb.
   *
   * They exist so `/market` is not an empty page to anything that does not run
   * JavaScript — which is every AI retrieval crawler, and was Googlebot too
   * while `robots.txt` still blocked `/_next`. Rendering them here rather than
   * in a second block above the feed means the page has ONE list instead of a
   * crawler copy and a human copy sitting on top of each other.
   *
   * The client still fetches on mount and replaces them; these are the first
   * paint, not the source of truth.
   */
  initialItems?: MarketProduct[];
};

/**
 * Listings per page.
 *
 * The grid was an infinite scroll of 20-row pages. It is now classic pagination:
 * a reader can tell how far in they are, can come back to where they were, and —
 * on a page whose whole job is browsing stock — is not forced to scroll past
 * everything to reach the footer.
 */
const PAGE_SIZE = 25;

/**
 * Fetch one extra row to learn whether another page exists.
 *
 * `get_home_feed` returns rows and no total, so "is there a next page" cannot be
 * asked directly. Asking for 26 and rendering 25 answers it exactly, with no
 * second query and no guessed page count. The RPC caps `p_limit` at 50, so this
 * is comfortably inside it.
 */
const PROBE_SIZE = PAGE_SIZE + 1;

const GRID_CLASS =
  "grid w-full list-none auto-rows-fr gap-3 p-0 [grid-template-columns:repeat(auto-fill,minmax(min(100%,10.25rem),1fr))] lg:gap-4 lg:[grid-template-columns:repeat(auto-fill,minmax(min(100%,12.3rem),1fr))]";

type Phase = "skeleton" | "list" | "empty" | "error";

function newSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}

/** Append only ids not seen before (mutates `seen`). */
function dedupe(products: MarketProduct[], seen: Set<string>): MarketProduct[] {
  const out: MarketProduct[] = [];
  for (const product of products) {
    if (!seen.has(product.id)) {
      seen.add(product.id);
      out.push(product);
    }
  }
  return out;
}

export function MarketFeed({ suburbId, suburbName, locale, t, initialItems }: MarketFeedProps) {
  const mockProducts = useMemo(
    () => createMockMarketProducts(locale, t.marketDemoSeller, t.marketKmShort),
    [locale, t.marketDemoSeller, t.marketKmShort],
  );

  const configured = isSupabaseBrowserConfigured();

  // Seeded from the server render so the first paint is real listings, not a
  // skeleton — and so the server HTML and the client's first render agree.
  const [items, setItems] = useState<MarketProduct[]>(initialItems ?? []);
  const [hasLocalListing, setHasLocalListing] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>(
    initialItems && initialItems.length > 0 ? "list" : "skeleton",
  );
  const [transitioning, setTransitioning] = useState(false);
  /** 1-indexed. */
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  /** Highest page confirmed to exist, so the control never invents one. */
  const [knownPages, setKnownPages] = useState(1);

  // Invalidates in-flight responses after suburb/locale changes (and concurrent loads).
  const genRef = useRef(0);

  const seedRef = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const prevLocaleRef = useRef(locale);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const itemsRef = useRef<MarketProduct[]>(items);
  itemsRef.current = items;

  if (seedRef.current === null) {
    seedRef.current = newSeed();
  }

  /**
   * Load one page.
   *
   * `clearVisible` shows a skeleton; otherwise the current grid stays up until
   * the new rows land, which is what makes a suburb switch feel like a filter
   * rather than a reload.
   */
  const loadPage = useCallback(
    async (target: number, clearVisible: boolean) => {
      if (!isSupabaseBrowserConfigured()) {
        return;
      }
      const gen = ++genRef.current;
      loadingRef.current = true;
      const keptItems = !clearVisible && itemsRef.current.length > 0;
      if (keptItems) {
        setTransitioning(true);
        setHasLocalListing(null); // hide the stale "nearby" notice during the swap
      } else {
        setItems([]);
        setPhase("skeleton");
      }
      try {
        const client = getSupabaseBrowserClient();
        const {
          products,
          hasLocalListing: hll,
          errorMessage,
        } = await fetchMarketListings(client, {
          suburbId,
          locale,
          sellerFallback: t.marketDemoSeller,
          kmSuffix: t.marketKmShort,
          offset: (target - 1) * PAGE_SIZE,
          // One extra row, purely to answer "is there a next page".
          limit: PROBE_SIZE,
          jitterSeed: seedRef.current!,
        });
        if (gen !== genRef.current) {
          return;
        }
        if (errorMessage) {
          setPhase("error");
          return;
        }

        const more = products.length > PAGE_SIZE;
        // Dedupe within the page only. Pages are now independent windows over a
        // stable ordering, so there is no cross-page `seen` set to maintain —
        // and keeping one would wrongly blank a row that legitimately appears
        // on the page you navigated back to.
        const visible = dedupe(products.slice(0, PAGE_SIZE), new Set());

        setHasNext(more);
        setKnownPages((prev) => Math.max(prev, more ? target + 1 : target));
        setItems(visible);
        setHasLocalListing(hll);
        setPage(target);
        setPhase(visible.length ? "list" : "empty");

        // Land at the top of the grid, not halfway down the page the reader just left.
        if (target !== 1) {
          scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch {
        if (gen === genRef.current) {
          setPhase("error");
        }
      } finally {
        if (gen === genRef.current) {
          loadingRef.current = false;
          setTransitioning(false);
        }
      }
    },
    [suburbId, locale, t.marketDemoSeller, t.marketKmShort],
  );

  const goToPage = useCallback(
    (target: number) => {
      if (target < 1 || loadingRef.current) {
        return;
      }
      void loadPage(target, false);
    },
    [loadPage],
  );

  const refresh = useCallback(() => {
    seedRef.current = newSeed();
    setKnownPages(1);
    void loadPage(1, true);
  }, [loadPage]);

  // Suburb switch keeps the old grid (transition); language switch forces a skeleton.
  useEffect(() => {
    if (!configured) {
      return;
    }
    const localeChanged = prevLocaleRef.current !== locale;
    prevLocaleRef.current = locale;
    // A different suburb is a different result set, so paging restarts at 1.
    setKnownPages(1);
    void loadPage(1, localeChanged);
  }, [suburbId, locale, configured, loadPage]);

  if (!configured) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-3">
        <div className="mb-4 rounded-2xl border border-black/10 border-l-4 border-l-warning bg-surface-base px-4 py-3 text-left text-xs text-black/55 shadow-card sm:text-sm">
          <p className="font-semibold text-black">{t.marketSupabaseNotConfiguredTitle}</p>
          <p className="mt-1 text-black/55">{t.marketSupabaseNotConfiguredBody}</p>
        </div>
        <ul className={GRID_CLASS} aria-label={t.marketFeedListAria}>
          {mockProducts.map((product) => (
            <li key={product.id} className="min-w-0">
              <MarketProductCard
                product={product}
                regionLabel={product.suburbLabel ?? suburbName}
                href={toLocalePath(`/market/p/${encodeURIComponent(product.id)}`, locale)}
                nofollow
                copy={{
                  postNoImageAria: t.marketPostNoImageAria,
                  badgeNew: t.marketBadgeNew,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="relative flex min-h-0 flex-1 flex-col overflow-y-auto py-3"
      aria-busy={phase === "skeleton"}
    >
      {transitioning ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-0.5 overflow-hidden">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-brand-500" />
        </div>
      ) : null}

      {phase === "skeleton" ? (
        <ul className={GRID_CLASS} role="status" aria-label={t.marketSupabaseLoadingAria}>
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="min-w-0">
              <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
                <div className="aspect-square w-full animate-pulse bg-surface-raised" />
                <div className="flex flex-col gap-1 p-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-surface-raised" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-surface-raised" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-surface-raised" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {phase === "error" ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
          <p className="max-w-md text-sm text-black/55">{t.marketSupabaseLoadError}</p>
          <button
            type="button"
            onClick={refresh}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 active:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            {t.marketSupabaseRetry}
          </button>
        </div>
      ) : null}

      {phase === "empty" ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
          <p className="max-w-md text-sm text-black/55">{t.marketSupabaseEmpty}</p>
          <button
            type="button"
            onClick={refresh}
            className="rounded-xl border border-black/10 bg-surface-base px-4 py-2 text-sm font-semibold text-black transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            {t.marketSupabaseRetry}
          </button>
        </div>
      ) : null}

      {phase === "list" ? (
        <>
          {hasLocalListing === false ? (
            <div className="mb-3 rounded-2xl bg-surface-raised px-4 py-2.5 text-center text-xs text-black/60 sm:text-sm">
              {t.marketNearbyNotice.replace("{suburb}", suburbName)}
            </div>
          ) : null}
          <ul className={GRID_CLASS} aria-label={t.marketFeedListAria}>
            {items.map((product) => (
              <li key={product.id} className="min-w-0">
                <MarketProductCard
                  product={product}
                  regionLabel={product.suburbLabel ?? suburbName}
                  href={toLocalePath(`/market/p/${encodeURIComponent(product.id)}`, locale)}
                  nofollow
                  titleAs="h3"
                  copy={{
                    postNoImageAria: t.marketPostNoImageAria,
                    badgeNew: t.marketBadgeNew,
                  }}
                />
              </li>
            ))}
          </ul>
          <MarketPagination
            page={page}
            knownPages={knownPages}
            hasNext={hasNext}
            busy={transitioning}
            onGo={goToPage}
            t={t}
          />
        </>
      ) : null}
    </div>
  );
}
