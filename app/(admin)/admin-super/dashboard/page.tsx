"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type LegendPayload,
} from "recharts";

type Kpis = {
  totalUsers: number;
  todayUsers: number;
  totalPosts: number;
  todayPosts: number;
  totalDealResults: number;
  todayDealResults: number;
  totalLikes: number;
  todayLikes: number;
  totalMessages: number;
  todayMessages: number;
  totalMeetups: number;
  todayMeetups: number;
};

type StatusSlice = { name: string; value: number };

const STATUS_COLORS = [
  "#64748b", "#3b82f6", "#f59e0b", "#10b981", "#6366f1", "#ef4444", "#8b5cf6", "#ec4899",
];

const RANGE_OPTIONS = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
] as const;

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

type TrendSeriesKey = "posts" | "likes" | "dealResults";

function isTrendSeriesKey(k: string): k is TrendSeriesKey {
  return k === "posts" || k === "likes" || k === "dealResults";
}

function DailyTrendLegendContent({
  payload,
  visibility,
  onToggle,
}: {
  payload?: ReadonlyArray<LegendPayload>;
  visibility: Record<TrendSeriesKey, boolean>;
  onToggle: (key: TrendSeriesKey) => void;
}) {
  if (!payload?.length) return null;
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs">
      {payload.map((entry, index) => {
        const raw = entry.dataKey;
        const key = typeof raw === "string" && isTrendSeriesKey(raw) ? raw : null;
        if (!key) return null;
        const on = visibility[key];
        const color = entry.color ?? "#64748b";
        const label = entry.value ?? key;
        return (
          <li
            key={`${String(entry.dataKey)}-${index}`}
            className={`flex items-center gap-2 ${on ? "" : "opacity-45"}`}
          >
            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={on ? `Hide ${label}` : `Show ${label}`}
              onClick={() => onToggle(key)}
              className={`flex h-[22px] w-10 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 ${
                on ? "justify-end bg-slate-800" : "justify-start bg-slate-300"
              }`}
            >
              <span className="block h-4 w-4 rounded-full bg-white shadow-sm" />
            </button>
            <span className="relative inline-flex h-3 w-7 shrink-0 items-center" aria-hidden>
              <span className="h-px w-full rounded-full" style={{ backgroundColor: color }} />
              <span
                className="absolute left-1/2 top-1/2 box-border h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white"
                style={{ borderColor: color }}
              />
            </span>
            <span className="font-medium" style={{ color }}>
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function DashboardOverviewPage() {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [statusDist, setStatusDist] = useState<StatusSlice[]>([]);
  const [dailyData, setDailyData] = useState<{ date: string; posts: number; likes: number; dealResults: number }[]>([]);
  const [range, setRange] = useState<7 | 14 | 30>(30);
  const [loading, setLoading] = useState(true);
  const [loadWarning, setLoadWarning] = useState<string | null>(null);
  const [seriesVisible, setSeriesVisible] = useState<Record<TrendSeriesKey, boolean>>({
    posts: true,
    likes: true,
    dealResults: true,
  });

  const toggleSeries = (key: TrendSeriesKey) => {
    setSeriesVisible((v) => ({ ...v, [key]: !v[key] }));
  };

  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportStart, setReportStart] = useState("2026-01-01");
  const [reportEnd, setReportEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reportOpen) return;
    function handleClick(e: MouseEvent) {
      if (reportRef.current && !reportRef.current.contains(e.target as Node)) setReportOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [reportOpen]);

  function goReport(type: "weekly" | "monthly" | "quarterly") {
    const params = new URLSearchParams({ start: reportStart, end: reportEnd, type });
    router.push(`/admin-super/dashboard/generate-report?${params.toString()}`);
    setReportOpen(false);
  }

  useEffect(() => {
    const todayISO = todayStart();

    async function loadViaBrowserFallback() {
      if (!isAdminAuthConfigured()) return;
      const sb = getAdminAuthBrowserClient();

      const [
        { count: totalUsers },
        { count: todayUsers },
        { count: totalPosts },
        { count: todayPosts },
        { count: totalDealResults },
        { count: todayDealResults },
        { count: totalLikes },
        { count: todayLikes },
        { count: totalMessages },
        { count: todayMessages },
        { count: totalMeetups },
        { count: todayMeetups },
        { data: allPosts },
      ] = await Promise.all([
        sb.from("profiles").select("*", { count: "exact", head: true }),
        sb.from("profiles").select("*", { count: "exact", head: true }).gte("suburb_verified_at", todayISO),
        sb.from("posts").select("*", { count: "exact", head: true }),
        sb.from("posts").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
        sb.from("posts").select("*", { count: "exact", head: true }).eq("status", "sold"),
        sb.from("posts").select("*", { count: "exact", head: true }).eq("status", "sold").gte("updated_at", todayISO),
        sb.from("post_interests").select("*", { count: "exact", head: true }),
        sb.from("post_interests").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
        sb.from("messages").select("*", { count: "exact", head: true }),
        sb.from("messages").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
        sb.from("meetup_schedules").select("*", { count: "exact", head: true }).eq("status", "met"),
        sb.from("meetup_schedules").select("*", { count: "exact", head: true }).eq("status", "met").gte("updated_at", todayISO),
        sb.from("posts").select("status"),
      ]);

      setKpis({
        totalUsers: totalUsers ?? 0,
        todayUsers: todayUsers ?? 0,
        totalPosts: totalPosts ?? 0,
        todayPosts: todayPosts ?? 0,
        totalDealResults: totalDealResults ?? 0,
        todayDealResults: todayDealResults ?? 0,
        totalLikes: totalLikes ?? 0,
        todayLikes: todayLikes ?? 0,
        totalMessages: totalMessages ?? 0,
        todayMessages: todayMessages ?? 0,
        totalMeetups: totalMeetups ?? 0,
        todayMeetups: todayMeetups ?? 0,
      });

      const counts: Record<string, number> = {};
      allPosts?.forEach((p: { status: string }) => {
        counts[p.status] = (counts[p.status] ?? 0) + 1;
      });
      setStatusDist(Object.entries(counts).map(([name, value]) => ({ name, value })));

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - range);
      const cutoffISO = cutoff.toISOString();
      const [{ data: dailyPosts }, { data: dailyLikes }, { data: dailyDeals }] =
        await Promise.all([
          sb.from("posts").select("created_at").gte("created_at", cutoffISO),
          sb.from("post_interests").select("created_at").gte("created_at", cutoffISO),
          sb.from("posts").select("updated_at").eq("status", "sold").gte("updated_at", cutoffISO),
        ]);

      const buckets: Record<string, { posts: number; likes: number; dealResults: number }> = {};
      for (let i = 0; i < range; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (range - 1 - i));
        const key = d.toISOString().slice(0, 10);
        buckets[key] = { posts: 0, likes: 0, dealResults: 0 };
      }
      dailyPosts?.forEach((r: { created_at: string }) => {
        const k = r.created_at.slice(0, 10);
        if (buckets[k]) buckets[k].posts++;
      });
      dailyLikes?.forEach((r: { created_at: string }) => {
        const k = r.created_at.slice(0, 10);
        if (buckets[k]) buckets[k].likes++;
      });
      dailyDeals?.forEach((r: { updated_at: string }) => {
        const k = r.updated_at.slice(0, 10);
        if (buckets[k]) buckets[k].dealResults++;
      });
      setDailyData(Object.entries(buckets).map(([date, v]) => ({ date: date.slice(5), ...v })));
    }

    async function load() {
      setLoading(true);
      setLoadWarning(null);

      try {
        const res = await fetch(`/api/admin/overview?range=${range}`, { cache: "no-store" });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          await loadViaBrowserFallback();
          setLoadWarning(
            `Server aggregate API is unavailable${
              errBody?.error ? ` (${errBody.error})` : ""
            }. Showing fallback values from browser query.`,
          );
          setLoading(false);
          return;
        }
        const data = await res.json();
        setKpis(data.kpis);
        setStatusDist(data.statusDist ?? []);
        setDailyData(data.dailyData ?? []);
      } catch {
        await loadViaBrowserFallback();
        setLoadWarning(
          "Server aggregate API failed. Showing fallback values from browser query.",
        );
      }
      setLoading(false);
    }

    load();
  }, [range]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard Overview</h1>
        <div className="relative" ref={reportRef}>
          <button
            type="button"
            onClick={() => setReportOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </button>
          {reportOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">Generate Report</h3>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">Start Date</span>
                  <input
                    type="date"
                    value={reportStart}
                    onChange={(e) => setReportStart(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">End Date</span>
                  <input
                    type="date"
                    value={reportEnd}
                    onChange={(e) => setReportEnd(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goReport("weekly")}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => goReport("monthly")}
                  className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => goReport("quarterly")}
                  className="flex-1 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
                >
                  Quarterly
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {loadWarning ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {loadWarning}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Users" total={kpis?.totalUsers ?? "-"} today={kpis?.todayUsers} loading={loading} />
        <KpiCard label="Posts" total={kpis?.totalPosts ?? "-"} today={kpis?.todayPosts} loading={loading} />
        <KpiCard label="Deal Results" total={kpis?.totalDealResults ?? "-"} today={kpis?.todayDealResults} loading={loading} />
        <KpiCard label="Likes" total={kpis?.totalLikes ?? "-"} today={kpis?.todayLikes} loading={loading} />
        <KpiCard label="Messages" total={kpis?.totalMessages ?? "-"} today={kpis?.todayMessages} loading={loading} />
        <KpiCard label="Meetups" total={kpis?.totalMeetups ?? "-"} today={kpis?.todayMeetups} loading={loading} />
      </div>

      {/* Daily trend chart */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Daily Trends</h2>
          <div className="flex gap-1">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => setRange(opt.days as 7 | 14 | 30)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  range === opt.days
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="h-56 animate-pulse rounded bg-slate-100" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTxns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend
                content={(props) => (
                  <DailyTrendLegendContent
                    payload={props.payload}
                    visibility={seriesVisible}
                    onToggle={toggleSeries}
                  />
                )}
              />
              <Area
                type="monotone"
                dataKey="posts"
                stroke="#3b82f6"
                fill="url(#colorPosts)"
                hide={!seriesVisible.posts}
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#10b981"
                fill="url(#colorLikes)"
                hide={!seriesVisible.likes}
              />
              <Area
                type="monotone"
                dataKey="dealResults"
                stroke="#f59e0b"
                fill="url(#colorTxns)"
                name="deal results (sold)"
                hide={!seriesVisible.dealResults}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Post status donut */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Post Status Distribution</h2>
        {loading ? (
          <div className="h-56 animate-pulse rounded bg-slate-100" />
        ) : (
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={320} height={260}>
              <PieChart>
                <Pie
                  data={statusDist}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {statusDist.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
