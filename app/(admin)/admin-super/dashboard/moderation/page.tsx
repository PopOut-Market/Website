"use client";

import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import {
  formatAudCents,
  isNotAuthorized,
  mapRpcError,
  postIdArg,
  RESTRICT_REASON_CODES,
  RESTRICTION_REASON_LABELS,
  UNAUTHORIZED_MESSAGE,
  unwrapRpc,
  type RestrictReasonCode,
} from "@/lib/supabase/admin-rpc";
import { getPostImageUrl } from "@/lib/supabase/post-image-url";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Listing moderation — restrict or reinstate a single listing by ID.
 *
 * There is no admin listing browser, so the entry point is a numeric listing-ID
 * input. A best-effort preview via the anon `get_post_detail` RPC helps the
 * operator confirm they have the right listing (it returns nothing for deleted,
 * unavailable, or already-restricted posts — the action is still available by
 * ID in that case).
 *
 * Restrict/reinstate call the admin RPCs directly from the signed-in admin's
 * Supabase session, mirroring reward-review. The backend handles idempotency
 * (the `changed` flag) and fires all seller notifications server-side.
 */

type PostDetailRow = {
  id?: number | string;
  title?: string | null;
  price_cents?: number | null;
  status?: string | null;
  seller_nickname?: string | null;
  photo_paths?: string[] | null;
};

type Preview = {
  id: string;
  title: string;
  priceCents: number | null;
  status: string | null;
  sellerNickname: string | null;
  photoUrls: string[];
};

type Busy = null | "restrict" | "reinstate" | "lookup";

export default function ListingModerationPage() {
  const [postId, setPostId] = useState("");
  const [reason, setReason] = useState<RestrictReasonCode | "">("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewNote, setPreviewNote] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const handleUnauthorized = useCallback(() => {
    setUnauthorized(true);
    setPreview(null);
    setPreviewNote(null);
    setError(UNAUTHORIZED_MESSAGE);
    setBusy(null);
  }, []);

  const trimmedId = postId.trim();
  const validId = /^\d+$/.test(trimmedId);

  const lookup = useCallback(
    async (silent: boolean) => {
      if (unauthorized) return;
      const id = postId.trim();
      if (!/^\d+$/.test(id)) {
        setPreview(null);
        if (!silent) setPreviewNote("Enter a numeric listing ID.");
        return;
      }
      if (!isAdminAuthConfigured()) {
        setError("Supabase is not configured.");
        return;
      }
      if (!silent) {
        setBusy("lookup");
        setPreviewNote(null);
      }
      try {
        const sb = getAdminAuthBrowserClient();
        const { data, error: rpcError } = await sb.rpc("get_post_detail", {
          p_post_id: postIdArg(id),
          p_locale: "en",
        });
        if (rpcError) {
          if (isNotAuthorized(rpcError)) {
            handleUnauthorized();
            return;
          }
          setPreview(null);
          setPreviewNote("Couldn't load a preview — you can still act by ID.");
          return;
        }
        const row = unwrapRpc<PostDetailRow>(data);
        if (!row || row.id == null) {
          setPreview(null);
          setPreviewNote(
            "No preview available — the listing may be deleted, unavailable, or already restricted. You can still act by ID.",
          );
          return;
        }
        setPreview({
          id: String(row.id),
          title: (row.title ?? "").toString().trim() || "(untitled)",
          priceCents: typeof row.price_cents === "number" ? row.price_cents : null,
          status: row.status?.toString().trim() || null,
          sellerNickname: row.seller_nickname?.toString().trim() || null,
          photoUrls: (Array.isArray(row.photo_paths) ? row.photo_paths : [])
            .map((p) => getPostImageUrl(p))
            .filter((u): u is string => Boolean(u)),
        });
        setPreviewNote(null);
      } catch {
        setPreview(null);
        setPreviewNote("Couldn't load a preview — you can still act by ID.");
      } finally {
        if (!silent) setBusy(null);
      }
    },
    [postId, unauthorized, handleUnauthorized],
  );

  async function restrict() {
    if (!validId || !reason || busy !== null || unauthorized) return;
    setBusy("restrict");
    setError(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_restrict_post", {
        p_post_id: postIdArg(trimmedId),
        p_reason_code: reason,
        p_note: note.trim() || null,
      });
      if (rpcError) {
        if (isNotAuthorized(rpcError)) {
          handleUnauthorized();
          return;
        }
        setError(mapRpcError(rpcError, "Failed to restrict the listing."));
        return;
      }
      const result = unwrapRpc<{ post_id?: number; changed?: boolean }>(data);
      showToast(
        result?.changed === false
          ? "No change — this listing is already restricted under that reason."
          : "Listing restricted.",
      );
      setNote("");
      // The listing is now restricted, so get_post_detail would return nothing —
      // skip the re-lookup and show a positive note instead of the generic
      // "no preview available" copy (which reads like a soft error after success).
      setPreview(null);
      setPreviewNote("This listing is now restricted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to restrict the listing.");
    } finally {
      setBusy(null);
    }
  }

  async function reinstate() {
    if (!validId || busy !== null || unauthorized) return;
    setBusy("reinstate");
    setError(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_reinstate_post", {
        p_post_id: postIdArg(trimmedId),
      });
      if (rpcError) {
        if (isNotAuthorized(rpcError)) {
          handleUnauthorized();
          return;
        }
        setError(mapRpcError(rpcError, "Failed to reinstate the listing."));
        return;
      }
      const result = unwrapRpc<{ post_id?: number; changed?: boolean }>(data);
      showToast(
        result?.changed === false
          ? "Nothing to reinstate — this listing isn't currently restricted."
          : "Listing reinstated. The seller has been notified.",
      );
      void lookup(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reinstate the listing.");
    } finally {
      setBusy(null);
    }
  }

  const busyAny = busy !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Listing moderation</h1>
        <p className="mt-1 text-sm text-slate-600">
          Restrict a listing (hides it and lets the seller appeal) or reinstate one by listing ID.
          Enter the ID to preview, then choose an action.
        </p>
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

      {/* Listing lookup */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="post-id" className="mb-1 block text-xs font-medium text-slate-700">
          Listing ID
        </label>
        <div className="flex flex-wrap items-start gap-2">
          <input
            id="post-id"
            inputMode="numeric"
            value={postId}
            onChange={(e) => {
              setPostId(e.target.value);
              setPreviewNote(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") void lookup(false);
            }}
            disabled={busyAny || unauthorized}
            placeholder="e.g. 12345"
            className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => void lookup(false)}
            disabled={!validId || busyAny || unauthorized}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {busy === "lookup" ? "Looking up…" : "Look up"}
          </button>
        </div>
        {previewNote && <p className="mt-2 text-xs text-slate-500">{previewNote}</p>}

        {preview && (
          <div className="mt-4 flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row">
            <div className="flex shrink-0 gap-2">
              {preview.photoUrls.length === 0 ? (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-2xl">
                  🖼️
                </div>
              ) : (
                preview.photoUrls.slice(0, 3).map((url) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="h-24 w-24 rounded-lg border border-slate-200 object-cover transition hover:opacity-80"
                    />
                  </a>
                ))
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">{preview.title}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {formatAudCents(preview.priceCents)}
                </span>
                {preview.status && preview.status !== "available" && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    status: {preview.status}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Listing #{preview.id}
                {preview.sellerNickname ? ` · ${preview.sellerNickname}` : ""}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Restrict */}
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Restrict listing</h2>
          <p className="mt-1 text-sm text-slate-600">
            Hides the listing. Pick a reason (required). The note is operator-only and never shown
            to the seller.
          </p>
        </div>
        <div>
          <label
            htmlFor="restrict-reason"
            className="mb-1 block text-xs font-medium text-slate-700"
          >
            Reason (required)
          </label>
          <select
            id="restrict-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as RestrictReasonCode | "")}
            disabled={busyAny || unauthorized}
            className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
          >
            <option value="">Select a reason…</option>
            {RESTRICT_REASON_CODES.map((code) => (
              <option key={code} value={code}>
                {RESTRICTION_REASON_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="restrict-note" className="mb-1 block text-xs font-medium text-slate-700">
            Internal note (optional)
          </label>
          <textarea
            id="restrict-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            disabled={busyAny || unauthorized}
            placeholder="Operator-only note…"
            className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={restrict}
          disabled={!validId || !reason || busyAny || unauthorized}
          title={
            !validId ? "Enter a numeric listing ID" : !reason ? "Pick a reason first" : undefined
          }
          className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
        >
          {busy === "restrict" ? "Restricting…" : "Restrict listing"}
        </button>
      </section>

      {/* Reinstate */}
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Reinstate listing</h2>
          <p className="mt-1 text-sm text-slate-600">
            Lifts an active restriction and makes the listing visible again. The seller is notified
            automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={reinstate}
          disabled={!validId || busyAny || unauthorized}
          title={!validId ? "Enter a numeric listing ID" : undefined}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy === "reinstate" ? "Reinstating…" : "Reinstate listing"}
        </button>
      </section>
    </div>
  );
}
