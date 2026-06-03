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
  "flex min-w-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-[border-color,transform] duration-150 hover:border-black/25 hover:-translate-y-px motion-reduce:transform-none";

export function MarketProductCard({ product, regionLabel, copy, href }: MarketProductCardProps) {
  const inner = (
    <>
      <div
        className="relative aspect-square w-full bg-surface-raised"
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
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black/30">
            —
          </div>
        )}
        {product.isNew ? (
          <div className="absolute left-2 top-2 z-[1] rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {copy.badgeNew}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="line-clamp-2 min-h-[2.5rem] text-left text-[0.95rem] font-semibold leading-snug text-black sm:text-base">
          {product.title}
        </h2>
        <div className="mt-auto flex items-baseline justify-between gap-2">
          <span className="truncate text-lg font-bold tabular-nums text-black">
            {product.priceLabel}
          </span>
          <span className="shrink-0 truncate text-xs text-black/40">{regionLabel}</span>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${CARD_CLASS} block text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700`}
      >
        {inner}
      </Link>
    );
  }

  return <article className={CARD_CLASS}>{inner}</article>;
}
