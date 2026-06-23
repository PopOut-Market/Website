"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { useEffect, useState } from "react";

type FeedbackRow = {
  id: string;
  user_id: string | null;
  content: string | null;
  created_at: string;
  nickname: string;
  app_version: string | null;
  os_name: string | null;
  os_version: string | null;
  locale: string | null;
};

function initialOf(name: string) {
  return (name.trim()[0] ?? "?").toUpperCase();
}

export default function FeedbackPage() {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await adminApiFetch("/api/admin/feedback", { cache: "no-store" });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const json = await res.json();
        setTotalCount(json.total ?? 0);
        setTodayCount(json.today ?? 0);
        setRows((json.rows ?? []) as FeedbackRow[]);
      } catch {
        /* network error — leave empty */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = search
    ? rows.filter(
        (r) =>
          r.content?.toLowerCase().includes(search.toLowerCase()) ||
          r.nickname.toLowerCase().includes(search.toLowerCase()),
      )
    : rows;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">User Feedback</h1>

      <div className="grid grid-cols-2 gap-4">
        <KpiCard label="Total Feedback" total={totalCount} loading={loading} />
        <KpiCard label="Today" total={todayCount} loading={loading} />
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
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
                  {initialOf(row.nickname)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{row.nickname}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(row.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700">
                    {row.content ?? "(no text)"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                    {row.app_version && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5">v{row.app_version}</span>
                    )}
                    {row.os_name && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5">
                        {row.os_name}
                        {row.os_version ? ` ${row.os_version}` : ""}
                      </span>
                    )}
                    {row.locale && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5">{row.locale}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
