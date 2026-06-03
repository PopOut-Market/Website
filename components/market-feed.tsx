"use client";

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
};

/** Mirrors the app's home feed: 20-row pages, stable shuffle, dedupe by id. */
const PAGE_SIZE = 20;

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

export function MarketFeed({ suburbId, suburbName, locale, t }: MarketFeedProps) {
  const mockProducts = useMemo(
    () => createMockMarketProducts(locale, t.marketDemoSeller, t.marketKmShort),
    [locale, t.marketDemoSeller, t.marketKmShort],
  );

  const configured = isSupabaseBrowserConfigured();

  const [items, setItems] = useState<MarketProduct[]>([]);
  const [hasLocalListing, setHasLocalListing] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>("skeleton");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  // Invalidates in-flight responses after suburb/locale changes (and concurrent loads).
  const genRef = useRef(0);
  const offsetRef = useRef(0);
  const seenRef = useRef<Set<string>>(new Set());
  const seedRef = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const prevLocaleRef = useRef(locale);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Latest-value refs so loadMore() (called from the observer) doesn't go stale.
  const itemsRef = useRef<MarketProduct[]>(items);
  itemsRef.current = items;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  // Always points at the latest loadMore so the duplicate-page chain isn't stale.
  const loadMoreRef = useRef<() => void>(() => {});

  if (seedRef.current === null) {
    seedRef.current = newSeed();
  }

  /** Reset pagination and load page 0. `clearVisible` shows a skeleton; otherwise the
   *  old grid stays up until the new first page lands (suburb-switch transition). */
  const loadFirstPage = useCallback(
    async (clearVisible: boolean) => {
      if (!isSupabaseBrowserConfigured()) {
        return;
      }
      const gen = ++genRef.current;
      offsetRef.current = 0;
      seenRef.current = new Set();
      loadingRef.current = true;
      setHasMore(true);
      setLoadingMore(false);
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
        const { products, hasLocalListing: hll, errorMessage } = await fetchMarketListings(
          client,
          {
            suburbId,
            locale,
            sellerFallback: t.marketDemoSeller,
            kmSuffix: t.marketKmShort,
            offset: 0,
            limit: PAGE_SIZE,
            jitterSeed: seedRef.current!,
          },
        );
        if (gen !== genRef.current) {
          return;
        }
        if (errorMessage) {
          setPhase("error");
          return;
        }
        const fresh = dedupe(products, seenRef.current);
        offsetRef.current = products.length;
        setHasMore(products.length >= PAGE_SIZE);
        setItems(fresh);
        setHasLocalListing(hll);
        setPhase(fresh.length ? "list" : "empty");
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

  const loadMore = useCallback(async () => {
    if (!isSupabaseBrowserConfigured()) {
      return;
    }
    if (loadingRef.current || !hasMoreRef.current || phaseRef.current !== "list") {
      return;
    }
    const gen = genRef.current;
    loadingRef.current = true;
    setLoadingMore(true);
    let chainDuplicatePage = false;
    try {
      const client = getSupabaseBrowserClient();
      const { products, errorMessage } = await fetchMarketListings(client, {
        suburbId,
        locale,
        sellerFallback: t.marketDemoSeller,
        kmSuffix: t.marketKmShort,
        offset: offsetRef.current,
        limit: PAGE_SIZE,
        jitterSeed: seedRef.current!,
      });
      if (gen !== genRef.current) {
        return;
      }
      if (errorMessage) {
        return; // keep what's already shown
      }
      offsetRef.current += products.length;
      const more = products.length >= PAGE_SIZE;
      setHasMore(more);
      const fresh = dedupe(products, seenRef.current);
      if (fresh.length) {
        setItems((prev) => [...prev, ...fresh]);
      } else if (more) {
        // A full page of all-duplicate ids doesn't grow the DOM, so the sentinel
        // never moves and the observer won't re-fire — advance the offset ourselves.
        chainDuplicatePage = true;
      }
    } catch {
      // keep what's already shown
    } finally {
      if (gen === genRef.current) {
        loadingRef.current = false;
        setLoadingMore(false);
        if (chainDuplicatePage) {
          queueMicrotask(() => loadMoreRef.current());
        }
      }
    }
  }, [suburbId, locale, t.marketDemoSeller, t.marketKmShort]);

  loadMoreRef.current = loadMore;

  const refresh = useCallback(() => {
    seedRef.current = newSeed();
    void loadFirstPage(true);
  }, [loadFirstPage]);

  // Suburb switch keeps the old grid (transition); language switch forces a skeleton.
  useEffect(() => {
    if (!configured) {
      return;
    }
    const localeChanged = prevLocaleRef.current !== locale;
    prevLocaleRef.current = locale;
    void loadFirstPage(localeChanged);
  }, [suburbId, locale, configured, loadFirstPage]);

  // Infinite scroll: observe a sentinel near the bottom of the scroll container.
  useEffect(() => {
    if (phase !== "list") {
      return;
    }
    const sentinel = sentinelRef.current;
    const root = scrollRef.current;
    if (!sentinel || !root) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMore();
        }
      },
      { root, rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // Re-arm on append (items.length), sentinel mount/unmount (hasMore), and when a
    // suburb-switch transition completes (transitioning) — IntersectionObserver only
    // fires on state *changes*, so a still-intersecting sentinel needs a fresh observe().
  }, [phase, loadMore, items.length, hasMore, transitioning]);

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
                href={`/market/p/${encodeURIComponent(product.id)}?area=${encodeURIComponent(suburbName)}`}
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
        <ul
          className={GRID_CLASS}
          role="status"
          aria-label={t.marketSupabaseLoadingAria}
        >
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
                  href={`/market/p/${encodeURIComponent(product.id)}?area=${encodeURIComponent(suburbName)}`}
                  copy={{
                    postNoImageAria: t.marketPostNoImageAria,
                    badgeNew: t.marketBadgeNew,
                  }}
                />
              </li>
            ))}
          </ul>
          {hasMore ? <div ref={sentinelRef} aria-hidden className="h-px w-full" /> : null}
          {loadingMore ? (
            <div
              className="flex items-center justify-center py-6"
              role="status"
              aria-label={t.marketSupabaseLoadingAria}
            >
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/15 border-t-brand-500" />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
