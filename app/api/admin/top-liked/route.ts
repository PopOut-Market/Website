import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

export async function GET(req: Request) {
  const supabaseUrl =
    env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey =
    env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Missing server key." }, { status: 500 });
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const period = new URL(req.url).searchParams.get("period") ?? "all";

  let query = sb.from("post_interests").select("post_id");
  if (period === "month") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    query = query.gte("created_at", cutoff.toISOString());
  }

  const { data: interests, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: `Query failed: ${error.message}` },
      { status: 500 },
    );
  }

  const counts: Record<number, number> = {};
  interests?.forEach((r: { post_id: number }) => {
    counts[r.post_id] = (counts[r.post_id] ?? 0) + 1;
  });

  const ranked = Object.entries(counts)
    .map(([postId, likes]) => ({ postId: Number(postId), likes }))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);

  const postIds = ranked.map((r) => r.postId);
  if (postIds.length === 0) {
    return NextResponse.json({ topPosts: [] });
  }

  const { data: posts } = await sb
    .from("posts")
    .select("id, raw_title, category_id, price_cents")
    .in("id", postIds);

  const { data: categories } = await sb
    .from("categories")
    .select("id, slug")
    .eq("is_active", true);

  const catMap = new Map<number, string>();
  categories?.forEach((c: { id: number; slug: string }) =>
    catMap.set(c.id, c.slug),
  );

  const postMap = new Map<
    number,
    { raw_title: string | null; category_id: number; price_cents: number | null }
  >();
  posts?.forEach(
    (p: {
      id: number;
      raw_title: string | null;
      category_id: number;
      price_cents: number | null;
    }) => postMap.set(p.id, p),
  );

  const topPosts = ranked.map((r) => {
    const p = postMap.get(r.postId);
    return {
      id: r.postId,
      title: p?.raw_title?.trim() || `Post #${r.postId}`,
      category: catMap.get(p?.category_id ?? 0) ?? "unknown",
      priceCents: p?.price_cents ?? 0,
      likes: r.likes,
    };
  });

  return NextResponse.json({ topPosts });
}
