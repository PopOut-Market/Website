"use client";

import {
  AuthorLine,
  BilingualText,
  CommunityPhotoStrip,
  EmptyQueue,
  Notice,
} from "@/components/admin/content-review/shared";
import { getAdminAuthBrowserClient } from "@/lib/supabase/admin-auth-browser-client";
import {
  asRows,
  COMMUNITY_REASON_CODES,
  COMMUNITY_REASON_LABELS,
  type CommunityQueueRow,
  type CommunityReasonCode,
  formatDateTime,
  humanizeTopic,
  isAccessEnded,
  NOTE_MAX_LENGTH,
  refusalMessage,
  unwrapDecision,
} from "@/lib/supabase/admin-content-review";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Community posts queue — every published post, oldest first.
 *
 * Each item: leave it alone, or restrict it with a reason. Both decisions carry
 * `p_version` VERBATIM from the row (see the type's note — never re-derive it).
 */

const PAGE_SIZE = 50;

type UndoState = { restrictionId: number; title: string };

export function CommunityQueue({ onAccessEnded }: { onAccessEnded: () => void }) {
  const [rows, setRows] = useState<CommunityQueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "info"; text: string } | null>(null);
  const [undo, setUndo] = useState<UndoState | null>(null);
  const [undoing, setUndoing] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(
    async (nextOffset: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const sb = getAdminAuthBrowserClient();
        // p_topic / p_has_photos are filter seams — pass nothing, review everything.
        const { data, error: rpcError } = await sb.rpc("admin_list_community_queue", {
          p_limit: PAGE_SIZE,
          p_offset: nextOffset,
        });
        if (rpcError) {
          if (isAccessEnded(rpcError)) {
            onAccessEnded();
            return;
          }
          setError(rpcError.message ?? "Failed to load the community queue.");
          return;
        }
        const fresh = asRows<CommunityQueueRow>(data);
        setRows((prev) => (append ? [...prev, ...fresh] : fresh));
        setOffset(nextOffset + fresh.length);
        setHasMore(fresh.length === PAGE_SIZE);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load the community queue.");
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [onAccessEnded],
  );

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  useEffect(
    () => () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    [],
  );

  const flash = useCallback((tone: "success" | "info", text: string) => {
    setNotice({ tone, text });
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 6000);
  }, []);

  /** The server's queue shrank by one — keep the paging offset in step. */
  const dropRow = useCallback((postId: number) => {
    setRows((prev) => prev.filter((r) => r.post_id !== postId));
    setOffset((o) => Math.max(0, o - 1));
  }, []);

  /**
   * `changed` — the member edited the post under the reviewer. Reload it; never
   * resubmit against the version they were looking at. A full refetch is the
   * honest reload: the payload carries the new version but not the new words.
   */
  const reloadAfterChange = useCallback(() => {
    flash(
      "info",
      "The member edited this post while you were reading it. It has been reloaded with their new words — review it again.",
    );
    fetchPage(0, false);
  }, [fetchPage, flash]);

  const handleRestricted = useCallback(
    (row: CommunityQueueRow, restrictionId: number | null) => {
      dropRow(row.post_id);
      if (restrictionId != null) {
        setUndo({ restrictionId, title: row.title?.trim() || `Post #${row.post_id}` });
        if (noticeTimer.current) clearTimeout(noticeTimer.current);
        setNotice(null);
      } else {
        flash("success", "Post restricted.");
      }
    },
    [dropRow, flash],
  );

  const runUndo = useCallback(async () => {
    if (!undo) return;
    setUndoing(true);
    try {
      const sb = getAdminAuthBrowserClient();
      // No appeal can be expected here: the restriction was made seconds ago and
      // the reviewer was shown none. `null` means "I checked and there was none".
      const { data, error: rpcError } = await sb.rpc("admin_reinstate_community_post", {
        p_restriction_id: undo.restrictionId,
        p_expected_appeal_id: null,
      });
      if (rpcError) {
        if (isAccessEnded(rpcError)) {
          onAccessEnded();
          return;
        }
        flash("info", rpcError.message ?? "Undo failed.");
        return;
      }
      const result = unwrapDecision(data);
      switch (result?.result) {
        case "ok":
          flash("success", "Undone — the post is back and the member was told it returned.");
          break;
        case "already_handled":
          flash(
            "info",
            "Too late to undo from here — the member appealed, or another reviewer moved it on. Look it up by post ID below.",
          );
          break;
        case "gone":
          flash("info", "That post is gone — deleted, or the author was banned or left.");
          break;
        case "refused":
          flash("info", refusalMessage(result.reason));
          break;
        default:
          flash("info", "Undo returned an unexpected result.");
      }
      setUndo(null);
      fetchPage(0, false);
    } catch (e) {
      flash("info", e instanceof Error ? e.message : "Undo failed.");
    } finally {
      setUndoing(false);
    }
  }, [undo, onAccessEnded, flash, fetchPage]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Every published community post, oldest first. Leave it alone, or restrict it with a reason —
        restricting takes the whole thread, and its replies come back if it is reinstated.
      </p>

      {undo && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          <span>
            Restricted <span className="font-medium">{undo.title}</span> — the member has been told.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runUndo}
              disabled={undoing}
              className="rounded-lg bg-emerald-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {undoing ? "Undoing…" : "Undo"}
            </button>
            <button
              type="button"
              onClick={() => setUndo(null)}
              disabled={undoing}
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : rows.length === 0 && !hasMore && !error ? (
        // Only an all-clear when the SERVER has no more to give. Deciding every
        // row on the loaded page empties `rows` while `hasMore` is still true —
        // showing "nothing to review" there would be a false all-clear, and it
        // would take the Load more button down with it.
        <EmptyQueue label="No community posts waiting for review." />
      ) : (
        <div className="space-y-3">
          {rows.length === 0 && hasMore && (
            // `hasMore` is "this page came back full", i.e. MAYBE more — not a
            // promise there is more. Don't assert what we can't know.
            <Notice tone="info">
              Every post on this page has been decided. Load the next page to see whether more are
              waiting.
            </Notice>
          )}
          {rows.map((row) => (
            <CommunityCard
              key={`${row.post_id}:${row.version}`}
              row={row}
              onAccessEnded={onAccessEnded}
              onLeftAlone={(postId) => {
                dropRow(postId);
                flash("success", "Left alone — nothing was sent to the member.");
              }}
              onAlreadyHandled={(postId) => {
                dropRow(postId);
                flash("info", "Another reviewer got there first — refreshed.");
              }}
              onGone={(postId) => {
                dropRow(postId);
                flash("info", "That post is gone — deleted, or the author was banned or left.");
              }}
              onRestricted={handleRestricted}
              onChanged={reloadAfterChange}
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

function CommunityCard({
  row,
  onAccessEnded,
  onLeftAlone,
  onAlreadyHandled,
  onGone,
  onRestricted,
  onChanged,
}: {
  row: CommunityQueueRow;
  onAccessEnded: () => void;
  onLeftAlone: (postId: number) => void;
  onAlreadyHandled: (postId: number) => void;
  onGone: (postId: number) => void;
  onRestricted: (row: CommunityQueueRow, restrictionId: number | null) => void;
  onChanged: () => void;
}) {
  const [restricting, setRestricting] = useState(false);
  const [reason, setReason] = useState<CommunityReasonCode | "">("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<null | "leave" | "restrict">(null);
  const [err, setErr] = useState<string | null>(null);

  /** Branch on `result` — only auth throws. */
  function handleResult(
    result: ReturnType<typeof unwrapDecision>,
    onOk: (payload: NonNullable<typeof result>) => void,
  ) {
    switch (result?.result) {
      case "ok":
        onOk(result);
        return;
      case "already_handled":
        onAlreadyHandled(row.post_id);
        return;
      case "changed":
        onChanged();
        return;
      case "gone":
        onGone(row.post_id);
        return;
      case "refused":
        setErr(refusalMessage(result.reason));
        setBusy(null);
        return;
      default:
        setErr("The decision returned an unexpected result.");
        setBusy(null);
    }
  }

  async function leaveAlone() {
    setBusy("leave");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_review_community_post", {
        p_post_id: row.post_id,
        // Verbatim from the row. Never through a Date.
        p_version: row.version,
      });
      if (rpcError) {
        if (isAccessEnded(rpcError)) {
          onAccessEnded();
          return;
        }
        setErr(rpcError.message ?? "Action failed.");
        setBusy(null);
        return;
      }
      handleResult(unwrapDecision(data), () => onLeftAlone(row.post_id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed.");
      setBusy(null);
    }
  }

  async function restrict() {
    if (!reason) return;
    setBusy("restrict");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_restrict_community_post", {
        p_post_id: row.post_id,
        p_reason_code: reason,
        p_note: note.trim() || null,
        p_version: row.version,
      });
      if (rpcError) {
        if (isAccessEnded(rpcError)) {
          onAccessEnded();
          return;
        }
        setErr(rpcError.message ?? "Action failed.");
        setBusy(null);
        return;
      }
      handleResult(unwrapDecision(data), (payload) =>
        onRestricted(row, payload.restriction_id ?? null),
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed.");
      setBusy(null);
    }
  }

  const edited = Boolean(row.edited_at);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            #{row.post_id}
          </span>
          {row.topic && (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
              {humanizeTopic(row.topic)}
            </span>
          )}
          {edited && (
            <span
              className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
              title={`Edited ${formatDateTime(row.edited_at)}`}
            >
              edited
            </span>
          )}
          <span className="ml-auto">
            <AuthorLine author={row.author} at={row.created_at} atLabel="posted" />
          </span>
        </div>

        <BilingualText
          title={row.title}
          body={row.body}
          titleEn={row.title_en}
          bodyEn={row.body_en}
          idPrefix={`cq-${row.post_id}`}
        />

        <CommunityPhotoStrip paths={row.photo_paths} />

        {err && <Notice tone="error">{err}</Notice>}

        <div className="border-t border-slate-100 pt-3">
          {!restricting ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={leaveAlone}
                disabled={busy !== null}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {busy === "leave" ? "Leaving…" : "Leave alone"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRestricting(true);
                  setErr(null);
                }}
                disabled={busy !== null}
                className="inline-flex items-center justify-center rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
              >
                Restrict…
              </button>
            </div>
          ) : (
            <div className="space-y-3 rounded-lg bg-slate-50 p-3">
              <div>
                <label
                  htmlFor={`reason-${row.post_id}`}
                  className="mb-1 block text-xs font-medium text-slate-700"
                >
                  Reason (the member is told this, in their own language)
                </label>
                <select
                  id={`reason-${row.post_id}`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value as CommunityReasonCode)}
                  disabled={busy !== null}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50 sm:max-w-xs"
                >
                  <option value="">Pick a reason…</option>
                  {COMMUNITY_REASON_CODES.map((code) => (
                    <option key={code} value={code}>
                      {COMMUNITY_REASON_LABELS[code]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`note-${row.post_id}`}
                  className="mb-1 block text-xs font-medium text-slate-700"
                >
                  Internal note (optional — the member never sees it)
                </label>
                <textarea
                  id={`note-${row.post_id}`}
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX_LENGTH))}
                  rows={2}
                  disabled={busy !== null}
                  placeholder="Operator-only note…"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                />
                <p className="mt-0.5 text-right text-xs text-slate-400">
                  {note.length}/{NOTE_MAX_LENGTH}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={restrict}
                  disabled={busy !== null || !reason}
                  className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {busy === "restrict" ? "Restricting…" : "Restrict post"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRestricting(false);
                    setReason("");
                    setNote("");
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
    </div>
  );
}
