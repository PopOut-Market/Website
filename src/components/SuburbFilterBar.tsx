"use client";

import type { FeedFilter, SuburbItem } from "@/types/post";

export const FILTER_OPTIONS: { label: string; value: FeedFilter }[] = [
  { label: "For You", value: "for_you" },
  { label: "Free", value: "freebies" },
  { label: "Under $10", value: "under_10" },
  { label: "Electronics", value: "electronics" },
  { label: "Home & Kitchen", value: "home-kitchen" },
  { label: "Furniture", value: "furniture" },
  { label: "Fashion", value: "fashion" },
  { label: "Beauty", value: "beauty" },
  { label: "Books & Education", value: "books-education" },
  { label: "Sports & Outdoors", value: "sports-outdoors" },
  { label: "Mobility", value: "mobility" },
  { label: "Hobbies & Collectibles", value: "hobbies-collectibles" },
  { label: "Kids & Baby", value: "kids-baby" },
  { label: "Other", value: "other" },
];

type Props = {
  suburbs: SuburbItem[];
  suburbId: string;
  onSuburbChange: (id: string) => void;
  filter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
};

export function SuburbFilterBar({
  suburbs,
  suburbId,
  onSuburbChange,
  filter,
  onFilterChange,
}: Props) {
  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Suburb
        </label>
        <select
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400"
          value={suburbId}
          onChange={(event) => onSuburbChange(event.target.value)}
        >
          {suburbs.map((suburb) => (
            <option key={suburb.id} value={suburb.id}>
              {suburb.name}
            </option>
          ))}
        </select>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTER_OPTIONS.map((item) => {
          const active = item.value === filter;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onFilterChange(item.value)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
