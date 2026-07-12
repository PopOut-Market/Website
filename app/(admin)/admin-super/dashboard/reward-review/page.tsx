"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
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
 * Layout: the queue is grouped BY SELLER. Each seller is one expandable row;
 * expanding shows that seller's pending listings. A seller may have at most
 * APPROVED_CAP (6) approved claims — once reached, Approve is disabled for all
 * of their remaining listings. NOTE: this cap is enforced in the UI only. The
 * write still goes through the SECURITY DEFINER `admin_review_claim` RPC, which
 * does not enforce it; a hard guarantee needs that RPC changed.
 *
 * Reads/writes call the RPCs DIRECTLY from the signed-in reviewer's Supabase
 * session (granted to `authenticated`, self-gated on `reward_admins`). The
 * per-seller approved counts come from a read-only service-role route.
 */

const APPROVED_CAP = 6;

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

type SellerGroup = {
  sellerId: string;
  nickname: string;
  claims: Claim[];
};

type ApprovedItem = {
  claimId: number;
  ownerId: string | null;
  nickname: string;
  postId: number | null;
  title: string | null;
  priceCents: number | null;
  thumbnailPath: string | null;
  decidedAt: string | null;
  reviewer: string | null;
};

type HistorySummary = {
  totalApproved: number;
  sellersApproved: number;
  perSeller: { ownerId: string; nickname: string; count: number }[];
};

const PAGE_SIZE = 50;
const UNKNOWN_SELLER = "__unknown__";

const REJECT_CODES = [
  { value: "not_own_photos", label: "Not their own photos" },
  { value: "community_safety", label: "Community safety" },
  { value: "duplicate", label: "Duplicate listing" },
  {
    value: "not_serious",
    label: "Not a serious listing",
    hint: "joke, test, filler, or absurd-priced listing — not a genuine item for sale",
  },
  {
    value: "item_not_available",
    label: "Item not actually available to sell",
    hint: "the listing's own photos show the item still belongs to a shop (store racks/shelves, sales floor, or held up in-store). Tags alone are never the signal — give ambiguous photos the benefit of the doubt.",
  },
] as const;
type RejectCode = (typeof REJECT_CODES)[number]["value"];

// Documented RPC guard: reward_review_claim / admin_review_claim raises this
// (on both approve AND reject) when the claim's listing is currently restricted.
// It's a deliberate guard, not a failure — surface the fix, not a raw error.
const POST_RESTRICTED_CODE = "REWARDS_POST_RESTRICTED";
const POST_RESTRICTED_MESSAGE =
  "This listing is currently taken down. Reinstate it first, then decide the claim.";

// `guard` errors are deliberate backend refusals (e.g. the listing is restricted),
// not failures — the UI renders them as an amber notice instead of a red error.
type ReviewError = { text: string; guard: boolean };
function toReviewError(rawMessage: string | null | undefined): ReviewError {
  const raw = (rawMessage ?? "").trim();
  if (raw.toUpperCase().includes(POST_RESTRICTED_CODE)) {
    return { text: POST_RESTRICTED_MESSAGE, guard: true };
  }
  return { text: raw || "Action failed.", guard: false };
}

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

// Group claims by seller, preserving oldest-first order (groups float up by the
// age of their oldest pending claim, since `ordered` is already oldest-first).
function groupBySeller(ordered: Claim[]): SellerGroup[] {
  const map = new Map<string, SellerGroup>();
  for (const c of ordered) {
    const id = c.seller?.id ?? UNKNOWN_SELLER;
    const existing = map.get(id);
    if (existing) {
      existing.claims.push(c);
    } else {
      map.set(id, {
        sellerId: id,
        nickname: c.seller?.nickname ?? "Unknown seller",
        claims: [c],
      });
    }
  }
  return [...map.values()];
}

export default function RewardReviewPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [approvedCounts, setApprovedCounts] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [approvedItems, setApprovedItems] = useState<ApprovedItem[]>([]);
  const [historySummary, setHistorySummary] = useState<HistorySummary | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState<Set<string>>(new Set());

  const fetchApprovedCounts = useCallback(async () => {
    try {
      const res = await adminApiFetch("/api/admin/reward-approved-counts", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setApprovedCounts(json.counts ?? {});
      }
    } catch {
      /* non-fatal — cap just won't pre-populate */
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await adminApiFetch("/api/admin/reward-history", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setApprovedItems(json.approved ?? []);
        setHistorySummary(json.summary ?? null);
      }
    } catch {
      /* non-fatal — history just won't show */
    } finally {
      setHistoryLoading(false);
    }
  }, []);

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
    fetchApprovedCounts();
    fetchHistory();
  }, [fetchPage, fetchApprovedCounts, fetchHistory]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const handleReviewed = useCallback(
    (claimId: number, ownerId: string | null, approved: boolean, message: string) => {
      setClaims((prev) => prev.filter((c) => c.claim_id !== claimId));
      // The server's pending set shrank by one, so pull the paging offset back in
      // step — otherwise the next "Load more" would skip unreviewed claims.
      setOffset((o) => Math.max(0, o - 1));
      // An approval consumes one of the seller's 6 slots — reflect it locally so
      // the rest of their listings disable Approve the moment the cap is hit.
      if (approved && ownerId) {
        setApprovedCounts((prev) => ({ ...prev, [ownerId]: (prev[ownerId] ?? 0) + 1 }));
      }
      // An approval moves the listing into the history list below — refresh it so
      // the running record + totals reflect the decision immediately.
      if (approved) fetchHistory();
      setToast(message);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    },
    [fetchHistory],
  );

  const toggleExpand = useCallback((sellerId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sellerId)) next.delete(sellerId);
      else next.add(sellerId);
      return next;
    });
  }, []);

  const toggleHistoryExpand = useCallback((sellerId: string) => {
    setHistoryExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sellerId)) next.delete(sellerId);
      else next.add(sellerId);
      return next;
    });
  }, []);

  // Oldest-first at the top, stable across removals + pagination.
  const ordered = [...claims].sort((a, b) => createdMs(a) - createdMs(b));
  const groups = groupBySeller(ordered);

  // Split rule (UI-only, no backend/rule change): a seller belongs in the
  // actionable TOP queue only if they still have room under the 6-approval cap
  // AND have pending listings — i.e. approved < CAP and pending > 0. Once a seller
  // reaches the cap (>= CAP approved) they drop to the bottom list even if pending
  // claims remain, because those can't be approved anyway (Approve is locked).
  const pendingCountById = new Map(groups.map((g) => [g.sellerId, g.claims.length]));
  const actionableGroups = groups.filter(
    (g) => g.sellerId === UNKNOWN_SELLER || (approvedCounts[g.sellerId] ?? 0) < APPROVED_CAP,
  );
  const topSellerIds = new Set(actionableGroups.map((g) => g.sellerId));
  const actionablePending = actionableGroups.reduce((n, g) => n + g.claims.length, 0);

  // Bottom list = every seller NOT in the actionable top queue, built from the
  // approved-items feed (already newest-first) so the most recently-approved
  // seller sorts to the top. Includes at-cap sellers whose pending overflow is
  // shown as a badge (informational — not actionable here).
  const approvedBySeller = new Map<
    string,
    { ownerId: string; nickname: string; items: ApprovedItem[]; lastApprovedAt: string | null }
  >();
  for (const it of approvedItems) {
    const id = it.ownerId ?? UNKNOWN_SELLER;
    const ex = approvedBySeller.get(id);
    if (ex) ex.items.push(it);
    else
      approvedBySeller.set(id, {
        ownerId: id,
        nickname: it.nickname,
        items: [it],
        lastApprovedAt: it.decidedAt,
      });
  }
  const reviewedRoster = [...approvedBySeller.values()]
    .filter((s) => s.ownerId !== UNKNOWN_SELLER && !topSellerIds.has(s.ownerId))
    .sort((a, b) => {
      const ta = a.lastApprovedAt ? new Date(a.lastApprovedAt).getTime() : 0;
      const tb = b.lastApprovedAt ? new Date(b.lastApprovedAt).getTime() : 0;
      return tb - ta;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reward review</h1>
        <p className="mt-1 text-sm text-slate-600">
          Approve or deny the <span className="font-medium">+10&nbsp;coin</span> reward for newly
          posted listings, grouped by seller. Each seller can earn at most{" "}
          <span className="font-medium">{APPROVED_CAP}</span> approvals — after that, Approve is
          locked. This never affects the listing itself.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="To review"
          total={hasMore ? `${actionablePending}+` : actionablePending}
          loading={loading}
        />
        <KpiCard label="Sellers to review" total={actionableGroups.length} loading={loading} />
        <KpiCard
          label="Approved (all-time)"
          total={historySummary?.totalApproved ?? 0}
          loading={historyLoading}
        />
        <KpiCard
          label="Sellers approved"
          total={historySummary?.sellersApproved ?? 0}
          loading={historyLoading}
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

      <div>
        <h2 className="text-lg font-semibold text-slate-900">Pending review</h2>
        <p className="mt-1 text-sm text-slate-600">
          Sellers still under the {APPROVED_CAP}-cap with listings awaiting a decision. Expand to
          approve or deny. Sellers already at the cap move to the list below.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : actionableGroups.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
          <div className="mb-3 text-4xl">🎉</div>
          <p className="text-sm text-slate-600">
            Nothing to review — every seller with pending listings is already at the cap.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {actionableGroups.map((group) => {
            const confirmed =
              group.sellerId === UNKNOWN_SELLER ? 0 : (approvedCounts[group.sellerId] ?? 0);
            const atCap = group.sellerId !== UNKNOWN_SELLER && confirmed >= APPROVED_CAP;
            const isOpen = expanded.has(group.sellerId);
            return (
              <SellerRow
                key={group.sellerId}
                group={group}
                confirmed={confirmed}
                atCap={atCap}
                isOpen={isOpen}
                onToggle={() => toggleExpand(group.sellerId)}
                onReviewed={handleReviewed}
              />
            );
          })}
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

      {/* Reviewed sellers — everyone with 0 pending. Sorted by most-recent
          approval (newest at top); click a seller to expand their approved
          listings. A seller re-enters the queue above the moment a new listing
          is posted, and drops back to the top here once it's approved. */}
      <section className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Reviewed &amp; at-cap</h2>
          <p className="mt-1 text-sm text-slate-600">
            Sellers you&apos;re done with — fully reviewed, or already at the {APPROVED_CAP}-cap
            (extra pending shown but can&apos;t be approved). Most recently approved first; click to
            expand.
            {historySummary
              ? ` ${historySummary.totalApproved} approved across ${historySummary.sellersApproved} seller${
                  historySummary.sellersApproved === 1 ? "" : "s"
                }.`
              : ""}
          </p>
        </div>

        {historyLoading && reviewedRoster.length === 0 ? (
          <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
        ) : reviewedRoster.length === 0 ? (
          <p className="text-sm text-slate-400">No fully-reviewed sellers yet.</p>
        ) : (
          <div className="space-y-3">
            {reviewedRoster.map((s) => {
              const approved = approvedCounts[s.ownerId] ?? s.items.length;
              const atCap = approved >= APPROVED_CAP;
              const pending = pendingCountById.get(s.ownerId) ?? 0;
              const isOpen = historyExpanded.has(s.ownerId);
              return (
                <div
                  key={s.ownerId}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleHistoryExpand(s.ownerId)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50"
                  >
                    <span className="text-slate-400">{isOpen ? "▾" : "▸"}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {(s.nickname.trim()[0] ?? "?").toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
                      {s.nickname}
                    </span>
                    <span className="hidden text-xs text-slate-400 sm:inline">
                      {s.items.length} listing{s.items.length === 1 ? "" : "s"}
                    </span>
                    {pending > 0 && (
                      <span
                        className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                        title="Pending listings over the cap — can't be approved"
                      >
                        {pending} pending
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                        atCap ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}
                      title="Approved / cap"
                    >
                      {approved}/{APPROVED_CAP}
                    </span>
                  </button>

                  {isOpen && (
                    <ul className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/50">
                      {s.items.map((it) => {
                        const thumb = getPostImageUrl(it.thumbnailPath);
                        return (
                          <li key={it.claimId} className="flex items-center gap-3 px-5 py-2.5">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumb}
                                alt=""
                                className="h-10 w-10 shrink-0 rounded-md border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-base">
                                🖼️
                              </div>
                            )}
                            <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                              {it.title ?? "(untitled)"}
                            </span>
                            <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                              {priceLabel(it.priceCents)}
                            </span>
                            <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
                              {formatDate(it.decidedAt)}
                              {it.reviewer ? ` · ${it.reviewer}` : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function SellerRow({
  group,
  confirmed,
  atCap,
  isOpen,
  onToggle,
  onReviewed,
}: {
  group: SellerGroup;
  confirmed: number;
  atCap: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onReviewed: (claimId: number, ownerId: string | null, approved: boolean, message: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <span className="text-slate-400">{isOpen ? "▾" : "▸"}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
          {(group.nickname.trim()[0] ?? "?").toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{group.nickname}</p>
          <p className="text-xs text-slate-400">
            {group.claims.length} pending listing{group.claims.length === 1 ? "" : "s"}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            atCap ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {confirmed}/{APPROVED_CAP} confirmed{atCap ? " · cap reached" : ""}
        </span>
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-slate-100 bg-slate-50/50 p-4">
          {atCap && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              This seller already has {confirmed} approved listings (cap is {APPROVED_CAP}). Approve
              is locked; you can still deny.
            </p>
          )}
          {group.claims.map((claim) => (
            <ClaimCard
              key={claim.claim_id}
              claim={claim}
              approveLocked={atCap}
              onReviewed={onReviewed}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ClaimCard({
  claim,
  approveLocked,
  onReviewed,
}: {
  claim: Claim;
  approveLocked: boolean;
  onReviewed: (claimId: number, ownerId: string | null, approved: boolean, message: string) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [code, setCode] = useState<RejectCode>("not_own_photos");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);
  const [err, setErr] = useState<ReviewError | null>(null);

  const photos = (claim.photos ?? [])
    .map((p) => getPostImageUrl(p))
    .filter((u): u is string => Boolean(u));

  const selectedReason = REJECT_CODES.find((r) => r.value === code);
  const rejectHint = selectedReason && "hint" in selectedReason ? selectedReason.hint : null;

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
        setErr(toReviewError(error.message));
        setBusy(null);
        return;
      }
      // Success → parent removes this card (component unmounts). `changed:false`
      // means another reviewer already decided it, so don't claim a fresh credit.
      const result = (Array.isArray(data) ? data[0] : data) as { changed?: boolean } | null;
      const alreadyDecided = result?.changed === false;
      onReviewed(
        claim.claim_id,
        claim.seller?.id ?? null,
        approve && !alreadyDecided,
        alreadyDecided
          ? "This claim was already reviewed by someone else."
          : approve
            ? "Approved — seller credited +10 coins."
            : `Reward denied (${REJECT_CODES.find((r) => r.value === code)?.label}).`,
      );
    } catch (e) {
      setErr(toReviewError(e instanceof Error ? e.message : null));
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
          <p className="mt-1 text-xs text-slate-400">{formatDate(claim.created_at)}</p>
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
          <p
            className={`mb-2 rounded-lg border px-3 py-1.5 text-sm ${
              err.guard
                ? "border-amber-300 bg-amber-50 text-amber-800"
                : "border-rose-300 bg-rose-50 text-rose-700"
            }`}
          >
            {err.text}
          </p>
        )}

        {!rejecting ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => review(true)}
              disabled={busy !== null || approveLocked}
              title={approveLocked ? `Seller reached the ${APPROVED_CAP}-approval cap` : undefined}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {approveLocked
                ? "Approve locked"
                : busy === "approve"
                  ? "Approving…"
                  : "Approve +10 coins"}
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
              {rejectHint && <p className="mt-1 text-xs text-slate-500">{rejectHint}</p>}
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
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Also taking this listing down? Deny the reward here first, then restrict — restricting
              first silently cancels this pending claim without naming the rule.
            </p>
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
