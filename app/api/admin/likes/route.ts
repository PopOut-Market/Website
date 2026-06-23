import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;

  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Missing server key." }, { status: 500 });
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Likes ("interests") live in post_interests (post_id, user_id, created_at).
  // There is no posts.interest_count column — everything is derived here.
  const { data: interestsData, error } = await sb
    .from("post_interests")
    .select("post_id, created_at");

  if (error) {
    return NextResponse.json({ error: `Query failed: ${error.message}` }, { status: 500 });
  }

  const interests = (interestsData ?? []) as { post_id: number; created_at: string }[];

  const todayISO = new Date();
  todayISO.setHours(0, 0, 0, 0);
  const todayKey = todayISO.toISOString();

  const total = interests.length;
  const today = interests.filter((r) => r.created_at >= todayKey).length;

  // Per-post like counts (for avg + category breakdown).
  const perPost: Record<number, number> = {};
  interests.forEach((r) => {
    perPost[r.post_id] = (perPost[r.post_id] ?? 0) + 1;
  });
  const likedPostIds = Object.keys(perPost).map(Number);
  const avgPerPost = likedPostIds.length > 0 ? (total / likedPostIds.length).toFixed(1) : "0";

  // Resolve categories for the liked posts.
  const [postsRes, catsRes] = await Promise.all([
    likedPostIds.length > 0
      ? sb.from("posts").select("id, category_id").in("id", likedPostIds)
      : Promise.resolve({ data: [] as { id: number; category_id: number }[] }),
    sb.from("categories").select("id, slug").eq("is_active", true),
  ]);

  const catSlug = new Map<number, string>();
  (catsRes.data ?? []).forEach((c: { id: number; slug: string }) => catSlug.set(c.id, c.slug));
  const postCat = new Map<number, number>();
  (postsRes.data ?? []).forEach((p: { id: number; category_id: number }) =>
    postCat.set(p.id, p.category_id),
  );

  const catLikes: Record<string, number> = {};
  for (const [postId, likes] of Object.entries(perPost)) {
    const catId = postCat.get(Number(postId));
    const name = (catId != null && catSlug.get(catId)) || "unknown";
    catLikes[name] = (catLikes[name] ?? 0) + likes;
  }
  const byCategory = Object.entries(catLikes)
    .map(([name, likes]) => ({ name, likes }))
    .sort((a, b) => b.likes - a.likes);

  // 30-day daily trend.
  const buckets: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  interests.forEach((r) => {
    const k = r.created_at.slice(0, 10);
    if (buckets[k] !== undefined) buckets[k]++;
  });
  const trend = Object.entries(buckets).map(([date, likes]) => ({ date: date.slice(5), likes }));

  const topPostLikes = Math.max(0, ...Object.values(perPost));

  return NextResponse.json({
    total,
    today,
    avgPerPost,
    topPostLikes,
    byCategory,
    trend,
  });
}
