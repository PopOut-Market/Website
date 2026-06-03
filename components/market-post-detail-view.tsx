"use client";

import { BackNavLink } from "@/components/back-nav-link";
import Image from "next/image";
import Link from "next/link";
import { MARKET_POST_DETAIL_OTHER_ITEMS_MAX, type MarketPostDetail } from "@/lib/market-post-detail";
import { PRIMARY_BUTTON_CLASS } from "@/lib/site-config";
import { useEffect, useMemo, useState } from "react";

type MarketPostDetailViewCopy = {
  marketPostBack: string;
  marketPostBackAria: string;
  marketPostListedLabel: string;
  marketPostAreaLabel: string;
  marketPostDeliverableBadge: string;
  marketPostFixedPriceLabel: string;
  marketPostDescriptionHeading: string;
  marketPostPreferredMeetupLabel: string;
  marketPostOtherItemsHeading: string;
  marketPostSellerVerifiedLabel: string;
  marketUnknown: string;
  marketPostNoImageAria: string;
  marketBadgeNew: string;
  marketPostMeetupMapAlt: string;
  downloadCta: string;
};

type MarketPostDetailViewProps = {
  detail: MarketPostDetail;
  copy: MarketPostDetailViewCopy;
  backHref: string;
};

export function MarketPostDetailView({ detail, copy, backHref }: MarketPostDetailViewProps) {
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
        <BackNavLink href={backHref} aria-label={copy.marketPostBackAria}>
          {copy.marketPostBack}
        </BackNavLink>
      </div>

      <article className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
        <div
          className="relative aspect-square w-full max-w-lg shrink-0 self-center bg-surface-raised sm:max-w-2xl"
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
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-black/30">
              —
            </div>
          )}
          {detail.isNew ? (
            <div className="absolute left-3 top-3 z-[1] rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
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
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border ${
                  i === activePhoto ? "border-brand-500" : "border-black/10"
                }`}
              >
                <Image src={url} alt={`${detail.title} ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <section className="rounded-2xl border border-black/5 bg-surface-raised p-4">
            <div className="flex items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white">
                  {detail.sellerAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={detail.sellerAvatarUrl}
                      alt={detail.sellerLabel}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-black/40">
                      {detail.sellerLabel.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-black">{detail.sellerLabel}</p>
                  {detail.sellerVerifiedSuburbLabel || detail.sellerVerifiedAtLabel ? (
                    <p className="truncate text-sm text-black/55">
                      {copy.marketPostSellerVerifiedLabel}{" "}
                      {detail.sellerVerifiedSuburbLabel ?? copy.marketUnknown}
                      {detail.sellerVerifiedAtLabel ? ` · ${detail.sellerVerifiedAtLabel}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-2 border-b border-black/5 pb-5">
            <h1 className="text-balance text-left text-2xl font-semibold leading-snug text-black sm:text-3xl">
              {detail.title}
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-3xl font-bold tabular-nums text-black sm:text-4xl">
                {detail.priceLabel}
              </p>
              {detail.offerLabel === "no" ? (
                <span className="rounded-full border border-black/10 bg-surface-raised px-2.5 py-1 text-xs font-semibold text-black/55 sm:text-sm">
                  {copy.marketPostFixedPriceLabel}
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                {detail.statusLabel}
              </span>
              {detail.deliveryLabel === "yes" ? (
                <span className="rounded-full bg-brand-tint px-2.5 py-1 text-xs font-semibold text-brand-700">
                  {copy.marketPostDeliverableBadge}
                </span>
              ) : null}
            </div>
            <Link
              href="#download"
              className={`${PRIMARY_BUTTON_CLASS} mt-3 h-11 w-full px-5 text-sm sm:w-auto`}
            >
              {copy.downloadCta}
            </Link>
          </div>

          <dl className="grid gap-3 text-sm text-black/70 sm:grid-cols-1">
            {detail.areaLabel ? (
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/5 py-2">
                <dt className="font-medium text-black/55">{copy.marketPostAreaLabel}</dt>
                <dd className="text-right font-semibold text-black">{detail.areaLabel}</dd>
              </div>
            ) : null}
            {detail.listedAtLabel ? (
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/5 py-2">
                <dt className="font-medium text-black/55">{copy.marketPostListedLabel}</dt>
                <dd className="text-right text-black">{detail.listedAtLabel}</dd>
              </div>
            ) : null}
          </dl>

          {desc.length > 0 ? (
            <section className="border-t border-black/5 pt-4">
              <h2 className="text-sm font-semibold text-black">{copy.marketPostDescriptionHeading}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-black/70">{desc}</p>
            </section>
          ) : null}

          <section className="border-t border-black/5 pt-4">
            <h2 className="text-sm font-semibold text-black">{copy.marketPostPreferredMeetupLabel}</h2>
            <p className="mt-1 text-sm text-black/55">{detail.meetupLabel ?? copy.marketUnknown}</p>
            {mapImageUrl ? (
              <div className="relative mt-3 h-48 w-full overflow-hidden rounded-xl border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mapImageUrl} alt={detail.meetupLabel ?? copy.marketPostMeetupMapAlt} className="h-full w-full object-cover" />
              </div>
            ) : null}
          </section>

          {detail.otherItems.length > 0 ? (
            <section className="border-t border-black/5 pt-4">
              <h2 className="text-xl font-semibold text-black">{copy.marketPostOtherItemsHeading}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {detail.otherItems.slice(0, MARKET_POST_DETAIL_OTHER_ITEMS_MAX).map((item) => (
                  <Link
                    key={item.id}
                    href={`/market/p/${encodeURIComponent(item.id)}`}
                    className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-colors hover:border-brand-500"
                  >
                    <div className="relative aspect-square w-full bg-surface-raised">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="220px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-black/30">—</div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="line-clamp-2 text-sm font-semibold text-black">{item.title}</p>
                      <p className="mt-1 text-sm font-bold tabular-nums text-black">
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
