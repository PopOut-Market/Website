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
      sb.from("posts").select("created_at").gte("created_at", windowStartISO),
      sb.from("categories").select("id, name, slug"),
      sb
        .from("posts")
        .select("category_id, suburb_id", { count: "exact" })
        .eq("status", "available"),
    ]);

    const firstErr = e1 ?? e2 ?? e3 ?? e3b ?? e4 ?? e5 ?? e6 ?? e7 ?? e8 ?? e9 ?? e10;
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

    // Posts created per day (last 7 days).
    const perDayCount = new Map<string, number>(dayKeys.map((d) => [d, 0]));
    for (const p of windowPosts ?? []) {
      const day = (p as { created_at: string }).created_at.slice(0, 10);
      if (perDayCount.has(day)) perDayCount.set(day, (perDayCount.get(day) ?? 0) + 1);
    }
    const dailyData = dayKeys.map((day) => ({
      date: day.slice(5),
      count: perDayCount.get(day) ?? 0,
    }));

    // Currently-available posts by category (English names).
    const catName = new Map<string, string>();
    for (const c of categoryRows ?? []) {
      const row = c as { id: string | number; name: unknown; slug: string | null };
      catName.set(String(row.id), categoryLabel(row));
    }
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
        daily: dailyData,
        byCategory,
        bySuburb: postsBySuburb,
      },
      users: {
        active: activeUsers ?? 0,
        excluded: (totalUsersAll ?? 0) - (activeUsers ?? 0),
        bySuburb,
        byLanguage,
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
