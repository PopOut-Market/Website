"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

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
      setTopPosts(
        safePosts
          .map((p) => ({
            id: p.id,
            title: p.raw_title.trim() || `Post #${p.id}`,
            category: catMap.get(p.category_id) ?? "unknown",
            priceCents: p.price_cents,
            likes: p.interest_count,
          }))
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 10),
      );

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
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Top Liked Posts</h2>
        {loading ? (
          <div className="h-40 animate-pulse rounded bg-slate-100" />
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
                {topPosts.map((p, i) => (
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
