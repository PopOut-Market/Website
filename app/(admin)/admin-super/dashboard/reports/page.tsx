"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { useState } from "react";

const MOCK_STATS = { total: 0, pending: 0, resolved: 0, dismissed: 0 };
const STATUS_FILTERS = ["All", "Pending", "Resolved", "Dismissed"] as const;

export default function ReportsPage() {
  const [filter, setFilter] = useState<string>("All");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reports</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Reports" total={MOCK_STATS.total} />
        <KpiCard label="Pending" total={MOCK_STATS.pending} />
        <KpiCard label="Resolved" total={MOCK_STATS.resolved} />
        <KpiCard label="Dismissed" total={MOCK_STATS.dismissed} />
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

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 text-4xl">🚩</div>
          <p className="text-sm font-medium text-slate-700">No reports data yet</p>
          <p className="mt-1 text-xs text-slate-500">
            The <code className="rounded bg-slate-100 px-1 py-0.5">reports</code> table has not been
            created. This is a UI shell — connect it once the table is ready.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Suggested Table Structure
          </h3>
          <pre className="mt-2 overflow-x-auto text-xs leading-relaxed text-slate-600">
{`create table public.reports (
  id            bigint generated always as identity primary key,
  reporter_id   uuid references auth.users(id),
  target_type   text check (target_type in ('post','user','message')),
  target_id     text not null,
  reason        text not null,
  details       text,
  status        text default 'pending'
                  check (status in ('pending','resolved','dismissed')),
  resolved_by   uuid references auth.users(id),
  created_at    timestamptz default now(),
  resolved_at   timestamptz
);`}
          </pre>
        </div>
      </section>
    </div>
  );
}
