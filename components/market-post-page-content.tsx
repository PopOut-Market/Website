"use client";

import { MarketPostDetailView } from "@/components/market-post-detail-view";
import { useSiteShell } from "@/components/site-chrome-context";
import { createMockMarketProducts } from "@/lib/market-mock";
import type { MarketPostDetail } from "@/lib/market-post-detail";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import type { Locale, SiteCopy } from "@/lib/site-i18n";
import { DEFAULT_MARKET_SUBURB } from "@/lib/site-suburbs";
import { fetchMarketPostDetail } from "@/lib/supabase/fetch-market-post-detail";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/browser-client";
import { isMarketSuburb, type MarketSuburb } from "@/lib/site-suburbs";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

function demoDetailFromPostId(postId: string, locale: Locale, t: SiteCopy): MarketPostDetail | null {
  const m = /^demo-(\d+)$/.exec(postId.trim());
  if (!m) return null;
  const index = Number(m[1]) - 1;
  const list = createMockMarketProducts(locale, t.marketDemoSeller, t.marketKmShort);
  const p = list[index];
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    priceLabel: p.priceLabel,
    sellerLabel: p.sellerLabel,
    sellerAvatarUrl: null,
    sellerVerifiedSuburbLabel: DEFAULT_MARKET_SUBURB,
    sellerVerifiedAtLabel: null,
    distanceLabel: p.distanceLabel,
    meetupPoint: null,
    imageUrl: p.imageUrl,
    photoUrls: p.imageUrl ? [p.imageUrl] : [],
    isNew: p.isNew,
    areaLabel: DEFAULT_MARKET_SUBURB,
    listedAtLabel: null,
    description: null,
    meetupLabel: null,
    categoryLabel: null,
    statusLabel: "active",
    deliveryLabel: "yes",
    offerLabel: "yes",
    otherItems: [],
  };
}

export function MarketPostPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawPostId = params.postId;
  const postId = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;
  const safePostId = typeof postId === "string" ? postId : "";
  const areaParam = searchParams.get("area");
  const selectedArea: MarketSuburb | null = areaParam && isMarketSuburb(areaParam) ? areaParam : null;
  const backHref = selectedArea ? `/market?area=${encodeURIComponent(selectedArea)}` : "/market";

  const { locale, t } = useSiteShell();
  const configured = isSupabaseBrowserConfigured();

  const [detail, setDetail] = useState<MarketPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  const load = useCallback(async () => {
    if (!safePostId) {
      setDetail(null);
      setLoading(false);
      setFetchFailed(false);
      return;
    }
    if (!configured) {
      setLoading(false);
      setFetchFailed(false);
      setDetail(demoDetailFromPostId(safePostId, locale, t));
      return;
    }

    setLoading(true);
    setFetchFailed(false);
    try {
      const client = getSupabaseBrowserClient();
      const { detail: d, errorMessage: err } = await fetchMarketPostDetail(client, {
        postId: safePostId,
        locale,
        sellerFallback: t.marketDemoSeller,
        kmSuffix: t.marketKmShort,
      });
      if (err) {
        console.error("[PopOut Market] Post detail failed:", err);
        setFetchFailed(true);
        setDetail(null);
      } else {
        setDetail(d);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[PopOut Market] Post detail failed:", msg);
      setFetchFailed(true);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [configured, locale, safePostId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const detailCopy = useMemo(
    () => ({
      marketPostBack: t.marketPostBack,
      marketPostBackAria: t.marketPostBackAria,
      marketPostListedLabel: t.marketPostListedLabel,
      marketPostAreaLabel: t.marketPostAreaLabel,
      marketPostDeliverableBadge: t.marketPostDeliverableBadge,
      marketPostFixedPriceLabel: t.marketPostFixedPriceLabel,
      marketPostDescriptionHeading: t.marketPostDescriptionHeading,
      marketPostPreferredMeetupLabel: t.marketPostPreferredMeetupLabel,
      marketPostOtherItemsHeading: t.marketPostOtherItemsHeading,
      marketPostSellerVerifiedLabel: t.marketPostSellerVerifiedLabel,
      marketUnknown: t.marketUnknown,
      marketPostNoImageAria: t.marketPostNoImageAria,
      marketBadgeNew: t.marketBadgeNew,
    }),
    [t],
  );

  if (!safePostId) {
    return (
      <section className={`${SHELL_X} flex min-h-0 flex-1 flex-col py-8`}>
        <div className={`${INNER_MAX} flex min-h-0 flex-1 flex-col items-center justify-center gap-3 text-center`}>
          <p className="max-w-md text-sm text-gray-700">{t.marketPostNotFoundBody}</p>
          <Link
            href={backHref}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            {t.marketPostBack}
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={`${SHELL_X} flex min-h-0 flex-1 flex-col py-16`}>
        <div className={`${INNER_MAX} flex min-h-0 flex-1 flex-col items-center justify-center`}>
          <div
            className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700"
            role="status"
            aria-label={t.marketPostDetailLoadingAria}
          />
        </div>
      </section>
    );
  }

  if (fetchFailed) {
    return (
      <section className={`${SHELL_X} flex min-h-0 flex-1 flex-col py-8`}>
        <div className={`${INNER_MAX} flex min-h-0 flex-1 flex-col items-center justify-center gap-3 text-center`}>
          <p className="max-w-md text-sm text-gray-700">{t.marketSupabaseLoadError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            {t.marketSupabaseRetry}
          </button>
        </div>
      </section>
    );
  }

  if (!detail) {
    return (
      <section className={`${SHELL_X} flex min-h-0 flex-1 flex-col py-8`}>
        <div className={`${INNER_MAX} flex min-h-0 flex-1 flex-col items-center justify-center gap-3 text-center`}>
          <h1 className="text-lg font-semibold text-gray-900">{t.marketPostNotFoundTitle}</h1>
          <p className="max-w-md text-sm text-gray-600">{t.marketPostNotFoundBody}</p>
          <Link
            href={backHref}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            {t.marketPostBack}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`${SHELL_X} flex min-h-0 flex-1 flex-col`}>
      <div className={`${INNER_MAX} flex min-h-0 flex-1 flex-col`}>
        <MarketPostDetailView detail={detail} copy={detailCopy} backHref={backHref} />
      </div>
    </section>
  );
}
