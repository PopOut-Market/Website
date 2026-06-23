"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
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
};

type Stats = {
  total: number;
  pending: number;
  reviewed: number;
  actioned: number;
  dismissed: number;
};

type ActionStatus = "pending" | "reviewed" | "actioned" | "dismissed";

const EMPTY_STATS: Stats = { total: 0, pending: 0, reviewed: 0, actioned: 0, dismissed: 0 };

const STATUS_FILTERS = ["All", "Pending", "Reviewed", "Actioned", "Dismissed"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  reviewed: "bg-sky-100 text-sky-700",
  actioned: "bg-emerald-100 text-emerald-700",
  dismissed: "bg-slate-200 text-slate-600",
};

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

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await adminApiFetch("/api/admin/reports", { cache: "no-store" });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const json = await res.json();
        setStats(json.stats ?? EMPTY_STATS);
        setRows((json.rows ?? []) as ReportRow[]);
      } catch {
        /* network error — leave empty */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function updateStatus(row: ReportRow, status: ActionStatus) {
    setBusyId(row.id);
    try {
      const res = await adminApiFetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          kind: row.kind,
          status,
          admin_notes: noteFor[row.id] ?? "",
        }),
      });
      if (!res.ok) {
        alert("Update failed. Please try again.");
        return;
      }
      setRows((prev) => {
        const next = prev.map((r) =>
          r.id === row.id
            ? { ...r, status, admin_notes: noteFor[row.id]?.trim() || r.admin_notes }
            : r,
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
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reports</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="Total" total={stats.total} loading={loading} />
        <KpiCard label="Pending" total={stats.pending} loading={loading} />
        <KpiCard label="Reviewed" total={stats.reviewed} loading={loading} />
        <KpiCard label="Actioned" total={stats.actioned} loading={loading} />
        <KpiCard label="Dismissed" total={stats.dismissed} loading={loading} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                filter === s
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 text-4xl">🚩</div>
            <p className="text-sm font-medium text-slate-700">No reports in this view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Target</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Reporter</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 align-top">
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                          r.kind === "post"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {r.kind}
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-800">{r.target}</td>
                    <td className="py-2 pr-4">
                      <span className="text-slate-700">{r.reason.replace(/_/g, " ")}</span>
                      {r.details && (
                        <span className="block text-xs text-slate-400">{r.details}</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">{r.reporterName}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                          STATUS_STYLES[r.status] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-xs text-slate-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-4">
                      {r.status === "pending" ? (
                        <div className="flex flex-col items-end gap-1.5">
                          <input
                            type="text"
                            value={noteFor[r.id] ?? ""}
                            onChange={(e) => setNoteFor((p) => ({ ...p, [r.id]: e.target.value }))}
                            placeholder="Note (optional)"
                            className="w-40 rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:border-slate-400"
                          />
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              disabled={busyId === r.id}
                              onClick={() => updateStatus(r, "actioned")}
                              title="Report is valid — action taken"
                              className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Action
                            </button>
                            <button
                              type="button"
                              disabled={busyId === r.id}
                              onClick={() => updateStatus(r, "reviewed")}
                              title="Seen, no action yet"
                              className="rounded bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-200 disabled:opacity-50"
                            >
                              Reviewed
                            </button>
                            <button
                              type="button"
                              disabled={busyId === r.id}
                              onClick={() => updateStatus(r, "dismissed")}
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
                            disabled={busyId === r.id}
                            onClick={() => updateStatus(r, "pending")}
                            title="Re-open this report"
                            className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline disabled:opacity-50"
                          >
                            re-open
                          </button>
                          {r.admin_notes && (
                            <span className="block max-w-40 truncate text-xs text-slate-400">
                              {r.admin_notes}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
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
