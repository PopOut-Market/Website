"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { useEffect, useState } from "react";

type Recipient = { nickname: string; count: number; lastAt: string | null };
type Recent = { id: string; nickname: string; revealedAt: string | null };
type Data = {
  total: number;
  remaining: number;
  revealed: number;
  recipients: Recipient[];
  recent: Recent[];
};

function fmt(iso: string | null): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? new Date(t).toLocaleString() : "—";
}

export default function VouchersPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApiFetch("/api/admin/vouchers", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => null);
          setError(j?.error ?? `Request failed (${r.status}).`);
          return;
        }
        setData((await r.json()) as Data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Vouchers</h1>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            $5 Woolworths
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Each voucher is a $5 Woolworths gift card. How many remain, how many were revealed, and
          who revealed them.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard label="Remaining" total={data?.remaining ?? 0} loading={loading} />
        <KpiCard label="Revealed" total={data?.revealed ?? 0} loading={loading} />
        <KpiCard label="Total" total={data?.total ?? 0} loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Who got vouchers</h2>
          {loading ? (
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
          ) : data && data.recipients.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.recipients.map((r) => (
                <div key={r.nickname} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-slate-800">{r.nickname}</span>
                  <span className="text-sm text-slate-500">
                    {r.count} voucher{r.count === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No vouchers revealed yet.</p>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Recent reveals</h2>
          {loading ? (
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
          ) : data && data.recent.length > 0 ? (
            <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {data.recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 py-2">
                  <span className="text-sm font-medium text-slate-700">{r.nickname}</span>
                  <span className="shrink-0 text-xs text-slate-400">{fmt(r.revealedAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No reveals yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
