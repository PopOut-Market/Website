"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import type { PostDetail } from "@/types/post";

type DetailResponse = { item: PostDetail };

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => String(params?.id ?? ""), [params]);
  const [item, setItem] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/posts/${id}?locale=en`, { cache: "no-store" });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || "Failed to load post detail");
        }

        const json = (await res.json()) as DetailResponse;
        if (!cancelled) {
          setItem(json.item);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load post detail");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 aspect-square animate-pulse rounded-xl bg-gray-200" />
        <div className="mt-4 h-7 w-3/4 animate-pulse rounded bg-gray-200" />
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <Link href="/" className="text-sm text-gray-600 underline">
          鈫?Back to Home
        </Link>
        <section className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Post not found"}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      <Link href="/" className="text-sm text-gray-600 underline">
        鈫?Back to Home
      </Link>

      <section className="mt-4 grid gap-5 md:grid-cols-2">
        <ImageGallery images={item.images} title={item.title} />

        <article className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
          <h1 className="text-xl font-semibold text-gray-900">{item.title}</h1>
          <p className="text-2xl font-bold text-gray-900">{item.priceLabel}</p>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Condition:</span>{" "}
              {item.condition}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Quantity:</span>{" "}
              {item.quantity}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Location:</span>{" "}
              {item.locationLabel}
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-sm font-semibold text-gray-900">Description</h2>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {item.description}
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
