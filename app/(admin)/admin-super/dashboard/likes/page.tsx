"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TopPost = { id: number; title: string; category: string; priceCents: number; likes: number };

export default function LikesPage() {
  const [totalLikes, setTotalLikes] = useState(0);
  const [todayLikes, setTodayLikes] = useState(0);
  const [avgPerPost, setAvgPerPost] = useState("0");
  const [topPostLikes, setTopPostLikes] = useState(0);
  const [catData, setCatData] = useState<{ name: string; likes: number }[]>([]);
  const [trendData, setTrendData] = useState<{ date: string; likes: number }[]>([]);
  const [topPostsAll, setTopPostsAll] = useState<TopPost[] | null>(null);
  const [topPostsMonth, setTopPostsMonth] = useState<TopPost[] | null>(null);
  const [topRange, setTopRange] = useState<"all" | "month">("all");
  const [loading, setLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await adminApiFetch("/api/admin/likes", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setTotalLikes(json.total ?? 0);
          setTodayLikes(json.today ?? 0);
          setAvgPerPost(json.avgPerPost ?? "0");
          setTopPostLikes(json.topPostLikes ?? 0);
          setCatData(json.byCategory ?? []);
          setTrendData(json.trend ?? []);
        }
      } catch {
        /* network error — leave zeroed */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fetchTopLiked = useCallback(
    async (period: "all" | "month") => {
      const cache = period === "all" ? topPostsAll : topPostsMonth;
      if (cache !== null) return;
      setTopLoading(true);
      try {
        const res = await adminApiFetch(`/api/admin/top-liked?period=${period}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const { topPosts: tp } = await res.json();
          if (period === "all") setTopPostsAll(tp ?? []);
          else setTopPostsMonth(tp ?? []);
        } else {
          if (period === "all") setTopPostsAll([]);
          else setTopPostsMonth([]);
        }
      } catch {
        if (period === "all") setTopPostsAll([]);
        else setTopPostsMonth([]);
      } finally {
        setTopLoading(false);
      }
    },
    [topPostsAll, topPostsMonth],
  );

  useEffect(() => {
    fetchTopLiked(topRange);
  }, [topRange, fetchTopLiked]);

  const displayedTopPosts = topRange === "month" ? (topPostsMonth ?? []) : (topPostsAll ?? []);
  const topTableLoading = topLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Likes / Interest Analytics
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Likes" total={totalLikes} loading={loading} />
        <KpiCard label="Today Likes" total={todayLikes} loading={loading} />
        <KpiCard label="Avg per Post" total={avgPerPost} loading={loading} />
        <KpiCard label="Top Post Likes" total={topPostLikes} loading={loading} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Likes by Category</h2>
        {loading ? (
          <div className="h-56 animate-pulse rounded bg-slate-100" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={catData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="likes" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Daily Likes Trend (30d)</h2>
        {loading ? (
          <div className="h-56 animate-pulse rounded bg-slate-100" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="likes" stroke="#ef4444" fill="#fecaca" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Top Liked Posts</h2>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setTopRange("all")}
              className={`rounded-md px-3 py-1.5 transition ${topRange === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTopRange("month")}
              className={`rounded-md px-3 py-1.5 transition ${topRange === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
        {topTableLoading ? (
          <div className="h-40 animate-pulse rounded bg-slate-100" />
        ) : displayedTopPosts.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No liked posts in this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Post ID</th>
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Likes</th>
                </tr>
              </thead>
              <tbody>
                {displayedTopPosts.map((p, i) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-slate-500">{i + 1}</td>
                    <td className="py-2 pr-4 font-medium text-slate-800">{p.id}</td>
                    <td className="py-2 pr-4">{p.title}</td>
                    <td className="py-2 pr-4">{p.category}</td>
                    <td className="py-2 pr-4">${(p.priceCents / 100).toFixed(2)}</td>
                    <td className="py-2 pr-4 font-semibold text-rose-600">{p.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
