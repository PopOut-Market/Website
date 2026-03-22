"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PostCard } from "@/components/PostCard";
import {
  FILTER_OPTIONS,
  SuburbFilterBar,
} from "@/components/SuburbFilterBar";
import type { FeedFilter, PostListItem, SuburbItem } from "@/types/post";

type PostsResponse = {
  items: PostListItem[];
  page: number;
  limit: number;
  hasMore: boolean;
};

const DEFAULT_LIMIT = 20;

export default function HomePage() {
  const [suburbs, setSuburbs] = useState<SuburbItem[]>([]);
  const [suburbId, setSuburbId] = useState<string>("");
  const [filter, setFilter] = useState<FeedFilter>("for_you");
  const [items, setItems] = useState<PostListItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSuburbs() {
      try {
        const res = await fetch("/api/suburbs", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load suburbs");
        const json = (await res.json()) as { items: SuburbItem[] };

        if (!cancelled) {
          setSuburbs(json.items ?? []);
          if (json.items?.length) {
            setSuburbId(String(json.items[0].id));
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load suburbs");
          setLoadingInitial(false);
        }
      }
    }

    loadSuburbs();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedFilter = useMemo(() => {
    if (FILTER_OPTIONS.some((f) => f.value === filter)) return filter;
    return "for_you" as FeedFilter;
  }, [filter]);

  async function fetchPosts(nextPage: number, append: boolean) {
    if (!suburbId) return;

    if (append) setLoadingMore(true);
    else setLoadingInitial(true);

    setError(null);

    try {
      const query = new URLSearchParams({
        suburbId,
        locale: "en",
        filter: selectedFilter,
        page: String(nextPage),
        limit: String(DEFAULT_LIMIT),
      });

      const res = await fetch(`/api/posts?${query.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "Failed to load posts");
      }

      const json = (await res.json()) as PostsResponse;
      setItems((prev) => (append ? [...prev, ...json.items] : json.items));
      setPage(json.page);
      setHasMore(Boolean(json.hasMore));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (!suburbId) return;
    setItems([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suburbId, selectedFilter]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        if (!hasMore || loadingInitial || loadingMore || !suburbId) return;
        fetchPosts(page + 1, true);
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingInitial, loadingMore, page, suburbId]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <SuburbFilterBar
        suburbs={suburbs}
        suburbId={suburbId}
        onSuburbChange={setSuburbId}
        filter={selectedFilter}
        onFilterChange={setFilter}
      />

      {error ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => fetchPosts(0, false)}
            className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700"
          >
            Retry
          </button>
        </section>
      ) : null}

      {loadingInitial ? (
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="aspect-square animate-pulse bg-gray-200" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-2/5 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </section>
      ) : (
        <>
          {items.length === 0 && !error ? (
            <section className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-600">No posts available for this filter.</p>
            </section>
          ) : null}

          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <PostCard key={item.id} item={item} />
            ))}
          </section>

          <div ref={sentinelRef} className="h-8" aria-hidden />

          {loadingMore ? (
            <p className="pb-6 text-center text-sm text-gray-500">Loading more...</p>
          ) : null}
        </>
      )}

      <p className="mt-8 pb-3 text-center text-xs text-gray-500">
        Read-only browsing mode.
      </p>
      <p className="text-center text-xs text-gray-400">
        <Link href="/" className="underline">
          Home
        </Link>
      </p>
    </main>
  );
}
