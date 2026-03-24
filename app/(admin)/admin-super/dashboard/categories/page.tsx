"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316", "#64748b", "#84cc16"];

type CatRow = {
  name: string;
  total: number;
  sold: number;
  sellRate: number;
  avgPrice: string;
};

export default function CategoriesPage() {
  const [rows, setRows] = useState<CatRow[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthConfigured()) return;
    const sb = getAdminAuthBrowserClient();

    async function load() {
      setLoading(true);

      const [{ data: categories }, { data: posts }] = await Promise.all([
        sb.from("categories").select("id, slug, sort_order").eq("is_active", true).order("sort_order"),
        sb.from("posts").select("category_id, status, price_cents"),
      ]);

      const catMap = new Map<number, string>();
      categories?.forEach((c: { id: number; slug: string }) => catMap.set(c.id, c.slug));

      const stats: Record<string, { total: number; sold: number; priceSum: number }> = {};

      posts?.forEach((p: { category_id: number; status: string; price_cents: number }) => {
        const name = catMap.get(p.category_id) ?? `cat-${p.category_id}`;
        if (!stats[name]) stats[name] = { total: 0, sold: 0, priceSum: 0 };
        stats[name].total++;
        if (p.status === "sold") stats[name].sold++;
        stats[name].priceSum += p.price_cents ?? 0;
      });

      const result: CatRow[] = Object.entries(stats)
        .map(([name, s]) => ({
          name,
          total: s.total,
          sold: s.sold,
          sellRate: s.total > 0 ? Math.round((s.sold / s.total) * 100) : 0,
          avgPrice: s.total > 0 ? (s.priceSum / s.total / 100).toFixed(2) : "0",
        }))
        .sort((a, b) => b.total - a.total);

      setRows(result);
      setPieData(result.map((r) => ({ name: r.name, value: r.total })));
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Category Analytics</h1>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Categories" total={rows.length} loading={loading} />
        <KpiCard label="Total Posts" total={rows.reduce((s, r) => s + r.total, 0)} loading={loading} />
        <KpiCard label="Total Sold" total={rows.reduce((s, r) => s + r.sold, 0)} loading={loading} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Post Distribution (Pie)</h2>
          {loading ? (
            <div className="h-56 animate-pulse rounded bg-slate-100" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Sell-through Rate (%)</h2>
          {loading ? (
            <div className="h-56 animate-pulse rounded bg-slate-100" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Bar dataKey="sellRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Sell Rate %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Category Performance Table</h2>
        {loading ? (
          <div className="h-40 animate-pulse rounded bg-slate-100" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Sold</th>
                  <th className="py-2 pr-4">Sell Rate</th>
                  <th className="py-2 pr-4">Avg Price (AUD)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-800">{r.name}</td>
                    <td className="py-2 pr-4">{r.total}</td>
                    <td className="py-2 pr-4">{r.sold}</td>
                    <td className="py-2 pr-4">{r.sellRate}%</td>
                    <td className="py-2 pr-4">${r.avgPrice}</td>
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
