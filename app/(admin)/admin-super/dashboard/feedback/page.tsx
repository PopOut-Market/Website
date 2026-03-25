"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { useEffect, useState } from "react";

type FeedbackRow = {
  id: string;
  user_id: string | null;
  content: string | null;
  image_urls: string[] | null;
  created_at: string;
  nickname: string;
  avatar_url: string | null;
};

export default function FeedbackPage() {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [withImagesCount, setWithImagesCount] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await fetch("/api/admin/feedback", { cache: "no-store" });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const json = await res.json();

        setTotalCount(json.total ?? 0);
        setTodayCount(json.today ?? 0);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: FeedbackRow[] = (json.rows ?? []).map((d: any) => {
          const prof = Array.isArray(d.profiles) ? d.profiles[0] : d.profiles;
          return {
            id: d.id,
            user_id: d.user_id ?? null,
            content: d.content,
            image_urls: d.image_urls,
            created_at: d.created_at,
            nickname: prof?.nickname ?? "Unknown",
            avatar_url: prof?.avatar_url ?? null,
          };
        });

        setRows(mapped);
        setWithImagesCount(mapped.filter((r) => r.image_urls && r.image_urls.length > 0).length);
      } catch {
        /* network error — leave empty */
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = search
    ? rows.filter((r) => r.content?.toLowerCase().includes(search.toLowerCase()) || r.nickname.toLowerCase().includes(search.toLowerCase()))
    : rows;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">User Feedback</h1>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Total Feedback" total={totalCount} loading={loading} />
        <KpiCard label="Today" total={todayCount} loading={loading} />
        <KpiCard label="With Images" total={withImagesCount} loading={loading} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 text-4xl">💬</div>
            <p className="text-sm text-slate-600">No feedback found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((row) => (
              <div key={row.id} className="flex gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={row.avatar_url ?? ""}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full bg-slate-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{row.nickname}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(row.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-700">{row.content ?? "(no text)"}</p>
                  {row.image_urls && row.image_urls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {row.image_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt=""
                            className="h-16 w-16 rounded-lg border border-slate-200 object-cover transition hover:opacity-80"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
