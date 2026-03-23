"use client";

import { MarketProductCard } from "@/components/market-product-card";
import { createMockMarketProducts } from "@/lib/market-mock";
import type { MarketProduct } from "@/lib/market-product";
import type { Locale, SiteCopy } from "@/lib/site-i18n";
import type { MarketSuburb } from "@/lib/site-suburbs";
import { fetchMarketListings } from "@/lib/supabase/fetch-market-listings";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/browser-client";
import { marketSuburbToSlug } from "@/lib/suburb-slug";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MarketFeedProps = {
  area: MarketSuburb;
  locale: Locale;
  t: SiteCopy;
};

export function MarketFeed({ area, locale, t }: MarketFeedProps) {
  const mockProducts = useMemo(
    () => createMockMarketProducts(locale, t.marketDemoSeller, t.marketKmShort),
    [locale, t.marketDemoSeller, t.marketKmShort],
  );

  const configured = isSupabaseBrowserConfigured();
  const [remote, setRemote] = useState<MarketProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const displayProducts = remote ?? [];
  /** Avoids a slower CBD request overwriting results after `area` updates (e.g. URL → Southbank). */
  const fetchGenerationRef = useRef(0);

  const runFetch = useCallback(async () => {
    if (!isSupabaseBrowserConfigured()) {
      return;
    }
    const gen = ++fetchGenerationRef.current;
    setLoading(true);
    setFetchFailed(false);
    setRemote(null);
    try {
      const client = getSupabaseBrowserClient();
      const { products, errorMessage: err } = await fetchMarketListings(client, {
        marketSuburb: area,
        suburbSlug: marketSuburbToSlug(area),
        suburbLabel: area,
        locale,
        sellerFallback: t.marketDemoSeller,
        kmSuffix: t.marketKmShort,
      });
      if (gen !== fetchGenerationRef.current) {
        return;
      }
      if (err) {
        console.error("[PopOut Market] Listings request failed:", err);
        setFetchFailed(true);
        setRemote([]);
      } else {
        setRemote(products);
      }
    } catch (e) {
      if (gen !== fetchGenerationRef.current) {
        return;
      }
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[PopOut Market] Listings request failed:", msg);
      setFetchFailed(true);
      setRemote([]);
    } finally {
      if (gen === fetchGenerationRef.current) {
        setLoading(false);
      }
    }
  }, [area, locale, t.marketDemoSeller, t.marketKmShort]);

  useEffect(() => {
    if (!configured) {
      setRemote(null);
      setFetchFailed(false);
      setLoading(false);
      return;
    }
    void runFetch();
  }, [configured, runFetch]);

  const retry = useCallback(() => {
    void runFetch();
  }, [runFetch]);

  if (!configured) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-3">
        <div className="mb-3 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-2.5 text-left text-xs text-amber-950 sm:text-sm">
          <p className="font-semibold">{t.marketSupabaseNotConfiguredTitle}</p>
          <p className="mt-1 text-amber-900/90">{t.marketSupabaseNotConfiguredBody}</p>
        </div>
        <ul
          className="grid w-full list-none auto-rows-fr gap-3 p-0 [grid-template-columns:repeat(auto-fill,minmax(min(100%,10.25rem),1fr))] sm:gap-3.5 lg:[grid-template-columns:repeat(auto-fill,minmax(min(100%,12.3rem),1fr))]"
          aria-label={t.marketFeedListAria}
        >
          {mockProducts.map((product) => (
            <li key={product.id} className="min-w-0">
              <MarketProductCard
                product={product}
                regionLabel={area}
                href={`/market/p/${encodeURIComponent(product.id)}?area=${encodeURIComponent(area)}`}
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

  if (loading && remote === null) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-16">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700"
          role="status"
          aria-label={t.marketSupabaseLoadingAria}
        />
      </div>
    );
  }

  if (fetchFailed) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-2 py-8 text-center">
        <p className="max-w-md text-sm text-gray-700">{t.marketSupabaseLoadError}</p>
        <button
          type="button"
          onClick={retry}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
        >
          {t.marketSupabaseRetry}
        </button>
      </div>
    );
  }

  if (remote !== null && remote.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-2 py-8 text-center">
        <p className="max-w-md text-sm text-gray-600">{t.marketSupabaseEmpty}</p>
        <button
          type="button"
          onClick={retry}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
        >
          {t.marketSupabaseRetry}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-3">
      <ul
        className="grid w-full list-none auto-rows-fr gap-3 p-0 [grid-template-columns:repeat(auto-fill,minmax(min(100%,10.25rem),1fr))] sm:gap-3.5 lg:[grid-template-columns:repeat(auto-fill,minmax(min(100%,12.3rem),1fr))]"
        aria-label={t.marketFeedListAria}
      >
        {displayProducts.map((product) => (
          <li key={product.id} className="min-w-0">
            <MarketProductCard
              product={product}
              regionLabel={area}
              href={`/market/p/${encodeURIComponent(product.id)}?area=${encodeURIComponent(area)}`}
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
