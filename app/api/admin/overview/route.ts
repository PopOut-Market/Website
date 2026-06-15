import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type Bucket = { posts: number; likes: number; dealResults: number };
type CachedResult = {
  data: Record<string, unknown>;
  fetchedAt: number;
};

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const cache = new Map<string, CachedResult>();

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function GET(req: Request) {
  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "Missing server key. Set SUPABASE_SERVICE_ROLE_KEY in .env to the legacy service_role JWT from Supabase Dashboard > Settings > API > Legacy API Keys.",
      },
      { status: 500 },
    );
  }

  const rangeParam = Number(new URL(req.url).searchParams.get("range") ?? "30");
  const range = [7, 14, 30].includes(rangeParam) ? rangeParam : 30;

  const cacheKey = `overview-${range}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const todayISO = startOfTodayIso();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - range);
  const cutoffISO = cutoff.toISOString();

  try {
    const [
      { count: totalUsers, error: e1 },
      { count: todayUsers, error: e2 },
      { count: totalPosts, error: e3 },
      { count: todayPosts, error: e4 },
      { count: totalDealResults, error: e5 },
      { count: todayDealResults, error: e6 },
      { count: totalLikes, error: e7 },
      { count: todayLikes, error: e8 },
      { count: totalMessages, error: e9 },
      { count: todayMessages, error: e10 },
      { count: totalMeetups, error: e11 },
      { count: todayMeetups, error: e12 },
      { data: allPosts, error: e13 },
      { data: dailyPosts, error: e14 },
      { data: dailyLikes, error: e15 },
      { data: dailyDealResults, error: e16 },
    ] = await Promise.all([
      sb.from("profiles").select("*", { count: "exact", head: true }),
      sb.from("profiles").select("*", { count: "exact", head: true }).gte("suburb_verified_at", todayISO),
      sb.from("posts").select("*", { count: "exact", head: true }),
      sb.from("posts").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      sb.from("posts").select("*", { count: "exact", head: true }).eq("status", "sold"),
      sb.from("posts").select("*", { count: "exact", head: true }).eq("status", "sold").gte("updated_at", todayISO),
      sb.from("post_interests").select("*", { count: "exact", head: true }),
      sb.from("post_interests").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      sb.from("messages").select("*", { count: "exact", head: true }),
      sb.from("messages").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      sb.from("meetup_schedules").select("*", { count: "exact", head: true }).eq("status", "met"),
      sb.from("meetup_schedules").select("*", { count: "exact", head: true }).eq("status", "met").gte("updated_at", todayISO),
      sb.from("posts").select("status"),
      sb.from("posts").select("created_at").gte("created_at", cutoffISO),
      sb.from("post_interests").select("created_at").gte("created_at", cutoffISO),
      sb.from("posts").select("updated_at").eq("status", "sold").gte("updated_at", cutoffISO),
    ]);

    const firstErr = e1 ?? e2 ?? e3 ?? e4 ?? e5 ?? e6 ?? e7 ?? e8 ?? e9 ?? e10 ?? e11 ?? e12 ?? e13 ?? e14 ?? e15 ?? e16;
    if (firstErr) {
      return NextResponse.json(
        {
          error: `Supabase query failed: ${firstErr.message || "(empty)"} (code: ${(firstErr as unknown as {code?:string}).code ?? "unknown"}).`,
        },
        { status: 500 },
      );
    }

    const statusCounts: Record<string, number> = {};
    allPosts?.forEach((p: { status: string }) => {
      statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
    });

    const buckets: Record<string, Bucket> = {};
    for (let i = 0; i < range; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (range - 1 - i));
      buckets[d.toISOString().slice(0, 10)] = { posts: 0, likes: 0, dealResults: 0 };
    }

    dailyPosts?.forEach((r: { created_at: string }) => {
      const k = r.created_at.slice(0, 10);
      if (buckets[k]) buckets[k].posts++;
    });
    dailyLikes?.forEach((r: { created_at: string }) => {
      const k = r.created_at.slice(0, 10);
      if (buckets[k]) buckets[k].likes++;
    });
    dailyDealResults?.forEach((r: { updated_at: string }) => {
      const k = r.updated_at.slice(0, 10);
      if (buckets[k]) buckets[k].dealResults++;
    });

    const result = {
      kpis: {
        totalUsers: totalUsers ?? 0,
        todayUsers: todayUsers ?? 0,
        totalPosts: totalPosts ?? 0,
        todayPosts: todayPosts ?? 0,
        totalDealResults: totalDealResults ?? 0,
        todayDealResults: todayDealResults ?? 0,
        totalLikes: totalLikes ?? 0,
        todayLikes: todayLikes ?? 0,
        totalMessages: totalMessages ?? 0,
        todayMessages: todayMessages ?? 0,
        totalMeetups: totalMeetups ?? 0,
        todayMeetups: todayMeetups ?? 0,
      },
      statusDist: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
      dailyData: Object.entries(buckets).map(([date, v]) => ({ date: date.slice(5), ...v })),
      cachedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, { data: result, fetchedAt: Date.now() });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
