/**
 * Shared helpers for the operator-facing listing-restriction & appeal surfaces.
 *
 * All four admin RPCs — admin_restrict_post, admin_reinstate_post,
 * admin_list_appeals, admin_resolve_appeal — are called DIRECTLY from the
 * signed-in admin's Supabase session, exactly like the reward-review template
 * (granted to `authenticated`, self-gated on `reward_admins`, no service-role
 * key). The backend enforces one-appeal-per-takedown, concurrency, and
 * idempotency; the UI just trusts the returned `changed` flag.
 */

/** Minimal structural shape of a supabase-js / PostgREST error. */
type RpcError = { message?: string | null; code?: string | null } | null;

/**
 * Single-object RPCs (restrict / reinstate / resolve) return a jsonb object,
 * but a SETOF-style function can surface it as a 1-element array — normalise.
 * Do NOT use this for admin_list_appeals (its array IS the payload).
 */
export function unwrapRpc<T>(data: unknown): T | null {
  if (data == null) return null;
  return (Array.isArray(data) ? (data[0] ?? null) : data) as T | null;
}

/**
 * The SECURITY DEFINER RPCs `RAISE EXCEPTION 'NOT_AUTHORIZED'` when the caller
 * isn't an allow-listed admin; PostgREST surfaces that text verbatim in
 * error.message. On this, the operator surfaces clear their view and let
 * AdminAuthGuard bounce the session on its next check.
 */
export function isNotAuthorized(error: RpcError): boolean {
  return (error?.message ?? "").trim().toUpperCase().includes("NOT_AUTHORIZED");
}

export const UNAUTHORIZED_MESSAGE =
  "Your session is no longer authorized. Please sign out and sign in again.";

/**
 * p_post_id is a bigint; send a number when the id is purely numeric.
 *
 * Accepts a number as well as a string on purpose. The moderation page feeds this
 * a string from a text input, but the reward-review page feeds it `post_id` off
 * `admin_list_pending_claims`, where it is a bigint column — and PostgREST
 * serialises bigint as a JSON *number*, whatever the TS type claims. Calling
 * `.trim()` on that would throw.
 */
export function postIdArg(raw: string | number): number | string {
  if (typeof raw === "number") {
    return Number.isSafeInteger(raw) ? raw : String(raw);
  }
  const t = String(raw ?? "").trim();
  if (/^\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n)) return n;
  }
  return t;
}

/**
 * Reasons an operator may pick when restricting a listing. `community_reports`
 * is deliberately excluded — it is auto-only and the RPC rejects it.
 */
export const RESTRICT_REASON_CODES = [
  "scam_fraud",
  "prohibited_item",
  "fake_or_misleading",
  "spam",
  "other",
  "item_not_available",
] as const;
export type RestrictReasonCode = (typeof RESTRICT_REASON_CODES)[number];

/** Display labels for every restriction reason, incl. the auto-only one. */
export const RESTRICTION_REASON_LABELS: Record<string, string> = {
  scam_fraud: "Scam / fraud",
  prohibited_item: "Prohibited item",
  fake_or_misleading: "Fake or misleading",
  spam: "Spam",
  other: "Other",
  item_not_available: "Item not available to sell",
  community_reports: "Community reports",
};

export function reasonLabel(code: string | null | undefined): string {
  if (!code) return "—";
  return RESTRICTION_REASON_LABELS[code] ?? code;
}

/**
 * The reward, and how many listings a seller can earn it for (lifetime).
 *
 * These MIRROR Postgres — they are not the source of truth. `admin_review_claim`
 * counts the seller's `listing_approved` ledger rows under an advisory lock and
 * credits nothing past the cap, writing `status='closed_at_cap'` instead. The
 * client cannot make it overpay, so these two constants only drive LABELS (the
 * "+10 coins" / "no coins" preview on the approve button). If they drift from the
 * database, the preview is wrong but no money moves incorrectly — the receipt is
 * always rendered from what the RPC actually returned.
 */
export const REWARD_APPROVED_CAP = 6;
export const REWARD_COINS = 10;

/** Friendly copy for the documented RPC error message texts (Postgres RAISE). */
const RPC_ERROR_COPY: Record<string, string> = {
  RESTRICT_REASON_REQUIRED: "Pick a reason before restricting.",
  POST_NOT_FOUND: "No listing found with that ID.",
  POST_DELETED: "That listing has been deleted and can't be changed.",
  POST_NOT_RESTRICTABLE: "That listing can't be restricted in its current state.",
  UPHOLD_REQUIRED: "Choose to uphold or decline the appeal.",
  NOT_AUTHORIZED: UNAUTHORIZED_MESSAGE,
  // Reward review.
  CLAIM_NOT_FOUND: "That reward claim no longer exists.",
  SELLER_UNDER_CAP:
    "This seller still has reward slots left, so this listing is owed coins — approve it instead.",
  POST_STILL_LIVE:
    "Voiding only applies to a listing that has been taken down. This one hasn't been, so its claim needs a real decision — approve, deny, or take it down.",
  REWARDS_POST_RESTRICTED:
    "This listing is currently taken down. Reinstate it first, then decide the claim.",
};

/** Map a known RPC error message to friendly copy, else show it raw. */
export function mapRpcError(error: RpcError, fallback = "Action failed."): string {
  const raw = (error?.message ?? "").trim();
  if (!raw) return fallback;
  return RPC_ERROR_COPY[raw] ?? raw;
}

const AUD = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export function formatAudCents(cents: number | null | undefined): string {
  return cents == null ? "—" : AUD.format(cents / 100);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? new Date(t).toLocaleString() : "";
}

/** "scam_fraud" / "fake item" -> "Scam fraud" / "Fake item" (for free-text report reasons). */
export function humanize(value: string | null | undefined): string {
  const s = (value ?? "").replace(/_/g, " ").trim();
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
