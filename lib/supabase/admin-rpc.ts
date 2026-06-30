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
type RpcError = { message?: string | null } | null;

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
] as const;
export type RestrictReasonCode = (typeof RESTRICT_REASON_CODES)[number];

/** Display labels for every restriction reason, incl. the auto-only one. */
export const RESTRICTION_REASON_LABELS: Record<string, string> = {
  scam_fraud: "Scam / fraud",
  prohibited_item: "Prohibited item",
  fake_or_misleading: "Fake or misleading",
  spam: "Spam",
  other: "Other",
  community_reports: "Community reports",
};

export function reasonLabel(code: string | null | undefined): string {
  if (!code) return "—";
  return RESTRICTION_REASON_LABELS[code] ?? code;
}

/** Friendly copy for the documented RPC error message texts (Postgres RAISE). */
const RPC_ERROR_COPY: Record<string, string> = {
  RESTRICT_REASON_REQUIRED: "Pick a reason before restricting.",
  POST_NOT_FOUND: "No listing found with that ID.",
  POST_DELETED: "That listing has been deleted and can't be changed.",
  POST_NOT_RESTRICTABLE: "That listing can't be restricted in its current state.",
  UPHOLD_REQUIRED: "Choose to uphold or decline the appeal.",
  NOT_AUTHORIZED: UNAUTHORIZED_MESSAGE,
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
