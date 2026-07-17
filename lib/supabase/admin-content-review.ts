/**
 * Shared contract for the operator-facing CONTENT review surfaces — community
 * posts, profile photos, and community appeals.
 *
 * This is a different job from listing moderation (`admin-rpc.ts`) and the two
 * must not be merged: several functions here look like their listing-review
 * equivalents and are deliberately different. The traps, spelled out:
 *
 *   - `admin_resolve_community_appeal(p_appeal_id, p_uphold)` takes NO note.
 *     Its listing twin `admin_resolve_appeal` takes a third `p_note`. Passing
 *     one here is a signature mismatch, not a no-op.
 *   - The community reason set (6) and the photo reason set (5) are disjoint
 *     from the listing set, and from each other.
 *   - Photos have NO note field at all.
 *   - Taking a photo down is the `profile-photo` EDGE FUNCTION, never the
 *     `profile_photo_takedown` RPC — see `takedownProfilePhoto` below.
 *
 * Everything is called with the signed-in reviewer's own session; every SQL
 * function calls `assert_reward_admin()` as its first act, so a non-reviewer
 * gets nothing regardless of what this page does.
 */

import { FunctionsHttpError, type SupabaseClient } from "@supabase/supabase-js";

/** Minimal structural shape of a supabase-js / PostgREST error. */
type RpcError = { message?: string | null; code?: string | null } | null;

/* -------------------------------------------------------------------------- */
/* Access                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * `assert_reward_admin()` raises with errcode 42501 in FOUR distinct cases, and
 * only one of them says NOT_AUTHORIZED:
 *
 *   - no auth.uid()               -> 'NOT_AUTHORIZED'
 *   - caller is banned            -> 'ACCOUNT_BANNED'   (assert_caller_not_banned)
 *   - caller has no live profile  -> 'NOT_AUTHORIZED'
 *   - caller not in reward_admins -> 'NOT_AUTHORIZED'
 *
 * `isNotAuthorized` in admin-rpc.ts matches the message text alone, so an
 * operator BANNED mid-session slips through it as a generic error and their
 * queue keeps rendering member content — exactly what rule 5 forbids. Match the
 * SQLSTATE too: 42501 is insufficient_privilege and every refusal from this
 * allowlist carries it, whatever the wording.
 *
 * (The listing pages have the same blind spot. Fixing them is out of scope for
 * this feature — noted for follow-up rather than changed underneath them.)
 */
export function isAccessEnded(error: RpcError): boolean {
  if (!error) return false;
  if ((error.code ?? "").trim() === "42501") return true;
  const msg = (error.message ?? "").trim().toUpperCase();
  return msg.includes("NOT_AUTHORIZED") || msg.includes("ACCOUNT_BANNED");
}

/**
 * Shown when access ends mid-session. Deliberately distinct copy from an empty
 * queue: a refusal must never read as "nothing to review".
 */
export const ACCESS_ENDED_MESSAGE =
  "Your reviewer access has ended. Member content has been cleared from this page. Sign out and sign in again if you believe this is wrong.";

/* -------------------------------------------------------------------------- */
/* Result branching                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The decision functions do not throw on a lost race — they return a
 * `{result}` object and ONLY auth throws. Every caller must branch on this.
 */
export type DecisionResult = "ok" | "already_handled" | "changed" | "gone" | "refused";

export type DecisionPayload = {
  result: DecisionResult;
  /** `changed` only: the post's CURRENT version. Reload with it; never resubmit. */
  version?: string | null;
  /** `ok` from restrict/replace: powers an immediate undo without a second lookup. */
  restriction_id?: number | null;
  /** `refused` only: self_review | missing_input | invalid_photo_path | unknown_photo. */
  reason?: string | null;
  /** `ok` from replace: the reason was already this one, so nothing was sent. */
  unchanged?: boolean | null;
};

/**
 * A jsonb-returning RPC hands back the object itself, but a SETOF-shaped one can
 * surface it as a 1-element array. Normalise. Do NOT use on the list functions —
 * their array IS the payload.
 */
export function unwrapDecision(data: unknown): DecisionPayload | null {
  if (data == null) return null;
  return (Array.isArray(data) ? (data[0] ?? null) : data) as DecisionPayload | null;
}

/** The list RPCs return a jsonb array, coalesced to `[]` server-side. */
export function asRows<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

/**
 * `refused` means the page sent something it should not have — it is a bug, not
 * a member-facing state. Say which, so it is diagnosable from a screenshot.
 */
export const REFUSAL_COPY: Record<string, string> = {
  self_review:
    "This is your own content. Your own posts and photos are never yours to review — this shouldn't have been offered.",
  missing_input: "The decision was sent without everything it needs.",
  invalid_photo_path: "That photo path doesn't belong to that member.",
  unknown_photo: "There's no record of that member ever uploading that photo.",
};

export function refusalMessage(reason: string | null | undefined): string {
  const key = (reason ?? "").trim();
  return REFUSAL_COPY[key] ?? `Refused${key ? ` (${key})` : ""}.`;
}

/* -------------------------------------------------------------------------- */
/* Reasons                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Community post reasons — exactly these six, mirroring the CHECK constraint on
 * community_post_restrictions.reason_code.
 */
export const COMMUNITY_REASON_CODES = [
  "scam_fraud",
  "harassment",
  "sexual_or_inappropriate",
  "fake_or_misleading",
  "spam",
  "other",
] as const;
export type CommunityReasonCode = (typeof COMMUNITY_REASON_CODES)[number];

export const COMMUNITY_REASON_LABELS: Record<string, string> = {
  scam_fraud: "Scam or fraud",
  harassment: "Harassment",
  sexual_or_inappropriate: "Sexual or inappropriate",
  fake_or_misleading: "Fake or misleading",
  spam: "Spam",
  other: "Breaks a community rule",
};

/**
 * Profile photo reasons — five, and deliberately NOT the community set. Mirrors
 * both the CHECK on profile_photo_takedowns.reason and the edge function's own
 * VALID_REASONS allowlist.
 */
export const PHOTO_REASON_CODES = [
  "sexual_content",
  "violence",
  "hate_symbol",
  "someone_else",
  "other",
] as const;
export type PhotoReasonCode = (typeof PHOTO_REASON_CODES)[number];

export const PHOTO_REASON_LABELS: Record<string, string> = {
  sexual_content: "Sexual content",
  violence: "Violence",
  hate_symbol: "Hate symbol",
  someone_else: "Someone else's photo",
  other: "Breaks a photo rule",
};

export function communityReasonLabel(code: string | null | undefined): string {
  if (!code) return "—";
  return COMMUNITY_REASON_LABELS[code] ?? code;
}

/** DB CHECK: community_post_restrictions.internal_note is <= 500 chars. */
export const NOTE_MAX_LENGTH = 500;

/* -------------------------------------------------------------------------- */
/* Rows                                                                        */
/* -------------------------------------------------------------------------- */

export type QueueAuthor = { id: string; nickname: string | null };

export type CommunityQueueRow = {
  post_id: number;
  /**
   * `coalesce(edited_at, created_at)` as a timestamptz STRING. Pass it back
   * verbatim on every decision. Do not round-trip it through a Date — that
   * truncates sub-millisecond precision and the server's `<>` comparison then
   * answers `changed` for every decision.
   */
  version: string;
  created_at: string | null;
  edited_at: string | null;
  title: string | null;
  body: string | null;
  /** The post in English, free from the existing translation cron. Null = not yet. */
  title_en: string | null;
  body_en: string | null;
  topic: string | null;
  photo_paths: string[] | null;
  suburb_id: number | null;
  author: QueueAuthor | null;
};

export type PhotoQueueRow = {
  photo_path: string;
  user_id: string;
  nickname: string | null;
  uploaded_at: string | null;
  /** false = already replaced/removed by the member — the FILE is still live. */
  is_current: boolean | null;
  /** true = a takedown landed but the file was not destroyed. Re-restrict it. */
  destroy_pending: boolean | null;
};

export type CommunityAppealRow = {
  appeal_id: number;
  restriction_id: number;
  /** The member's appeal, in their language. There is no English for this, by design. */
  body: string | null;
  created_at: string | null;
  reason_code: string;
  post_id: number;
  title: string | null;
  post_body: string | null;
  /** The POST's English (not the appeal's). */
  title_en: string | null;
  post_body_en: string | null;
  photo_paths: string[] | null;
  author: QueueAuthor | null;
};

export type CommunityRestrictionLookup = {
  result: "ok" | "not_restricted" | "gone" | "refused";
  restriction_id?: number;
  reason_code?: string;
  internal_note?: string | null;
  restricted_at?: string | null;
  title?: string | null;
  body?: string | null;
  photo_paths?: string[] | null;
  /**
   * The open appeal against this restriction, or null if there is none. Pass it
   * back as `p_expected_appeal_id`: null means "I checked and there was none",
   * not "I didn't look".
   */
  open_appeal_id?: number | null;
  reason?: string | null;
};

/* -------------------------------------------------------------------------- */
/* Storage                                                                     */
/* -------------------------------------------------------------------------- */

function supabaseProjectOrigin(): string {
  return (process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
    .trim()
    .replace(/\/$/, "");
}

/**
 * Both buckets are public. Note these are NOT the market bucket — `getPostImageUrl`
 * in post-image-url.ts resolves `post_images` (listing photos) and is wrong here.
 */
const COMMUNITY_POST_IMAGES_BUCKET = "community_post_images";
const PROFILE_PHOTOS_BUCKET = "profile_photos";

function publicObjectUrl(bucket: string, storagePath: string | null | undefined): string | null {
  if (!storagePath) return null;
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) return storagePath;
  const origin = supabaseProjectOrigin();
  if (!origin) return null;
  const objectPath = storagePath
    .replace(/^\/+/, "")
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${origin}/storage/v1/object/public/${bucket}/${objectPath}`;
}

export function communityPhotoUrl(storagePath: string | null | undefined): string | null {
  return publicObjectUrl(COMMUNITY_POST_IMAGES_BUCKET, storagePath);
}

export function profilePhotoUrl(storagePath: string | null | undefined): string | null {
  return publicObjectUrl(PROFILE_PHOTOS_BUCKET, storagePath);
}

/* -------------------------------------------------------------------------- */
/* Photo takedown — the edge function, NEVER the RPC                           */
/* -------------------------------------------------------------------------- */

export type TakedownOutcome =
  | { kind: "ok" }
  /** Another reviewer already left this photo alone. A normal race, not an error. */
  | { kind: "already_handled" }
  | { kind: "unknown_photo" }
  | { kind: "not_authorized" }
  /** DESTROY_FAILED / CONFIRM_FAILED. Retrying is safe and idempotent. */
  | { kind: "retryable"; code: string }
  | { kind: "error"; message: string };

/**
 * Take a profile photo down.
 *
 * This MUST go through the `profile-photo` edge function. The SQL RPC only
 * tombstones the path, nulls the member's picture and notifies them — the edge
 * function is what destroys the image file AND confirms the destroy back into
 * the queue's `destroy_pending` state. Calling `profile_photo_takedown` directly
 * would report "removed" while the photo stayed downloadable at its public URL,
 * and would strand the row as destroy-pending forever. Do not "tidy" this into
 * an RPC.
 *
 * Contract (prod, profile-photo v2):
 *   200 {ok:true} | 400 INVALID_REQUEST | 403 NOT_AUTHORIZED | 404 UNKNOWN_PHOTO
 *   409 ALREADY_HANDLED | 502 DESTROY_FAILED|CONFIRM_FAILED {retryable:true}
 *   500 INTERNAL_ERROR
 */
export async function takedownProfilePhoto(
  sb: SupabaseClient,
  args: { targetUserId: string; path: string; reason: PhotoReasonCode },
): Promise<TakedownOutcome> {
  try {
    const { error } = await sb.functions.invoke("profile-photo", {
      body: {
        action: "takedown",
        targetUserId: args.targetUserId,
        path: args.path,
        reason: args.reason,
      },
    });
    if (!error) return { kind: "ok" };

    if (error instanceof FunctionsHttpError) {
      const status = error.context?.status;
      let body: { error?: string; retryable?: boolean } = {};
      // Read the body for the error code; fall back to status alone if the
      // response is not JSON or was already consumed.
      try {
        body = await error.context.json();
      } catch {
        body = {};
      }
      const code = (body.error ?? "").trim();

      if (status === 409 || code === "ALREADY_HANDLED") return { kind: "already_handled" };
      if (status === 404 || code === "UNKNOWN_PHOTO") return { kind: "unknown_photo" };
      if (status === 403 || code === "NOT_AUTHORIZED") return { kind: "not_authorized" };
      if (body.retryable === true || code === "DESTROY_FAILED" || code === "CONFIRM_FAILED") {
        return { kind: "retryable", code: code || "RETRYABLE" };
      }
      if (code === "INVALID_REQUEST" || code === "UNKNOWN_ACTION") {
        // The page built a bad call — a bug here, not a member-facing state.
        return { kind: "error", message: `The takedown was rejected as malformed (${code}).` };
      }
      return {
        kind: "error",
        message: `The takedown failed (${code || `HTTP ${status ?? "?"}`}).`,
      };
    }

    // Relay/fetch failure: the request may or may not have landed. Retrying is
    // safe either way — the RPC is idempotent by construction.
    return { kind: "retryable", code: "NETWORK" };
  } catch (e) {
    return { kind: "error", message: e instanceof Error ? e.message : "The takedown failed." };
  }
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* -------------------------------------------------------------------------- */

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? new Date(t).toLocaleString() : "";
}

/** "ask_locals" -> "Ask locals" (topics are display-only; we never filter by them). */
export function humanizeTopic(value: string | null | undefined): string {
  const s = (value ?? "").replace(/_/g, " ").trim();
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
