"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  type GraphLink,
  type GraphNode,
  InvitationGraph,
} from "@/components/admin/invitation-graph";
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Invitations</h1>
        <p className="mt-1 text-sm text-slate-600">
          Who invited whom — the referral tree from reward invitations. Arrows point from inviter to
          invitee.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard label="Invitations" total={data?.links.length ?? 0} loading={loading} />
        <KpiCard label="Inviters" total={inviters} loading={loading} />
        <KpiCard label="Pending (phone-only)" total={data?.pending ?? 0} loading={loading} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? (
          <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
        ) : data ? (
          <>
            <InvitationGraph nodes={data.nodes} links={data.links} />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" /> inviter
                (size = # invites)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full border border-slate-400 bg-white" />{" "}
                invitee
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-emerald-500" /> reward paid
              </span>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
