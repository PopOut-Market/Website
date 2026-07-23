"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Each point carries the per-bucket breakdown (category label -> count, or
// language code -> count) used to repaint the adjacent bar chart on hover.
type SeriesPoint = { date: string; count: number; breakdown: Record<string, number> };
type Series = SeriesPoint[];

type Overview = {
  posts: {
    available: number;
    last7d: number;
    byStatus: { status: string; count: number }[];
    daily: Series;
    weekly: Series;
    byCategory: { name: string; count: number }[];
    bySuburb: { name: string; count: number }[];
  };
  users: {
    active: number;
    excluded: number;
    bySuburb: { name: string; count: number }[];
    byLanguage: { code: string; count: number }[];
    daily: Series;
    weekly: Series;
  };
  generatedAt: string;
};

type Granularity = "day" | "week";

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
              className={`h-full rounded-full transition-all duration-300 ${r.color ?? color}`}
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
  action,
  children,
  className = "",
}: {
  title: string;
  total?: number;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          {total !== undefined && (
            <span className="text-xs font-medium text-slate-400">n = {total}</span>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function GranularityToggle({
  value,
  onChange,
}: {
  value: Granularity;
  onChange: (v: Granularity) => void;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 text-xs">
      {(["day", "week"] as const).map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          aria-pressed={value === g}
          className={`px-2.5 py-1 font-medium transition ${
            value === g
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          {g === "day" ? "Day" : "Week"}
        </button>
      ))}
    </div>
  );
}

function TrendChart({
  data,
  name,
  color,
  onHover,
}: {
  data: Series;
  name: string;
  color: string;
  onHover: (index: number | null) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 0, left: -8 }}
        onMouseMove={(state) => {
          if (state.isTooltipActive && state.activeTooltipIndex != null) {
            onHover(Number(state.activeTooltipIndex));
          }
        }}
        onMouseLeave={() => onHover(null)}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          name={name}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const sumCounts = (rows: { count: number }[]): number => rows.reduce((a, r) => a + r.count, 0);

/**
 * Hovered bucket index with a delayed reset: hovering a point sets it
 * immediately; leaving the chart clears it 1s later (cancelled if the pointer
 * returns first), so the bar chart lingers on the last day before reverting.
 */
function useHoverIndex(): [number | null, (i: number | null) => void] {
  const [index, setIndex] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const set = useCallback((i: number | null) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (i === null) {
      timer.current = setTimeout(() => setIndex(null), 1000);
    } else {
      setIndex(i);
    }
  }, []);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  return [index, set];
}

/**
 * Rows for a bar chart given a hovered bucket's breakdown. Keeps the default
 * rows in their original order (counts swapped to the bucket's, 0 if absent) so
 * bars change width in place, then appends any labels seen only in that bucket.
 * `keyOf` maps a default row's label to the breakdown's key (identity for
 * categories; code→display handled by the caller for languages).
 */
function mergeBreakdownRows(
  base: { label: string; count: number }[],
  breakdown: Record<string, number> | null,
): { label: string; count: number }[] {
  if (!breakdown) return base;
  const used = new Set(base.map((r) => r.label));
  const merged = base.map((r) => ({ label: r.label, count: breakdown[r.label] ?? 0 }));
  const extras = Object.entries(breakdown)
    .filter(([label]) => !used.has(label))
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
  return [...merged, ...extras];
}

function DashboardCharts({ data }: { data: Overview }) {
  const [postsGranularity, setPostsGranularity] = useState<Granularity>("day");
  const [usersGranularity, setUsersGranularity] = useState<Granularity>("day");
  const [postsHover, setPostsHover] = useHoverIndex();
  const [usersHover, setUsersHover] = useHoverIndex();

  const bucketLabel = (g: Granularity, date: string) => (g === "week" ? `week of ${date}` : date);
  const rangeLabel = (g: Granularity) => (g === "day" ? "7 days" : "8 weeks");

  const postsSeries = postsGranularity === "day" ? data.posts.daily : data.posts.weekly;
  const usersSeries = usersGranularity === "day" ? data.users.daily : data.users.weekly;

  // Posts bar chart: default = currently-available by category; on hover over the
  // trend, that bucket's *published* posts split by category.
  const postsBase = data.posts.byCategory.map((c) => ({ label: c.name, count: c.count }));
  const postsPoint = postsHover != null ? postsSeries[postsHover] : undefined;
  const postsBarRows = mergeBreakdownRows(postsBase, postsPoint?.breakdown ?? null);
  const postsBarTitle = postsPoint
    ? `Posts published · ${bucketLabel(postsGranularity, postsPoint.date)}`
    : "Available posts by category";

  // Users bar chart: default = users by language; on hover, that bucket's new
  // signups by language. Breakdown keys are language codes, so remap to the
  // display names the default rows use before merging.
  const usersBase = data.users.byLanguage.map((l) => ({
    label: LANGUAGE_NAMES[l.code] ?? l.code,
    count: l.count,
  }));
  const usersPoint = usersHover != null ? usersSeries[usersHover] : undefined;
  const usersBreakdown = usersPoint
    ? Object.entries(usersPoint.breakdown).reduce<Record<string, number>>((acc, [code, n]) => {
        const label = LANGUAGE_NAMES[code] ?? code;
        acc[label] = (acc[label] ?? 0) + n;
        return acc;
      }, {})
    : null;
  const usersBarRows = mergeBreakdownRows(usersBase, usersBreakdown);
  const usersBarTitle = usersPoint
    ? `New users · ${bucketLabel(usersGranularity, usersPoint.date)}`
    : "Users by app language";

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <Section
          title={`Posts per ${postsGranularity} · last ${rangeLabel(postsGranularity)}`}
          total={sumCounts(postsSeries)}
          action={<GranularityToggle value={postsGranularity} onChange={setPostsGranularity} />}
          className="lg:col-span-2"
        >
          <TrendChart
            key={postsGranularity}
            data={postsSeries}
            name="Posts"
            color="#6366f1"
            onHover={setPostsHover}
          />
        </Section>

        <Section title={postsBarTitle} total={sumCounts(postsBarRows)}>
          <BarList rows={postsBarRows} color="bg-rose-500" />
        </Section>
      </div>

      {/* Same 3-col split as the posts row above: trend spans 2, the language
          bar chart takes the last column. Equal height via the stretched row. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        <Section
          title={`New users per ${usersGranularity} · last ${rangeLabel(usersGranularity)}`}
          total={sumCounts(usersSeries)}
          action={<GranularityToggle value={usersGranularity} onChange={setUsersGranularity} />}
          className="lg:col-span-2"
        >
          <TrendChart
            key={usersGranularity}
            data={usersSeries}
            name="New users"
            color="#10b981"
            onHover={setUsersHover}
          />
        </Section>

        <Section title={usersBarTitle} total={sumCounts(usersBarRows)}>
          <BarList rows={usersBarRows} color="bg-violet-500" />
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
      </div>
    </>
  );
}

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
        <DashboardCharts data={data} />
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
