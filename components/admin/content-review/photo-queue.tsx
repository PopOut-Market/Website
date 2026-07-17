"use client";

import { EmptyQueue, Notice } from "@/components/admin/content-review/shared";
import { getAdminAuthBrowserClient } from "@/lib/supabase/admin-auth-browser-client";
import {
  asRows,
  formatDateTime,
  isAccessEnded,
  PHOTO_REASON_CODES,
  PHOTO_REASON_LABELS,
  type PhotoQueueRow,
  type PhotoReasonCode,
  profilePhotoUrl,
  refusalMessage,
  takedownProfilePhoto,
  unwrapDecision,
} from "@/lib/supabase/admin-content-review";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Profile photos queue — every uploaded photo, oldest first.
 *
 * There is NO undo here: taking a photo down destroys the image file, and that
 * is permanent. Every takedown goes through the `profile-photo` edge function
 * (see takedownProfilePhoto) — never the RPC, which would leave the file live.
 */

const PAGE_SIZE = 50;

export function PhotoQueue({ onAccessEnded }: { onAccessEnded: () => void }) {
  const [rows, setRows] = useState<PhotoQueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "info"; text: string } | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(
    async (nextOffset: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const sb = getAdminAuthBrowserClient();
        const { data, error: rpcError } = await sb.rpc("admin_list_photo_queue", {
          p_limit: PAGE_SIZE,
          p_offset: nextOffset,
        });
        if (rpcError) {
          if (isAccessEnded(rpcError)) {
            onAccessEnded();
            return;
          }
          setError(rpcError.message ?? "Failed to load the photo queue.");
          return;
        }
        const fresh = asRows<PhotoQueueRow>(data);
        setRows((prev) => (append ? [...prev, ...fresh] : fresh));
        setOffset(nextOffset + fresh.length);
        setHasMore(fresh.length === PAGE_SIZE);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load the photo queue.");
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

  const dropRow = useCallback((path: string) => {
    setRows((prev) => prev.filter((r) => r.photo_path !== path));
    setOffset((o) => Math.max(0, o - 1));
  }, []);

  /**
   * DESTROY_FAILED and CONFIRM_FAILED both mean the tombstone committed but the
   * file is not confirmed destroyed — so the row IS destroy-pending now. Mark it
   * in place. Refetching page 0 instead would throw away every page the reviewer
   * loaded with "Load more", and could scroll the unfinished takedown out of the
   * window entirely — the one row that must not be lost track of.
   */
  const markDestroyPending = useCallback((path: string) => {
    setRows((prev) =>
      prev.map((r) => (r.photo_path === path ? { ...r, destroy_pending: true } : r)),
    );
  }, []);

  const pendingCount = rows.filter((r) => r.destroy_pending).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Every uploaded profile photo, oldest first. Taking one down destroys the image file — that
        is permanent and <span className="font-medium">cannot be undone</span>.
      </p>

      {pendingCount > 0 && (
        <Notice tone="error">
          {pendingCount} photo{pendingCount === 1 ? " has" : "s have"} an unfinished takedown — the
          member&apos;s picture is gone but the file is still downloadable. Take{" "}
          {pendingCount === 1 ? "it" : "them"} down again to finish the job; retrying is safe.
        </Notice>
      )}

      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : rows.length === 0 && !hasMore && !error ? (
        // See the note in community-queue: an emptied page is not an all-clear.
        <EmptyQueue label="No profile photos waiting for review." />
      ) : (
        <>
          {rows.length === 0 && hasMore && (
            // See the note in community-queue: hasMore means MAYBE more.
            <Notice tone="info">
              Every photo on this page has been decided. Load the next page to see whether more are
              waiting.
            </Notice>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map((row) => (
              <PhotoCard
                key={row.photo_path}
                row={row}
                onAccessEnded={onAccessEnded}
                onDone={(path, tone, text) => {
                  dropRow(path);
                  flash(tone, text);
                }}
                onRetryable={(path, code, text) => {
                  // Blacklist, not a whitelist. ANY retryable answer that came
                  // FROM the server means profile_photo_takedown already returned
                  // — the edge function only reaches the destroy/confirm steps
                  // after the RPC committed the tombstone — so the row is
                  // destroy-pending regardless of which code came back. Matching
                  // on the two known codes would leave an off-contract retryable
                  // (the data layer's `code || "RETRYABLE"` fallback) unmarked
                  // while the toast still told the reviewer to retry, leaving
                  // "Leave alone" live on a condemned file. NETWORK is the only
                  // case that may never have reached the server; the retry
                  // answers that one either way.
                  if (code !== "NETWORK") markDestroyPending(path);
                  flash("info", text);
                }}
              />
            ))}
          </div>
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
        </>
      )}
    </div>
  );
}

function PhotoCard({
  row,
  onAccessEnded,
  onDone,
  onRetryable,
}: {
  row: PhotoQueueRow;
  onAccessEnded: () => void;
  onDone: (path: string, tone: "success" | "info", text: string) => void;
  onRetryable: (path: string, code: string, text: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState<PhotoReasonCode | "">("");
  const [busy, setBusy] = useState<null | "leave" | "takedown">(null);
  const [err, setErr] = useState<string | null>(null);

  const url = profilePhotoUrl(row.photo_path);
  // Truthy check, not `=== false`: the queue's is_current is nullable in shape,
  // and a null must read as "not their current picture", never as current.
  const notCurrent = !row.is_current;
  const pending = Boolean(row.destroy_pending);

  async function leaveAlone() {
    setBusy("leave");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_review_photo", {
        p_user_id: row.user_id,
        p_photo_path: row.photo_path,
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
      const result = unwrapDecision(data);
      switch (result?.result) {
        case "ok":
          onDone(row.photo_path, "success", "Left alone — the photo stays and nothing was sent.");
          return;
        case "already_handled":
          onDone(row.photo_path, "info", "Another reviewer got there first — refreshed.");
          return;
        case "gone":
          onDone(row.photo_path, "info", "That member is gone — banned or left.");
          return;
        case "refused":
          setErr(refusalMessage(result.reason));
          setBusy(null);
          return;
        default:
          setErr("The decision returned an unexpected result.");
          setBusy(null);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed.");
      setBusy(null);
    }
  }

  async function takedown() {
    if (!reason) return;
    setBusy("takedown");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const outcome = await takedownProfilePhoto(sb, {
        targetUserId: row.user_id,
        path: row.photo_path,
        reason,
      });
      switch (outcome.kind) {
        case "ok":
          // Do NOT assert whether the member was notified. The server decides
          // that from `was_current` recomputed under its own row lock, while our
          // `is_current` is from whenever the queue was loaded. On a retry of a
          // destroy-pending row they are actively contradictory: the first
          // takedown already nulled their picture and told them, so the row now
          // reads "not current" and this copy would swear they were never told.
          // State the rule instead of guessing the outcome.
          onDone(
            row.photo_path,
            "success",
            "Taken down — the image file is destroyed. The member is told only if it was still their current picture.",
          );
          return;
        case "already_handled":
          onDone(
            row.photo_path,
            "info",
            "Another reviewer already left that photo alone — refreshed.",
          );
          return;
        case "not_authorized":
          onAccessEnded();
          return;
        case "unknown_photo":
          setErr("There's no record of that member ever uploading this photo. Nothing was done.");
          setBusy(null);
          return;
        case "retryable":
          onRetryable(
            row.photo_path,
            outcome.code,
            outcome.code === "CONFIRM_FAILED"
              ? "The file was destroyed but the queue wasn't told. Take it down again to finish — retrying is safe."
              : outcome.code === "NETWORK"
                ? "The takedown couldn't be reached. Take it down again — retrying is safe."
                : "The image file wasn't destroyed. Take it down again — retrying is safe.",
          );
          setBusy(null);
          return;
        case "error":
          setErr(outcome.message);
          setBusy(null);
          return;
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "The takedown failed.");
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-square w-full bg-slate-100">
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" title="Open full size">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
          </a>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Image unavailable
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {pending && (
            <span
              className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white"
              title="A takedown landed but the file was not destroyed"
            >
              destroy pending
            </span>
          )}
          {/*
            Gated on !pending, like the body note below. On a destroy-pending row
            the first takedown is what nulled the member's picture, so is_current
            reads false through no act of theirs — showing "not current" here
            would blame them for what this queue did.
          */}
          {!pending && notCurrent && (
            <span
              className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white"
              title="The member already replaced or removed this photo — the file is still live"
            >
              not current
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="truncate text-sm font-semibold text-slate-900">
            {row.nickname?.trim() || "(no nickname)"}
          </p>
          <p className="text-xs text-slate-400">Uploaded {formatDateTime(row.uploaded_at)}</p>
        </div>

        {pending ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            This takedown never finished — the file is still downloadable. Take it down again to
            destroy it. Retrying is safe and the member is not told twice.
          </p>
        ) : (
          notCurrent && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Already replaced or removed by the member — but the file is still live at its URL.
              Still worth taking down; they will not be told, because it is not their picture now.
            </p>
          )
        )}

        {err && <Notice tone="error">{err}</Notice>}

        <div className="mt-auto border-t border-slate-100 pt-3">
          {!confirming ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={leaveAlone}
                disabled={busy !== null || pending}
                title={
                  pending
                    ? "This photo was already taken down — it only needs its file destroyed."
                    : undefined
                }
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
              >
                {busy === "leave" ? "Leaving…" : "Leave alone"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(true);
                  setErr(null);
                }}
                disabled={busy !== null}
                className="inline-flex items-center justify-center rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
              >
                {pending ? "Finish takedown…" : "Take down…"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                This destroys the image file permanently. There is no undo.
              </p>
              <div>
                <label
                  htmlFor={`preason-${row.photo_path}`}
                  className="mb-1 block text-xs font-medium text-slate-700"
                >
                  Reason
                </label>
                <select
                  id={`preason-${row.photo_path}`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value as PhotoReasonCode)}
                  disabled={busy !== null}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                >
                  <option value="">Pick a reason…</option>
                  {PHOTO_REASON_CODES.map((code) => (
                    <option key={code} value={code}>
                      {PHOTO_REASON_LABELS[code]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={takedown}
                  disabled={busy !== null || !reason}
                  className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {busy === "takedown" ? "Taking down…" : "Confirm — destroy photo"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    setReason("");
                    setErr(null);
                  }}
                  disabled={busy !== null}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
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
