"use client";

import Image from "next/image";
import Link from "next/link";
import { MARKET_POST_DETAIL_OTHER_ITEMS_MAX, type MarketPostDetail } from "@/lib/market-post-detail";
import { POPOUT_BRAND_GRADIENT_TEXT_CLASS } from "@/lib/site-config";
import { useEffect, useMemo, useState } from "react";

type MarketPostDetailViewCopy = {
  marketPostBack: string;
  marketPostBackAria: string;
  marketPostListedLabel: string;
  marketPostAreaLabel: string;
  marketPostDistanceLabel: string;
  marketPostDeliverableBadge: string;
  marketPostFixedPriceLabel: string;
  marketPostDescriptionHeading: string;
  marketPostPreferredMeetupLabel: string;
  marketPostOtherItemsHeading: string;
  marketPostSellerVerifiedLabel: string;
  marketUnknown: string;
  marketPostNoImageAria: string;
  marketBadgeNew: string;
};

type MarketPostDetailViewProps = {
  detail: MarketPostDetail;
  distanceLabel: string;
  copy: MarketPostDetailViewCopy;
};

export function MarketPostDetailView({ detail, distanceLabel, copy }: MarketPostDetailViewProps) {
  const desc = detail.description?.trim() ?? "";
  const [activePhoto, setActivePhoto] = useState(0);

  const photos = detail.photoUrls.length > 0 ? detail.photoUrls : detail.imageUrl ? [detail.imageUrl] : [];
  const mainPhoto = photos[activePhoto] ?? detail.imageUrl;
  const mapImageUrl = useMemo(() => {
    const p = detail.meetupPoint;
    if (!p) {
      return null;
    }
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${p.lat},${p.lng}&zoom=14&size=900x460&markers=${p.lat},${p.lng},lightred1`;
  }, [detail.meetupPoint]);

  useEffect(() => {
    setActivePhoto(0);
  }, [detail.id]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 pb-5">
      <div className="flex shrink-0 justify-start pt-1">
        <Link
          href="/market"
          className="inline-flex h-9 max-w-full items-center gap-1.5 rounded-[11px] border border-gray-200 bg-white/90 px-3 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-xl transition hover:border-gray-300 hover:bg-white"
          aria-label={copy.marketPostBackAria}
        >
          <svg
            className="h-4 w-4 shrink-0 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.08 1.04l-4.25-4a.75.75 0 0 1 0-1.08l4.25-4a.75.75 0 0 1 1.06.02Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="truncate">{copy.marketPostBack}</span>
        </Link>
      </div>

      <article className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm">
        <div
          className="relative aspect-square w-full max-w-lg shrink-0 self-center bg-gradient-to-b from-gray-100 to-gray-200/90 sm:max-w-2xl"
          aria-label={mainPhoto ? undefined : copy.marketPostNoImageAria}
        >
          {mainPhoto ? (
            <Image
              src={mainPhoto}
              alt={detail.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 34rem"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-400">
              —
            </div>
          )}
          {detail.isNew ? (
            <div className="absolute left-3 top-3 z-[1] rounded-md bg-[#FF0048] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {copy.marketBadgeNew}
            </div>
          ) : null}
        </div>

        {photos.length > 1 ? (
          <div className="mx-auto mt-2 flex w-full max-w-2xl gap-2 overflow-x-auto px-4 pb-1">
            {photos.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => setActivePhoto(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${
                  i === activePhoto ? "border-pink-500" : "border-gray-200"
                }`}
              >
                <Image src={url} alt={`${detail.title} ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {detail.sellerAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={detail.sellerAvatarUrl}
                      alt={detail.sellerLabel}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                      {detail.sellerLabel.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-gray-900">{detail.sellerLabel}</p>
                  {detail.sellerVerifiedSuburbLabel || detail.sellerVerifiedAtLabel ? (
                    <p className="truncate text-sm text-gray-500">
                      {copy.marketPostSellerVerifiedLabel}{" "}
                      {detail.sellerVerifiedSuburbLabel ?? copy.marketUnknown}
                      {detail.sellerVerifiedAtLabel ? ` · ${detail.sellerVerifiedAtLabel}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>
              <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08-.01Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </section>

          <div className="flex flex-col gap-2 border-b border-gray-100 pb-5">
            <h1 className="text-balance text-left text-2xl font-semibold leading-snug text-gray-900 sm:text-3xl">
              {detail.title}
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p
                className={`text-3xl font-extrabold tabular-nums sm:text-4xl ${POPOUT_BRAND_GRADIENT_TEXT_CLASS}`}
              >
                {detail.priceLabel}
              </p>
              {detail.offerLabel === "no" ? (
                <span className="text-base font-semibold text-gray-700 sm:text-lg">
                  {copy.marketPostFixedPriceLabel}
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                {detail.statusLabel}
              </span>
              {detail.deliveryLabel === "yes" ? (
                <span className="rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                  {copy.marketPostDeliverableBadge}
                </span>
              ) : null}
            </div>
          </div>

          <dl className="grid gap-3 text-sm text-gray-700 sm:grid-cols-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-50 py-2">
              <dt className="font-medium text-gray-500">{copy.marketPostDistanceLabel}</dt>
              <dd className="text-right font-semibold tabular-nums text-gray-900">{distanceLabel}</dd>
            </div>
            {detail.areaLabel ? (
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-50 py-2">
                <dt className="font-medium text-gray-500">{copy.marketPostAreaLabel}</dt>
                <dd className="text-right font-semibold text-gray-900">{detail.areaLabel}</dd>
              </div>
            ) : null}
            {detail.listedAtLabel ? (
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-50 py-2">
                <dt className="font-medium text-gray-500">{copy.marketPostListedLabel}</dt>
                <dd className="text-right text-gray-900">{detail.listedAtLabel}</dd>
              </div>
            ) : null}
          </dl>

          {desc.length > 0 ? (
            <section className="border-t border-gray-100 pt-4">
              <h2 className="text-sm font-semibold text-gray-900">{copy.marketPostDescriptionHeading}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{desc}</p>
            </section>
          ) : null}

          <section className="border-t border-gray-100 pt-4">
            <h2 className="text-sm font-semibold text-gray-900">{copy.marketPostPreferredMeetupLabel}</h2>
            <p className="mt-1 text-sm text-gray-600">{detail.meetupLabel ?? copy.marketUnknown}</p>
            {mapImageUrl ? (
              <div className="relative mt-3 h-48 w-full overflow-hidden rounded-xl border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mapImageUrl} alt={detail.meetupLabel ?? "map"} className="h-full w-full object-cover" />
              </div>
            ) : null}
          </section>

          {detail.otherItems.length > 0 ? (
            <section className="border-t border-gray-100 pt-4">
              <h2 className="text-xl font-semibold text-gray-900">{copy.marketPostOtherItemsHeading}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {detail.otherItems.slice(0, MARKET_POST_DETAIL_OTHER_ITEMS_MAX).map((item) => (
                  <Link
                    key={item.id}
                    href={`/market/p/${encodeURIComponent(item.id)}`}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm"
                  >
                    <div className="relative aspect-square w-full bg-gray-100">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="220px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">—</div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="line-clamp-2 text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className={`mt-1 text-sm font-extrabold ${POPOUT_BRAND_GRADIENT_TEXT_CLASS}`}>
                        {item.priceLabel}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </div>
  );
}
