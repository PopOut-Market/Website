"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { getPostImageUrl } from "@/lib/supabase/post-image-url";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reward review — NOT listing moderation.
 *
 * A listing goes live the moment it is posted and is never blocked here. What
 * gets reviewed is whether the listing earns its +10 coin reward. The queue is
 * `reward_listing_claims` rows with status='pending'. Approve credits the
 * seller; deny refuses the reward with an internal reason. Neither touches the
 * listing.
 *
 * Both reads and writes call SECURITY DEFINER RPCs DIRECTLY from the signed-in
 * reviewer's Supabase session (granted to `authenticated`, self-gated on
 * `reward_admins`). There is intentionally no server route and no service-role
 * key here — the mutation happens server-side inside Postgres.
 */

type OtherListing = {
  post_id: string;
  thumbnail_path: string | null;
  title: string | null;
  price_cents: number | null;
};

type Claim = {
  claim_id: number;
  post_id: string;
  created_at: string;
  title: string | null;
  description: string | null;
  price_cents: number | null;
  category_id: number | null;
  post_status: string | null;
  photos: string[] | null;
  seller: { id: string; nickname: string | null } | null;
  other_listings: OtherListing[] | null;
};

const PAGE_SIZE = 50;

const REJECT_CODES = [
  { value: "not_own_photos", label: "Not their own photos" },
  { value: "community_safety", label: "Community safety" },
  { value: "duplicate", label: "Duplicate listing" },
] as const;
type RejectCode = (typeof REJECT_CODES)[number]["value"];

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
function priceLabel(cents: number | null | undefined): string {
  return cents == null ? "—" : aud.format(cents / 100);
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? new Date(t).toLocaleString() : "";
}

function createdMs(c: Claim): number {
  const t = new Date(c.created_at ?? "").getTime();
  return Number.isFinite(t) ? t : 0;
}

export default function RewardReviewPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(async (nextOffset: number, append: boolean) => {
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
      const { data, error } = await sb.rpc("admin_list_pending_claims", {
        p_limit: PAGE_SIZE,
        p_offset: nextOffset,
      });
      if (error) {
        setError(error.message || "Failed to load claims.");
        return;
      }
      const rows = Array.isArray(data) ? (data as Claim[]) : [];
      setClaims((prev) => (append ? [...prev, ...rows] : rows));
      setOffset(nextOffset + rows.length);
      setHasMore(rows.length === PAGE_SIZE);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load claims.");
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const handleReviewed = useCallback((claimId: number, message: string) => {
    setClaims((prev) => prev.filter((c) => c.claim_id !== claimId));
    // The server's pending set shrank by one, so pull the paging offset back in
    // step — otherwise the next "Load more" would skip unreviewed claims.
    setOffset((o) => Math.max(0, o - 1));
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  // Guarantee oldest-first at the top, stable across removals + pagination
  // (the RPC already returns oldest-first; this keeps it certain client-side).
  const ordered = [...claims].sort((a, b) => createdMs(a) - createdMs(b));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reward review</h1>
        <p className="mt-1 text-sm text-slate-600">
          Approve or deny the <span className="font-medium">+10&nbsp;coin</span> reward for newly
          posted listings. This does not affect the listing itself — it stays live either way.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard
          label="Pending claims"
          total={hasMore ? `${claims.length}+` : claims.length}
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
            <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : claims.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="mb-3 text-4xl">🎉</div>
          <p className="text-sm text-slate-600">
            No pending reward claims — you&apos;re all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordered.map((claim) => (
            <ClaimCard key={claim.claim_id} claim={claim} onReviewed={handleReviewed} />
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

function ClaimCard({
  claim,
  onReviewed,
}: {
  claim: Claim;
  onReviewed: (claimId: number, message: string) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [code, setCode] = useState<RejectCode>("not_own_photos");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);
  const [err, setErr] = useState<string | null>(null);

  const photos = (claim.photos ?? [])
    .map((p) => getPostImageUrl(p))
    .filter((u): u is string => Boolean(u));

  async function review(approve: boolean) {
    setBusy(approve ? "approve" : "reject");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error } = await sb.rpc(
        "admin_review_claim",
        approve
          ? { p_claim_id: claim.claim_id, p_approve: true }
          : {
              p_claim_id: claim.claim_id,
              p_approve: false,
              p_code: code,
              p_note: note.trim() || null,
            },
      );
      if (error) {
        setErr(error.message || "Action failed.");
        setBusy(null);
        return;
      }
      // Success → parent removes this card (component unmounts). `changed:false`
      // means another reviewer already decided it, so don't claim a fresh credit.
      const result = (Array.isArray(data) ? data[0] : data) as { changed?: boolean } | null;
      const alreadyDecided = result?.changed === false;
      onReviewed(
        claim.claim_id,
        alreadyDecided
          ? "This claim was already reviewed by someone else."
          : approve
            ? "Approved — seller credited +10 coins."
            : `Reward denied (${REJECT_CODES.find((r) => r.value === code)?.label}).`,
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed.");
      setBusy(null);
    }
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex shrink-0 gap-2">
          {photos.length === 0 ? (
            <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-slate-100 text-2xl">
              🖼️
            </div>
          ) : (
            photos.slice(0, 3).map((url) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="h-28 w-28 rounded-lg border border-slate-200 object-cover transition hover:opacity-80"
                />
              </a>
            ))
          )}
          {photos.length > 3 && (
            <div className="flex h-28 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
              +{photos.length - 3}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              {claim.title ?? "(untitled)"}
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {priceLabel(claim.price_cents)}
            </span>
            {claim.post_status && claim.post_status !== "available" && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                listing: {claim.post_status}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {claim.seller?.nickname ?? "Unknown seller"} · {formatDate(claim.created_at)}
          </p>
          {claim.description && (
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-slate-700">
              {claim.description}
            </p>
          )}

          {claim.other_listings && claim.other_listings.length > 0 && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium text-slate-500">
                Seller&apos;s other listings
              </p>
              <div className="flex flex-wrap gap-2">
                {claim.other_listings.slice(0, 6).map((o) => {
                  const thumb = getPostImageUrl(o.thumbnail_path);
                  return (
                    <div
                      key={o.post_id}
                      className="w-14"
                      title={`${o.title ?? ""} ${priceLabel(o.price_cents)}`.trim()}
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt=""
                          className="h-14 w-14 rounded-md border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-slate-100 text-sm">
                          🖼️
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        {err && (
          <p className="mb-2 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm text-rose-700">
            {err}
          </p>
        )}

        {!rejecting ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => review(true)}
              disabled={busy !== null}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {busy === "approve" ? "Approving…" : "Approve +10 coins"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRejecting(true);
                setErr(null);
              }}
              disabled={busy !== null}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Deny reward
            </button>
          </div>
        ) : (
          <div className="space-y-3 rounded-lg bg-slate-50 p-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Reason (internal — never shown to the seller)
              </label>
              <select
                value={code}
                onChange={(e) => setCode(e.target.value as RejectCode)}
                disabled={busy !== null}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
              >
                {REJECT_CODES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Internal note (optional)
              </label>
              <textarea
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
                onClick={() => review(false)}
                disabled={busy !== null}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
              >
                {busy === "reject" ? "Denying…" : "Confirm deny"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejecting(false);
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
    </article>
  );
}
