"use client";

import { RestrictReasonHelp } from "@/components/admin/restrict-reason-help";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
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
 * Listing moderation — restrict or reinstate a single listing.
 *
 * A listing is always the target of an action by its numeric ID, but the
 * operator can find that ID three ways (tabbed lookup):
 *   - By ID     — a best-effort preview via the anon `get_post_detail` RPC.
 *   - By title  — search `posts.raw_title`.
 *   - By seller — search `profiles.nickname`.
 * Title/seller search goes through the service-role `/api/admin/search-posts`
 * route (behind requireAdmin), so it surfaces EVERY listing — including
 * restricted, sold, or otherwise unavailable ones that the anon RPCs hide.
 * Picking a result fills the target ID and preview; the restrict/reinstate flow
 * below is unchanged and always acts on that single ID.
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

/** Row shape returned by `/api/admin/search-posts`. */
type SearchResult = {
  id: string;
  title: string | null;
  priceCents: number | null;
  status: string | null;
  sellerId: string | null;
  sellerNickname: string | null;
  thumbnailPath: string | null;
  updatedAt: string | null;
  createdAt: string | null;
};

type LookupMode = "id" | "title" | "seller";
type Busy = null | "restrict" | "reinstate" | "lookup" | "search";

const SEARCH_MIN_LEN = 2;

export default function ListingModerationPage() {
  const [postId, setPostId] = useState("");
  const [reason, setReason] = useState<RestrictReasonCode | "">("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewNote, setPreviewNote] = useState<string | null>(null);

  // Tabbed lookup: search-by-text lives alongside the by-ID preview.
  const [lookupMode, setLookupMode] = useState<LookupMode>("id");
  const [searchQuery, setSearchQuery] = useState("");
  // The query the current results actually belong to. "Load more" is only valid
  // while the box still matches it, so editing the text can't append a mismatched
  // page (a new query at the previous query's offset).
  const [committedQuery, setCommittedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchNote, setSearchNote] = useState<string | null>(null);
  const [searchOffset, setSearchOffset] = useState(0);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  // Listings acted on this session (id -> outcome), so a search row reflects the
  // action instead of showing its now-stale pre-action status.
  const [actedById, setActedById] = useState<Record<string, "restricted" | "reinstated">>({});

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
    setSearchResults([]);
    setSearchHasMore(false);
    setError(UNAUTHORIZED_MESSAGE);
    setBusy(null);
    setLoadingMore(false);
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

  const runSearch = useCallback(
    async (append: boolean) => {
      if (unauthorized || lookupMode === "id") return;
      const query = searchQuery.trim();
      if (query.length < SEARCH_MIN_LEN) {
        setSearchResults([]);
        setSearchHasMore(false);
        setSearchNote(`Enter at least ${SEARCH_MIN_LEN} characters to search.`);
        return;
      }
      // Never page a query the visible results don't belong to.
      if (append && query !== committedQuery) return;
      if (!isAdminAuthConfigured()) {
        setError("Supabase is not configured.");
        return;
      }
      const nextOffset = append ? searchOffset : 0;
      if (append) setLoadingMore(true);
      else {
        setBusy("search");
        setSearchNote(null);
        setCommittedQuery(query);
        setActedById({});
      }
      try {
        const params = new URLSearchParams({
          q: query,
          mode: lookupMode,
          offset: String(nextOffset),
        });
        const res = await adminApiFetch(`/api/admin/search-posts?${params.toString()}`);
        if (res.status === 401 || res.status === 403) {
          handleUnauthorized();
          return;
        }
        const json = (await res.json().catch(() => null)) as {
          results?: SearchResult[];
          hasMore?: boolean;
          error?: string;
        } | null;
        if (!res.ok) {
          if (!append) {
            setSearchResults([]);
            setSearchHasMore(false);
          }
          setSearchNote(json?.error ?? "Search failed.");
          return;
        }
        const rows = Array.isArray(json?.results) ? json.results : [];
        setSearchResults((prev) => (append ? [...prev, ...rows] : rows));
        setSearchOffset(nextOffset + rows.length);
        setSearchHasMore(Boolean(json?.hasMore));
        setSearchNote(!append && rows.length === 0 ? "No listings found." : null);
      } catch (e) {
        setSearchNote(e instanceof Error ? e.message : "Search failed.");
      } finally {
        if (append) setLoadingMore(false);
        else setBusy(null);
      }
    },
    [searchQuery, committedQuery, lookupMode, searchOffset, unauthorized, handleUnauthorized],
  );

  const selectResult = useCallback((r: SearchResult) => {
    setPostId(r.id);
    setError(null);
    setPreviewNote(null);
    setPreview({
      id: r.id,
      title: (r.title ?? "").trim() || "(untitled)",
      priceCents: r.priceCents,
      status: r.status?.trim() || null,
      sellerNickname: r.sellerNickname?.trim() || null,
      photoUrls: [getPostImageUrl(r.thumbnailPath, r.updatedAt)].filter((u): u is string =>
        Boolean(u),
      ),
    });
  }, []);

  const switchMode = useCallback((mode: LookupMode) => {
    setLookupMode(mode);
    // Results belong to a specific mode/query — clear them on a tab switch so a
    // stale seller list doesn't linger under the title tab. The picked listing
    // (postId + preview) is intentionally kept.
    setSearchResults([]);
    setSearchHasMore(false);
    setSearchOffset(0);
    setSearchNote(null);
    setCommittedQuery("");
    setActedById({});
  }, []);

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
      // Reflect it on the matching search row (whatever tab it was found from).
      setActedById((prev) => ({ ...prev, [trimmedId]: "restricted" }));
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
      const nothingToDo = result?.changed === false;
      showToast(
        nothingToDo
          ? "Nothing to reinstate — this listing isn't currently restricted."
          : "Listing reinstated. The seller has been notified.",
      );
      // Only mark the search row when a restriction was actually lifted.
      if (!nothingToDo) {
        setActedById((prev) => ({ ...prev, [trimmedId]: "reinstated" }));
      }
      void lookup(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reinstate the listing.");
    } finally {
      setBusy(null);
    }
  }

  const busyAny = busy !== null;
  const searchDisabled = busyAny || loadingMore || unauthorized;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Listing moderation</h1>
        <p className="mt-1 text-sm text-slate-600">
          Restrict a listing (hides it and lets the seller appeal) or reinstate one. Find a listing
          by ID, title, or seller, then choose an action.
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

      {/* Listing lookup — by ID, title, or seller */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div
          role="group"
          aria-label="Find a listing by"
          className="mb-4 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm"
        >
          {(
            [
              ["id", "By ID"],
              ["title", "By title"],
              ["seller", "By seller"],
            ] as [LookupMode, string][]
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              aria-pressed={lookupMode === mode}
              onClick={() => switchMode(mode)}
              disabled={busyAny || loadingMore}
              className={`rounded-md px-3 py-1.5 font-medium transition disabled:opacity-50 ${
                lookupMode === mode
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {lookupMode === "id" ? (
          <>
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
          </>
        ) : (
          <>
            <label htmlFor="search-q" className="mb-1 block text-xs font-medium text-slate-700">
              {lookupMode === "title" ? "Listing title" : "Seller nickname"}
            </label>
            <div className="flex flex-wrap items-start gap-2">
              <input
                id="search-q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void runSearch(false);
                }}
                disabled={searchDisabled}
                placeholder={
                  lookupMode === "title" ? "e.g. bike, sofa, iphone" : "e.g. sooyoung"
                }
                className="w-72 max-w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => void runSearch(false)}
                disabled={searchQuery.trim().length < SEARCH_MIN_LEN || searchDisabled}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {busy === "search" ? "Searching…" : "Search"}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Matches any part of the {lookupMode === "title" ? "title" : "seller nickname"}.
              Includes restricted and sold listings.
            </p>
            {searchNote && <p className="mt-2 text-xs text-slate-500">{searchNote}</p>}

            {searchResults.length > 0 && (
              <ul className="mt-3 space-y-2">
                {searchResults.map((r) => (
                  <li key={r.id}>
                    <SearchResultRow
                      result={r}
                      selected={validId && trimmedId === r.id}
                      acted={actedById[r.id]}
                      onSelect={() => selectResult(r)}
                    />
                  </li>
                ))}
                {searchHasMore && searchQuery.trim() === committedQuery && (
                  <li className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => void runSearch(true)}
                      disabled={searchDisabled}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </>
        )}

        {/* Shared note about the selected/acted listing — visible in every tab. */}
        {previewNote && <p className="mt-3 text-xs text-slate-500">{previewNote}</p>}

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
          {validId && (
            <p className="mt-1 text-xs font-medium text-slate-500">Acting on listing #{trimmedId}</p>
          )}
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
          {reason && (
            <div className="mt-2 max-w-sm">
              <RestrictReasonHelp reason={reason} />
            </div>
          )}
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
            !validId ? "Find a listing first" : !reason ? "Pick a reason first" : undefined
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
          {validId && (
            <p className="mt-1 text-xs font-medium text-slate-500">Acting on listing #{trimmedId}</p>
          )}
        </div>
        <button
          type="button"
          onClick={reinstate}
          disabled={!validId || busyAny || unauthorized}
          title={!validId ? "Find a listing first" : undefined}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy === "reinstate" ? "Reinstating…" : "Reinstate listing"}
        </button>
      </section>
    </div>
  );
}

function SearchResultRow({
  result,
  selected,
  acted,
  onSelect,
}: {
  result: SearchResult;
  selected: boolean;
  acted?: "restricted" | "reinstated";
  onSelect: () => void;
}) {
  const thumb = getPostImageUrl(result.thumbnailPath, result.updatedAt);
  const title = (result.title ?? "").trim() || "(untitled)";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
        selected
          ? "border-slate-400 bg-slate-100"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb}
          alt=""
          className="h-12 w-12 shrink-0 rounded-md border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-slate-100 text-lg">
          🖼️
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium text-slate-900">{title}</span>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {formatAudCents(result.priceCents)}
          </span>
          {acted ? (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                acted === "restricted"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {acted === "restricted" ? "Restricted" : "Reinstated"}
            </span>
          ) : (
            result.status &&
            result.status !== "available" && (
              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {result.status}
              </span>
            )
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          Listing #{result.id}
          {result.sellerNickname ? ` · ${result.sellerNickname}` : ""}
        </p>
      </div>
      <span className="shrink-0 text-xs font-medium text-slate-400">
        {acted ? "✓" : selected ? "Selected" : "Select"}
      </span>
    </button>
  );
}
