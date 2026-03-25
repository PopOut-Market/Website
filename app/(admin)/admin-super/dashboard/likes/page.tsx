"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
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
  const [catData, setCatData] = useState<{ name: string; likes: number }[]>([]);
  const [trendData, setTrendData] = useState<{ date: string; likes: number }[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [topPostsAll, setTopPostsAll] = useState<TopPost[] | null>(null);
  const [topPostsMonth, setTopPostsMonth] = useState<TopPost[] | null>(null);
  const [topRange, setTopRange] = useState<"all" | "month">("all");
  const [loading, setLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(false);

  useEffect(() => {
    if (!isAdminAuthConfigured()) return;
    const sb = getAdminAuthBrowserClient();

    async function load() {
      setLoading(true);

      const todayISO = new Date();
      todayISO.setHours(0, 0, 0, 0);
      const cutoff30 = new Date();
      cutoff30.setDate(cutoff30.getDate() - 30);

      const [{ data: interests }, { data: categories }, { data: posts }] = await Promise.all([
        sb.from("post_interests").select("created_at").gte("created_at", cutoff30.toISOString()),
        sb.from("categories").select("id, slug").eq("is_active", true),
        sb.from("posts")
          .select("id, raw_title, category_id, price_cents, interest_count, created_at")
          .order("interest_count", { ascending: false }),
      ]);

      const catMap = new Map<number, string>();
      categories?.forEach((c: { id: number; slug: string }) => catMap.set(c.id, c.slug));

      const safePosts =
        posts?.map((p: { id: number; raw_title: string | null; category_id: number; price_cents: number | null; interest_count: number | null; created_at: string }) => ({
          ...p,
          raw_title: p.raw_title ?? "",
          price_cents: p.price_cents ?? 0,
          interest_count: p.interest_count ?? 0,
        })) ?? [];

      // Use a single source of truth: posts.interest_count
      const totalLikesFromPosts = safePosts.reduce((sum, p) => sum + p.interest_count, 0);
      setTotalLikes(totalLikesFromPosts);
      setAvgPerPost(safePosts.length > 0 ? (totalLikesFromPosts / safePosts.length).toFixed(1) : "0");

      // "Today likes": prefer real event count if accessible; otherwise fall back to 0.
      const todayFromEvents =
        interests?.filter((r: { created_at: string }) => r.created_at >= todayISO.toISOString()).length ?? 0;
      setTodayLikes(todayFromEvents);

      const catLikes: Record<string, number> = {};
      safePosts.forEach((p) => {
        const cat = catMap.get(p.category_id) ?? "unknown";
        catLikes[cat] = (catLikes[cat] ?? 0) + p.interest_count;
      });
      const catLikesSorted = Object.entries(catLikes)
        .map(([name, likes]) => ({ name, likes }))
        .sort((a, b) => b.likes - a.likes);
      setCatData(catLikesSorted);

      // Daily trend
      const buckets: Record<string, number> = {};
      for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        buckets[d.toISOString().slice(0, 10)] = 0;
      }
      if (interests && interests.length > 0) {
        interests.forEach((r: { created_at: string }) => {
          const k = r.created_at.slice(0, 10);
          if (buckets[k] !== undefined) buckets[k]++;
        });
      } else {
        // Fallback when post_interests is not visible because of RLS:
        // distribute by post created day using interest_count so chart is not blank.
        safePosts.forEach((p) => {
          const k = p.created_at.slice(0, 10);
          if (buckets[k] !== undefined) buckets[k] += p.interest_count;
        });
      }
      setTrendData(Object.entries(buckets).map(([date, likes]) => ({ date: date.slice(5), likes })));

      setLoading(false);
    }

    load();
  }, []);

  const fetchTopLiked = useCallback(async (period: "all" | "month") => {
    const cache = period === "all" ? topPostsAll : topPostsMonth;
    if (cache !== null) return;
    setTopLoading(true);
    try {
      const res = await fetch(`/api/admin/top-liked?period=${period}`, { cache: "no-store" });
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
  }, [topPostsAll, topPostsMonth]);

  useEffect(() => {
    fetchTopLiked(topRange);
  }, [topRange, fetchTopLiked]);

  const displayedTopPosts = topRange === "month" ? (topPostsMonth ?? []) : (topPostsAll ?? topPosts);
  const topTableLoading = topLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Likes / Interest Analytics</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Likes" total={totalLikes} loading={loading} />
        <KpiCard label="Today Likes" total={todayLikes} loading={loading} />
        <KpiCard label="Avg per Post" total={avgPerPost} loading={loading} />
        <KpiCard label="Top Post Likes" total={topPosts[0]?.likes ?? 0} loading={loading} />
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
