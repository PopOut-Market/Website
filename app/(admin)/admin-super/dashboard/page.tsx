"use client";

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
  activity: { messages7d: number };
  sales: {
    sold: number;
    onPlatform: number;
    elsewhere: number;
    afterPriceDrop: number;
    atOriginalPrice: number;
    medianDiscountPct: number | null;
    discountBuckets: { label: string; count: number }[];
    medianDaysAfterDrop: number | null;
    daysAfterDropCovered: number;
    medianDaysFullPrice: number | null;
    daysFullPriceCovered: number;
  };
  community: {
    total: number;
    byTopic: { topic: string; count: number }[];
    replies: number;
    restricted: number;
  };
  creation: { bulk: number; single: number };
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

/**
 * Rows shown before "show all". Long lists (suburbs, categories) ran to dozens of
 * rows and pushed everything below them off the screen; the first handful is
 * almost always what the question was about.
 *
 * The bar scale stays keyed to the WHOLE list, not the visible slice, so
 * collapsing never silently rescales the bars and makes a small number look big.
 */
const BAR_LIST_COLLAPSED = 5;

/**
 * Day 1 of the product, for the "day N" counter.
 *
 * Parsed as local midnight (the `new Date(y, m, d)` form), never
 * `new Date("2026-06-18")` — that ISO form is parsed as UTC, which in Melbourne
 * is 10 or 11 hours ahead of local midnight and puts the counter a day out for
 * most of the working day.
 */
const LAUNCH = { year: 2026, month: 5, day: 18 } as const; // month is 0-indexed

/**
 * Total App Store downloads — TYPED IN BY HAND. Update `display` and `checked`
 * together whenever you read the real figure.
 *
 * There is no automatic source. Apple's public lookup endpoint returns 44 fields
 * for this app and not one of them is a download or install count (only
 * `userRatingCount`), and the store page shows the same. The real number lives in
 * App Store Connect → Analytics → Total Downloads, readable only with an App
 * Store Connect API key (issuer id + key id + .p8) that the account holder has to
 * issue. If that key ever exists, this becomes a server-side fetch and the
 * "manual" hint below should go with it.
 *
 * Rendered with a "+" on purpose: a rounded floor is honest about being rounded
 * in a way that a precise-looking stale number is not.
 */
const APP_DOWNLOADS = { display: "2,000+", checked: "24 Aug 2026" } as const;

function daysSinceLaunch(now: Date): number {
  const start = new Date(LAUNCH.year, LAUNCH.month, LAUNCH.day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Both are local midnight, so the difference is a whole number of days and is
  // immune to daylight saving shifting the clock by an hour.
  const days = Math.round((today.getTime() - start.getTime()) / 86_400_000);
  return days + 1; // launch day is day 1, not day 0
}

/** One metric inside a stacked panel. */
function StatRow({
  label,
  value,
  loading,
  hint,
}: {
  label: string;
  value: number | string;
  loading?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-4">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
      </div>
      {loading ? (
        <div className="h-6 w-14 shrink-0 animate-pulse rounded bg-slate-100" />
      ) : (
        <p className="shrink-0 text-xl font-semibold tabular-nums text-slate-900">{value}</p>
      )}
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * The counter is computed after mount, not during render.
 *
 * This page is prerendered, so `new Date()` in render would bake the build date
 * into the HTML and then disagree with the client on hydration. Rendering a dash
 * until the effect runs is the honest version — and it is invisible in practice.
 */
function DayCounter() {
  const [day, setDay] = useState<number | null>(null);
  useEffect(() => setDay(daysSinceLaunch(new Date())), []);

  const launchLabel = new Date(LAUNCH.year, LAUNCH.month, LAUNCH.day).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  // Both derived from the same date by arithmetic, so neither can drift away from
  // the number above them. The next hundred gives the tile something to hold in
  // the space under the counter without a second data source.
  const weeks = day === null ? null : Math.floor(day / 7);
  const milestone = day === null ? null : Math.floor(day / 100) * 100 + 100;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-sm">
      {/* Two soft highlights, drawn behind the content. Purely decorative, hence
          aria-hidden and pointer-events-none — they must never eat a click. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-violet-400/10 blur-3xl"
      />

      <p className="relative text-xs font-medium uppercase tracking-wider text-slate-400">Day</p>

      <div className="relative flex flex-1 flex-col items-center justify-center py-6">
        <p className="text-7xl font-semibold leading-none tabular-nums text-white">
          {day === null ? "—" : day.toLocaleString()}
        </p>
        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">
          live
        </p>
      </div>

      <div className="relative border-t border-white/10 pt-3">
        <div className="flex items-baseline justify-between gap-3 text-[11px]">
          <span className="text-slate-400">Since {launchLabel}</span>
          <span className="tabular-nums text-slate-300">
            {weeks === null ? "—" : `${weeks} weeks`}
          </span>
        </div>
        {day !== null && milestone !== null && (
          <p className="mt-1.5 text-[11px] tabular-nums text-slate-500">
            Day {milestone} in {milestone - day} days
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * A two-slice ring. Deliberately not a pie: the question these answer is always
 * "what share of the whole", and a ring keeps the total legible in the middle
 * instead of making the reader estimate two wedges.
 */
function Donut({
  parts,
  centerValue,
  centerLabel,
}: {
  parts: { label: string; value: number; className: string; stroke: string }[];
  centerValue: string;
  centerLabel: string;
}) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      {/* The centre label is HTML on top of the ring, not <text> inside it. The
          svg is rotated -90deg so the first slice starts at twelve o'clock, and
          any text inside inherits that rotation plus SVG's own baseline rules —
          which is what had it sitting low and off-centre. An absolutely
          positioned flex box centres in both axes with no arithmetic. */}
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#f1f5f9" strokeWidth="12" />
          {total > 0 &&
            parts.map((p) => {
              const len = (p.value / total) * C;
              const el = (
                <circle
                  key={p.label}
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke={p.stroke}
                  strokeWidth="12"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="text-lg font-semibold tabular-nums text-slate-900">{centerValue}</span>
          <span className="mt-0.5 text-[10px] text-slate-400">{centerLabel}</span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2">
        {parts.map((p) => (
          <li key={p.label} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${p.className}`} />
              <span className="truncate text-slate-700">{p.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-slate-900">
              <span className="font-medium">{p.value.toLocaleString()}</span>
              <span className="ml-1.5 text-xs text-slate-400">
                {total > 0 ? `${Math.round((p.value / total) * 100)}%` : "—"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarList({
  rows,
  color = "bg-slate-800",
  collapsedRows = BAR_LIST_COLLAPSED,
  showPct = false,
}: {
  rows: { label: string; count: number; color?: string; display?: string }[];
  color?: string;
  collapsedRows?: number;
  /** Share of the summed rows, beside each count. Only meaningful when the rows
   *  partition one whole — a share of a partial list is a misleading number. */
  showPct?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  if (rows.length === 0) return <p className="text-sm text-slate-500">No data.</p>;
  const max = Math.max(1, ...rows.map((r) => r.count));
  const sum = rows.reduce((a, r) => a + r.count, 0);
  const collapsible = rows.length > collapsedRows;
  const visible = collapsible && !expanded ? rows.slice(0, collapsedRows) : rows;

  return (
    <div className="space-y-2">
      {visible.map((r) => (
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
          <span className="w-12 shrink-0 text-right text-sm font-medium tabular-nums text-slate-900">
            {r.display ?? r.count}
          </span>
          {showPct && (
            <span className="w-9 shrink-0 text-right text-xs tabular-nums text-slate-400">
              {sum > 0 ? `${Math.round((r.count / sum) * 100)}%` : "—"}
            </span>
          )}
        </div>
      ))}

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-1 inline-flex items-center gap-1 rounded-lg px-1 py-0.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
        >
          {expanded ? "Show less" : `Show all ${rows.length}`}
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
            className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.23 8.29a.75.75 0 0 1 0-1.08Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
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
            value === g ? "bg-slate-800 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
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

      {/* Left column stacks the two "what is on the board" panels; Sales is a
          single tall panel beside them. Without the wrapper the grid stretched
          the short left cell to match Sales and left a block of white space. */}
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Section title="Posts by status" total={sumCounts(data.posts.byStatus)}>
            <BarList
              rows={data.posts.byStatus.map((s) => ({
                label: s.status,
                count: s.count,
                color: STATUS_COLORS[s.status] ?? "bg-slate-500",
              }))}
            />

            {/* Community posts share this panel because they answer the same
              question one pillar over: what is actually being written here. The
              scale is worth seeing next to the marketplace rather than on its
              own page — a few dozen posts beside a few thousand listings is the
              finding. Topics render at zero rather than being dropped: a topic
              nobody posts in is information. */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Community posts by topic</h3>
                <span className="shrink-0 text-xs font-medium text-slate-400">
                  n = {data.community.total}
                </span>
              </div>
              <BarList
                rows={data.community.byTopic.map((t) => ({ label: t.topic, count: t.count }))}
                color="bg-teal-500"
              />
              <p className="mt-3 text-xs text-slate-400">
                {data.community.replies.toLocaleString()} replies
                {data.community.restricted > 0 ? ` · ${data.community.restricted} restricted` : ""}
              </p>
            </div>
          </Section>

          <Section
            title="How listings are created"
            total={data.creation.single + data.creation.bulk}
          >
            <Donut
              parts={[
                {
                  label: "One at a time",
                  value: data.creation.single,
                  className: "bg-slate-800",
                  stroke: "#1e293b",
                },
                {
                  label: "Bulk (photos to AI)",
                  value: data.creation.bulk,
                  className: "bg-violet-500",
                  stroke: "#8b5cf6",
                },
              ]}
              centerValue={(data.creation.single + data.creation.bulk).toLocaleString()}
              centerLabel="listings"
            />
          </Section>
        </div>

        {/* Sales sits beside status because it is the same question one level
            deeper: of everything that left the board, what actually traded. */}
        <Section title="Sales" total={data.sales.sold}>
          <div className="space-y-5">
            <Donut
              parts={[
                {
                  label: "Sold through PopOut",
                  value: data.sales.onPlatform,
                  className: "bg-emerald-500",
                  stroke: "#10b981",
                },
                {
                  label: "Sold elsewhere",
                  value: data.sales.elsewhere,
                  className: "bg-slate-300",
                  stroke: "#cbd5e1",
                },
              ]}
              centerValue={data.sales.sold.toLocaleString()}
              centerLabel="sold"
            />
            <p className="text-xs leading-relaxed text-slate-400">
              A seller records a sale by picking the buyer from the people who messaged them, so
              every sold listing has a buyer. Where that conversation carries no messages at all,
              the trade was arranged somewhere else and only recorded here — those are excluded from
              the price split below.
            </p>
            <div className="border-t border-slate-100 pt-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Of the {data.sales.onPlatform.toLocaleString()} sold through PopOut
              </h3>

              {/* The split was a sentence before, which buried it. Two bars make
                  the ratio the first thing read, which is what it is. */}
              <BarList
                rows={[
                  {
                    label: "Full price",
                    count: data.sales.atOriginalPrice,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Price dropped",
                    count: data.sales.afterPriceDrop,
                    color: "bg-rose-500",
                  },
                ]}
                showPct
              />

              <div className="mt-5 border-t border-slate-100 pt-4">
                <h3 className="mb-1 text-sm font-semibold text-slate-900">
                  How deep the drops went
                </h3>
                <p className="mb-3 text-[11px] text-slate-400">
                  Measured against the previous price, which is all the database keeps — a seller
                  who went 100 → 80 → 65 counts as 19% off, not 35%. Every figure is a floor.
                  {data.sales.medianDiscountPct != null
                    ? ` Median ${Math.round(data.sales.medianDiscountPct)}% off.`
                    : ""}
                </p>
                <BarList
                  rows={data.sales.discountBuckets.map((b) => ({
                    label: b.label,
                    count: b.count,
                    color: "bg-rose-500",
                  }))}
                  collapsedRows={6}
                />
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <h3 className="mb-1 text-sm font-semibold text-slate-900">How long they sat</h3>
                <p className="mb-3 text-[11px] text-slate-400">
                  Median days to sale. Two clocks: a discounted listing is timed from the price cut,
                  a full-price one from the day it went up — it has no other starting line.
                </p>
                {data.sales.medianDaysAfterDrop != null &&
                data.sales.medianDaysFullPrice != null ? (
                  <>
                    <BarList
                      rows={[
                        {
                          label: "After last drop",
                          count: data.sales.medianDaysAfterDrop,
                          display: `${data.sales.medianDaysAfterDrop.toFixed(1)}d`,
                          color: "bg-rose-500",
                        },
                        {
                          label: "From listing",
                          count: data.sales.medianDaysFullPrice,
                          display: `${data.sales.medianDaysFullPrice.toFixed(1)}d`,
                          color: "bg-emerald-500",
                        },
                      ]}
                    />
                    <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                      {data.sales.daysAfterDropCovered ?? 0} of {data.sales.afterPriceDrop}{" "}
                      discounted sales carry a dated drop · {data.sales.daysFullPriceCovered ?? 0}{" "}
                      full-price sales.
                    </p>
                  </>
                ) : (
                  // Rendered instead of a zero-length bar: a missing median and a
                  // median of zero are different facts, and the bar cannot say which.
                  <p className="text-sm text-slate-500">
                    No discounted sale has a dated price drop yet.
                  </p>
                )}
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                  A drop is only dated when a save notification went out, so listings nobody had
                  saved are missing here — and those are the slower ones. Read the first bar as a
                  best case.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
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

      {/* Left: the three counts, stacked. Middle: how long we have been live.
          Right: engagement, reserved — the numbers are placeholders until the
          DAU/WAU source is wired up, and they are labelled as such so nobody
          reads a hard zero as a measurement. */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="justify-center divide-y divide-slate-100">
          <StatRow label="Available posts" value={data?.posts.available ?? 0} loading={loading} />
          <StatRow label="Active users" value={data?.users.active ?? 0} loading={loading} />
          <StatRow label="Posts · last 7 days" value={data?.posts.last7d ?? 0} loading={loading} />
          {/* The in-app figure: listings the seller completed through PopOut, i.e.
              they picked the buyer out of their own chats. It deliberately excludes
              the ones marked "Other (sold elsewhere)" — the Sales panel below shows
              both halves. Switch to `posts.byStatus` if the combined total is ever
              wanted here instead. */}
          <StatRow label="Sold" value={data?.sales.onPlatform ?? 0} loading={loading} />
        </Panel>

        <DayCounter />

        {/* DAU / WAU / MAU are placeholders awaiting a real source, and are NOT
            computed here. The only signal this database holds is
            `profiles.last_active_at` — one timestamp per account, overwritten on
            every use. It can answer "active right now" but can never be replayed
            into a historical curve, so a real source needs an event table or a
            nightly snapshot. The hint stops a hard zero being read as a
            measurement. */}
        <Panel className="justify-center divide-y divide-slate-100">
          {/* Downloads sits with these rather than with the marketplace counts
              because it shares their defining property: it does not come from
              this database. The hint carries the date so a stale figure looks
              stale instead of looking live. */}
          <StatRow
            label="Downloads"
            value={APP_DOWNLOADS.display}
            hint={`Manual · ${APP_DOWNLOADS.checked}`}
          />
          <StatRow label="DAU" value={0} hint="Not connected yet" />
          <StatRow label="WAU" value={0} hint="Not connected yet" />
          <StatRow label="MAU" value={0} hint="Not connected yet" />
          <StatRow
            label="Messages · last 7 days"
            value={data?.activity.messages7d ?? 0}
            loading={loading}
          />
        </Panel>
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
