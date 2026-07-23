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
      { data: statusRows, error: e4 },
      { data: languageRows, error: e5 },
      { data: suburbRows, error: e6 },
      { data: suburbNames, error: e7 },
      { data: windowPosts, error: e8 },
      { data: categoryRows, error: e9 },
      { data: availablePosts, count: availableCount, error: e10 },
      { data: windowProfiles, error: e11 },
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
      sb.from("posts").select("status"),
      sb
        .from("profiles")
        .select("language")
        .eq("is_deleted", false)
        .eq("is_banned", false)
        .is("deleted_at", null),
      sb
        .from("profiles")
        .select("verified_suburb_id")
        .eq("is_deleted", false)
        .eq("is_banned", false)
        .is("deleted_at", null),
      sb.from("suburbs").select("id, name"),
      // Posts created over the last 8 weeks (feeds the daily/weekly series and,
      // via category_id, the per-bucket category breakdown shown on hover).
      sb.from("posts").select("created_at, category_id").gte("created_at", weekWindowStartISO),
      sb.from("categories").select("id, name, slug"),
      sb
        .from("posts")
        .select("category_id, suburb_id", { count: "exact" })
        .eq("status", "available"),
      // New signups over the last 8 weeks (excludes deleted/banned, like active
      // users). `language` feeds the per-bucket language breakdown shown on hover.
      sb
        .from("profiles")
        .select("created_at, language")
        .eq("is_deleted", false)
        .eq("is_banned", false)
        .is("deleted_at", null)
        .gte("created_at", weekWindowStartISO),
    ]);

    const firstErr = e1 ?? e2 ?? e3 ?? e3b ?? e4 ?? e5 ?? e6 ?? e7 ?? e8 ?? e9 ?? e10 ?? e11;
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

    const byStatus = [...tally(statusRows, "status", "(unknown)").entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

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

    const seriesDaily = (rows: unknown[] | null, labelOf: (r: Record<string, unknown>) => string) => {
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

    return NextResponse.json({
      posts: {
        total: totalPosts ?? 0,
        available: availableCount ?? 0,
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
