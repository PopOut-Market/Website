import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * How many listings each seller has actually been PAID for.
 *
 * `status='approved'` is the money fact: it means coins were credited. A listing
 * that was fine but earned nothing because the seller was already at the cap gets
 * `status='closed_at_cap'`, which is deliberately NOT counted here — it must never
 * consume a reward slot.
 *
 * ## Why this is paged rather than one `select()`
 *
 * A PostgREST project sets a `max-rows` ceiling (Supabase defaults to 1000), and it
 * applies it SILENTLY: a plain `.select("owner_id").eq("status","approved")` just
 * stops at the ceiling and returns a short array with no error and no flag. Once a
 * marketplace has more paid claims than the ceiling, every count derived from that
 * scan is quietly wrong and stays wrong — sellers past the cut-off would read as
 * 0/6 and the "N paid" total would freeze at the ceiling.
 *
 * So: ask for the EXACT count first (a `head` count query, which no ceiling
 * touches), then page until we have that many rows. Advancing the cursor by the
 * number of rows actually RETURNED — rather than by the page size we asked for —
 * is what makes this correct no matter where the ceiling is set, including if it
 * is lower than PAGE.
 */

const PAGE = 1000;
/** Backstop against a pathological loop; 500k paid claims is far beyond real use. */
const MAX_PAGES = 500;

export type PaidCounts = {
  /** owner_id -> number of PAID claims. Sellers with none are simply absent. */
  counts: Record<string, number>;
  /** Exact number of paid claims, straight from the database. */
  total: number;
  /** Distinct sellers who have ever been paid. */
  sellers: number;
};

export async function paidCountsByOwner(
  sb: SupabaseClient,
): Promise<{ ok: true; data: PaidCounts } | { ok: false; error: string }> {
  // Exact total, unaffected by max-rows (head:true fetches no rows at all).
  const { count, error: countErr } = await sb
    .from("reward_listing_claims")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  if (countErr) return { ok: false, error: countErr.message || "(empty)" };

  const total = count ?? 0;
  const counts: Record<string, number> = {};
  if (total === 0) return { ok: true, data: { counts, total: 0, sellers: 0 } };

  let collected = 0;
  for (let page = 0; page < MAX_PAGES && collected < total; page++) {
    const { data, error } = await sb
      .from("reward_listing_claims")
      .select("owner_id")
      .eq("status", "approved")
      .range(collected, collected + PAGE - 1);

    if (error) return { ok: false, error: error.message || "(empty)" };

    const rows = (data ?? []) as { owner_id: string | null }[];
    // A zero-length page with rows still outstanding means we cannot make progress
    // (a ceiling of 0, or rows deleted mid-scan). Stop rather than spin forever.
    if (rows.length === 0) break;

    for (const r of rows) {
      const id = r.owner_id ?? "(unknown)";
      counts[id] = (counts[id] ?? 0) + 1;
    }
    // Advance by what we actually GOT, not by PAGE — the server may have clamped.
    collected += rows.length;
  }

  return { ok: true, data: { counts, total, sellers: Object.keys(counts).length } };
}
