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
  isMissingFunction,
  isNotAuthorized,
  mapRpcError,
  postIdArg,
  RESTRICT_REASON_CODES,
  RESTRICTION_REASON_LABELS,
  REWARD_APPROVED_CAP,
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
 * The coin payout is NOT a second question. It is a consequence the SERVER
 * derives from the seller's cap state, and the button only PREVIEWS it:
 *
 *   - seller under the cap → "Approve · +10 coins"    → admin_review_claim(id, true)
 *   - seller at the cap    → "Approve · no coins"     → admin_pass_claim(id)
 *
 * Same verb, same place, never disabled. The reviewer never picks a payout.
 *
 * `Deny reward` stays, but only for its honest meaning: the seller is at FAULT
 * (stolen photos, joke listing, ...). It leaves the listing live. `Take listing
 * down` is the hygiene action — it hides the listing, opens an appeal, and
 * cancels the claim server-side.
 *
 * ## Why the old page stacked at-cap sellers forever
 *
 * `Approve` used to mean two things at once — "this listing is fine" AND "+10
 * coins are owed". So when the reward axis ran out, the hygiene axis was taken
 * hostage: Approve locked, and the only remaining exits were Deny (every reason
 * code asserts seller fault — a fabricated accusation against a clean listing)
 * or Restrict (removes a good listing). Both are lies, so an honest reviewer
 * wrote nothing, and the claim sat in `pending` forever. The missing verb was
 * "this listing is fine, and nothing is owed". `admin_pass_claim` IS that verb.
 *
 * The old page also grouped by seller, which is why recency was unfindable: a
 * group's sort key was its OLDEST claim, so a listing posted a minute ago could
 * sit at the bottom of the page. The unit of the list now matches the unit of
 * the decision — a listing — and the seller is a chip on the card, not a
 * container. The one workflow grouping genuinely served (spotting a farm)
 * survives as the "only this seller" filter.
 *
 * ## Two runtime capabilities, both fail CLOSED
 *
 * 1. `passSupported` — whether THIS Supabase project has the Step-2 migration
 *    (`admin_pass_claim` / `admin_void_claim`). Probed at load, so the site and
 *    the SQL deploy independently in either order. Until the SQL lands, the
 *    at-cap action is `Set aside`, which writes NOTHING to the server: there is
 *    no honest zero-backend way to settle an at-cap claim, so we don't pretend
 *    there is. See supabase/migrations/20260713090000_reward_pass_void_claim.sql.
 *
 * 2. `countsError` — if the approved-counts route fails we do not know who is at
 *    cap, so Approve is disabled BOARD-WIDE behind a red banner. (The old page
 *    swallowed that failure, defaulted every seller to 0/6, and silently unlocked
 *    Approve for everyone — a cap whose failure mode is "no cap" is not a cap.)
 *
 * Reads and writes call the RPCs directly from the signed-in reviewer's Supabase
 * session (granted to `authenticated`, self-gated on `reward_admins`). The cap
 * counts come from a read-only service-role route.
 */

const PENDING_PAGE_SIZE = 50; // page size the RPC honours
const MAX_PENDING_PAGES = 40; // safety ceiling — 2000 pending claims
const STALE_AFTER_DAYS = 7; // nag when the oldest claim has waited this long

/**
 * A claim id that cannot exist (the identity sequence starts at 1), used to probe
 * whether `admin_pass_claim` is installed. The function raises CLAIM_NOT_FOUND
 * long before it can touch a row, so the probe is side-effect-free; the only
 * thing we read from the answer is whether the function itself resolved.
 */
const PASS_PROBE_CLAIM_ID = 0;

/**
 * Reasons the +10 is refused. EVERY one of these asserts seller FAULT and is
 * recorded permanently — which is exactly why none of them may be used to clear a
 * clean listing from an at-cap seller. That is what `admin_pass_claim` is for.
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
 * Which section a card sits in.
 *   review     — needs a decision, and coins are on the table
 *   no_reward  — needs a decision, but the seller is at cap so it pays nothing
 *   blocked    — the listing is already taken down, so NO reward decision is
 *                possible: admin_review_claim refuses both approve and deny with
 *                REWARDS_POST_RESTRICTED, and re-restricting is a no-op. Only
 *                admin_void_claim (or reinstating first) can settle it.
 *   set_aside  — parked locally, writes nothing. Only exists pre-migration.
 */
type Lane = "review" | "no_reward" | "blocked" | "set_aside";

type DecisionKind = "approved" | "passed" | "denied" | "restricted" | "voided" | "noop";

/** A receipt rendered IN PLACE of the card it replaces, so nothing below reflows. */
type Decided = {
  kind: DecisionKind;
  label: string;
  lane: Lane;
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
 * Per-admin browser state. Keyed on the signed-in identity so two admins sharing
 * a machine never inherit each other's watermark or shelf.
 */
function lastSeenKey(identity: string): string {
  return `popout.rewardReview.lastSeen.${identity}`;
}
function setAsideKey(identity: string): string {
  return `popout.rewardReview.setAside.${identity}`;
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

function readSetAside(identity: string): Set<number> {
  try {
    const raw = window.localStorage.getItem(setAsideKey(identity));
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n): n is number => typeof n === "number"));
  } catch {
    return new Set();
  }
}

function writeSetAside(identity: string, ids: Set<number>): void {
  try {
    window.localStorage.setItem(setAsideKey(identity), JSON.stringify([...ids]));
  } catch {
    /* private mode / quota — the shelf is best-effort by design */
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
  /** A page of the queue failed to load, but earlier pages are shown. */
  const [partial, setPartial] = useState<string | null>(null);
  /** More pending claims exist than the safety ceiling allows us to load. */
  const [truncated, setTruncated] = useState(false);

  const [approvedCounts, setApprovedCounts] = useState<Record<string, number>>({});
  const [countsError, setCountsError] = useState(false);

  /** null while probing. See the PASS_PROBE_CLAIM_ID docs. */
  const [passSupported, setPassSupported] = useState<boolean | null>(null);

  const [decided, setDecided] = useState<Map<number, Decided>>(new Map());
  const [setAside, setSetAside] = useState<Set<number>>(new Set());

  /**
   * Frozen at mount on purpose. If it tracked "now", the NEW badges would vanish
   * the instant you arrived and the feature would be decorative. It advances ONLY
   * when the reviewer explicitly clicks "Mark all seen".
   */
  const [lastSeen, setLastSeen] = useState<number | null>(null);

  const [newestFirst, setNewestFirst] = useState(true);
  const [query, setQuery] = useState("");
  const [sellerFilter, setSellerFilter] = useState<{ id: string; nickname: string } | null>(null);

  // null = "reviewer hasn't touched it", so the probe supplies the default. An
  // explicit toggle always wins after that (OR-ing the probe into the render
  // condition made the Hide button dead once the migration was installed).
  const [showNoReward, setShowNoReward] = useState<boolean | null>(null);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showShelf, setShowShelf] = useState(false);
  /** Board-level notice — survives a card being re-laned out from under it. */
  const [notice, setNotice] = useState<string | null>(null);

  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null);

  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [historySummary, setHistorySummary] = useState<HistorySummary | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  /** "We have attempted a load" — NOT "we have data". See the fetch effect. */
  const [historyTried, setHistoryTried] = useState(false);
  const [historyTruncated, setHistoryTruncated] = useState(false);

  const countsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Monotonic id of the newest counts request — older responses are dropped. */
  const countsSeq = useRef(0);
  /**
   * Slots this browser has paid for in THIS session, per seller. The server's
   * count can lag behind them (a scan started before the approve committed), and
   * a lagging snapshot must never be allowed to LOWER a seller below what we know
   * we have already paid — that is what would re-arm "+10" on an at-cap seller.
   */
  const creditedHere = useRef<Record<string, number>>({});

  /* ------------------------------------------------------------- data loads */

  const fetchApprovedCounts = useCallback(async () => {
    const seq = ++countsSeq.current;
    try {
      const res = await adminApiFetch("/api/admin/reward-approved-counts", { cache: "no-store" });
      // A newer request has been issued since this one left — its answer is the
      // truth, so drop this (possibly older) snapshot on the floor. Without this,
      // an in-flight response landing after a later approval would erase the
      // approval's optimistic increment and re-enable a +10 that isn't owed.
      if (seq !== countsSeq.current) return;
      if (!res.ok) {
        setCountsError(true);
        return;
      }
      const json = await res.json();
      if (seq !== countsSeq.current) return;
      const server: Record<string, number> = json.counts ?? {};
      // Never regress below what this session has already credited.
      const merged = { ...server };
      for (const [ownerId, paidHere] of Object.entries(creditedHere.current)) {
        merged[ownerId] = Math.max(server[ownerId] ?? 0, paidHere);
      }
      setApprovedCounts(merged);
      setCountsError(false);
    } catch {
      // Fail CLOSED. Without the counts we cannot tell who is at cap, so Approve
      // is disabled board-wide rather than silently paying an over-cap seller.
      if (seq === countsSeq.current) setCountsError(true);
    }
  }, []);

  /** Debounced so a burst of decisions costs ONE scan, not one per click. */
  const scheduleCountsRefresh = useCallback(() => {
    if (countsTimer.current) clearTimeout(countsTimer.current);
    countsTimer.current = setTimeout(() => {
      void fetchApprovedCounts();
    }, 1500);
  }, [fetchApprovedCounts]);

  const probePassSupport = useCallback(async () => {
    if (!isAdminAuthConfigured()) return;
    try {
      const sb = getAdminAuthBrowserClient();
      const { error: rpcError } = await sb.rpc("admin_pass_claim", {
        p_claim_id: PASS_PROBE_CLAIM_ID,
      });
      setPassSupported(!isMissingFunction(rpcError));
    } catch {
      // Network blip → assume the safe answer (no server-side settle available),
      // which only ever costs us the write-nothing local shelf.
      setPassSupported(false);
    }
  }, []);

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

    // A blipped page must not wipe the pages that DID load — the old page called
    // setClaims([]) here, so a mid-loop error rendered an authoritative "0 to
    // review" next to the red banner and the queue looked healthy and empty.
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
    setSetAside(readSetAside(identity));
  }, [identity]);

  useEffect(() => {
    void load();
    void probePassSupport();
  }, [load, probePassSupport]);

  // History is fetched only when the tab is actually opened (the old page called
  // it after EVERY approval, and it runs an unbounded table scan) — and only ONCE
  // per invalidation. Gating on `history === null` alone would loop forever on a
  // failure: the error paths never set `history`, so the guard would keep passing
  // and hammer the service-role route at one request per round-trip. The gate is
  // "have we tried", not "did we get an answer". Explicit retry is the Refresh
  // button; `historyTried` is reset to false whenever a decision invalidates it.
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
        // Reflect the consumed slot immediately so the seller's OTHER pending
        // cards flip to the no-coins action without waiting for the refetch, and
        // remember it in a ref so a lagging server snapshot can't undo it.
        setApprovedCounts((prev) => {
          const next = (prev[creditedOwnerId] ?? 0) + 1;
          creditedHere.current[creditedOwnerId] = Math.max(
            creditedHere.current[creditedOwnerId] ?? 0,
            next,
          );
          return { ...prev, [creditedOwnerId]: next };
        });
      }
      scheduleCountsRefresh();
      // A decision changes what the Decisions tab should show — drop the cache and
      // re-arm the one-shot fetch so the tab reloads next time it is opened.
      setHistory(null);
      setHistoryTried(false);
    },
    [scheduleCountsRefresh],
  );

  /**
   * `admin_restrict_post` answered `changed:false` — the listing was ALREADY down.
   * Nothing was written, so do NOT show a receipt and do NOT drop the card (the
   * old page did both, "clearing" a claim the server never touched). Re-tag it so
   * it moves to the Blocked lane, which is where it actually belongs.
   */
  const markAlreadyRestricted = useCallback((claimId: number) => {
    setClaims((prev) =>
      prev.map((c) => (c.claim_id === claimId ? { ...c, post_status: "restricted" } : c)),
    );
    // Re-tagging moves the card into the Blocked lane, which unmounts the card
    // that would otherwise have shown the explanation — so say it at board level
    // and open the lane, or the card would just silently vanish and read exactly
    // like a successful take-down.
    setShowBlocked(true);
    setNotice(
      "That listing was already taken down, so nothing changed. Its reward claim is still open — it has moved to the Blocked section below.",
    );
  }, []);

  const toggleSetAside = useCallback(
    (claimId: number, on: boolean) => {
      setSetAside((prev) => {
        const next = new Set(prev);
        if (on) next.add(claimId);
        else next.delete(claimId);
        writeSetAside(identity, next);
        return next;
      });
    },
    [identity],
  );

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
      if (setAside.has(c.claim_id)) return "set_aside";
      if (c.post_status === "restricted") return "blocked";
      // Cap unknown (counts route down, or no seller profile to key the count on)
      // → keep the card in the working lane, where Approve is DISABLED. It must
      // not be filed as "no reward at stake": we don't know that it isn't.
      if (countsError) return "review";
      const sellerId = c.seller?.id;
      if (!sellerId) return "review";
      return (approvedCounts[sellerId] ?? 0) >= REWARD_APPROVED_CAP ? "no_reward" : "review";
    },
    [approvedCounts, countsError, decided, setAside],
  );

  const filtering = query.trim().length > 0 || sellerFilter !== null;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return claims.filter((c) => {
      if (sellerFilter && c.seller?.id !== sellerFilter.id) return false;
      if (!needle) return true;
      const hay = `${c.title ?? ""} ${c.seller?.nickname ?? ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [claims, query, sellerFilter]);

  const lanes = useMemo(() => {
    const out: Record<Lane, Claim[]> = { review: [], no_reward: [], blocked: [], set_aside: [] };
    for (const c of visible) out[laneOf(c)].push(c);
    // newestFirst → the biggest timestamp comes first (descending).
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
  const noRewardCount = pendingIn("no_reward");
  const blockedCount = pendingIn("blocked");
  const shelfCount = pendingIn("set_aside");

  const isNew = useCallback((c: Claim) => lastSeen != null && createdMs(c) > lastSeen, [lastSeen]);

  const newCount = useMemo(
    () => lanes.review.filter((c) => !decided.has(c.claim_id) && isNew(c)).length,
    [lanes.review, decided, isNew],
  );

  /** Oldest UNDECIDED claim across the two working lanes — the starvation guard. */
  const oldestWaitingDays = useMemo(() => {
    const times = [...lanes.review, ...lanes.no_reward]
      .filter((c) => !decided.has(c.claim_id))
      .map(createdMs)
      .filter((t) => t > 0);
    if (times.length === 0) return 0;
    return Math.floor((Date.now() - Math.min(...times)) / 86_400_000);
  }, [lanes.review, lanes.no_reward, decided]);

  const pendingCountFor = useCallback(
    (sellerId: string | undefined) => {
      if (!sellerId) return 0;
      return claims.filter((c) => c.seller?.id === sellerId && !decided.has(c.claim_id)).length;
    },
    [claims, decided],
  );

  /* ------------------------------------------------------------------ render */

  const cardProps = {
    approvedCounts,
    countsError,
    passSupported,
    decided,
    onDecided,
    onUnauthorized,
    markAlreadyRestricted,
    toggleSetAside,
    onOpenPhotos: (photos: string[], index: number) => setLightbox({ photos, index }),
    onFilterSeller: (id: string, nickname: string) => setSellerFilter({ id, nickname }),
    pendingCountFor,
    isNew,
  };

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
          <strong className="font-semibold">is it OK to stay on the marketplace?</strong> The coins
          are worked out for you — a seller under the {REWARD_APPROVED_CAP}-listing cap earns{" "}
          <span className="font-medium">+10</span>, a seller at the cap earns nothing and the
          listing is simply cleared. Deny only if the seller is at fault; take the listing down if
          it breaks the rules.
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
            <KpiCard label={`No reward at stake`} total={noRewardCount} loading={loading} />
            <KpiCard label="Decided this session" total={decided.size} loading={false} />
          </div>

          {countsError && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <span className="flex-1">
                <strong className="font-semibold">Reward counts unavailable.</strong> We can&apos;t
                tell who has hit the {REWARD_APPROVED_CAP}-listing cap, so{" "}
                <strong className="font-semibold">Approve is disabled</strong> to stop anyone being
                over-credited. Denying and taking listings down still work.
              </span>
              <button
                type="button"
                onClick={() => void fetchApprovedCounts()}
                className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
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

          {passSupported === false && (
            <div className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700">
              <strong className="font-semibold">
                The no-coins approve isn&apos;t installed on this database yet.
              </strong>{" "}
              Until <code className="rounded bg-white px-1 py-0.5 text-xs">admin_pass_claim</code>{" "}
              ships, an at-cap seller&apos;s good listing has no honest way to be closed — approving
              would over-pay, denying would record a fault that didn&apos;t happen, and taking it
              down would remove a good listing. So those cards offer{" "}
              <strong className="font-semibold">Set aside</strong> instead, which writes nothing to
              the server. Run{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs">
                supabase/migrations/20260713090000_reward_pass_void_claim.sql
              </code>{" "}
              and reload — this page lights the real action up on its own.
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
                  // A filter that hides everything is NOT an empty queue — saying
                  // "nothing to review" while a search box is narrowing the list is
                  // just a lie with confetti on it.
                  filtering ? (
                    <div className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500 shadow-sm">
                      No listings match the current filter.
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                      <div className="mb-3 text-4xl">🎉</div>
                      <p className="text-sm text-slate-600">
                        Nothing left that needs a decision with coins on the table.
                      </p>
                      {(noRewardCount > 0 || blockedCount > 0) && (
                        <p className="mt-1 text-xs text-slate-400">
                          {noRewardCount > 0 && `${noRewardCount} at-cap`}
                          {noRewardCount > 0 && blockedCount > 0 && " · "}
                          {blockedCount > 0 && `${blockedCount} blocked`} still below.
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

              {lanes.no_reward.length > 0 && (
                <CollapsibleLane
                  title="No reward at stake"
                  subtitle={`Seller is already at the ${REWARD_APPROVED_CAP}-listing cap, so these pay nothing — but they still need a hygiene decision.`}
                  count={noRewardCount}
                  // Worth working when they can actually be settled; pure clutter
                  // when they can't. The migration flips this open by itself —
                  // until the reviewer says otherwise.
                  open={showNoReward ?? passSupported === true}
                  onToggle={() => setShowNoReward((v) => !(v ?? passSupported === true))}
                  tone="slate"
                >
                  <LaneBody claims={lanes.no_reward} lane="no_reward" {...cardProps} />
                </CollapsibleLane>
              )}

              {lanes.blocked.length > 0 && (
                <CollapsibleLane
                  title="Blocked — listing already taken down"
                  subtitle="No reward decision is possible on these: approve and deny both refuse while the listing is restricted. Reinstate it first, or void the claim."
                  count={blockedCount}
                  open={showBlocked}
                  onToggle={() => setShowBlocked((v) => !v)}
                  tone="rose"
                >
                  <LaneBody claims={lanes.blocked} lane="blocked" {...cardProps} />
                </CollapsibleLane>
              )}

              {lanes.set_aside.length > 0 && (
                <CollapsibleLane
                  title="Set aside"
                  subtitle="Local to this browser — nothing was written. These claims are still pending on the server and other admins still see them."
                  count={shelfCount}
                  open={showShelf}
                  onToggle={() => setShowShelf((v) => !v)}
                  tone="slate"
                >
                  <LaneBody claims={lanes.set_aside} lane="set_aside" {...cardProps} />
                </CollapsibleLane>
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
  passSupported: boolean | null;
  decided: Map<number, Decided>;
  onDecided: (claimId: number, entry: Decided, creditedOwnerId?: string | null) => void;
  onUnauthorized: () => void;
  markAlreadyRestricted: (claimId: number) => void;
  toggleSetAside: (claimId: number, on: boolean) => void;
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
  // The divider is only meaningful in a newest-first list: everything above it is
  // new since the reviewer's last visit, everything below was already there.
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

function CollapsibleLane({
  title,
  subtitle,
  count,
  open,
  onToggle,
  tone,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  tone: "slate" | "rose";
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
          tone === "rose"
            ? "border-rose-200 bg-rose-50 hover:bg-rose-100/70"
            : "border-slate-200 bg-slate-100 hover:bg-slate-200/60"
        }`}
      >
        <span className="text-slate-400">{open ? "▾" : "▸"}</span>
        <span className="min-w-0 flex-1">
          <span
            className={`block text-sm font-semibold ${
              tone === "rose" ? "text-rose-900" : "text-slate-900"
            }`}
          >
            {title} · {count}
          </span>
          <span
            className={`mt-0.5 block text-xs ${
              tone === "rose" ? "text-rose-700" : "text-slate-500"
            }`}
          >
            {subtitle}
          </span>
        </span>
        <span className="shrink-0 text-xs font-medium text-slate-500">
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open && children}
    </section>
  );
}

function Receipt({ claim, entry }: { claim: Claim; entry: Decided }) {
  const tone: Record<DecisionKind, string> = {
    approved: "border-emerald-300 bg-emerald-50 text-emerald-900",
    passed: "border-slate-300 bg-slate-100 text-slate-800",
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
  passSupported,
  onDecided,
  onUnauthorized,
  markAlreadyRestricted,
  toggleSetAside,
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

  const photos = (claim.photos ?? [])
    .map((p) => getPostImageUrl(p))
    .filter((u): u is string => Boolean(u));

  function fail(rpcError: { message?: string | null } | null, fallback: string) {
    setBusy(null); // never leave a button stuck reading "Approving…"
    if (isNotAuthorized(rpcError)) {
      onUnauthorized();
      return;
    }
    const raw = (rpcError?.message ?? "").trim();
    // A `guard` is a deliberate backend refusal, not a failure — amber, not red.
    const guard =
      /REWARDS_POST_RESTRICTED|SELLER_UNDER_CAP|POST_STILL_LIVE|REWARD_CAP_EXCEEDED/i.test(raw);
    setErr({ text: mapRpcError(rpcError, fallback), guard });
    setBusy(null);
  }

  /** Approve WITH coins — the seller is under the cap and is owed +10. */
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
      const already = (unwrapRpc<{ changed?: boolean }>(data)?.changed ?? true) === false;
      onDecided(
        claim.claim_id,
        already
          ? { kind: "noop", label: "Already decided by someone else", lane }
          : { kind: "approved", label: "Approved · +10 coins", lane },
        already ? null : sellerId,
      );
    } catch (e) {
      fail({ message: e instanceof Error ? e.message : null }, "Failed to approve the claim.");
    }
  }

  /**
   * Approve WITHOUT coins — the seller is at cap, so nothing is owed. The listing
   * is fine and stays live. This RPC is structurally incapable of paying coins,
   * which is what makes it safe to put in the primary slot.
   */
  async function pass() {
    setBusy("pass");
    setErr(null);
    try {
      const sb = getAdminAuthBrowserClient();
      const { data, error: rpcError } = await sb.rpc("admin_pass_claim", {
        p_claim_id: claim.claim_id,
      });
      if (rpcError) return fail(rpcError, "Failed to clear the claim.");
      const already = (unwrapRpc<{ changed?: boolean }>(data)?.changed ?? true) === false;
      onDecided(claim.claim_id, {
        kind: already ? "noop" : "passed",
        label: already ? "Already decided by someone else" : "Approved · no coins (at cap)",
        lane,
      });
    } catch (e) {
      fail({ message: e instanceof Error ? e.message : null }, "Failed to clear the claim.");
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
      const already = (unwrapRpc<{ changed?: boolean }>(data)?.changed ?? true) === false;
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
      const already = (unwrapRpc<{ changed?: boolean }>(data)?.changed ?? true) === false;
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
        // Nothing was written — the listing was ALREADY down. Do not claim success
        // and do not drop the card; re-file it under Blocked, where it belongs.
        // markAlreadyRestricted raises the explanation at BOARD level, because
        // re-laning unmounts this card and any message set here would be lost.
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

  const atCap = lane === "no_reward";
  const blocked = lane === "blocked";
  const parked = lane === "set_aside";
  const unknownSeller = !sellerId;

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
        {atCap && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
            At cap ({rewarded}/{REWARD_APPROVED_CAP})
          </span>
        )}
        {parked && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
            Set aside
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
            {unknownSeller ? (
              <span
                className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                title="This claim has no seller profile, so we cannot tell how many listings this seller has already been rewarded for. Approve is disabled — nothing here can stop it over-paying."
              >
                ⚠ profile unavailable — cap not checkable
              </span>
            ) : (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                  countsError
                    ? "bg-slate-200 text-slate-500"
                    : rewarded >= REWARD_APPROVED_CAP
                      ? "bg-slate-200 text-slate-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {countsError ? "?" : rewarded}/{REWARD_APPROVED_CAP} rewarded
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
              {passSupported ? (
                <button
                  type="button"
                  onClick={voidClaim}
                  disabled={busy !== null}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50"
                >
                  {busy === "void" ? "Voiding…" : "Void claim — nothing owed"}
                </button>
              ) : (
                <span className="text-xs text-slate-500">
                  Nothing on this page can settle it yet. Reinstate the listing first, then decide
                  its claim.
                </span>
              )}
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
              <PrimaryAction
                atCap={atCap}
                parked={parked}
                countsError={countsError}
                unknownSeller={unknownSeller}
                passSupported={passSupported}
                busy={busy}
                onApprove={approve}
                onPass={pass}
                onSetAside={() => toggleSetAside(claim.claim_id, true)}
                onRestore={() => toggleSetAside(claim.claim_id, false)}
              />
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
            <PrimaryHint
              atCap={atCap}
              parked={parked}
              countsError={countsError}
              passSupported={passSupported}
              rewarded={rewarded}
              nickname={nickname}
              unknownSeller={unknownSeller}
            />
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * The whole fix, in one button. Same verb, same position, in every state — only
 * the label and the write target change, and the label always tells the truth
 * about the coins BEFORE the click.
 */
function PrimaryAction({
  atCap,
  parked,
  countsError,
  unknownSeller,
  passSupported,
  busy,
  onApprove,
  onPass,
  onSetAside,
  onRestore,
}: {
  atCap: boolean;
  parked: boolean;
  countsError: boolean;
  unknownSeller: boolean;
  passSupported: boolean | null;
  busy: string | null;
  onApprove: () => void;
  onPass: () => void;
  onSetAside: () => void;
  onRestore: () => void;
}) {
  if (parked) {
    return (
      <button
        type="button"
        onClick={onRestore}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Put back in the queue
      </button>
    );
  }

  // Two different unknowns, one rule: if we cannot count this seller's paid
  // listings, we cannot know a +10 is owed — and `admin_review_claim` will pay it
  // anyway, because it does not enforce the cap. So Approve fails CLOSED. (A null
  // seller means the profile join came back empty, which also means there is no
  // id to key the count on. Deny and take-down still work.)
  if (countsError || unknownSeller) {
    return (
      <button
        type="button"
        disabled
        title={
          unknownSeller
            ? "This claim has no seller profile, so we can't count how many listings they've already been rewarded for. Approving could over-pay."
            : "Reward counts are unavailable, so we can't tell whether this seller is owed coins."
        }
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white opacity-40"
      >
        Approve — unavailable
      </button>
    );
  }

  if (atCap) {
    // Before the migration there is NO honest server-side settle, so we offer the
    // one action that tells no lie: park it locally and write nothing.
    if (passSupported !== true) {
      return (
        <button
          type="button"
          onClick={onSetAside}
          disabled={busy !== null}
          className="rounded-lg border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          ⏸ Set aside · no reward owed
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={onPass}
        disabled={busy !== null}
        className="rounded-lg border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-50"
      >
        {busy === "pass" ? "Clearing…" : `✓ Approve · no coins (at cap)`}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onApprove}
      disabled={busy !== null}
      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
    >
      {busy === "approve" ? "Approving…" : "✓ Approve · +10 coins"}
    </button>
  );
}

function PrimaryHint({
  atCap,
  parked,
  countsError,
  passSupported,
  rewarded,
  nickname,
  unknownSeller,
}: {
  atCap: boolean;
  parked: boolean;
  countsError: boolean;
  passSupported: boolean | null;
  rewarded: number;
  nickname: string;
  unknownSeller: boolean;
}) {
  if (parked) {
    return (
      <p className="text-xs text-slate-500">
        Local to this browser — nothing was written. The claim is still pending on the server and
        other admins still see it.
      </p>
    );
  }
  if (countsError) {
    return (
      <p className="text-xs text-rose-600">
        Reward counts are unavailable, so approving could over-pay. Fix the counts and reload.
      </p>
    );
  }
  if (atCap && passSupported !== true) {
    return (
      <p className="text-xs text-slate-500">
        {nickname} has already been rewarded for {REWARD_APPROVED_CAP} listings, so no coins can be
        paid for this one — and there&apos;s no honest way to close it yet. Denying would record a
        fault that didn&apos;t happen; taking it down would remove a good listing.
      </p>
    );
  }
  if (atCap) {
    return (
      <p className="text-xs text-slate-500">
        {nickname} is at the {REWARD_APPROVED_CAP}-listing reward cap. Keeping this listing pays
        nothing.
      </p>
    );
  }
  if (unknownSeller) {
    return (
      <p className="text-xs text-amber-700">
        This claim has no seller profile, so we can&apos;t count how many listings this seller has
        already been rewarded for — and nothing else would stop an over-payment.{" "}
        <strong className="font-semibold">Approve is disabled.</strong> You can still deny the
        reward or take the listing down.
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

const DECISION_BADGE: Record<string, { label: string; className: string }> = {
  approved: { label: "Approved · +10", className: "bg-emerald-100 text-emerald-700" },
  approved_unpaid: { label: "Approved · no coins", className: "bg-slate-200 text-slate-700" },
  rejected: { label: "Reward denied", className: "bg-rose-100 text-rose-700" },
  denied: { label: "Reward denied", className: "bg-rose-100 text-rose-700" },
  cancelled: { label: "Cancelled", className: "bg-slate-200 text-slate-600" },
  voided: { label: "Voided", className: "bg-slate-200 text-slate-600" },
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
            Settled claims, newest first — approvals, no-coins clears, and denials with the reason
            that was recorded.
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
