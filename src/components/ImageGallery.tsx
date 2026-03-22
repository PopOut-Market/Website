"use client";

import { useState } from "react";

type Props = {
  images: { url: string; sortOrder: number }[];
  title: string;
};

export function ImageGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = images[activeIndex] ?? images[0];

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-500">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={title}
          className="aspect-square w-full object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-lg border ${
                index === activeIndex ? "border-gray-900" : "border-gray-200"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={`${title} ${index + 1}`}
                className="h-16 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
