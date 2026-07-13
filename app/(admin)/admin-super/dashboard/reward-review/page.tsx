"use client";

import { useAdminAuth } from "@/components/admin/admin-auth-guard";
import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import {
  formatAudCents,
  formatDateTime,
  isNotAuthorized,
  mapRpcError,
  postIdArg,
  RESTRICT_REASON_CODES,
  RESTRICTION_REASON_LABELS,
  REWARD_APPROVED_CAP,
  REWARD_COINS,
  UNAUTHORIZED_MESSAGE,
  unwrapRpc,
  type RestrictReasonCode,
} from "@/lib/supabase/admin-rpc";
import { getPostImageUrl } from "@/lib/supabase/post-image-url";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Review queue — one card per LISTING, newest first.
 *
 * ## The model
 *
 * Every new listing raises a `reward_listing_claims` row, and every claim needs
 * exactly ONE answer from the reviewer:
 *
 *     "Is this listing OK to stay on the marketplace?"
 *
 * The coins are NOT a second question. `admin_review_claim(id, approve=true)`
 * decides them ITSELF: it counts the seller's `listing_approved` ledger rows
 * under an advisory lock and credits +10 only if they are under the cap. Past the
 * cap it clears the claim at ZERO coins and returns `credited: false` with
 * `status: 'closed_at_cap'`. It has always worked this way, and the cap has always
 * been enforced there — a client cannot make it overpay.
 *
 * So Approve is ONE button that is never disabled. The seller's approved count is
 * used ONLY to PREVIEW the outcome on the label ("+10 coins" / "no coins"). If
 * that preview is stale, wrong, or unavailable, nothing breaks and no money moves
 * incorrectly — the RECEIPT is rendered from what the server actually returned,
 * never from what the client guessed.
 *
 * ## What the old page got wrong
 *
 * It DISABLED Approve once a seller hit the cap. That was the whole bug. The
 * server would have cleared those claims at zero coins quite happily, but the UI
 * refused to ask, leaving the reviewer with only Deny (every reason code asserts
 * seller FAULT — a fabricated accusation against a clean listing) or Restrict
 * (removes a good listing). Both are lies, so an honest reviewer wrote nothing and
 * at-cap sellers' listings stacked up forever.
 *
 * It also grouped BY SELLER, so a group's sort key was its OLDEST claim and a
 * listing posted a minute ago could sit at the bottom of the page. The unit of the
 * list now matches the unit of the decision — a listing. The seller is a chip on
 * the card, not a container.
 *
 * ## The one lane that is genuinely different
 *
 * A claim whose listing is already RESTRICTED cannot be approved or denied at all
 * — `admin_review_claim` raises REWARDS_POST_RESTRICTED on both. `admin_void_claim`
 * is the only exit. Those claims get their own section.
 *
 * All RPCs are called directly from the signed-in reviewer's Supabase session
 * (granted to `authenticated`, self-gated on `reward_admins`).
 */

const PENDING_PAGE_SIZE = 50; // page size the RPC honours
const MAX_PENDING_PAGES = 40; // safety ceiling — 2000 pending claims
const STALE_AFTER_DAYS = 7; // nag when the oldest claim has waited this long

/**
 * Reasons the +10 is refused. EVERY one asserts seller FAULT and is recorded
 * permanently — which is why none of them may be used to clear a clean listing.
 * A clean listing from an at-cap seller is just an Approve that pays nothing.
 */
const DENY_CODES = [
  { value: "not_own_photos", label: "Not their own photos" },
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
  {
    value: "community_safety",
    label: "Community safety",
    hint: "this leaves the listing LIVE and only refuses the coins. If the listing is genuinely unsafe, use “Take listing down” instead.",
  },
] as const;
type DenyCode = (typeof DENY_CODES)[number]["value"];

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

/**
 * `review` — needs a decision. Whether it pays is the SERVER's business.
 * `blocked` — listing already taken down; only admin_void_claim can settle it.
 */
type Lane = "review" | "blocked";

type DecisionKind = "approved" | "closed" | "denied" | "restricted" | "voided" | "noop";

/** A receipt rendered IN PLACE of the card, so nothing below reflows mid-click. */
type Decided = { kind: DecisionKind; label: string; lane: Lane };

/** What `admin_review_claim` answers. `credited` is the money fact; trust it. */
type ReviewResult = {
  changed?: boolean;
  credited?: boolean;
  coins?: number;
  status?: string;
};

type HistoryItem = {
  claimId: number;
  ownerId: string | null;
  nickname: string;
  postId: number | null;
  title: string | null;
  priceCents: number | null;
  thumbnailPath: string | null;
  status: string | null;
  rejectCode: string | null;
  decidedAt: string | null;
  reviewer: string | null;
};

type HistorySummary = {
  totalApproved: number;
  sellersApproved: number;
  perSeller: { ownerId: string; nickname: string; count: number }[];
};

/* ------------------------------------------------------------------ helpers */

function createdMs(c: Claim): number {
  const t = new Date(c.created_at ?? "").getTime();
  return Number.isFinite(t) ? t : 0;
}

function relativeAge(iso: string | null | undefined): string {
  const t = new Date(iso ?? "").getTime();
  if (!Number.isFinite(t)) return "";
  const mins = Math.floor((Date.now() - t) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function initial(nickname: string): string {
  return (nickname.trim()[0] ?? "?").toUpperCase();
}

/**
 * Did the server actually pay? Read the ANSWER, never the client's guess.
 *
 * `credited` is authoritative. `status` is the fallback for it: 'closed_at_cap'
 * is the terminal status the RPC writes when it clears a claim without paying.
 * If neither field is present we return null — "it succeeded, but don't claim
 * anything about coins", which is the only honest thing left to say.
 */
function creditedFrom(result: ReviewResult | null): boolean | null {
  if (typeof result?.credited === "boolean") return result.credited;
  if (result?.status === "closed_at_cap") return false;
  if (result?.status === "approved") return true;
  return null;
}

function lastSeenKey(identity: string): string {
  return `popout.rewardReview.lastSeen.${identity}`;
}

function readLastSeen(identity: string): number | null {
  try {
    const raw = window.localStorage.getItem(lastSeenKey(identity));
    if (!raw) return null;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : null;
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------------- page */

export default function RewardReviewPage() {
  const { identity } = useAdminAuth();

  const [tab, setTab] = useState<"queue" | "decisions">("queue");

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedAt, setLoadedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [partial, setPartial] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  /**
   * Advisory ONLY — it decides the button's LABEL, never whether the button
   * works. The cap itself lives in Postgres.
   */
  const [approvedCounts, setApprovedCounts] = useState<Record<string, number>>({});
  const [countsError, setCountsError] = useState(false);

  const [decided, setDecided] = useState<Map<number, Decided>>(new Map());

  /** Frozen at mount — otherwise the NEW badges vanish the instant you arrive. */
  const [lastSeen, setLastSeen] = useState<number | null>(null);

  const [newestFirst, setNewestFirst] = useState(true);
  const [query, setQuery] = useState("");
  const [sellerFilter, setSellerFilter] = useState<{ id: string; nickname: string } | null>(null);
  const [showBlocked, setShowBlocked] = useState(false);

  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);

  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [historySummary, setHistorySummary] = useState<HistorySummary | null>(null);
  const [historyTruncated, setHistoryTruncated] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  /** "We have attempted a load" — NOT "we have data", or a failure loops. */
  const [historyTried, setHistoryTried] = useState(false);

  const countsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countsSeq = useRef(0);

  /* ------------------------------------------------------------- data loads */

  const fetchApprovedCounts = useCallback(async () => {
    const seq = ++countsSeq.current;
    try {
      const res = await adminApiFetch("/api/admin/reward-approved-counts", { cache: "no-store" });
      // Drop a stale answer: a response that left before a later decision would
      // otherwise roll the preview back and flip a label to the wrong outcome.
      if (seq !== countsSeq.current) return;
      if (!res.ok) {
        setCountsError(true);
        return;
      }
      const json = await res.json();
      if (seq !== countsSeq.current) return;
      setApprovedCounts(json.counts ?? {});
      setCountsError(false);
    } catch {
      if (seq === countsSeq.current) setCountsError(true);
    }
  }, []);

  /** Debounced so a burst of decisions costs ONE scan, not one per click. */
  const scheduleCountsRefresh = useCallback(() => {
    if (countsTimer.current) clearTimeout(countsTimer.current);
    countsTimer.current = setTimeout(() => void fetchApprovedCounts(), 1500);
  }, [fetchApprovedCounts]);

  const load = useCallback(async () => {
    if (!isAdminAuthConfigured()) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setPartial(null);
    setTruncated(false);

    const countsPromise = fetchApprovedCounts();
    const sb = getAdminAuthBrowserClient();
    const all: Claim[] = [];
    let failure: string | null = null;
    let lastPageFull = false;

    try {
      for (let page = 0; page < MAX_PENDING_PAGES; page++) {
        const { data, error: rpcError } = await sb.rpc("admin_list_pending_claims", {
          p_limit: PENDING_PAGE_SIZE,
          p_offset: page * PENDING_PAGE_SIZE,
        });
        if (rpcError) {
          if (isNotAuthorized(rpcError)) {
            setError(UNAUTHORIZED_MESSAGE);
            setClaims([]);
            setLoading(false);
            return;
          }
          failure = mapRpcError(rpcError, "Failed to load the queue.");
          break;
        }
        const rows = Array.isArray(data) ? (data as Claim[]) : [];
        all.push(...rows);
        lastPageFull = rows.length === PENDING_PAGE_SIZE;
        if (!lastPageFull) break;
      }
    } catch (e) {
      failure = e instanceof Error ? e.message : "Failed to load the queue.";
    }

    // A blipped page must not wipe the pages that DID load, or the KPI renders an
    // authoritative "0 to review" next to a red banner and the queue looks empty.
    if (failure && all.length === 0) {
      setError(failure);
      setClaims([]);
    } else {
      if (failure) setPartial(`${failure} Showing the ${all.length} claims that did load.`);
      setTruncated(!failure && lastPageFull);
      setClaims(all);
      setLoadedAt(new Date().toISOString());
    }

    await countsPromise;
    setLoading(false);
  }, [fetchApprovedCounts]);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await adminApiFetch("/api/admin/reward-history", { cache: "no-store" });
      if (!res.ok) {
        setHistoryError("Failed to load the decision history.");
        return;
      }
      const json = await res.json();
      setHistory(json.decisions ?? []);
      setHistorySummary(json.summary ?? null);
      setHistoryTruncated(Boolean(json.truncated));
    } catch {
      setHistoryError("Failed to load the decision history.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    setLastSeen(readLastSeen(identity));
  }, [identity]);

  useEffect(() => {
    void load();
  }, [load]);

  // Fetched only when the tab is opened, and only ONCE per invalidation. Gating on
  // `history === null` would loop forever on failure (the error paths never set
  // it), hammering an unbounded service-role scan. The gate is "have we tried".
  useEffect(() => {
    if (tab === "decisions" && !historyTried && !historyLoading) {
      setHistoryTried(true);
      void fetchHistory();
    }
  }, [tab, historyTried, historyLoading, fetchHistory]);

  useEffect(
    () => () => {
      if (countsTimer.current) clearTimeout(countsTimer.current);
    },
    [],
  );

  /* -------------------------------------------------------------- mutations */

  const onDecided = useCallback(
    (claimId: number, entry: Decided, creditedOwnerId?: string | null) => {
      setDecided((prev) => new Map(prev).set(claimId, entry));
      if (creditedOwnerId) {
        // Any counts fetch already in flight was issued BEFORE this payment, so its
        // answer is now stale by construction. Retire it — otherwise it lands a
        // moment later, overwrites this increment, and re-advertises "+10 coins" on
        // the seller's remaining cards when they have just hit the cap. (The money
        // is safe regardless: the RPC won't overpay and the receipt is rendered from
        // its answer. This keeps the PREVIEW from lying.)
        countsSeq.current++;
        setApprovedCounts((prev) => ({
          ...prev,
          [creditedOwnerId]: (prev[creditedOwnerId] ?? 0) + 1,
        }));
      }
      scheduleCountsRefresh();
      setHistory(null);
      setHistoryTried(false);
    },
    [scheduleCountsRefresh],
  );

  /** Restrict answered `changed:false` — the listing was ALREADY down. */
  const markAlreadyRestricted = useCallback((claimId: number) => {
    setClaims((prev) =>
      prev.map((c) => (c.claim_id === claimId ? { ...c, post_status: "restricted" } : c)),
    );
    // Re-laning unmounts the card that would have shown the explanation, so say it
    // at board level and open the lane — otherwise it just silently vanishes and
    // reads exactly like a successful take-down.
    setShowBlocked(true);
    setNotice(
      "That listing was already taken down, so nothing changed. Its reward claim is still open — it has moved to the Blocked section below.",
    );
  }, []);

  const markAllSeen = useCallback(() => {
    try {
      window.localStorage.setItem(lastSeenKey(identity), new Date().toISOString());
    } catch {
      /* best-effort */
    }
    setLastSeen(Date.now());
  }, [identity]);

  const clearDecided = useCallback(() => {
    setClaims((prev) => prev.filter((c) => !decided.has(c.claim_id)));
    setDecided(new Map());
  }, [decided]);

  const onUnauthorized = useCallback(() => setError(UNAUTHORIZED_MESSAGE), []);

  /* ---------------------------------------------------------------- derived */

  const laneOf = useCallback(
    (c: Claim): Lane => {
      const pinned = decided.get(c.claim_id)?.lane;
      if (pinned) return pinned; // a receipt never jumps sections under the cursor
      return c.post_status === "restricted" ? "blocked" : "review";
    },
    [decided],
  );

  const filtering = query.trim().length > 0 || sellerFilter !== null;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return claims.filter((c) => {
      if (sellerFilter && c.seller?.id !== sellerFilter.id) return false;
      if (!needle) return true;
      return `${c.title ?? ""} ${c.seller?.nickname ?? ""}`.toLowerCase().includes(needle);
    });
  }, [claims, query, sellerFilter]);

  const lanes = useMemo(() => {
    const out: Record<Lane, Claim[]> = { review: [], blocked: [] };
    for (const c of visible) out[laneOf(c)].push(c);
    for (const key of Object.keys(out) as Lane[]) {
      out[key].sort((a, b) =>
        newestFirst ? createdMs(b) - createdMs(a) : createdMs(a) - createdMs(b),
      );
    }
    return out;
  }, [visible, laneOf, newestFirst]);

  const pendingIn = useCallback(
    (lane: Lane) => lanes[lane].filter((c) => !decided.has(c.claim_id)).length,
    [lanes, decided],
  );

  const needsReviewCount = pendingIn("review");
  const blockedCount = pendingIn("blocked");

  const isNew = useCallback((c: Claim) => lastSeen != null && createdMs(c) > lastSeen, [lastSeen]);

  const newCount = useMemo(
    () => lanes.review.filter((c) => !decided.has(c.claim_id) && isNew(c)).length,
    [lanes.review, decided, isNew],
  );

  const oldestWaitingDays = useMemo(() => {
    const times = lanes.review
      .filter((c) => !decided.has(c.claim_id))
      .map(createdMs)
      .filter((t) => t > 0);
    if (times.length === 0) return 0;
    return Math.floor((Date.now() - Math.min(...times)) / 86_400_000);
  }, [lanes.review, decided]);

  const pendingCountFor = useCallback(
    (sellerId: string | undefined) => {
      if (!sellerId) return 0;
      return claims.filter((c) => c.seller?.id === sellerId && !decided.has(c.claim_id)).length;
    },
    [claims, decided],
  );

  const cardProps = {
    approvedCounts,
    countsError,
    decided,
    onDecided,
    onUnauthorized,
    markAlreadyRestricted,
    onOpenPhotos: (photos: string[], index: number) => setLightbox({ photos, index }),
    onFilterSeller: (id: string, nickname: string) => setSellerFilter({ id, nickname }),
    pendingCountFor,
    isNew,
  };

  /* ------------------------------------------------------------------ render */

  return (
    <div className="space-y-6">
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          onIndex={(i) => setLightbox((l) => (l ? { ...l, index: i } : l))}
          onClose={() => setLightbox(null)}
        />
      )}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Review queue</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          One question per listing:{" "}
          <strong className="font-semibold">is it OK to stay on the marketplace?</strong> Approve,
          and the coins sort themselves out — a seller under the {REWARD_APPROVED_CAP}-listing cap
          earns <span className="font-medium">+{REWARD_COINS}</span>, a seller at the cap earns
          nothing and the listing is simply cleared. Deny only if the seller is at fault; take the
          listing down if it breaks the rules.
        </p>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {(
          [
            ["queue", `Queue${needsReviewCount ? ` · ${needsReviewCount}` : ""}`],
            ["decisions", "Decisions"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
              tab === key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {tab === "decisions" ? (
        <DecisionsTab
          items={history}
          summary={historySummary}
          truncated={historyTruncated}
          loading={historyLoading}
          error={historyError}
          onRefresh={fetchHistory}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <KpiCard
              label="Needs review"
              total={truncated ? `${needsReviewCount}+` : needsReviewCount}
              loading={loading}
            />
            <KpiCard
              label="New since last visit"
              total={lastSeen == null ? "—" : newCount}
              loading={loading}
            />
            <KpiCard label="Blocked" total={blockedCount} loading={loading} />
            <KpiCard label="Decided this session" total={decided.size} loading={false} />
          </div>

          {countsError && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="flex-1">
                Couldn&apos;t load the reward counts, so the buttons can&apos;t preview whether a
                listing will earn coins.{" "}
                <strong className="font-semibold">Approving is still safe</strong> — the database
                decides the payout, not this page, and the receipt will tell you what actually
                happened.
              </span>
              <button
                type="button"
                onClick={() => void fetchApprovedCounts()}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
              >
                Retry
              </button>
            </div>
          )}

          {partial && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="flex-1">{partial}</span>
              <button
                type="button"
                onClick={() => void load()}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
              >
                Retry
              </button>
            </div>
          )}

          {notice && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="flex-1">{notice}</span>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or seller…"
              className="min-w-[12rem] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            <div className="flex overflow-hidden rounded-lg border border-slate-300">
              {(
                [
                  [true, "Newest"],
                  [false, "Oldest"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setNewestFirst(value)}
                  className={`px-3 py-1.5 text-xs font-semibold transition ${
                    newestFirst === value
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={markAllSeen}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Mark all seen
            </button>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "⟳ Refresh"}
            </button>
            {loadedAt && (
              <span className="text-xs text-slate-400">Loaded {relativeAge(loadedAt)}</span>
            )}
            {decided.size > 0 && (
              <button
                type="button"
                onClick={clearDecided}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
              >
                Clear {decided.size} decided
              </button>
            )}
          </div>

          {sellerFilter && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm text-slate-700">
              <span className="flex-1">
                Showing only <strong className="font-semibold">{sellerFilter.nickname}</strong>
                &apos;s listings.
              </span>
              <button
                type="button"
                onClick={() => setSellerFilter(null)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-white/60"
              >
                Clear filter
              </button>
            </div>
          )}

          {!loading && oldestWaitingDays >= STALE_AFTER_DAYS && newestFirst && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              <span className="flex-1">
                ⏳ The oldest claim has been waiting {oldestWaitingDays} days. Newest-first can
                starve the tail.
              </span>
              <button
                type="button"
                onClick={() => setNewestFirst(false)}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
              >
                Sort oldest first
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <section className="space-y-3">
                {lanes.review.length === 0 ? (
                  // A filter that hides everything is not an empty queue.
                  filtering ? (
                    <div className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500 shadow-sm">
                      No listings match the current filter.
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                      <div className="mb-3 text-4xl">🎉</div>
                      <p className="text-sm text-slate-600">
                        Nothing left to review — every listing has a decision.
                      </p>
                      {blockedCount > 0 && (
                        <p className="mt-1 text-xs text-slate-400">
                          {blockedCount} blocked claim{blockedCount === 1 ? "" : "s"} still below.
                        </p>
                      )}
                    </div>
                  )
                ) : (
                  <LaneBody
                    claims={lanes.review}
                    lane="review"
                    showNewDivider={newestFirst && lastSeen != null}
                    {...cardProps}
                  />
                )}
              </section>

              {lanes.blocked.length > 0 && (
                <section className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowBlocked((v) => !v)}
                    className="flex w-full items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left transition hover:bg-rose-100/70"
                  >
                    <span className="text-slate-400">{showBlocked ? "▾" : "▸"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-rose-900">
                        Blocked — listing already taken down · {blockedCount}
                      </span>
                      <span className="mt-0.5 block text-xs text-rose-700">
                        No reward decision is possible while a listing is restricted — approve and
                        deny both refuse. Reinstate it, or void the claim.
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-slate-500">
                      {showBlocked ? "Hide" : "Show"}
                    </span>
                  </button>
                  {showBlocked && <LaneBody claims={lanes.blocked} lane="blocked" {...cardProps} />}
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- lane body */

type CardCommon = {
  approvedCounts: Record<string, number>;
  countsError: boolean;
  decided: Map<number, Decided>;
  onDecided: (claimId: number, entry: Decided, creditedOwnerId?: string | null) => void;
  onUnauthorized: () => void;
  markAlreadyRestricted: (claimId: number) => void;
  onOpenPhotos: (photos: string[], index: number) => void;
  onFilterSeller: (id: string, nickname: string) => void;
  pendingCountFor: (sellerId: string | undefined) => number;
  isNew: (c: Claim) => boolean;
};

function LaneBody({
  claims,
  lane,
  showNewDivider = false,
  ...common
}: CardCommon & { claims: Claim[]; lane: Lane; showNewDivider?: boolean }) {
  let dividerAfter = -1;
  if (showNewDivider) {
    const lastNew = claims.map((c) => common.isNew(c)).lastIndexOf(true);
    const firstOld = claims.findIndex((c) => !common.isNew(c));
    if (lastNew >= 0 && firstOld > lastNew) dividerAfter = lastNew;
  }

  return (
    <div className="space-y-3">
      {claims.map((claim, i) => (
        <div key={claim.claim_id} className="space-y-3">
          {common.decided.has(claim.claim_id) ? (
            <Receipt claim={claim} entry={common.decided.get(claim.claim_id)!} />
          ) : (
            <ClaimCard claim={claim} lane={lane} {...common} />
          )}
          {i === dividerAfter && (
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                earlier
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Receipt({ claim, entry }: { claim: Claim; entry: Decided }) {
  const tone: Record<DecisionKind, string> = {
    approved: "border-emerald-300 bg-emerald-50 text-emerald-900",
    closed: "border-slate-300 bg-slate-100 text-slate-800",
    denied: "border-rose-300 bg-rose-50 text-rose-900",
    restricted: "border-rose-300 bg-rose-50 text-rose-900",
    voided: "border-slate-300 bg-slate-100 text-slate-800",
    noop: "border-amber-300 bg-amber-50 text-amber-900",
  };
  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-4 py-2.5 text-sm ${tone[entry.kind]}`}
    >
      <span className="font-semibold">{entry.label}</span>
      <span className="opacity-60">·</span>
      <span className="min-w-0 truncate">{claim.title ?? "(untitled)"}</span>
      <span className="opacity-60">·</span>
      <span className="opacity-80">{claim.seller?.nickname ?? "Unknown seller"}</span>
    </div>
  );
}

/* --------------------------------------------------------------------- card */

function ClaimCard({
  claim,
  lane,
  approvedCounts,
  countsError,
  onDecided,
  onUnauthorized,
  markAlreadyRestricted,
  onOpenPhotos,
  onFilterSeller,
  pendingCountFor,
  isNew,
}: CardCommon & { claim: Claim; lane: Lane }) {
  const [panel, setPanel] = useState<null | "deny" | "restrict">(null);
  const [denyNote, setDenyNote] = useState("");
  const [showDenyNote, setShowDenyNote] = useState(false);
  const [restrictReason, setRestrictReason] = useState<RestrictReasonCode | "">("");
  const [restrictNote, setRestrictNote] = useState("");
  const [showOthers, setShowOthers] = useState(false);
  const [busy, setBusy] = useState<null | string>(null);
  const [err, setErr] = useState<{ text: string; guard: boolean } | null>(null);

  const sellerId = claim.seller?.id ?? null;
  const nickname = claim.seller?.nickname ?? "Unknown seller";
  const rewarded = sellerId ? (approvedCounts[sellerId] ?? 0) : 0;
  const alsoPending = Math.max(0, pendingCountFor(sellerId ?? undefined) - 1);
  const blocked = lane === "blocked";

  // Can we PREVIEW the coin outcome? Only affects the label — never the button.
  const previewKnown = !countsError && sellerId !== null;
  const willPay = previewKnown ? rewarded < REWARD_APPROVED_CAP : null;

  const photos = (claim.photos ?? [])
    .map((p) => getPostImageUrl(p))
    .filter((u): u is string => Boolean(u));

  function fail(rpcError: { message?: string | null } | null, fallback: string) {
    setBusy(null);
    if (isNotAuthorized(rpcError)) {
      onUnauthorized();
      return;
    }
    const raw = (rpcError?.message ?? "").trim();
    const guard = /REWARDS_POST_RESTRICTED|SELLER_UNDER_CAP|POST_STILL_LIVE/i.test(raw);
    setErr({ text: mapRpcError(rpcError, fallback), guard });
  }

  /**
   * The ONE hygiene verdict. `admin_review_claim` decides the coins itself — it
   * pays +10 under the cap and clears at zero past it — so this button is never
   * disabled and the client never sends a coin amount. The receipt is written
   * from `credited` in the ANSWER, so even a stale preview can't make the UI
   * claim a payment that didn't happen.
   */
  async function approve() {
    setBusy("approve");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_review_claim", {
        p_claim_id: claim.claim_id,
        p_approve: true,
      });
      if (rpcError) return fail(rpcError, "Failed to approve the claim.");

      const result = unwrapRpc<ReviewResult>(data);
      if (result?.changed === false) {
        onDecided(claim.claim_id, {
          kind: "noop",
          label: "Already decided by someone else",
          lane,
        });
        return;
      }
      const paid = creditedFrom(result);
      const coins = typeof result?.coins === "number" ? result.coins : REWARD_COINS;
      onDecided(
        claim.claim_id,
        paid === true
          ? { kind: "approved", label: `Approved · +${coins} coins`, lane }
          : paid === false
            ? { kind: "closed", label: "Approved · no coins (seller at cap)", lane }
            : { kind: "approved", label: "Approved", lane },
        paid === true ? sellerId : null,
      );
    } catch (e) {
      fail({ message: e instanceof Error ? e.message : null }, "Failed to approve the claim.");
    }
  }

  /** Void — the ONLY exit for a claim whose listing is already taken down. */
  async function voidClaim() {
    setBusy("void");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_void_claim", {
        p_claim_id: claim.claim_id,
      });
      if (rpcError) return fail(rpcError, "Failed to void the claim.");
      const already = unwrapRpc<ReviewResult>(data)?.changed === false;
      onDecided(claim.claim_id, {
        kind: already ? "noop" : "voided",
        label: already ? "Already decided by someone else" : "Claim voided — listing is down",
        lane,
      });
    } catch (e) {
      fail({ message: e instanceof Error ? e.message : null }, "Failed to void the claim.");
    }
  }

  /** Deny the reward for FAULT. Picking the reason IS the commit. */
  async function deny(code: DenyCode) {
    setBusy(`deny:${code}`);
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_review_claim", {
        p_claim_id: claim.claim_id,
        p_approve: false,
        p_code: code,
        p_note: denyNote.trim() || null,
      });
      if (rpcError) return fail(rpcError, "Failed to deny the reward.");
      const already = unwrapRpc<ReviewResult>(data)?.changed === false;
      const label = DENY_CODES.find((r) => r.value === code)?.label ?? code;
      onDecided(claim.claim_id, {
        kind: already ? "noop" : "denied",
        label: already ? "Already decided by someone else" : `Reward denied — ${label}`,
        lane,
      });
    } catch (e) {
      fail({ message: e instanceof Error ? e.message : null }, "Failed to deny the reward.");
    }
  }

  async function restrict() {
    if (!restrictReason) return;
    setBusy("restrict");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_restrict_post", {
        p_post_id: postIdArg(claim.post_id),
        p_reason_code: restrictReason,
        p_note: restrictNote.trim() || null,
      });
      if (rpcError) return fail(rpcError, "Failed to take the listing down.");
      if (unwrapRpc<{ changed?: boolean }>(data)?.changed === false) {
        // Nothing was written — it was ALREADY down. Don't claim success and don't
        // drop the card; re-file it under Blocked, where it belongs.
        setBusy(null);
        setPanel(null);
        markAlreadyRestricted(claim.claim_id);
        return;
      }
      onDecided(claim.claim_id, {
        kind: "restricted",
        label: `Taken down — ${RESTRICTION_REASON_LABELS[restrictReason]}`,
        lane,
      });
    } catch (e) {
      fail({ message: e instanceof Error ? e.message : null }, "Failed to take the listing down.");
    }
  }

  return (
    <article
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        blocked ? "border-rose-200" : "border-slate-200"
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {isNew(claim) && !blocked && (
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
            ● New
          </span>
        )}
        {blocked && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
            Listing taken down
          </span>
        )}
        {claim.post_status && !["available", "restricted"].includes(claim.post_status) && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            listing: {claim.post_status}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex shrink-0 gap-2">
          {photos.length === 0 ? (
            <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-slate-100 text-2xl">
              🖼️
            </div>
          ) : (
            photos.slice(0, 3).map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => onOpenPhotos(photos, i)}
                className="group relative"
                aria-label="Open photo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-lg border border-slate-200 object-cover transition group-hover:opacity-80"
                />
              </button>
            ))
          )}
          {photos.length > 3 && (
            <button
              type="button"
              onClick={() => onOpenPhotos(photos, 3)}
              className="flex h-28 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
            >
              +{photos.length - 3}
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              {claim.title ?? "(untitled)"}
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {formatAudCents(claim.price_cents)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400" title={formatDateTime(claim.created_at)}>
            posted {relativeAge(claim.created_at)}
          </p>
          {claim.description && (
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-slate-700">
              {claim.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
              {initial(nickname)}
            </span>
            <span className="text-sm font-semibold text-slate-900">{nickname}</span>
            {previewKnown ? (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                  willPay ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                }`}
              >
                {rewarded}/{REWARD_APPROVED_CAP} rewarded
              </span>
            ) : (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                rewards so far unknown
              </span>
            )}
            {alsoPending > 0 && (
              <span className="text-xs text-slate-500">{alsoPending} more pending</span>
            )}
            {sellerId && (
              <button
                type="button"
                onClick={() => onFilterSeller(sellerId, nickname)}
                className="ml-auto rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                only this seller
              </button>
            )}
          </div>

          {claim.other_listings && claim.other_listings.length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowOthers((v) => !v)}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-800"
              >
                {showOthers ? "▾" : "▸"} Seller&apos;s other {claim.other_listings.length} listings
              </button>
              {showOthers && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {claim.other_listings.slice(0, 12).map((o) => {
                    const thumb = getPostImageUrl(o.thumbnail_path);
                    return (
                      <div
                        key={o.post_id}
                        className="w-14"
                        title={`${o.title ?? ""} ${formatAudCents(o.price_cents)}`.trim()}
                      >
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt=""
                            loading="lazy"
                            width={56}
                            height={56}
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
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        {err && (
          <p
            className={`mb-3 rounded-lg border px-3 py-2 text-sm ${
              err.guard
                ? "border-amber-300 bg-amber-50 text-amber-800"
                : "border-rose-300 bg-rose-50 text-rose-700"
            }`}
          >
            {err.text}
          </p>
        )}

        {blocked ? (
          <div className="space-y-3">
            <p className="text-xs text-rose-800">
              This listing is already taken down, so its reward claim can&apos;t be approved or
              denied — the backend refuses both while a listing is restricted.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={voidClaim}
                disabled={busy !== null}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50"
              >
                {busy === "void" ? "Voiding…" : "Void claim — nothing owed"}
              </button>
              <Link
                href="/admin-super/dashboard/moderation"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open in Listing moderation →
              </Link>
            </div>
          </div>
        ) : panel === "deny" ? (
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-700">
              Why is no reward owed? The listing stays live — this only refuses the coins, and it is
              recorded permanently. Nothing is pre-selected: picking a reason commits it.
            </p>
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
              If the listing is fine and the seller has simply hit the cap, don&apos;t deny —
              <strong className="font-semibold"> just Approve</strong>. It pays nothing and records
              no fault.
            </p>
            <div className="space-y-1.5">
              {DENY_CODES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => deny(r.value)}
                  disabled={busy !== null}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-left transition hover:border-rose-300 hover:bg-rose-50 disabled:opacity-50"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {busy === `deny:${r.value}` ? "Denying…" : r.label}
                  </span>
                  {"hint" in r && r.hint && (
                    <span className="mt-0.5 block text-xs text-slate-500">{r.hint}</span>
                  )}
                </button>
              ))}
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowDenyNote((v) => !v)}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-800"
              >
                {showDenyNote ? "▾" : "▸"} Add an internal note (optional)
              </button>
              {showDenyNote && (
                <textarea
                  value={denyNote}
                  onChange={(e) => setDenyNote(e.target.value)}
                  rows={2}
                  disabled={busy !== null}
                  placeholder="Operator-only note — never shown to the seller…"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setPanel(null);
                setErr(null);
              }}
              disabled={busy !== null}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : panel === "restrict" ? (
          <div className="space-y-3 rounded-lg border border-rose-200 bg-rose-50/60 p-3">
            <p className="text-xs font-medium text-rose-800">
              This hides the listing from the marketplace, lets the seller appeal, and cancels the
              reward claim. Pick a reason (required); the note is operator-only.
            </p>
            <select
              value={restrictReason}
              onChange={(e) => setRestrictReason(e.target.value as RestrictReasonCode | "")}
              disabled={busy !== null}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
            >
              <option value="">Select a reason…</option>
              {RESTRICT_REASON_CODES.map((r) => (
                <option key={r} value={r}>
                  {RESTRICTION_REASON_LABELS[r]}
                </option>
              ))}
            </select>
            <textarea
              value={restrictNote}
              onChange={(e) => setRestrictNote(e.target.value)}
              rows={2}
              disabled={busy !== null}
              placeholder="Internal note (optional)…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={restrict}
                disabled={busy !== null || !restrictReason}
                title={!restrictReason ? "Pick a reason first" : undefined}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
              >
                {busy === "restrict" ? "Taking down…" : "Confirm take-down"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPanel(null);
                  setErr(null);
                }}
                disabled={busy !== null}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">
              Is this listing OK to stay on the marketplace?
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={approve}
                disabled={busy !== null}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                  willPay === false
                    ? "border border-slate-400 bg-white text-slate-800 hover:bg-slate-100"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {busy === "approve"
                  ? "Approving…"
                  : willPay === true
                    ? `✓ Approve · +${REWARD_COINS} coins`
                    : willPay === false
                      ? "✓ Approve · no coins (at cap)"
                      : "✓ Approve"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPanel("deny");
                  setErr(null);
                }}
                disabled={busy !== null}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Deny reward ▾
              </button>
              <button
                type="button"
                onClick={() => {
                  setPanel("restrict");
                  setErr(null);
                }}
                disabled={busy !== null}
                className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
              >
                Take listing down ▾
              </button>
            </div>
            <ApproveHint
              willPay={willPay}
              rewarded={rewarded}
              nickname={nickname}
              countsError={countsError}
            />
          </div>
        )}
      </div>
    </article>
  );
}

/** The coin PREVIEW. Advisory — the server has the last word, and the receipt reports it. */
function ApproveHint({
  willPay,
  rewarded,
  nickname,
  countsError,
}: {
  willPay: boolean | null;
  rewarded: number;
  nickname: string;
  countsError: boolean;
}) {
  if (willPay === null) {
    return (
      <p className="text-xs text-slate-500">
        {countsError
          ? "Can't preview the payout right now — approve anyway; the database works out the coins and the receipt will tell you what happened."
          : "This claim has no seller profile, so the payout can't be previewed. Approving is still safe — the database works out the coins."}
      </p>
    );
  }
  if (!willPay) {
    return (
      <p className="text-xs text-slate-500">
        {nickname} has already been rewarded for {REWARD_APPROVED_CAP} listings, so this one earns
        nothing. Approving just clears it — no coins, no fault recorded.
      </p>
    );
  }
  const left = REWARD_APPROVED_CAP - rewarded - 1;
  return (
    <p className="text-xs text-slate-500">
      {nickname}&apos;s {rewarded + 1}
      {rewarded + 1 === 1
        ? "st"
        : rewarded + 1 === 2
          ? "nd"
          : rewarded + 1 === 3
            ? "rd"
            : "th"}{" "}
      rewarded listing —{" "}
      {left === 0
        ? "their last reward slot"
        : `${left} slot${left === 1 ? "" : "s"} left after this`}
      .
    </p>
  );
}

/* ----------------------------------------------------------------- lightbox */

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + photos.length) % photos.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, photos.length, onIndex, onClose]);

  const safe = Math.min(Math.max(index, 0), photos.length - 1);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[safe]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
      />
      <div
        className="mt-4 flex items-center gap-4"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <button
          type="button"
          onClick={() => onIndex((safe - 1 + photos.length) % photos.length)}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          ← Prev
        </button>
        <span className="text-sm text-white/70">
          {safe + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={() => onIndex((safe + 1) % photos.length)}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Next →
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Close (Esc)
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ decisions tab */

/**
 * The real `reward_listing_claims.status` vocabulary:
 *   pending | approved | rejected | cancelled | closed_at_cap
 * `approved` means coins WERE paid; `closed_at_cap` means the listing was fine but
 * the seller was already at the cap. Keeping them distinct is what makes the
 * invariant "approved ⟺ coins were actually paid" true.
 */
const DECISION_BADGE: Record<string, { label: string; className: string }> = {
  approved: { label: `Approved · +${REWARD_COINS}`, className: "bg-emerald-100 text-emerald-700" },
  closed_at_cap: { label: "Approved · no coins", className: "bg-slate-200 text-slate-700" },
  rejected: { label: "Reward denied", className: "bg-rose-100 text-rose-700" },
  cancelled: { label: "Cancelled", className: "bg-slate-200 text-slate-600" },
};

function DecisionsTab({
  items,
  summary,
  truncated,
  loading,
  error,
  onRefresh,
}: {
  items: HistoryItem[] | null;
  summary: HistorySummary | null;
  truncated: boolean;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-slate-900">Decisions</h2>
          <p className="mt-1 text-sm text-slate-600">
            Settled claims, newest first — paid approvals, no-coins clears, and denials with the
            reason that was recorded.
            {summary
              ? ` ${summary.totalApproved} paid across ${summary.sellersApproved} seller${
                  summary.sellersApproved === 1 ? "" : "s"
                }.`
              : ""}
            {truncated ? " Showing the most recent 300 only." : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Loading…" : "⟳ Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading && !items ? (
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      ) : !items || items.length === 0 ? (
        <p className="text-sm text-slate-400">No decisions recorded yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {items.map((it) => {
            const thumb = getPostImageUrl(it.thumbnailPath);
            const badge = DECISION_BADGE[it.status ?? ""] ?? {
              label: it.status ?? "—",
              className: "bg-slate-100 text-slate-600",
            };
            return (
              <li key={it.claimId} className="flex items-center gap-3 px-4 py-2.5">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-md border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-base">
                    🖼️
                  </div>
                )}
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${badge.className}`}
                >
                  {badge.label}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                  {it.title ?? "(untitled)"}
                </span>
                {it.rejectCode && (
                  <span className="hidden shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-700 md:inline">
                    {it.rejectCode.replace(/_/g, " ")}
                  </span>
                )}
                <span className="shrink-0 text-xs font-medium text-slate-600">{it.nickname}</span>
                <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
                  {formatDateTime(it.decidedAt)}
                  {it.reviewer ? ` · ${it.reviewer}` : ""}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
