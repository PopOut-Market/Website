/**
 * Best-effort in-memory rate limiter (per server instance). Keyed by an
 * arbitrary string (typically `${bucket}:${ip}`). This is a first defensive
 * layer against scripted abuse of API routes; it is NOT a substitute for a
 * durable store. On serverless/edge the process can be recycled or sharded, so
 * for hard guarantees move this to an external store (e.g. Upstash Redis).
 *
 * It never throttles Google or any crawler that only requests pages — crawlers
 * do not hit `/api/*`, which is where this is applied.
 */

type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();

// Opportunistic cleanup so the Map can't grow unbounded across long-lived
// processes. Runs at most once per sweep window when a request comes in.
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

/**
 * Fixed-window counter. Allows `limit` requests per `windowMs` for a given key.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
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
