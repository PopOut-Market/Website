"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  bucketFill,
  type MapSuburb,
  SuburbUserMap,
  UserMapLegend,
} from "@/components/admin/suburb-user-map";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { useEffect, useMemo, useRef, useState } from "react";

type MapData = {
  suburbs: MapSuburb[];
  totalUsers: number;
  unassigned: number;
  outsideServiceArea: number;
  truncated: boolean;
  generatedAt: string;
};

export default function UserMapPage() {
  const [data, setData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [focusId, setFocusId] = useState<number | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    adminApiFetch("/api/admin/user-map", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => null);
          setError(j?.error ?? `Request failed (${r.status}).`);
          return;
        }
        setData((await r.json()) as MapData);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const ranked = useMemo(() => {
    if (!data) return [];
    return data.suburbs
      .filter((s) => s.users > 0)
      .sort((a, b) => b.users - a.users || a.name.localeCompare(b.name));
  }, [data]);

  // True position in the full ranking, so filtering the list never renumbers it.
  const rank = useMemo(() => new Map(ranked.map((s, i) => [s.id, i + 1])), [ranked]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? ranked.filter((s) => s.name.toLowerCase().includes(q)) : ranked;
  }, [ranked, search]);

  // Clicking a suburb on the map should also reveal its row — the rank and share
  // are the half of the answer the map itself cannot show.
  useEffect(() => {
    if (focusId === null) return;
    listRef.current
      ?.querySelector(`[data-suburb="${focusId}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [focusId]);

  const mapped = ranked.reduce((n, s) => n + s.users, 0);
  const top = ranked[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Suburb map</h1>
        <p className="mt-1 text-sm text-slate-600">
          Where our users are. Each suburb is shaded by how many live accounts have verified into it
          — darker means more users, grey means none yet. Hover a suburb for its count, or pick a
          row in the table to zoom to it.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      {data?.truncated && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Some suburb boundaries were cut off by the database row cap — the map is incomplete. The
          table below is still correct for the suburbs shown.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Users on the map" total={mapped.toLocaleString()} loading={loading} />
        <KpiCard
          label="Suburbs with users"
          total={data ? `${ranked.length} / ${data.suburbs.length}` : "—"}
          loading={loading}
        />
        <KpiCard label="Busiest suburb" total={top ? top.name : "—"} loading={loading} />
        <KpiCard
          label="No suburb yet"
          total={data ? (data.unassigned + data.outsideServiceArea).toLocaleString() : "—"}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm xl:col-span-2">
          {loading ? (
            <div className="h-[600px] animate-pulse rounded-lg bg-slate-100" />
          ) : data && data.suburbs.length > 0 ? (
            <div className="relative">
              <SuburbUserMap
                suburbs={data.suburbs}
                focusId={focusId}
                onSelect={setFocusId}
                resetToken={resetToken}
                className="h-[600px] w-full rounded-lg"
              />
              {focusId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setFocusId(null);
                    setResetToken((n) => n + 1);
                  }}
                  className="absolute right-3 top-3 z-[500] rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Whole city
                </button>
              )}
              <div className="pointer-events-none absolute bottom-3 left-3 z-[500]">
                <UserMapLegend />
              </div>
            </div>
          ) : (
            <div className="flex h-[600px] items-center justify-center text-sm text-slate-500">
              No suburb boundaries to draw.
            </div>
          )}
        </section>

        <section className="flex max-h-[616px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Ranked by users{" "}
              <span className="font-normal text-slate-500">({ranked.length} suburbs)</span>
            </h2>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a suburb…"
              className="w-40 rounded-lg border border-slate-200 px-3 py-1.5 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 sm:text-sm"
            />
          </div>

          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white text-left text-xs uppercase tracking-wider text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-2 font-medium">#</th>
                  <th className="py-2 pr-2 font-medium">Suburb</th>
                  <th className="py-2 pr-2 text-right font-medium">Users</th>
                  <th className="py-2 text-right font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s) => (
                  <tr
                    key={s.id}
                    data-suburb={s.id}
                    onClick={() => setFocusId(s.id)}
                    className={`cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 ${
                      focusId === s.id ? "bg-slate-100" : ""
                    }`}
                  >
                    <td className="py-2 pr-2 tabular-nums text-slate-400">{rank.get(s.id)}</td>
                    <td className="py-2 pr-2">
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 shrink-0 rounded-sm ring-1 ring-inset ring-slate-900/10"
                          style={{ backgroundColor: bucketFill(s.users) }}
                          aria-hidden="true"
                        />
                        <span className="font-medium text-slate-800">{s.name}</span>
                        {s.banned > 0 && (
                          <span
                            className="text-xs text-slate-400"
                            title={`${s.banned} of these accounts are banned`}
                          >
                            ({s.banned} banned)
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-2 pr-2 text-right font-semibold tabular-nums text-slate-900">
                      {s.users.toLocaleString()}
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-500">
                      {mapped > 0 ? `${((s.users / mapped) * 100).toFixed(1)}%` : "—"}
                    </td>
                  </tr>
                ))}
                {shown.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No suburb matches “{search}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <p className="text-xs text-slate-500">
        Counted from each account&apos;s verified suburb — the one their last location check
        confirmed — excluding deleted accounts. Banned accounts are still real accounts sitting in a
        suburb, so they are counted and flagged in the list rather than dropped. Shading is per
        suburb, not per square kilometre: Melbourne CBD is the darkest shape on the map but also one
        of the smallest, so read the ranking beside it for the real order.
        {data ? (
          <>
            {" "}
            {data.unassigned.toLocaleString()} user{data.unassigned === 1 ? "" : "s"} have not
            passed a location check yet
            {data.outsideServiceArea > 0
              ? `, and ${data.outsideServiceArea.toLocaleString()} sit in a suburb that is no longer an active service area`
              : ""}
            , so they appear in no suburb.
          </>
        ) : null}
      </p>
    </div>
  );
}
