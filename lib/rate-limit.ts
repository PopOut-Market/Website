/**
 * Best-effort in-memory rate limiter (per server instance). Keyed by an
 * arbitrary string (typically `${bucket}:${ip}`). First defensive layer against
 * scripted abuse of API routes; not a substitute for a durable store. It never
 * throttles normal page browsing — it is only applied on `/api/*` routes, which
 * regular visitors and the market feed do not use.
 */

type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();

let lastSweep = 0;
const SWEEP_INTERVAL_MS = 60_000;

function sweep(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets (for a Retry-After header). */
  retryAfterSec: number;
};

/** Fixed-window counter: allows `limit` requests per `windowMs` for a key. */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Extracts the client IP from common proxy headers, with a stable fallback. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("x-nf-client-connection-ip")?.trim() ||
    "unknown"
  );
}
