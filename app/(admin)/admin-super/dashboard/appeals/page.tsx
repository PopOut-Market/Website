"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import {
  formatDateTime,
  humanize,
  isNotAuthorized,
  mapRpcError,
  reasonLabel,
  UNAUTHORIZED_MESSAGE,
  unwrapRpc,
} from "@/lib/supabase/admin-rpc";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Appeal queue — review seller appeals against restricted listings.
 *
 * Lists open appeals oldest-first via admin_list_appeals, mirroring the
 * reward-review template (direct browser RPC, offset paging, optimistic removal,
 * hand-rolled toast). Each appeal is resolved with admin_resolve_appeal:
 *   - Uphold  → reinstates the listing + notifies the seller.
 *   - Decline → keeps it restricted, notifies the seller, and they CANNOT
 *               appeal again — so Decline is a deliberate confirm.
 * The backend enforces one-appeal-per-takedown, concurrency, and idempotency;
 * we trust the returned `changed` flag and just refresh the queue.
 */

type AppealReport = {
  reason: string | null;
  details: string | null;
  reported_at: string | null;
};

type Appeal = {
  appeal_id: number;
  restriction_id: number;
  post_id: number;
  post_title: string | null;
  reason_code: string;
  source: "manual" | "auto";
  internal_note: string | null;
  body: string | null;
  appealed_at: string | null;
  report_count: number;
  reports: AppealReport[] | null;
};

const PAGE_SIZE = 50;

export default function AppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUnauthorized = useCallback(() => {
    setUnauthorized(true);
    setAppeals([]);
    setHasMore(false);
    setError(UNAUTHORIZED_MESSAGE);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  const fetchPage = useCallback(
    async (nextOffset: number, append: boolean) => {
      if (!isAdminAuthConfigured()) {
        setError("Supabase is not configured.");
        setLoading(false);
        return;
      }
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const sb = getAdminAuthBrowserClient();
        const { data, error: rpcError } = await sb.rpc("admin_list_appeals", {
          p_limit: PAGE_SIZE,
          p_offset: nextOffset,
        });
        if (rpcError) {
          if (isNotAuthorized(rpcError)) {
            handleUnauthorized();
            return;
          }
          setError(mapRpcError(rpcError, "Failed to load appeals."));
          return;
        }
        const rows = Array.isArray(data) ? (data as Appeal[]) : [];
        setAppeals((prev) => (append ? [...prev, ...rows] : rows));
        setOffset(nextOffset + rows.length);
        setHasMore(rows.length === PAGE_SIZE);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load appeals.");
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [handleUnauthorized],
  );

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const handleResolved = useCallback((appealId: number, message: string) => {
    // The server's open set shrank by one — remove the card and pull the paging
    // offset back in step so the next "Load more" doesn't skip an appeal.
    setAppeals((prev) => prev.filter((a) => a.appeal_id !== appealId));
    setOffset((o) => Math.max(0, o - 1));
    setExpanded((prev) => {
      if (!prev.has(appealId)) return prev;
      const next = new Set(prev);
      next.delete(appealId);
      return next;
    });
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const toggleExpand = useCallback((appealId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(appealId)) next.delete(appealId);
      else next.add(appealId);
      return next;
    });
  }, []);

  const autoCount = appeals.filter((a) => a.source === "auto").length;
  const manualCount = appeals.filter((a) => a.source === "manual").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Appeals</h1>
        <p className="mt-1 text-sm text-slate-600">
          Seller appeals against restricted listings, oldest first.{" "}
          <span className="font-medium">Uphold</span> reinstates the listing;{" "}
          <span className="font-medium">Decline</span> keeps it restricted and the seller can&apos;t
          appeal again.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Open appeals"
          total={hasMore ? `${appeals.length}+` : appeals.length}
          loading={loading}
        />
        <KpiCard
          label="Community (auto)"
          total={hasMore ? `${autoCount}+` : autoCount}
          loading={loading}
        />
        <KpiCard
          label="Manual"
          total={hasMore ? `${manualCount}+` : manualCount}
          loading={loading}
        />
      </div>

      {toast && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {toast}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : unauthorized ? null : appeals.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="mb-3 text-4xl">🎉</div>
          <p className="text-sm text-slate-600">No open appeals.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appeals.map((appeal) => (
            <AppealCard
              key={appeal.appeal_id}
              appeal={appeal}
              isOpen={expanded.has(appeal.appeal_id)}
              onToggle={() => toggleExpand(appeal.appeal_id)}
              onResolved={handleResolved}
              onUnauthorized={handleUnauthorized}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => fetchPage(offset, true)}
                disabled={loadingMore}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AppealCard({
  appeal,
  isOpen,
  onToggle,
  onResolved,
  onUnauthorized,
}: {
  appeal: Appeal;
  isOpen: boolean;
  onToggle: () => void;
  onResolved: (appealId: number, message: string) => void;
  onUnauthorized: () => void;
}) {
  const [declining, setDeclining] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<null | "uphold" | "decline">(null);
  const [err, setErr] = useState<string | null>(null);

  const reports = appeal.reports ?? [];
  const title = appeal.post_title?.trim() || `Listing #${appeal.post_id}`;

  async function resolve(uphold: boolean) {
    setBusy(uphold ? "uphold" : "decline");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_resolve_appeal", {
        p_appeal_id: appeal.appeal_id,
        p_uphold: uphold,
        p_note: note.trim() || null,
      });
      if (rpcError) {
        if (isNotAuthorized(rpcError)) {
          onUnauthorized();
          return;
        }
        setErr(mapRpcError(rpcError));
        setBusy(null);
        return;
      }
      // Success → parent removes this card (component unmounts). `changed:false`
      // means it was already resolved/superseded — just refresh by removing it.
      const result = unwrapRpc<{ changed?: boolean }>(data);
      const alreadyResolved = result?.changed === false;
      onResolved(
        appeal.appeal_id,
        alreadyResolved
          ? "This appeal was already resolved — refreshed."
          : uphold
            ? "Appeal upheld — listing reinstated and the seller notified."
            : "Appeal declined — the seller has been notified.",
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed.");
      setBusy(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <span className="text-slate-400">{isOpen ? "▾" : "▸"}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Appealed {formatDateTime(appeal.appealed_at)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            appeal.source === "auto" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
          }`}
          title={appeal.source === "auto" ? "Automatic / community takedown" : "Manual takedown"}
        >
          {appeal.source === "auto" ? "community" : "manual"}
        </span>
        <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:inline">
          {reasonLabel(appeal.reason_code)}
        </span>
        {appeal.source === "auto" && appeal.report_count > 0 && (
          <span
            className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700"
            title="Number of community reports"
          >
            {appeal.report_count} report{appeal.report_count === 1 ? "" : "s"}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-slate-100 bg-slate-50/50 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Listing #{appeal.post_id}</span>
            <span aria-hidden>·</span>
            <span>
              Restricted for <span className="font-medium">{reasonLabel(appeal.reason_code)}</span>
            </span>
          </div>

          {/* Seller's appeal */}
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">Seller&apos;s appeal</p>
            <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              {appeal.body?.trim() || "(no message provided)"}
            </p>
          </div>

          {/* Internal note (operator-only) */}
          {appeal.internal_note?.trim() && (
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">
                Internal note (operator-only)
              </p>
              <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                {appeal.internal_note.trim()}
              </p>
            </div>
          )}

          {/* Underlying reports for auto / community takedowns */}
          {appeal.source === "auto" && (
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">
                Community reports ({appeal.report_count})
              </p>
              {reports.length === 0 ? (
                <p className="text-sm text-slate-400">No report details available.</p>
              ) : (
                <ul className="space-y-2">
                  {reports.map((r, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                          {humanize(r.reason)}
                        </span>
                        {r.reported_at && (
                          <span className="text-xs text-slate-400">
                            {formatDateTime(r.reported_at)}
                          </span>
                        )}
                      </div>
                      {r.details?.trim() && (
                        <p className="mt-1 whitespace-pre-wrap text-slate-700">
                          {r.details.trim()}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1 text-xs text-slate-400">Reporter identity is not recorded.</p>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-slate-100 pt-4">
            {err && (
              <p className="mb-2 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm text-rose-700">
                {err}
              </p>
            )}

            {!declining ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => resolve(true)}
                  disabled={busy !== null}
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {busy === "uphold" ? "Upholding…" : "Uphold — reinstate listing"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeclining(true);
                    setErr(null);
                  }}
                  disabled={busy !== null}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Decline appeal
                </button>
              </div>
            ) : (
              <div className="space-y-3 rounded-lg bg-white p-3">
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  Declining keeps the listing restricted. The seller is notified and{" "}
                  <span className="font-semibold">cannot appeal again</span>.
                </p>
                <div>
                  <label
                    htmlFor={`decline-note-${appeal.appeal_id}`}
                    className="mb-1 block text-xs font-medium text-slate-700"
                  >
                    Internal note (optional — never shown to the seller)
                  </label>
                  <textarea
                    id={`decline-note-${appeal.appeal_id}`}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    disabled={busy !== null}
                    placeholder="Operator-only note…"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => resolve(false)}
                    disabled={busy !== null}
                    className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                  >
                    {busy === "decline" ? "Declining…" : "Confirm decline"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeclining(false);
                      setErr(null);
                    }}
                    disabled={busy !== null}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
