"use client";

import { CommunityPhotoStrip, Notice } from "@/components/admin/content-review/shared";
import { getAdminAuthBrowserClient } from "@/lib/supabase/admin-auth-browser-client";
import {
  COMMUNITY_REASON_CODES,
  COMMUNITY_REASON_LABELS,
  type CommunityReasonCode,
  type CommunityRestrictionLookup,
  communityReasonLabel,
  formatDateTime,
  isAccessEnded,
  NOTE_MAX_LENGTH,
  refusalMessage,
  unwrapDecision,
} from "@/lib/supabase/admin-content-review";
import { useCallback, useState } from "react";

/**
 * Change your mind after moving on.
 *
 * A restricted post leaves the queue, so this look-up is the only way back to
 * it — there is no browsable history and no audit log to page through, by
 * design. You need the post ID.
 *
 * Both actions carry `p_expected_appeal_id`: the `open_appeal_id` this look-up
 * showed, or null if it showed none. `null` asserts "I checked and there was
 * none" — it is not "I didn't look". Any mismatch comes back already_handled,
 * which is what stops a reviewer acting on a state they never saw.
 */
export function RestrictionLookup({ onAccessEnded }: { onAccessEnded: () => void }) {
  const [postId, setPostId] = useState("");
  const [looking, setLooking] = useState(false);
  const [found, setFound] = useState<CommunityRestrictionLookup | null>(null);
  const [lookedUpId, setLookedUpId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    tone: "success" | "info" | "error";
    text: string;
  } | null>(null);

  const [replacing, setReplacing] = useState(false);
  const [reason, setReason] = useState<CommunityReasonCode | "">("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<null | "reinstate" | "replace">(null);

  const reset = useCallback(() => {
    setFound(null);
    setLookedUpId(null);
    setReplacing(false);
    setReason("");
    setNote("");
  }, []);

  // Every action below runs its decision inside try/finally so `busy` is cleared
  // on EVERY outcome, not just the error ones. It gates all the panel's controls
  // — a success path that returns without clearing it leaves the reviewer unable
  // to reverse the next takedown at all, on the only surface that can reach one.

  const idAsNumber = useCallback((raw: string): number | null => {
    const t = raw.trim();
    if (!/^\d+$/.test(t)) return null;
    const n = Number(t);
    return Number.isSafeInteger(n) ? n : null;
  }, []);

  async function lookup() {
    const id = idAsNumber(postId);
    if (id == null) {
      setMessage({ tone: "error", text: "Enter a numeric post ID." });
      return;
    }
    setLooking(true);
    setMessage(null);
    reset();
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_get_community_restriction", {
        p_post_id: id,
      });
      if (rpcError) {
        if (isAccessEnded(rpcError)) {
          onAccessEnded();
          return;
        }
        setMessage({ tone: "error", text: rpcError.message ?? "Look-up failed." });
        return;
      }
      const result = (unwrapDecision(data) as CommunityRestrictionLookup | null) ?? null;
      switch (result?.result) {
        case "ok":
          setFound(result);
          setLookedUpId(id);
          setReason((result.reason_code as CommunityReasonCode) ?? "");
          setNote(result.internal_note ?? "");
          return;
        case "not_restricted":
          setMessage({ tone: "info", text: `Post #${id} is not restricted.` });
          return;
        case "gone":
          setMessage({
            tone: "info",
            text: `Post #${id} is gone — deleted, or the author was banned or left.`,
          });
          return;
        case "refused":
          setMessage({ tone: "error", text: refusalMessage(result.reason) });
          return;
        default:
          setMessage({ tone: "error", text: "The look-up returned an unexpected result." });
      }
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Look-up failed." });
    } finally {
      setLooking(false);
    }
  }

  async function reinstate() {
    if (!found?.restriction_id) return;
    setBusy("reinstate");
    setMessage(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_reinstate_community_post", {
        p_restriction_id: found.restriction_id,
        // The appeal state we were SHOWN — verbatim, null included.
        p_expected_appeal_id: found.open_appeal_id ?? null,
      });
      if (rpcError) {
        if (isAccessEnded(rpcError)) {
          onAccessEnded();
          return;
        }
        setMessage({ tone: "error", text: rpcError.message ?? "Action failed." });
        return;
      }
      const result = unwrapDecision(data);
      switch (result?.result) {
        case "ok":
          setMessage({
            tone: "success",
            text: `Post #${lookedUpId} is back, with its replies. The member has been told it returned.`,
          });
          reset();
          return;
        case "already_handled":
          setMessage({
            tone: "info",
            text: "The appeal state moved while you were looking — someone appealed, or another reviewer acted. Look it up again.",
          });
          reset();
          return;
        case "gone":
          setMessage({
            tone: "info",
            text: "That post is gone — deleted, or the author was banned or left. Nothing is put back for a member who has gone.",
          });
          reset();
          return;
        case "refused":
          setMessage({ tone: "error", text: refusalMessage(result.reason) });
          return;
        default:
          setMessage({ tone: "error", text: "The decision returned an unexpected result." });
      }
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Action failed." });
    } finally {
      setBusy(null);
    }
  }

  async function replace() {
    if (!found?.restriction_id || !reason) return;
    setBusy("replace");
    setMessage(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_replace_community_restriction", {
        p_restriction_id: found.restriction_id,
        p_reason_code: reason,
        p_note: note.trim() || null,
        p_expected_appeal_id: found.open_appeal_id ?? null,
      });
      if (rpcError) {
        if (isAccessEnded(rpcError)) {
          onAccessEnded();
          return;
        }
        setMessage({ tone: "error", text: rpcError.message ?? "Action failed." });
        return;
      }
      const result = unwrapDecision(data);
      switch (result?.result) {
        case "ok":
          setMessage({
            tone: "success",
            text: result.unchanged
              ? "That was already the reason — nothing changed and the member was not told again."
              : "Reason replaced. The member has been told the new reason, and this earns them a fresh appeal.",
          });
          reset();
          return;
        case "already_handled":
          setMessage({
            tone: "info",
            text: "The restriction or its appeal moved while you were looking. Look it up again.",
          });
          reset();
          return;
        case "gone":
          setMessage({
            tone: "info",
            text: "That post is gone — deleted, or the author was banned or left.",
          });
          reset();
          return;
        case "refused":
          setMessage({ tone: "error", text: refusalMessage(result.reason) });
          return;
        default:
          setMessage({ tone: "error", text: "The decision returned an unexpected result." });
      }
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Action failed." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Change your mind about a takedown</h2>
      <p className="mt-1 text-xs text-slate-500">
        A restricted post leaves the queue, so this is the way back to it. There is no browsable
        history — you need the post ID.
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor="lookup-post-id" className="mb-1 block text-xs font-medium text-slate-700">
            Post ID
          </label>
          <input
            id="lookup-post-id"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") lookup();
            }}
            inputMode="numeric"
            placeholder="e.g. 1042"
            disabled={looking}
            className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={lookup}
          disabled={looking || !postId.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {looking ? "Looking up…" : "Look up"}
        </button>
      </div>

      {message && (
        <div className="mt-3">
          <Notice tone={message.tone}>{message.text}</Notice>
        </div>
      )}

      {found && (
        <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
              {communityReasonLabel(found.reason_code)}
            </span>
            <span className="text-xs text-slate-500">
              Restricted {formatDateTime(found.restricted_at)}
            </span>
            {found.open_appeal_id != null && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                open appeal #{found.open_appeal_id}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {found.title?.trim() || "(no title)"}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
              {found.body?.trim() || "(no body)"}
            </p>
          </div>

          <CommunityPhotoStrip paths={found.photo_paths ?? null} />

          {found.internal_note?.trim() && (
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">
                Internal note (operator-only)
              </p>
              <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                {found.internal_note.trim()}
              </p>
            </div>
          )}

          {found.open_appeal_id != null && (
            <Notice tone="info">
              This post has an open appeal. Reinstating it here voids that appeal without denying it
              — the member is only told their post is back.
            </Notice>
          )}

          <div className="border-t border-slate-200 pt-3">
            {!replacing ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={reinstate}
                  disabled={busy !== null}
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {busy === "reinstate" ? "Putting back…" : "Put the post back"}
                </button>
                <button
                  type="button"
                  onClick={() => setReplacing(true)}
                  disabled={busy !== null}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Change the reason…
                </button>
                <button
                  type="button"
                  onClick={reset}
                  disabled={busy !== null}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="replace-reason"
                    className="mb-1 block text-xs font-medium text-slate-700"
                  >
                    New reason (a different one earns the member a fresh appeal)
                  </label>
                  <select
                    id="replace-reason"
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
                    htmlFor="replace-note"
                    className="mb-1 block text-xs font-medium text-slate-700"
                  >
                    Internal note (optional — the member never sees it)
                  </label>
                  <textarea
                    id="replace-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX_LENGTH))}
                    rows={2}
                    disabled={busy !== null}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                  />
                  <p className="mt-0.5 text-right text-xs text-slate-400">
                    {note.length}/{NOTE_MAX_LENGTH}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={replace}
                    disabled={busy !== null || !reason}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {busy === "replace" ? "Replacing…" : "Replace reason"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplacing(false);
                      setReason((found.reason_code as CommunityReasonCode) ?? "");
                      setNote(found.internal_note ?? "");
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
