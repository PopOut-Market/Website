"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { type ReactNode, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Overview = {
  posts: {
    available: number;
    last7d: number;
    byStatus: { status: string; count: number }[];
    daily: { date: string; count: number }[];
    byCategory: { name: string; count: number }[];
    bySuburb: { name: string; count: number }[];
  };
  users: {
    active: number;
    excluded: number;
    bySuburb: { name: string; count: number }[];
    byLanguage: { code: string; count: number }[];
  };
  generatedAt: string;
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
  ko: "한국어",
  ja: "日本語",
  vi: "Tiếng Việt",
  fr: "Français",
  es: "Español",
};

const STATUS_COLORS: Record<string, string> = {
  available: "bg-emerald-500",
  sold: "bg-sky-500",
  deleted: "bg-slate-400",
  restricted: "bg-amber-500",
};

function BarList({
  rows,
  color = "bg-slate-800",
}: {
  rows: { label: string; count: number; color?: string }[];
  color?: string;
}) {
  if (rows.length === 0) return <p className="text-sm text-slate-500">No data.</p>;
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-sm text-slate-700" title={r.label}>
            {r.label}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${r.color ?? color}`}
              style={{ width: `${Math.max(2, (r.count / max) * 100)}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-sm font-medium text-slate-900">
            {r.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  total,
  children,
  className = "",
}: {
  title: string;
  total?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {total !== undefined && (
          <span className="shrink-0 text-xs font-medium text-slate-400">n = {total}</span>
        )}
      </div>
      {children}
    </section>
  );
}

const sumCounts = (rows: { count: number }[]): number => rows.reduce((a, r) => a + r.count, 0);

export default function DashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await adminApiFetch("/api/admin/overview", { cache: "no-store" });
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          setError(j?.error ?? `Request failed (${res.status}).`);
          return;
        }
        setData((await res.json()) as Overview);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard label="Available posts" total={data?.posts.available ?? 0} loading={loading} />
        <KpiCard label="Active users" total={data?.users.active ?? 0} loading={loading} />
        <KpiCard label="Posts · last 7 days" total={data?.posts.last7d ?? 0} loading={loading} />
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Section
              title="Posts per day · last 7 days"
              total={data.posts.last7d}
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data.posts.daily}
                  margin={{ top: 8, right: 16, bottom: 0, left: -8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Posts"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Available posts by category" total={sumCounts(data.posts.byCategory)}>
              <BarList
                rows={data.posts.byCategory.map((c) => ({ label: c.name, count: c.count }))}
                color="bg-rose-500"
              />
            </Section>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section title="Posts by status" total={sumCounts(data.posts.byStatus)}>
              <BarList
                rows={data.posts.byStatus.map((s) => ({
                  label: s.status,
                  count: s.count,
                  color: STATUS_COLORS[s.status] ?? "bg-slate-500",
                }))}
              />
            </Section>

            <Section title="Available posts by suburb" total={sumCounts(data.posts.bySuburb)}>
              <BarList
                rows={data.posts.bySuburb.map((s) => ({ label: s.name, count: s.count }))}
                color="bg-amber-500"
              />
            </Section>

            <Section title="Users by suburb" total={sumCounts(data.users.bySuburb)}>
              <BarList
                rows={data.users.bySuburb.map((s) => ({ label: s.name, count: s.count }))}
                color="bg-indigo-500"
              />
            </Section>

            <Section title="Users by app language" total={sumCounts(data.users.byLanguage)}>
              <BarList
                rows={data.users.byLanguage.map((l) => ({
                  label: LANGUAGE_NAMES[l.code] ?? l.code,
                  count: l.count,
                }))}
                color="bg-violet-500"
              />
            </Section>
          </div>
        </>
      ) : null}

      {data && (
        <p className="text-xs text-slate-400">
          {data.users.excluded > 0
            ? `User metrics exclude ${data.users.excluded} deleted/banned account${data.users.excluded === 1 ? "" : "s"}. `
            : ""}
          Updated {new Date(data.generatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
