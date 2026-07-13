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
 * True when the RPC itself does not exist in the database — PostgREST answers
 * PGRST202 ("Could not find the function … in the schema cache") for a function
 * it cannot resolve.
 *
 * The reward-review page uses this to detect, at runtime, whether the Step-2
 * migration (`admin_pass_claim` / `admin_void_claim`) has been applied to THIS
 * Supabase project. That keeps the two deploys independent in both directions:
 * the site works before the SQL lands (falling back to a write-nothing local
 * shelf) and lights the real action up the moment it does — no redeploy, and no
 * build-time flag (a `NEXT_PUBLIC_*` flag is inlined at build, so it could not
 * do this anyway).
 */
export function isMissingFunction(error: RpcError): boolean {
  if (!error) return false;
  if ((error.code ?? "").toUpperCase() === "PGRST202") return true;
  const raw = (error.message ?? "").toLowerCase();
  return raw.includes("could not find the function") || raw.includes("does not exist");
}

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

/** p_post_id is a bigint; send a number when the id is purely numeric. */
export function postIdArg(raw: string): number | string {
  const t = raw.trim();
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
 * How many listings a seller can be REWARDED for, lifetime. Past this, a listing
 * still gets a hygiene decision — it just earns no coins (`admin_pass_claim`).
 *
 * This constant is a MIRROR of the cap in Postgres, not the source of truth. The
 * authority is `admin_pass_claim`'s SELLER_UNDER_CAP guard (and, once installed,
 * the `enforce_reward_cap` trigger). Change one, change the other — see
 * supabase/migrations/20260713090000_reward_pass_void_claim.sql.
 */
export const REWARD_APPROVED_CAP = 6;

/** Friendly copy for the documented RPC error message texts (Postgres RAISE). */
const RPC_ERROR_COPY: Record<string, string> = {
  RESTRICT_REASON_REQUIRED: "Pick a reason before restricting.",
  POST_NOT_FOUND: "No listing found with that ID.",
  POST_DELETED: "That listing has been deleted and can't be changed.",
  POST_NOT_RESTRICTABLE: "That listing can't be restricted in its current state.",
  UPHOLD_REQUIRED: "Choose to uphold or decline the appeal.",
  NOT_AUTHORIZED: UNAUTHORIZED_MESSAGE,
  // Reward-review (admin_pass_claim / admin_void_claim / enforce_reward_cap).
  CLAIM_NOT_FOUND: "That reward claim no longer exists.",
  SELLER_UNDER_CAP:
    "This seller still has reward slots left, so this listing is owed +10 coins — approve it instead.",
  POST_STILL_LIVE:
    "Voiding only applies to a listing that has been taken down. This one hasn't been, so its claim needs a real decision — approve, deny, or take it down.",
  REWARD_CAP_EXCEEDED: `This seller is already at the ${REWARD_APPROVED_CAP}-listing reward cap, so no more coins can be paid. Reload and use the no-coins approve.`,
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
