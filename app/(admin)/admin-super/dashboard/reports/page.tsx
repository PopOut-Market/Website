"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { getPostImageUrl } from "@/lib/supabase/post-image-url";
import { useEffect, useState } from "react";

type ReportRow = {
  id: string;
  kind: "post" | "user";
  reason: string;
  details: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reporterName: string;
  target: string;
  postId: number | null;
  conversationId: string | null;
  reporterId: string | null;
  reportedId: string | null;
};

type Stats = { total: number; pending: number; reviewed: number; actioned: number; dismissed: number };
type ActionStatus = "pending" | "reviewed" | "actioned" | "dismissed";

type PostDetail = {
  id: number;
  title: string | null;
  description: string | null;
  priceCents: number | null;
  status: string | null;
  sellerId: string | null;
  sellerName: string | null;
  createdAt: string;
  originalLocale: string | null;
  photos: string[];
};
type ChatMsg = {
  id: string;
  senderId: string | null;
  senderName: string;
  type: string | null;
  content: string | null;
  translatedContent: string | null;
  targetLocale: string | null;
  sourceLocale: string | null;
  createdAt: string;
};
type Detail = {
  post: PostDetail | null;
  conversation?: {
    buyerId: string | null;
    sellerId: string | null;
    buyerName: string | null;
    sellerName: string | null;
  } | null;
  messages?: ChatMsg[];
};
type DetailState = { loading?: true; error?: string; data?: Detail };

const EMPTY_STATS: Stats = { total: 0, pending: 0, reviewed: 0, actioned: 0, dismissed: 0 };
const STATUS_FILTERS = ["All", "Pending", "Reviewed", "Actioned", "Dismissed"] as const;
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  reviewed: "bg-sky-100 text-sky-700",
  actioned: "bg-emerald-100 text-emerald-700",
  dismissed: "bg-slate-200 text-slate-600",
};

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
function priceLabel(cents: number | null): string {
  return cents == null ? "—" : aud.format(cents / 100);
}
function fmtDate(iso: string): string {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? new Date(t).toLocaleDateString() : "—";
}
function fmtTime(iso: string): string {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? new Date(t).toLocaleString() : "";
}

function recomputeStats(rows: ReportRow[]): Stats {
  return {
    total: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    reviewed: rows.filter((r) => r.status === "reviewed").length,
    actioned: rows.filter((r) => r.status === "actioned").length,
    dismissed: rows.filter((r) => r.status === "dismissed").length,
  };
}

export default function ReportsPage() {
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, DetailState>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApiFetch("/api/admin/reports", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        setStats(json.stats ?? EMPTY_STATS);
        setRows((json.rows ?? []) as ReportRow[]);
      } catch {
        /* leave empty */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function loadDetail(row: ReportRow) {
    if (details[row.id]?.data || details[row.id]?.loading) return;
    const qs =
      row.kind === "post"
        ? row.postId != null
          ? `postId=${row.postId}`
          : null
        : row.conversationId
          ? `conversationId=${encodeURIComponent(row.conversationId)}`
          : null;
    if (!qs) {
      setDetails((d) => ({ ...d, [row.id]: { error: "No linked content for this report." } }));
      return;
    }
    setDetails((d) => ({ ...d, [row.id]: { loading: true } }));
    try {
      const res = await adminApiFetch(`/api/admin/report-detail?${qs}`, { cache: "no-store" });
      const json = await res.json();
      setDetails((d) => ({
        ...d,
        [row.id]: res.ok ? { data: json as Detail } : { error: json?.error ?? "Failed to load." },
      }));
    } catch {
      setDetails((d) => ({ ...d, [row.id]: { error: "Network error." } }));
    }
  }

  function toggle(row: ReportRow) {
    setExpandedId((prev) => {
      const next = prev === row.id ? null : row.id;
      if (next) loadDetail(row);
      return next;
    });
  }

  async function updateStatus(row: ReportRow, status: ActionStatus) {
    setBusyId(row.id);
    try {
      const res = await adminApiFetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, kind: row.kind, status, admin_notes: noteFor[row.id] ?? "" }),
      });
      if (!res.ok) {
        alert("Update failed. Please try again.");
        return;
      }
      setRows((prev) => {
        const next = prev.map((r) =>
          r.id === row.id ? { ...r, status, admin_notes: noteFor[row.id]?.trim() || r.admin_notes } : r,
        );
        setStats(recomputeStats(next));
        return next;
      });
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = filter === "All" ? rows : rows.filter((r) => r.status === filter.toLowerCase());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Click a report to expand it — post reports show the listing; user reports show the chat
          between the two people plus the listing it was about.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="Total" total={stats.total} loading={loading} />
        <KpiCard label="Pending" total={stats.pending} loading={loading} />
        <KpiCard label="Reviewed" total={stats.reviewed} loading={loading} />
        <KpiCard label="Actioned" total={stats.actioned} loading={loading} />
        <KpiCard label="Dismissed" total={stats.dismissed} loading={loading} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              filter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="mb-3 text-4xl">🚩</div>
          <p className="text-sm font-medium text-slate-700">No reports in this view.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((r) => (
            <ReportCard
              key={r.id}
              row={r}
              isOpen={expandedId === r.id}
              detail={details[r.id]}
              busy={busyId === r.id}
              note={noteFor[r.id] ?? ""}
              onNote={(v) => setNoteFor((p) => ({ ...p, [r.id]: v }))}
              onToggle={() => toggle(r)}
              onStatus={(s) => updateStatus(r, s)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportCard({
  row,
  isOpen,
  detail,
  busy,
  note,
  onNote,
  onToggle,
  onStatus,
}: {
  row: ReportRow;
  isOpen: boolean;
  detail: DetailState | undefined;
  busy: boolean;
  note: string;
  onNote: (v: string) => void;
  onToggle: () => void;
  onStatus: (s: ActionStatus) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 p-4">
        <button onClick={onToggle} className="flex min-w-0 flex-1 items-start gap-3 text-left">
          <span className="mt-0.5 text-slate-400">{isOpen ? "▾" : "▸"}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                  row.kind === "post" ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {row.kind === "post" ? "post report" : "user report"}
              </span>
              <span className="truncate text-sm font-semibold text-slate-900">{row.target}</span>
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                  STATUS_STYLES[row.status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {row.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {row.reason.replace(/_/g, " ")} · by {row.reporterName}
              {row.details ? ` — ${row.details}` : ""}
            </p>
          </div>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="text-xs text-slate-400">{fmtDate(row.created_at)}</span>
          {row.status === "pending" ? (
            <div className="flex flex-col items-end gap-1.5">
              <input
                type="text"
                value={note}
                onChange={(e) => onNote(e.target.value)}
                placeholder="Note (optional)"
                className="w-36 rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:border-slate-400"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onStatus("actioned")}
                  title="Report is valid — action taken"
                  className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  Action
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onStatus("reviewed")}
                  title="Seen, no action yet"
                  className="rounded bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-200 disabled:opacity-50"
                >
                  Reviewed
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onStatus("dismissed")}
                  title="Report is invalid — dismiss"
                  className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-300 disabled:opacity-50"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div className="text-right">
              <button
                type="button"
                disabled={busy}
                onClick={() => onStatus("pending")}
                title="Re-open this report"
                className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline disabled:opacity-50"
              >
                re-open
              </button>
              {row.admin_notes && (
                <span className="block max-w-44 truncate text-xs text-slate-400">{row.admin_notes}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/60 p-4">
          {!detail || detail.loading ? (
            <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
          ) : detail.error ? (
            <p className="text-sm text-rose-600">{detail.error}</p>
          ) : row.kind === "user" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <ChatThread
                messages={detail.data?.messages ?? []}
                reporterId={row.reporterId}
                reportedId={row.reportedId}
                reporterName={row.reporterName}
                reportedName={row.target}
              />
              <PostCard post={detail.data?.post ?? null} label="Listing the chat was about" />
            </div>
          ) : (
            <PostCard post={detail.data?.post ?? null} label="Reported listing" />
          )}
        </div>
      )}
    </div>
  );
}

const LANG_TABS = [
  { key: "original", label: "原文" },
  { key: "zh", label: "中文" },
  { key: "ko", label: "한국어" },
  { key: "en", label: "English" },
] as const;
type LangKey = (typeof LANG_TABS)[number]["key"];

function localeMatches(loc: string | null, lang: "zh" | "ko" | "en"): boolean {
  if (!loc) return false;
  const l = loc.toLowerCase();
  return lang === "zh" ? l.startsWith("zh") : l.startsWith(lang);
}

function ChatThread({
  messages,
  reporterId,
  reportedId,
  reporterName,
  reportedName,
}: {
  messages: ChatMsg[];
  reporterId: string | null;
  reportedId: string | null;
  reporterName: string;
  reportedName: string;
}) {
  const [lang, setLang] = useState<LangKey>("original");
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-slate-100 px-3 py-2 text-xs">
        <span className="font-semibold text-slate-500">Chat</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> {reporterName} (reporter)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> {reportedName} (reported)
        </span>
        <div className="ml-auto inline-flex overflow-hidden rounded-md border border-slate-200">
          {LANG_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setLang(t.key)}
              className={`px-2 py-0.5 text-[11px] font-medium transition ${
                lang === t.key ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {messages.length === 0 ? (
        <p className="px-3 py-6 text-center text-sm text-slate-400">No messages in this conversation.</p>
      ) : (
        <div className="max-h-[28rem] space-y-2 overflow-y-auto p-3">
          {messages.map((m) => {
            const isReporter = m.senderId && m.senderId === reporterId;
            const isReported = m.senderId && m.senderId === reportedId;
            const isImage = m.type === "image";
            // Resolve the bubble text for the chosen language using only stored
            // data: prefer the stored translation when its target matches, else the
            // original if it's already in that language, else fall back to original.
            let text = m.content;
            let kind: "translated" | "native" | "fallback" = "native";
            if (lang !== "original" && !isImage) {
              if (localeMatches(m.targetLocale, lang) && m.translatedContent) {
                text = m.translatedContent;
                kind = "translated";
              } else if (localeMatches(m.sourceLocale, lang)) {
                text = m.content;
                kind = "native";
              } else {
                text = m.content;
                kind = "fallback";
              }
            }
            return (
              <div key={m.id} className={`flex ${isReporter ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                    isReporter
                      ? "bg-rose-50 text-slate-800"
                      : isReported
                        ? "bg-slate-100 text-slate-800"
                        : "bg-amber-50 text-slate-800"
                  }`}
                >
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">{m.senderName}</span>
                    <span className="text-[10px] text-slate-400">{fmtTime(m.createdAt)}</span>
                    {kind === "translated" && m.targetLocale && (
                      <span className="rounded bg-sky-100 px-1 text-[10px] font-medium text-sky-700">
                        {m.targetLocale} 译
                      </span>
                    )}
                  </div>
                  {isImage ? (
                    <span className="text-sm text-slate-500">📷 Photo</span>
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-sm">{text || "(empty)"}</p>
                  )}
                  {kind === "fallback" && (
                    <span className="mt-0.5 block text-[10px] italic text-slate-400">
                      原文（无此语言译文）
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, label }: { post: PostDetail | null; label: string }) {
  if (!post) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-400">
        No linked listing.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>

      {post.photos.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {post.photos.map((path, i) => {
            const url = getPostImageUrl(path);
            return url ? (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="h-28 w-28 rounded-lg border border-slate-200 object-cover transition hover:opacity-80"
                />
              </a>
            ) : null;
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-slate-900">{post.title || "(untitled)"}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {priceLabel(post.priceCents)}
        </span>
        {post.status && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {post.status}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Seller: {post.sellerName ?? "—"} · Posted {fmtDate(post.createdAt)} · #{post.id}
        {post.originalLocale ? ` · language ${post.originalLocale} (not translated)` : ""}
      </p>
      {post.description && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{post.description}</p>
      )}
    </div>
  );
}
