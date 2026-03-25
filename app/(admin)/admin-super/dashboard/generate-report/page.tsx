"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
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

/* ─── Types ─── */
type ReportType = "weekly" | "monthly" | "quarterly";

interface PeriodBucket {
  label: string;
  start: string;
  end: string;
  posts: number;
  likes: number;
  dealResults: number;
  newUsers: number;
  messages: number;
  meetups: number;
}

interface ReportData {
  periods: PeriodBucket[];
  totalPosts: number;
  totalLikes: number;
  totalDealResults: number;
  totalNewUsers: number;
  totalMessages: number;
  totalMeetups: number;
  statusDist: { name: string; value: number }[];
}

const STATUS_COLORS = [
  "#64748b", "#3b82f6", "#f59e0b", "#10b981", "#6366f1", "#ef4444", "#8b5cf6", "#ec4899",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`;
}

function fmtDateShort(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`;
}

function typeLabel(t: ReportType): string {
  return t === "weekly" ? "Weekly" : t === "monthly" ? "Monthly" : "Quarterly";
}

function buildPeriods(start: Date, end: Date, type: ReportType): { label: string; start: string; end: string }[] {
  const periods: { label: string; start: string; end: string }[] = [];
  const cursor = new Date(start);

  while (cursor < end) {
    const pStart = new Date(cursor);
    let pEnd: Date;

    if (type === "weekly") {
      pEnd = new Date(cursor);
      pEnd.setDate(pEnd.getDate() + 6);
    } else if (type === "monthly") {
      pEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    } else {
      pEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 3, 0);
    }

    if (pEnd > end) pEnd = new Date(end);

    const label =
      type === "weekly"
        ? `${fmtDateShort(pStart)} – ${fmtDateShort(pEnd)}`
        : type === "monthly"
          ? `${MONTHS[pStart.getMonth()]} ${pStart.getFullYear()}`
          : `Q${Math.floor(pStart.getMonth() / 3) + 1} ${pStart.getFullYear()}`;

    periods.push({
      label,
      start: pStart.toISOString().slice(0, 10),
      end: pEnd.toISOString().slice(0, 10),
    });

    if (type === "weekly") {
      cursor.setDate(cursor.getDate() + 7);
    } else if (type === "monthly") {
      cursor.setMonth(cursor.getMonth() + 1);
      cursor.setDate(1);
    } else {
      cursor.setMonth(cursor.getMonth() + 3);
      cursor.setDate(1);
    }
  }

  return periods;
}

function pctChange(current: number, previous: number): string {
  if (previous === 0 && current === 0) return "—";
  if (previous === 0) return `+${current} new`;
  if (current === 0) return "−100%";
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

function pctChangeColor(current: number, previous: number): string {
  if (previous === 0 && current === 0) return "text-slate-400";
  if (previous === 0) return "text-emerald-600";
  if (current === 0) return "text-rose-600";
  return current >= previous ? "text-emerald-600" : "text-rose-600";
}

/* ─── Data Fetcher ─── */
async function fetchReportData(
  startDate: string,
  endDate: string,
  type: ReportType,
): Promise<ReportData> {
  const periods = buildPeriods(new Date(startDate), new Date(endDate), type);
  const buckets: PeriodBucket[] = periods.map((p) => ({
    ...p,
    posts: 0,
    likes: 0,
    dealResults: 0,
    newUsers: 0,
    messages: 0,
    meetups: 0,
  }));

  function assignToBucket(dateStr: string, field: keyof Omit<PeriodBucket, "label" | "start" | "end">) {
    const d = dateStr.slice(0, 10);
    for (const b of buckets) {
      if (d >= b.start && d <= b.end) {
        (b[field] as number)++;
        break;
      }
    }
  }

  const res = await fetch(
    `/api/admin/report?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    console.warn("[Report] API route failed, status", res.status);
    return { periods: buckets, totalPosts: 0, totalLikes: 0, totalDealResults: 0, totalNewUsers: 0, totalMessages: 0, totalMeetups: 0, statusDist: [] };
  }

  const raw = await res.json();

  const posts: { created_at?: string }[] = raw.posts ?? [];
  const interests: { created_at?: string }[] = raw.interests ?? [];
  const soldPosts: { updated_at?: string }[] = raw.soldPosts ?? [];
  const profiles: { suburb_verified_at?: string }[] = raw.profiles ?? [];
  const allPostStatuses: { status?: string }[] = raw.allPostStatuses ?? [];
  const messagesRows: { created_at?: string }[] = raw.messages ?? [];
  const meetupsRows: { updated_at?: string }[] = raw.meetups ?? [];

  posts.forEach((r) => { if (r.created_at) assignToBucket(r.created_at, "posts"); });
  interests.forEach((r) => { if (r.created_at) assignToBucket(r.created_at, "likes"); });
  soldPosts.forEach((r) => { if (r.updated_at) assignToBucket(r.updated_at, "dealResults"); });
  profiles.forEach((r) => { if (r.suburb_verified_at) assignToBucket(r.suburb_verified_at, "newUsers"); });
  messagesRows.forEach((r) => { if (r.created_at) assignToBucket(r.created_at, "messages"); });
  meetupsRows.forEach((r) => { if (r.updated_at) assignToBucket(r.updated_at, "meetups"); });

  const statusCounts: Record<string, number> = {};
  allPostStatuses.forEach((p) => {
    if (p.status) statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
  });

  let totalMessages = 0;
  let totalMeetups = 0;
  for (const b of buckets) {
    totalMessages += b.messages;
    totalMeetups += b.meetups;
  }

  if (totalMessages === 0 && raw.msgCountFallback != null && raw.msgCountFallback > 0) {
    totalMessages = raw.msgCountFallback;
    const avg = Math.round(totalMessages / buckets.length);
    buckets.forEach((b, i) => { b.messages = i === buckets.length - 1 ? totalMessages - avg * (buckets.length - 1) : avg; });
  }

  if (totalMeetups === 0 && raw.meetupCountFallback != null && raw.meetupCountFallback > 0) {
    totalMeetups = raw.meetupCountFallback;
    const avg = Math.round(totalMeetups / buckets.length);
    buckets.forEach((b, i) => { b.meetups = i === buckets.length - 1 ? totalMeetups - avg * (buckets.length - 1) : avg; });
  }

  return {
    periods: buckets,
    totalPosts: posts.length,
    totalLikes: interests.length,
    totalDealResults: soldPosts.length,
    totalNewUsers: profiles.length,
    totalMessages,
    totalMeetups,
    statusDist: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
  };
}

/* ─── PDF Export ─── */
async function exportPDF(startDate: string, endDate: string, type: ReportType) {
  const { default: html2canvas } = await import("html2canvas-pro");
  const { default: jsPDF } = await import("jspdf");

  const el = document.getElementById("report-content");
  if (!el) return;

  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
  const imgData = canvas.toDataURL("image/png");

  const pxWidth = canvas.width;
  const pxHeight = canvas.height;

  const pdfWidth = 210;
  const pdfHeight = (pxHeight * pdfWidth) / pxWidth;

  const pdf = new jsPDF({
    orientation: pdfHeight > 297 ? "portrait" : "portrait",
    unit: "mm",
    format: [pdfWidth, Math.max(pdfHeight + 20, 297)],
  });

  pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);

  const s = new Date(startDate);
  const e = new Date(endDate);
  const fileName = `${fmtDate(s)}-${fmtDate(e)}-${typeLabel(type)} report.pdf`.replace(/\//g, "_");
  pdf.save(fileName);
}

/* ─── Report Page Content ─── */
function ReportContent() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get("start") ?? "2026-01-01";
  const endDate = searchParams.get("end") ?? new Date().toISOString().slice(0, 10);
  const type = (searchParams.get("type") ?? "weekly") as ReportType;

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const startLabel = useMemo(() => fmtDate(new Date(startDate)), [startDate]);
  const endLabel = useMemo(() => fmtDate(new Date(endDate)), [endDate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await fetchReportData(startDate, endDate, type);
    setData(result);
    setLoading(false);
  }, [startDate, endDate, type]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleExport() {
    setExporting(true);
    try {
      await exportPDF(startDate, endDate, type);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin-super/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <button
          type="button"
          onClick={handleExport}
          disabled={loading || exporting}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
        </div>
      ) : data ? (
        <div id="report-content" className="space-y-8 rounded-xl bg-white p-8">
          {/* Report Header */}
          <header className="border-b border-slate-200 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  PopOut Market — {typeLabel(type)} Report
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {startLabel} — {endLabel}
                </p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>Generated: {fmtDate(new Date())}</p>
                <p>{data.periods.length} {type === "weekly" ? "weeks" : type === "monthly" ? "months" : "quarters"} analyzed</p>
              </div>
            </div>
          </header>

          {/* Executive Summary KPIs */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Executive Summary</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <SummaryKpi label="New Posts" value={data.totalPosts} color="bg-blue-50 text-blue-700" />
              <SummaryKpi label="Likes" value={data.totalLikes} color="bg-emerald-50 text-emerald-700" />
              <SummaryKpi label="Deals Closed" value={data.totalDealResults} color="bg-amber-50 text-amber-700" />
              <SummaryKpi label="New Users" value={data.totalNewUsers} color="bg-violet-50 text-violet-700" />
              <SummaryKpi label="Messages" value={data.totalMessages} color="bg-sky-50 text-sky-700" />
              <SummaryKpi label="Meetups" value={data.totalMeetups} color="bg-rose-50 text-rose-700" />
            </div>
            {data.periods.length >= 2 && (
              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Period-over-Period Change (Latest vs Previous)
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {(["posts", "likes", "dealResults", "newUsers", "messages", "meetups"] as const).map((k) => {
                    const cur = data.periods[data.periods.length - 1][k];
                    const prev = data.periods[data.periods.length - 2][k];
                    const labels: Record<string, string> = {
                      posts: "Posts", likes: "Likes", dealResults: "Deals",
                      newUsers: "Users", messages: "Messages", meetups: "Meetups",
                    };
                    return (
                      <div key={k} className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-xs text-slate-500">{labels[k]}</p>
                        <p className={`text-lg font-bold ${pctChangeColor(cur, prev)}`}>
                          {pctChange(cur, prev)}
                        </p>
                        <p className="text-[11px] text-slate-400">{prev} → {cur}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Activity Trend Chart */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Activity Trends</h2>
            <p className="mb-3 text-xs text-slate-500">
              Posts, likes, and deal completions per {type === "weekly" ? "week" : type === "monthly" ? "month" : "quarter"}.
            </p>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.periods}>
                  <defs>
                    <linearGradient id="rptPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rptLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rptDeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="posts" stroke="#3b82f6" fill="url(#rptPosts)" name="Posts" />
                  <Area type="monotone" dataKey="likes" stroke="#10b981" fill="url(#rptLikes)" name="Likes" />
                  <Area type="monotone" dataKey="dealResults" stroke="#f59e0b" fill="url(#rptDeals)" name="Deals Closed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Engagement & Growth Chart */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Engagement & Growth</h2>
            <p className="mb-3 text-xs text-slate-500">
              New users, messages, and meetups per {type === "weekly" ? "week" : type === "monthly" ? "month" : "quarter"}.
            </p>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.periods}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="newUsers" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="New Users" />
                  <Bar dataKey="messages" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Messages" />
                  <Bar dataKey="meetups" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Meetups" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Post Status Distribution */}
          {data.statusDist.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-800">Post Status Distribution</h2>
              <p className="mb-3 text-xs text-slate-500">
                Breakdown of all posts created during the reporting period by their current status.
              </p>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                <ResponsiveContainer width={260} height={220}>
                  <PieChart>
                    <Pie
                      data={data.statusDist}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {data.statusDist.map((_, i) => (
                        <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {data.statusDist.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}
                      />
                      <span className="text-slate-600">{s.name}</span>
                      <span className="font-semibold text-slate-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Detailed Period Breakdown Table */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Detailed Period Breakdown</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 font-semibold text-slate-600">Period</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Posts</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Likes</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Deals</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">New Users</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Messages</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Meetups</th>
                  </tr>
                </thead>
                <tbody>
                  {data.periods.map((p, i) => {
                    const prev = i > 0 ? data.periods[i - 1] : null;
                    return (
                      <tr key={p.label} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3 font-medium text-slate-800">{p.label}</td>
                        <MetricCell value={p.posts} prev={prev?.posts} />
                        <MetricCell value={p.likes} prev={prev?.likes} />
                        <MetricCell value={p.dealResults} prev={prev?.dealResults} />
                        <MetricCell value={p.newUsers} prev={prev?.newUsers} />
                        <MetricCell value={p.messages} prev={prev?.messages} />
                        <MetricCell value={p.meetups} prev={prev?.meetups} />
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
                    <td className="px-4 py-3 text-slate-800">Total</td>
                    <td className="px-4 py-3 text-right text-slate-800">{data.totalPosts}</td>
                    <td className="px-4 py-3 text-right text-slate-800">{data.totalLikes}</td>
                    <td className="px-4 py-3 text-right text-slate-800">{data.totalDealResults}</td>
                    <td className="px-4 py-3 text-right text-slate-800">{data.totalNewUsers}</td>
                    <td className="px-4 py-3 text-right text-slate-800">{data.totalMessages}</td>
                    <td className="px-4 py-3 text-right text-slate-800">{data.totalMeetups}</td>
                  </tr>
                  {data.periods.length > 0 && (
                    <tr className="bg-slate-50 text-slate-500">
                      <td className="px-4 py-2 text-xs">Avg / period</td>
                      <td className="px-4 py-2 text-right text-xs">{(data.totalPosts / data.periods.length).toFixed(1)}</td>
                      <td className="px-4 py-2 text-right text-xs">{(data.totalLikes / data.periods.length).toFixed(1)}</td>
                      <td className="px-4 py-2 text-right text-xs">{(data.totalDealResults / data.periods.length).toFixed(1)}</td>
                      <td className="px-4 py-2 text-right text-xs">{(data.totalNewUsers / data.periods.length).toFixed(1)}</td>
                      <td className="px-4 py-2 text-right text-xs">{(data.totalMessages / data.periods.length).toFixed(1)}</td>
                      <td className="px-4 py-2 text-right text-xs">{(data.totalMeetups / data.periods.length).toFixed(1)}</td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </section>

          {/* Conversion Funnel */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Conversion Funnel</h2>
            <p className="mb-3 text-xs text-slate-500">
              End-to-end marketplace funnel: posts created → interest (likes) → deals closed.
            </p>
            <div className="flex items-center justify-center gap-3">
              <FunnelStep
                label="Posts Created"
                value={data.totalPosts}
                color="bg-blue-100 text-blue-800"
                pct={100}
              />
              <FunnelArrow />
              <FunnelStep
                label="Likes (Interest)"
                value={data.totalLikes}
                color="bg-emerald-100 text-emerald-800"
                pct={data.totalPosts > 0 ? (data.totalLikes / data.totalPosts) * 100 : 0}
              />
              <FunnelArrow />
              <FunnelStep
                label="Deals Closed"
                value={data.totalDealResults}
                color="bg-amber-100 text-amber-800"
                pct={data.totalLikes > 0 ? (data.totalDealResults / data.totalLikes) * 100 : 0}
              />
            </div>
          </section>

          {/* Key Insights */}
          <section className="border-t border-slate-200 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Key Insights</h2>
            <KeyInsights data={data} type={type} />
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
            PopOut Market • {typeLabel(type)} Report • {startLabel} – {endLabel} • Confidential
          </footer>
        </div>
      ) : null}
    </div>
  );
}

/* ─── Sub-components ─── */

function SummaryKpi({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}

function MetricCell({ value, prev }: { value: number; prev?: number }) {
  return (
    <td className="px-4 py-3 text-right">
      <span className="font-medium text-slate-800">{value}</span>
      {prev != null && (
        <span className={`ml-1.5 text-[11px] ${pctChangeColor(value, prev)}`}>
          {pctChange(value, prev)}
        </span>
      )}
    </td>
  );
}

function FunnelStep({ label, value, color, pct }: { label: string; value: number; color: string; pct: number }) {
  return (
    <div className={`flex flex-col items-center rounded-xl p-5 ${color}`} style={{ minWidth: 140 }}>
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
      <p className="mt-1 text-xs font-medium">{label}</p>
      <p className="mt-0.5 text-[11px] opacity-60">{pct.toFixed(1)}%</p>
    </div>
  );
}

function FunnelArrow() {
  return (
    <svg className="h-5 w-8 shrink-0 text-slate-300" viewBox="0 0 32 20" fill="none">
      <path d="M0 10h26m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KeyInsights({ data, type }: { data: ReportData; type: ReportType }) {
  const insights: string[] = [];
  const n = data.periods.length;
  const periodName = type === "weekly" ? "week" : type === "monthly" ? "month" : "quarter";

  if (n === 0) {
    insights.push("No data available for the selected period.");
    return <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">{insights.map((t, i) => <li key={i}>{t}</li>)}</ul>;
  }

  const totalActivity = data.totalPosts + data.totalLikes + data.totalDealResults;
  insights.push(`Total platform activity during this period: ${totalActivity.toLocaleString()} events across ${n} ${periodName}(s).`);

  if (data.totalPosts > 0) {
    const likeRatio = (data.totalLikes / data.totalPosts).toFixed(1);
    insights.push(`Average of ${likeRatio} likes per post created — indicates ${Number(likeRatio) >= 2 ? "strong" : Number(likeRatio) >= 1 ? "moderate" : "low"} buyer interest.`);
  }

  if (data.totalLikes > 0) {
    const convRate = ((data.totalDealResults / data.totalLikes) * 100).toFixed(1);
    insights.push(`Like-to-deal conversion rate: ${convRate}% — ${Number(convRate) >= 10 ? "healthy" : "room for improvement"}.`);
  }

  if (n >= 2) {
    const last = data.periods[n - 1];
    const secondLast = data.periods[n - 2];
    const postGrowth = secondLast.posts > 0 ? ((last.posts - secondLast.posts) / secondLast.posts) * 100 : 0;
    if (Math.abs(postGrowth) > 5) {
      insights.push(
        `Post volume ${postGrowth > 0 ? "increased" : "decreased"} by ${Math.abs(postGrowth).toFixed(1)}% in the latest ${periodName} compared to the previous one.`,
      );
    }

    const peakPeriod = data.periods.reduce((max, p) => (p.posts + p.likes + p.dealResults > max.posts + max.likes + max.dealResults ? p : max));
    insights.push(`Peak activity ${periodName}: ${peakPeriod.label} with ${peakPeriod.posts + peakPeriod.likes + peakPeriod.dealResults} total events.`);
  }

  if (data.totalNewUsers > 0 && n > 0) {
    insights.push(`${data.totalNewUsers} new verified users joined, averaging ${(data.totalNewUsers / n).toFixed(1)} per ${periodName}.`);
  }

  if (data.totalMeetups > 0 && data.totalDealResults > 0) {
    const meetupRate = ((data.totalMeetups / data.totalDealResults) * 100).toFixed(0);
    insights.push(`${meetupRate}% of completed deals had confirmed meetups — indicating ${Number(meetupRate) >= 50 ? "strong" : "growing"} trust in the scheduling feature.`);
  }

  return (
    <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-600">
      {insights.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

/* ─── Page Wrapper ─── */
export default function GenerateReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
