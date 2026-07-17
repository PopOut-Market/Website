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
  type CommunityAppealRow,
  communityReasonLabel,
  formatDateTime,
  isAccessEnded,
  refusalMessage,
  unwrapDecision,
} from "@/lib/supabase/admin-content-review";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Appeals queue — members contesting a community-post takedown, oldest first.
 *
 * Uphold brings the post and its whole thread back; deny leaves it restricted.
 * Either way the member is told, in their own language, automatically — this
 * page sends no copy. One appeal per takedown and the decision is final, so
 * denial is a deliberate confirm.
 */

const PAGE_SIZE = 50;

export function AppealsQueue({ onAccessEnded }: { onAccessEnded: () => void }) {
  const [rows, setRows] = useState<CommunityAppealRow[]>([]);
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
        const { data, error: rpcError } = await sb.rpc("admin_list_community_appeals", {
          p_limit: PAGE_SIZE,
          p_offset: nextOffset,
        });
        if (rpcError) {
          if (isAccessEnded(rpcError)) {
            onAccessEnded();
            return;
          }
          setError(rpcError.message ?? "Failed to load appeals.");
          return;
        }
        const fresh = asRows<CommunityAppealRow>(data);
        setRows((prev) => (append ? [...prev, ...fresh] : fresh));
        setOffset(nextOffset + fresh.length);
        setHasMore(fresh.length === PAGE_SIZE);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load appeals.");
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

  const dropRow = useCallback((appealId: number) => {
    setRows((prev) => prev.filter((r) => r.appeal_id !== appealId));
    setOffset((o) => Math.max(0, o - 1));
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Members contesting a community-post takedown, oldest first.{" "}
        <span className="font-medium">Uphold</span> brings the post and its replies back;{" "}
        <span className="font-medium">Deny</span> leaves it restricted. Either way the member is
        told in their own language — you send no message.
      </p>

      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : rows.length === 0 && !hasMore && !error ? (
        // See the note in community-queue: an emptied page is not an all-clear.
        <EmptyQueue label="No open appeals." />
      ) : (
        <div className="space-y-3">
          {rows.length === 0 && hasMore && (
            // See the note in community-queue: hasMore means MAYBE more.
            <Notice tone="info">
              Every appeal on this page has been decided. Load the next page to see whether more are
              waiting.
            </Notice>
          )}
          {rows.map((row) => (
            <AppealCard
              key={row.appeal_id}
              row={row}
              onAccessEnded={onAccessEnded}
              onResolved={(appealId, tone, text) => {
                dropRow(appealId);
                flash(tone, text);
              }}
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
  row,
  onAccessEnded,
  onResolved,
}: {
  row: CommunityAppealRow;
  onAccessEnded: () => void;
  onResolved: (appealId: number, tone: "success" | "info", text: string) => void;
}) {
  const [denying, setDenying] = useState(false);
  const [busy, setBusy] = useState<null | "uphold" | "deny">(null);
  const [err, setErr] = useState<string | null>(null);

  async function resolve(uphold: boolean) {
    setBusy(uphold ? "uphold" : "deny");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      // TWO arguments. `admin_resolve_community_appeal` takes NO note — its
      // listing twin `admin_resolve_appeal` does, and they are not the same
      // function. p_uphold must be a real boolean: null is refused, because a
      // final one-shot decision never falls back to a default.
      const { data, error: rpcError } = await sb.rpc("admin_resolve_community_appeal", {
        p_appeal_id: row.appeal_id,
        p_uphold: uphold,
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
          onResolved(
            row.appeal_id,
            "success",
            uphold
              ? "Appeal upheld — the post and its replies are back, and the member has been told."
              : "Appeal denied — the post stays restricted and the member has been told.",
          );
          return;
        case "already_handled":
          onResolved(row.appeal_id, "info", "That appeal was already decided — refreshed.");
          return;
        case "gone":
          onResolved(
            row.appeal_id,
            "info",
            "That post is gone — deleted, or the member was banned or left.",
          );
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

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            Post #{row.post_id}
          </span>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
            Restricted for {communityReasonLabel(row.reason_code)}
          </span>
          <span className="ml-auto">
            <AuthorLine author={row.author} at={row.created_at} atLabel="appealed" />
          </span>
        </div>

        {/*
          The member's appeal, exactly as they wrote it. There is no English for
          this and no translate button to add — a deliberate product decision.
        */}
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">
            Their appeal — in their own words, untranslated
          </p>
          <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {row.body?.trim() || "(no message)"}
          </p>
        </div>

        {/* The restricted post itself. title_en / post_body_en are the POST's English. */}
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="mb-2 text-xs font-medium text-slate-500">The restricted post</p>
          <BilingualText
            title={row.title}
            body={row.post_body}
            titleEn={row.title_en}
            bodyEn={row.post_body_en}
            idPrefix={`ap-${row.appeal_id}`}
          />
          <div className="mt-3">
            <CommunityPhotoStrip paths={row.photo_paths} />
          </div>
        </div>

        {err && <Notice tone="error">{err}</Notice>}

        <div className="border-t border-slate-100 pt-3">
          {!denying ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => resolve(true)}
                disabled={busy !== null}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy === "uphold" ? "Upholding…" : "Uphold — bring the post back"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDenying(true);
                  setErr(null);
                }}
                disabled={busy !== null}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Deny appeal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                Denying keeps the post restricted. The member is told, and this appeal is{" "}
                <span className="font-semibold">final</span> — they cannot appeal this takedown
                again.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => resolve(false)}
                  disabled={busy !== null}
                  className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {busy === "deny" ? "Denying…" : "Confirm deny"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDenying(false);
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
