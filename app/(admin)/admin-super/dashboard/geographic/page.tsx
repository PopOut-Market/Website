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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SuburbStat = {
  name: string;
  posts: number;
  users: number;
  transactions: number;
};

export default function GeographicPage() {
  const [data, setData] = useState<SuburbStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthConfigured()) return;
    const sb = getAdminAuthBrowserClient();

    async function load() {
      setLoading(true);

      const [{ data: posts }, { data: profiles }, { data: soldPosts }, { data: suburbs }] =
        await Promise.all([
          sb.from("posts").select("suburb_id"),
          sb.from("profiles").select("verified_suburb_id"),
          sb.from("posts").select("suburb_id").eq("status", "sold"),
          sb.from("suburbs").select("id, name").eq("is_active", true).order("name"),
        ]);

      const subMap = new Map<number, SuburbStat>();
      suburbs?.forEach((s: { id: number; name: string }) => {
        subMap.set(s.id, { name: s.name, posts: 0, users: 0, transactions: 0 });
      });

      posts?.forEach((p: { suburb_id: number }) => {
        const entry = subMap.get(p.suburb_id);
        if (entry) entry.posts++;
      });

      profiles?.forEach((p: { verified_suburb_id: number | null }) => {
        if (p.verified_suburb_id) {
          const entry = subMap.get(p.verified_suburb_id);
          if (entry) entry.users++;
        }
      });

      soldPosts?.forEach((p: { suburb_id: number }) => {
        const entry = subMap.get(p.suburb_id);
        if (entry) entry.transactions++;
      });

      const result = Array.from(subMap.values())
        .filter((s) => s.posts > 0 || s.users > 0)
        .sort((a, b) => b.posts - a.posts);

      setData(result);
      setLoading(false);
    }

    load();
  }, []);

  const totalPosts = data.reduce((s, d) => s + d.posts, 0);
  const totalUsers = data.reduce((s, d) => s + d.users, 0);
  const activeSuburbs = data.filter((d) => d.posts > 0).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Geographic Analytics</h1>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Active Suburbs" total={activeSuburbs} loading={loading} />
        <KpiCard label="Posts (active suburbs)" total={totalPosts} loading={loading} />
        <KpiCard label="Users (verified)" total={totalUsers} loading={loading} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Posts by Suburb</h2>
        <p className="mb-4 text-xs text-slate-500">
          Map visualization will use react-leaflet + GeoJSON — currently showing bar chart with real data.
        </p>
        {loading ? (
          <div className="h-56 animate-pulse rounded bg-slate-100" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.slice(0, 20)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="posts" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Users by Suburb</h2>
        {loading ? (
          <div className="h-56 animate-pulse rounded bg-slate-100" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.slice(0, 20)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="users" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Deal Results (Sold) by Suburb</h2>
        {loading ? (
          <div className="h-56 animate-pulse rounded bg-slate-100" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.slice(0, 20)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="transactions" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
