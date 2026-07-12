"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  type GraphLink,
  type GraphNode,
  InvitationLeaderboard,
} from "@/components/admin/invitation-leaderboard";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { useEffect, useState } from "react";

type Data = { nodes: GraphNode[]; links: GraphLink[]; pending: number };

export default function InvitationsPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApiFetch("/api/admin/invitations", { cache: "no-store" })
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

  const inviters = data ? data.nodes.filter((n) => n.invites > 0).length : 0;
  const paidRate =
    data && data.links.length > 0
      ? `${Math.round((data.links.filter((l) => l.paid).length / data.links.length) * 100)}%`
      : "0%";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Invitations</h1>
        <p className="mt-1 text-sm text-slate-600">
          Top referrers from reward invitations, ranked. Click a row to see exactly who that person
          invited and which rewards were paid.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Invitations" total={data?.links.length ?? 0} loading={loading} />
        <KpiCard label="Inviters" total={inviters} loading={loading} />
        <KpiCard label="Reward paid rate" total={paidRate} loading={loading} />
        <KpiCard label="Pending (phone-only)" total={data?.pending ?? 0} loading={loading} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? (
          <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
        ) : data ? (
          <>
            <InvitationLeaderboard nodes={data.nodes} links={data.links} />
            <p className="mt-3 text-xs text-slate-500">
              <span className="font-medium text-slate-600">Paid %</span> = rewards paid ÷ invitees
              who joined · <span className="font-medium text-slate-600">Reach</span> = total
              downstream invitees (their invitees&rsquo; invitees…). Click any row to expand that
              referrer&rsquo;s tree.
            </p>
          </>
        ) : null}
      </section>
    </div>
  );
}
