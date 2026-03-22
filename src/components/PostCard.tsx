"use client";

import Link from "next/link";
import type { PostListItem } from "@/types/post";

type Props = {
  item: PostListItem;
};

export function PostCard({ item }: Props) {
  return (
    <Link
      href={`/post/${item.id}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-400"
    >
      <div className="aspect-square w-full bg-gray-100">
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-medium text-gray-900">
          {item.title}
        </h3>
        <p className="text-lg font-bold text-gray-900">{item.priceLabel}</p>
        <p className="text-xs text-gray-500">{item.distanceOrSuburb}</p>
      </div>
    </Link>
  );
}
