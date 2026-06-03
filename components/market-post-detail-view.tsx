"use client";

import Image from "next/image";
import Link from "next/link";
import { SuburbBoundaryMap } from "@/components/suburb-boundary-map";
import { MARKET_POST_DETAIL_OTHER_ITEMS_MAX, type MarketPostDetail } from "@/lib/market-post-detail";
import { PRIMARY_BUTTON_CLASS } from "@/lib/site-config";
import { useEffect, useState } from "react";

/** Flat white card sitting on the grey listing canvas — mirrors the app's card stack. */
const CARD = "rounded-2xl bg-white shadow-card";

/** Small padlock shown in front of the fixed-price badge. */
function LockIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/** Lines icon for the Description heading. */
function DescriptionIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] text-black/45"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
  );
}

/** Map-pin icon for the meet-up heading. */
function PinIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] text-black/45"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

type MarketPostDetailViewCopy = {
  marketPostDeliverableBadge: string;
  marketPostFixedPriceLabel: string;
  marketPostDescriptionHeading: string;
  marketPostPreferredMeetupLabel: string;
  marketPostOtherItemsHeading: string;
  marketPostSellerVerifiedLabel: string;
  marketPostContactSellerCta: string;
  marketPostListedInOn: string;
  marketPostListedIn: string;
  marketPostListedOn: string;
  marketUnknown: string;
  marketPostNoImageAria: string;
  marketBadgeNew: string;
  marketPostMeetupMapAlt: string;
};

type MarketPostDetailViewProps = {
  detail: MarketPostDetail;
  copy: MarketPostDetailViewCopy;
};

export function MarketPostDetailView({ detail, copy }: MarketPostDetailViewProps) {
  const desc = detail.description?.trim() ?? "";

  // Single "listed in {suburb} on {date}" caption (date is already locale-formatted
  // upstream; suburb names stay as-is). Falls back gracefully if one side is missing.
  const area = detail.areaLabel?.trim() || null;
  const listedAt = detail.listedAtLabel?.trim() || null;
  const listedLine =
    area && listedAt
      ? copy.marketPostListedInOn.replace("{suburb}", area).replace("{date}", listedAt)
      : area
        ? copy.marketPostListedIn.replace("{suburb}", area)
        : listedAt
          ? copy.marketPostListedOn.replace("{date}", listedAt)
          : null;
  const [activePhoto, setActivePhoto] = useState(0);

  const photos = detail.photoUrls.length > 0 ? detail.photoUrls : detail.imageUrl ? [detail.imageUrl] : [];
  const mainPhoto = photos[activePhoto] ?? detail.imageUrl;

  // Meet-up map: pin the exact point when set, otherwise centre on the listing's suburb.
  const meetupPoint = detail.meetupPoint;
  const mapMarker: [number, number] | null = meetupPoint ? [meetupPoint.lat, meetupPoint.lng] : null;
  const mapCenter: [number, number] | null = meetupPoint
    ? [meetupPoint.lat, meetupPoint.lng]
    : detail.suburbCentroid
      ? [detail.suburbCentroid.lat, detail.suburbCentroid.lng]
      : null;
  const showMap = Boolean(meetupPoint || detail.suburbCentroid || (detail.suburbId ?? 0) > 0);

  useEffect(() => {
    setActivePhoto(0);
  }, [detail.id]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-8 pt-4">
      {/* Photo */}
      <div className={`${CARD} overflow-hidden`}>
        <div
          className="relative aspect-square w-full bg-surface-raised"
          aria-label={mainPhoto ? undefined : copy.marketPostNoImageAria}
        >
          {mainPhoto ? (
            <Image
              src={mainPhoto}
              alt={detail.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 42rem"
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
          <div className="flex gap-2 overflow-x-auto p-3">
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
      </div>

      {/* Seller */}
      <div className={`${CARD} flex items-center gap-3 px-4 py-3.5`}>
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-raised">
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
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-black">{detail.sellerLabel}</p>
          {detail.sellerVerifiedSuburbLabel ? (
            <p className="truncate text-sm text-black/55">
              {copy.marketPostSellerVerifiedLabel} {detail.sellerVerifiedSuburbLabel}
            </p>
          ) : null}
        </div>
      </div>

      {/* Title · price · CTA */}
      <div className={`${CARD} flex flex-col gap-3 p-5`}>
        <h1 className="text-balance text-left text-xl font-semibold leading-snug text-black sm:text-2xl">
          {detail.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="flex items-center gap-x-3">
            <p className="text-xl font-bold tabular-nums text-black sm:text-2xl">{detail.priceLabel}</p>
            {detail.offerLabel === "no" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-surface-raised px-2.5 py-1 text-xs font-semibold text-black/55 sm:text-sm">
                <LockIcon />
                {copy.marketPostFixedPriceLabel}
              </span>
            ) : null}
          </div>
          {listedLine ? <span className="text-sm text-black/55">{listedLine}</span> : null}
        </div>
        <Link
          href="#download"
          className={`${PRIMARY_BUTTON_CLASS} mt-1 w-full px-7 py-4 text-base sm:w-auto sm:text-lg`}
        >
          {copy.marketPostContactSellerCta}
        </Link>
      </div>

      {/* Description */}
      {desc.length > 0 ? (
        <div className={`${CARD} p-5`}>
          <h2 className="flex items-center gap-2 text-base font-semibold text-black">
            <DescriptionIcon />
            {copy.marketPostDescriptionHeading}
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-black/80 sm:text-lg">{desc}</p>
        </div>
      ) : null}

      {/* Where to meet up */}
      <div className={`${CARD} p-5`}>
        <h2 className="flex items-center gap-2 text-base font-semibold text-black">
          <PinIcon />
          {copy.marketPostPreferredMeetupLabel}
        </h2>
        <p className="mt-2 text-sm text-black/55">{detail.meetupLabel ?? copy.marketUnknown}</p>
        {showMap ? (
          <div className="relative mt-3 h-52 w-full overflow-hidden rounded-xl border border-black/10">
            <SuburbBoundaryMap
              suburbId={detail.suburbId ?? 0}
              center={mapCenter}
              marker={mapMarker}
              title={detail.meetupLabel ?? copy.marketPostMeetupMapAlt}
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : null}
      </div>

      {/* More from this seller */}
      {detail.otherItems.length > 0 ? (
        <div className={`${CARD} p-5`}>
          <h2 className="text-base font-semibold text-black">{copy.marketPostOtherItemsHeading}</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {detail.otherItems.slice(0, MARKET_POST_DETAIL_OTHER_ITEMS_MAX).map((item) => (
              <Link
                key={item.id}
                href={`/market/p/${encodeURIComponent(item.id)}`}
                className="block overflow-hidden rounded-2xl border border-black/5 bg-white text-inherit no-underline shadow-card transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-black/25 motion-reduce:transform-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
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
                  <p className="mt-1 text-sm font-bold tabular-nums text-black">{item.priceLabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
