import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * Dashboard overview metrics, computed server-side with the service-role key
 * (behind requireAdmin). Service-role is required: a normal session hits RLS
 * and sees only its own row, which undercounts every aggregate.
 *
 * Posts: available count, status breakdown, per-day created count (last 7 days),
 * and the category + suburb split of currently-available posts (English names).
 * Users: active count (excludes deleted/banned) + suburb + app-language splits.
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function categoryLabel(row: { id: string | number; name: unknown; slug: string | null }): string {
  if (row.name && typeof row.name === "object") {
    return (row.name as Record<string, string>).en ?? row.slug ?? `#${row.id}`;
  }
  return (row.name as string | null) ?? row.slug ?? `#${row.id}`;
}

// Post statuses the UI knows how to colour. Anything outside this set is folded
// into an "(other)" bucket below so the breakdown still sums to the true total.
const POST_STATUSES = ["available", "sold", "deleted", "restricted"] as const;

/**
 * The Community tab's five topics, in the order the app lists them, with the
 * names the app actually shows. The database stores the slug; two of them do not
 * read as their label ("tips_deals" is shown as "Local deals", "general" as
 * "Local life"), so mapping here keeps the dashboard speaking the product's own
 * vocabulary rather than its column values.
 */
const COMMUNITY_TOPICS: { slug: string; label: string }[] = [
  { slug: "tips_deals", label: "Local deals" },
  { slug: "ask_locals", label: "Ask & News" },
  { slug: "general", label: "Local life" },
  { slug: "want_to_buy", label: "Looking to buy" },
  { slug: "other", label: "Other" },
];

// PostgREST caps a single response at db-max-rows (1000 on this project). Any
// query that tallies a whole table in memory silently undercounts once the
// table grows past that cap, so page through every row via a stable `id` order
// until a short page marks the end.
const PAGE_SIZE = 1000;
type QueryError = { message?: string; code?: string } | null;
type RangeableQuery = {
  range: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: QueryError }>;
};
async function fetchAllRows(
  makeQuery: () => RangeableQuery,
): Promise<{ data: unknown[]; error: QueryError }> {
  const all: unknown[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await makeQuery().range(from, from + PAGE_SIZE - 1);
    if (error) return { data: all, error };
    const rows = data ?? [];
    for (const r of rows) all.push(r);
    if (rows.length < PAGE_SIZE) break;
  }
  return { data: all, error: null };
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;

  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "Missing server key. Set SUPABASE_SERVICE_ROLE_KEY in .env (Supabase > Settings > API).",
      },
      { status: 500 },
    );
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Last 7 calendar days (UTC), oldest first.
  const dayKeys: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    dayKeys.push(d.toISOString().slice(0, 10));
  }
  const windowStartISO = `${dayKeys[0]}T00:00:00.000Z`;

  // Rolling weekly buckets: 8 seven-day windows ending today (UTC), oldest first.
  // The oldest window's first day sets the fetch window for the per-week series.
  const DAY_MS = 86_400_000;
  const WEEK_COUNT = 8;
  const todayUTCms = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const weekStarts: number[] = [];
  for (let k = WEEK_COUNT - 1; k >= 0; k--) {
    weekStarts.push(todayUTCms - (k * 7 + 6) * DAY_MS);
  }
  const weekWindowStartISO = new Date(weekStarts[0]).toISOString();
  const weekLabels = weekStarts.map((ms) => new Date(ms).toISOString().slice(5, 10));

  try {
    const [
      { count: totalPosts, error: e1 },
      { count: postsLast7d, error: e2 },
      { count: totalUsersAll, error: e3 },
      { count: activeUsers, error: e3b },
      statusCounts,
      { data: languageRows, error: e5 },
      { data: suburbRows, error: e6 },
      { data: suburbNames, error: e7 },
      { data: windowPosts, error: e8 },
      { data: categoryRows, error: e9 },
      { data: availablePosts, error: e10 },
      { data: windowProfiles, error: e11 },
      { count: messages7d, error: e15 },
      { count: messagesTotal, error: e15b },
      { count: bulkPosts, error: e16 },
      { data: soldPosts, error: e17 },
      { data: salesRows, error: e18 },
      { data: communityRows, error: e19 },
      { count: communityReplies, error: e20 },
      { data: priceDropRows, error: e21 },
    ] = await Promise.all([
      sb.from("posts").select("*", { count: "exact", head: true }),
      sb
        .from("posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", windowStartISO),
      sb.from("profiles").select("*", { count: "exact", head: true }),
      // User metrics exclude deleted (is_deleted / deleted_at) and banned accounts.
      sb
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_deleted", false)
        .eq("is_banned", false)
        .is("deleted_at", null),
      // Posts by status: one exact head count per status (zero rows transferred),
      // so the tally can never be truncated by the 1000-row response cap.
      Promise.all(
        POST_STATUSES.map((status) =>
          sb.from("posts").select("*", { count: "exact", head: true }).eq("status", status),
        ),
      ),
      fetchAllRows(() =>
        sb
          .from("profiles")
          .select("language")
          .eq("is_deleted", false)
          .eq("is_banned", false)
          .is("deleted_at", null)
          .order("id"),
      ),
      fetchAllRows(() =>
        sb
          .from("profiles")
          .select("verified_suburb_id")
          .eq("is_deleted", false)
          .eq("is_banned", false)
          .is("deleted_at", null)
          .order("id"),
      ),
      sb.from("suburbs").select("id, name"),
      // Posts created over the last 8 weeks (feeds the daily/weekly series and,
      // via category_id, the per-bucket category breakdown shown on hover).
      fetchAllRows(() =>
        sb
          .from("posts")
          .select("created_at, category_id")
          .gte("created_at", weekWindowStartISO)
          .order("id"),
      ),
      sb.from("categories").select("id, name, slug"),
      // Currently-available posts: rows drive the category + suburb splits, and
      // their row total is the exact available count once every page is fetched.
      fetchAllRows(() =>
        sb.from("posts").select("category_id, suburb_id").eq("status", "available").order("id"),
      ),
      // New signups over the last 8 weeks (excludes deleted/banned, like active
      // users). `language` feeds the per-bucket language breakdown shown on hover.
      fetchAllRows(() =>
        sb
          .from("profiles")
          .select("created_at, language")
          .eq("is_deleted", false)
          .eq("is_banned", false)
          .is("deleted_at", null)
          .gte("created_at", weekWindowStartISO)
          .order("id"),
      ),

      // DAU / WAU / MAU are not computed here — the dashboard shows placeholders
      // until a real source exists. `profiles.last_active_at` is the only signal
      // in this database and it is a single overwritten timestamp per account: it
      // can answer "active right now" but can never be replayed into a historical
      // curve. To reinstate a point-in-time count, add head counts filtered on
      // `last_active_at >= now - N days` alongside the message count below; for a
      // real series, add an event table or a nightly snapshot.

      sb
        .from("messages")
        .select("*", { count: "exact", head: true })
        .gte("created_at", windowStartISO),

      // Every message ever sent. A head count, so the 1000-row response cap
      // cannot truncate it however large the table gets.
      sb.from("messages").select("*", { count: "exact", head: true }),

      // How the listing was created. `batch_id` is set only by the bulk flow.
      sb.from("posts").select("*", { count: "exact", head: true }).not("batch_id", "is", null),

      // Sold listings with both prices and the listing date, so the discount and
      // the time it took to sell can be measured.
      //
      // LIMITATION, and it bounds every discount figure below: `last_price_cents`
      // is the IMMEDIATELY PREVIOUS price, overwritten on each edit, and there is
      // no price-history table. A seller who went 100 -> 80 -> 65 leaves only
      // 80 -> 65 behind, so a multi-step drop is understated. Every discount here
      // is therefore a FLOOR, not the true drop from the original asking price.
      // Fixing it properly needs an `original_price_cents` column written once at
      // publish, or a price-history table.
      fetchAllRows(() =>
        sb
          .from("posts")
          .select("id, price_cents, last_price_cents, created_at")
          .eq("status", "sold")
          .order("id"),
      ),
      // Every recorded sale, with the conversation it was completed in.
      fetchAllRows(() =>
        sb.from("transactions").select("post_id, conversation_id, sold_at").order("id"),
      ),

      // Community posts. Small table today, but paged like every other tally so
      // it cannot silently truncate later.
      fetchAllRows(() => sb.from("community_posts").select("topic, restricted_at").order("id")),
      sb.from("community_post_replies").select("*", { count: "exact", head: true }),

      // Price-drop history. `posts` keeps only the immediately previous price and
      // no timestamp for the change, so the ONLY record of when a seller dropped
      // a price is the notification that went out to the people who had saved the
      // listing. Payload carries { post_id, old_price_cents, new_price_cents }.
      //
      // COVERAGE IS PARTIAL AND NOT RANDOM: a notification only exists if somebody
      // had saved the listing. Nobody saved it, nothing fired, no trace. The
      // dashboard states the covered count next to the figure for that reason.
      fetchAllRows(() =>
        sb.from("notifications").select("payload, created_at").eq("kind", "price_drop").order("id"),
      ),
    ]);

    const e4 = statusCounts.find((r) => r.error)?.error ?? null;
    const firstErr =
      e1 ??
      e2 ??
      e3 ??
      e3b ??
      e4 ??
      e5 ??
      e6 ??
      e7 ??
      e8 ??
      e9 ??
      e10 ??
      e11 ??
      e15 ??
      e15b ??
      e16 ??
      e17 ??
      e18 ??
      e19 ??
      e20 ??
      e21;
    if (firstErr) {
      return NextResponse.json(
        {
          error: `Supabase query failed: ${firstErr.message || "(empty)"} (code: ${(firstErr as { code?: string }).code ?? "unknown"}).`,
        },
        { status: 500 },
      );
    }

    const tally = (rows: unknown[] | null, key: string, fallback: string) => {
      const m = new Map<string, number>();
      for (const r of rows ?? []) {
        const v = (r as Record<string, unknown>)[key];
        const label = v == null || v === "" ? fallback : String(v);
        m.set(label, (m.get(label) ?? 0) + 1);
      }
      return m;
    };

    const byStatus: { status: string; count: number }[] = POST_STATUSES.map((status, i) => ({
      status,
      count: statusCounts[i].count ?? 0,
    }));
    // Fold any post whose status is null or outside POST_STATUSES into "(other)"
    // so the breakdown reconciles with the total. (The counts are separate
    // queries, so a mid-fetch write can make this drift by a row; the > 0 guard
    // keeps that from ever showing a negative bucket.)
    const otherStatus = (totalPosts ?? 0) - byStatus.reduce((a, r) => a + r.count, 0);
    if (otherStatus > 0) byStatus.push({ status: "(other)", count: otherStatus });
    byStatus.sort((a, b) => b.count - a.count);

    const byLanguage = [...tally(languageRows, "language", "(not set)").entries()]
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count);

    const nameById = new Map<string, string>();
    for (const s of suburbNames ?? []) {
      const row = s as { id: string | number; name: string | null };
      if (row.name) nameById.set(String(row.id), row.name);
    }
    const suburbCounts = new Map<string, number>();
    for (const r of suburbRows ?? []) {
      const id = (r as { verified_suburb_id: string | number | null }).verified_suburb_id;
      const label = id == null ? "(not set)" : (nameById.get(String(id)) ?? `Suburb #${id}`);
      suburbCounts.set(label, (suburbCounts.get(label) ?? 0) + 1);
    }
    const bySuburb = [...suburbCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Category id -> English label (needed before the series below can attribute
    // each windowed post to a category for the hover breakdown).
    const catName = new Map<string, string>();
    for (const c of categoryRows ?? []) {
      const row = c as { id: string | number; name: unknown; slug: string | null };
      catName.set(String(row.id), categoryLabel(row));
    }

    // Per-day (last 7 days) and per-week (last 8 weeks) counts of created_at rows,
    // each bucket carrying a `breakdown` (label -> count via `labelOf`) so the UI
    // can repaint the adjacent bar chart for the hovered bucket. Reused for both
    // posts (by category) and new signups (by language).
    type Slot = { count: number; breakdown: Map<string, number> };
    const newSlot = (): Slot => ({ count: 0, breakdown: new Map() });
    const finish = (date: string, s: Slot) => ({
      date,
      count: s.count,
      breakdown: Object.fromEntries(s.breakdown),
    });
    const add = (s: Slot, label: string) => {
      s.count += 1;
      s.breakdown.set(label, (s.breakdown.get(label) ?? 0) + 1);
    };

    const seriesDaily = (
      rows: unknown[] | null,
      labelOf: (r: Record<string, unknown>) => string,
    ) => {
      const perDay = new Map<string, Slot>(dayKeys.map((d) => [d, newSlot()]));
      for (const r of rows ?? []) {
        const rec = r as Record<string, unknown>;
        const day = String(rec.created_at ?? "").slice(0, 10);
        const slot = perDay.get(day);
        if (slot) add(slot, labelOf(rec));
      }
      return dayKeys.map((day) => finish(day.slice(5), perDay.get(day) as Slot));
    };
    const seriesWeekly = (
      rows: unknown[] | null,
      labelOf: (r: Record<string, unknown>) => string,
    ) => {
      const slots = Array.from({ length: WEEK_COUNT }, newSlot);
      for (const r of rows ?? []) {
        const rec = r as Record<string, unknown>;
        const iso = String(rec.created_at ?? "");
        if (iso.length < 10) continue;
        const dayMs = Date.UTC(
          Number(iso.slice(0, 4)),
          Number(iso.slice(5, 7)) - 1,
          Number(iso.slice(8, 10)),
        );
        const daysAgo = Math.floor((todayUTCms - dayMs) / DAY_MS);
        if (daysAgo < 0 || daysAgo >= WEEK_COUNT * 7) continue;
        add(slots[WEEK_COUNT - 1 - Math.floor(daysAgo / 7)], labelOf(rec));
      }
      return weekLabels.map((date, i) => finish(date, slots[i]));
    };

    const postCategoryLabel = (r: Record<string, unknown>): string => {
      const id = r.category_id as string | number | null;
      return id == null ? "Uncategorised" : (catName.get(String(id)) ?? "Uncategorised");
    };
    const userLanguageLabel = (r: Record<string, unknown>): string => {
      const lang = r.language;
      return lang == null || lang === "" ? "(not set)" : String(lang);
    };

    const postsDaily = seriesDaily(windowPosts, postCategoryLabel);
    const postsWeekly = seriesWeekly(windowPosts, postCategoryLabel);
    const usersDaily = seriesDaily(windowProfiles, userLanguageLabel);
    const usersWeekly = seriesWeekly(windowProfiles, userLanguageLabel);

    // Currently-available posts by category (English names).
    const availByCat = new Map<string, number>();
    for (const p of availablePosts ?? []) {
      const id = (p as { category_id: string | number | null }).category_id;
      const name = id == null ? "Uncategorised" : (catName.get(String(id)) ?? "Uncategorised");
      availByCat.set(name, (availByCat.get(name) ?? 0) + 1);
    }
    const byCategory = [...availByCat.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Currently-available posts by suburb (reuses the suburb id -> name map).
    const availBySuburb = new Map<string, number>();
    for (const p of availablePosts ?? []) {
      const id = (p as { suburb_id: string | number | null }).suburb_id;
      const label = id == null ? "(not set)" : (nameById.get(String(id)) ?? `Suburb #${id}`);
      availBySuburb.set(label, (availBySuburb.get(label) ?? 0) + 1);
    }
    const postsBySuburb = [...availBySuburb.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // ---- sales ---------------------------------------------------------------
    // The seller declares this, so it is not inferred. When marking an item sold
    // they either pick a buyer from the people who messaged them, or choose
    // "Other (sold elsewhere)" — and that option writes a transaction with
    // `conversation_id` NULL. The migration that created the table says so
    // outright: "NULL for sales marked via the 'Other / sold offline' picker
    // option."
    //
    // Discriminate on `conversation_id`, NOT on `buyer_id`: buyer_id is also
    // nulled when a real buyer later deletes their account, so it would count a
    // genuine in-app sale as an outside one. On today's data the two happen to
    // agree, which is exactly the kind of coincidence that hides this bug.
    const conversationByPost = new Map<number, string | null>();
    const soldAtByPost = new Map<number, string | null>();
    for (const row of salesRows ?? []) {
      const r = row as {
        post_id?: number | null;
        conversation_id?: string | null;
        sold_at?: string | null;
      };
      if (r.post_id != null) {
        conversationByPost.set(r.post_id, r.conversation_id ?? null);
        soldAtByPost.set(r.post_id, r.sold_at ?? null);
      }
    }

    // When each listing was last discounted, from the notification stream.
    //
    // Keyed on the LATEST `created_at`, not on the last row of an id-ordered
    // scan: notification ids are not in time order (verified against production —
    // last-by-id disagrees with latest-by-time on these rows and moves the median
    // by more than a day). `order("id")` on the query is only there to make the
    // Range pagination in fetchAllRows deterministic.
    //
    // Spot-checked against production: for every sold-after-a-drop listing that
    // has any notification, the last notified `new_price_cents` equals the
    // listing's current `price_cents` — so where a timestamp exists it is the
    // real final drop, not an earlier one.
    const lastDropAtByPost = new Map<number, string>();
    for (const row of priceDropRows ?? []) {
      const r = row as { payload?: { post_id?: number | null } | null; created_at?: string | null };
      const postId = r.payload?.post_id;
      if (postId == null || !r.created_at) continue;
      const seen = lastDropAtByPost.get(postId);
      if (seen === undefined || r.created_at > seen) lastDropAtByPost.set(postId, r.created_at);
    }

    // Discount size, bucketed by percentage rather than by dollars: 20% off a
    // $50 chair and 20% off a $500 bike are the same decision by the seller,
    // while "$10 off" describes neither.
    const discountPcts: number[] = [];
    let givenAway = 0;
    // Two different clocks, and the labels on the dashboard say so. `daysAfterDrop`
    // starts at the last price cut; `daysFullPrice` starts at publication, because
    // a listing that was never discounted has no other starting line.
    const daysAfterDrop: number[] = [];
    const daysFullPrice: number[] = [];

    let soldOnPlatform = 0;
    let soldElsewhere = 0;
    let soldAfterPriceDrop = 0;
    let soldAtOriginalPrice = 0;
    for (const row of soldPosts ?? []) {
      const r = row as { id: number; price_cents: number | null; last_price_cents: number | null };
      const onPlatform = conversationByPost.get(r.id) != null;
      if (onPlatform) soldOnPlatform += 1;
      else soldElsewhere += 1;

      // The price split covers platform sales only. Whether dropping the price
      // here moved an item says nothing about one the seller sold on Gumtree and
      // came back to tick off.
      if (!onPlatform) continue;
      const dropped =
        r.last_price_cents != null && r.price_cents != null && r.last_price_cents > r.price_cents;

      const listedAt = (row as { created_at?: string | null }).created_at;
      const soldAt = soldAtByPost.get(r.id);
      const days =
        listedAt && soldAt ? (Date.parse(soldAt) - Date.parse(listedAt)) / 86_400_000 : null;

      if (dropped) {
        soldAfterPriceDrop += 1;
        if (r.price_cents === 0) givenAway += 1;
        else if (r.last_price_cents! > 0) {
          discountPcts.push(((r.last_price_cents! - r.price_cents!) / r.last_price_cents!) * 100);
        }
        const droppedAt = lastDropAtByPost.get(r.id);
        if (droppedAt && soldAt) {
          const since = (Date.parse(soldAt) - Date.parse(droppedAt)) / 86_400_000;
          if (Number.isFinite(since) && since >= 0) daysAfterDrop.push(since);
        }
      } else {
        soldAtOriginalPrice += 1;
        if (days != null && days >= 0) daysFullPrice.push(days);
      }
    }

    const median = (xs: number[]): number | null => {
      if (xs.length === 0) return null;
      const a = [...xs].sort((x, y) => x - y);
      const mid = a.length >> 1;
      return a.length % 2 ? a[mid]! : (a[mid - 1]! + a[mid]!) / 2;
    };

    // Buckets, not an average: the spread is the finding, and a mean is dragged
    // around by a couple of near-total drops on a sample this small.
    const discountBuckets = [
      { label: "Under 10% off", count: discountPcts.filter((p) => p < 10).length },
      { label: "10-24% off", count: discountPcts.filter((p) => p >= 10 && p < 25).length },
      { label: "25-49% off", count: discountPcts.filter((p) => p >= 25 && p < 50).length },
      { label: "50%+ off", count: discountPcts.filter((p) => p >= 50).length },
      // Dropping to zero is a different decision from discounting, so it is its
      // own row instead of an infinite-looking 100% inside "50%+".
      { label: "Given away", count: givenAway },
    ];

    // ---- community -----------------------------------------------------------
    const topicCounts = new Map<string, number>();
    let communityRestricted = 0;
    for (const row of communityRows ?? []) {
      const r = row as { topic?: string | null; restricted_at?: string | null };
      const slug = r.topic ?? "other";
      topicCounts.set(slug, (topicCounts.get(slug) ?? 0) + 1);
      if (r.restricted_at) communityRestricted += 1;
    }
    // Fixed order, and every topic present even at zero: a topic nobody has
    // posted in is a finding, and dropping the row would hide it.
    const communityByTopic = COMMUNITY_TOPICS.map((t) => ({
      topic: t.label,
      count: topicCounts.get(t.slug) ?? 0,
    }));

    const totalPostsCount = totalPosts ?? 0;
    const bulk = bulkPosts ?? 0;

    return NextResponse.json({
      activity: {
        messages7d: messages7d ?? 0,
        messagesTotal: messagesTotal ?? 0,
      },
      sales: {
        sold: soldOnPlatform + soldElsewhere,
        onPlatform: soldOnPlatform,
        elsewhere: soldElsewhere,
        afterPriceDrop: soldAfterPriceDrop,
        atOriginalPrice: soldAtOriginalPrice,
        medianDiscountPct: median(discountPcts),
        discountBuckets,
        medianDaysAfterDrop: median(daysAfterDrop),
        // How many of the discounted sales the figure above could actually be
        // computed for. Rendered next to it: without the denominator the median
        // reads as if it covered all of them.
        daysAfterDropCovered: daysAfterDrop.length,
        medianDaysFullPrice: median(daysFullPrice),
        daysFullPriceCovered: daysFullPrice.length,
      },
      community: {
        total: (communityRows ?? []).length,
        byTopic: communityByTopic,
        replies: communityReplies ?? 0,
        restricted: communityRestricted,
      },
      creation: {
        bulk,
        single: Math.max(0, totalPostsCount - bulk),
      },
      posts: {
        total: totalPosts ?? 0,
        available: availablePosts.length,
        last7d: postsLast7d ?? 0,
        byStatus,
        daily: postsDaily,
        weekly: postsWeekly,
        byCategory,
        bySuburb: postsBySuburb,
      },
      users: {
        active: activeUsers ?? 0,
        excluded: (totalUsersAll ?? 0) - (activeUsers ?? 0),
        bySuburb,
        byLanguage,
        daily: usersDaily,
        weekly: usersWeekly,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
