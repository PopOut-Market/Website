"use client";

import Image from "next/image";
import Link from "next/link";
import type { MarketProduct } from "@/lib/market-product";

type MarketProductCardCopy = {
  postNoImageAria: string;
  badgeNew: string;
};

type MarketProductCardProps = {
  product: MarketProduct;
  regionLabel: string;
  copy: MarketProductCardCopy;
  /** When set, the whole card links to the listing detail page. */
  href?: string;
};

const CARD_CLASS =
  "flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm transition hover:border-gray-300 hover:shadow-md";

export function MarketProductCard({ product, regionLabel, copy, href }: MarketProductCardProps) {
  const inner = (
    <>
      <div
        className="relative aspect-square w-full bg-gradient-to-b from-gray-100 to-gray-200/90"
        aria-label={product.imageUrl ? undefined : copy.postNoImageAria}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 45vw, 240px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-400">
            —
          </div>
        )}
        {product.isNew ? (
          <div className="absolute left-2 top-2 z-[1] rounded-md bg-[#FF0048] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {copy.badgeNew}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-3.5">
        <h2 className="line-clamp-2 min-h-[3rem] text-left text-[0.95rem] font-semibold leading-snug text-gray-900 sm:text-base">
          {product.title}
        </h2>
        <div className="mt-auto flex items-baseline justify-between gap-2">
          <span className="truncate text-lg font-extrabold tabular-nums text-gray-900">
            {product.priceLabel}
          </span>
          <span
            className="max-w-[45%] shrink-0 truncate text-right text-sm text-gray-600"
            title={product.distanceLabel}
          >
            {product.distanceLabel}
          </span>
        </div>
        <p className="truncate text-sm text-gray-500">{product.sellerLabel}</p>
        <p className="truncate text-xs text-gray-400">{regionLabel}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${CARD_CLASS} block text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
      >
        {inner}
      </Link>
    );
  }

  return <article className={CARD_CLASS}>{inner}</article>;
}
