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
    return NextResponse.json(
      {
        error:
          "Missing server key. Set SUPABASE_SERVICE_ROLE_KEY in .env to the legacy service_role JWT.",
      },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const startDate = url.searchParams.get("start");
  const endDate = url.searchParams.get("end");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing start or end query parameter." },
      { status: 400 },
    );
  }

  const startISO = `${startDate}T00:00:00.000Z`;
  const endISO = `${endDate}T23:59:59.999Z`;

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const [postsRes, interestsRes, soldPostsRes, profilesRes, allStatusRes] =
      await Promise.all([
        sb
          .from("posts")
          .select("created_at")
          .gte("created_at", startISO)
          .lte("created_at", endISO),
        sb
          .from("post_interests")
          .select("created_at")
          .gte("created_at", startISO)
          .lte("created_at", endISO),
        sb
          .from("posts")
          .select("updated_at")
          .eq("status", "sold")
          .gte("updated_at", startISO)
          .lte("updated_at", endISO),
        sb
          .from("profiles")
          .select("suburb_verified_at")
          .gte("suburb_verified_at", startISO)
          .lte("suburb_verified_at", endISO),
        sb
          .from("posts")
          .select("status")
          .gte("created_at", startISO)
          .lte("created_at", endISO),
      ]);

    const [msgRes, meetupRes] = await Promise.all([
      sb
        .from("messages")
        .select("created_at")
        .gte("created_at", startISO)
        .lte("created_at", endISO),
      sb
        .from("meetup_schedules")
        .select("updated_at")
        .eq("status", "met")
        .gte("updated_at", startISO)
        .lte("updated_at", endISO),
    ]);

    const firstErr =
      postsRes.error ??
      interestsRes.error ??
      soldPostsRes.error ??
      profilesRes.error ??
      allStatusRes.error;

    if (firstErr) {
      return NextResponse.json(
        { error: `Supabase query failed: ${firstErr.message}` },
        { status: 500 },
      );
    }

    let messagesData: { created_at: string }[] = [];
    let meetupsData: { updated_at: string }[] = [];
    let msgCountFallback: number | null = null;
    let meetupCountFallback: number | null = null;

    if (msgRes.error) {
      const { count } = await sb
        .from("messages")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startISO)
        .lte("created_at", endISO);
      msgCountFallback = count ?? 0;
    } else {
      messagesData = (msgRes.data ?? []) as { created_at: string }[];
    }

    if (meetupRes.error) {
      const { count } = await sb
        .from("meetup_schedules")
        .select("*", { count: "exact", head: true })
        .eq("status", "met")
        .gte("updated_at", startISO)
        .lte("updated_at", endISO);
      meetupCountFallback = count ?? 0;
    } else {
      meetupsData = (meetupRes.data ?? []) as { updated_at: string }[];
    }

    return NextResponse.json({
      posts: postsRes.data ?? [],
      interests: interestsRes.data ?? [],
      soldPosts: soldPostsRes.data ?? [],
      profiles: profilesRes.data ?? [],
      allPostStatuses: allStatusRes.data ?? [],
      messages: messagesData,
      meetups: meetupsData,
      msgCountFallback,
      meetupCountFallback,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 500 },
    );
  }
}
