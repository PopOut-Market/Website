import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { fetchAllRows } from "@/lib/supabase/admin-fetch-all";
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
    return NextResponse.json({ error: "Missing start or end query parameter." }, { status: 400 });
  }

  const startISO = `${startDate}T00:00:00.000Z`;
  const endISO = `${endDate}T23:59:59.999Z`;

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const [postsRes, interestsRes, txRes, profilesRes, allStatusRes] = await Promise.all([
      fetchAllRows(() =>
        sb
          .from("posts")
          .select("created_at")
          .gte("created_at", startISO)
          .lte("created_at", endISO)
          .order("id"),
      ),
      fetchAllRows(() =>
        sb
          .from("post_interests")
          .select("created_at")
          .gte("created_at", startISO)
          .lte("created_at", endISO)
          .order("post_id")
          .order("user_id"),
      ),
      // Completed sales, from the transaction record rather than from
      // `posts.status = "sold"` bucketed by `updated_at`. `updated_at` moves on
      // any later edit, so a sale drifted into whichever period the listing was
      // last touched in; `sold_at` is written once and never moves. It is also
      // the more complete record — 326 transactions against 305 posts still
      // carrying the "sold" status, because a relisted or restricted post loses
      // it. Every handover in this product is in person, so this is both the
      // deal count and the handover count; there is no second number.
      fetchAllRows(() =>
        sb
          .from("transactions")
          .select("sold_at")
          .gte("sold_at", startISO)
          .lte("sold_at", endISO)
          .order("id"),
      ),
      fetchAllRows(() =>
        sb
          .from("profiles")
          .select("suburb_verified_at")
          .gte("suburb_verified_at", startISO)
          .lte("suburb_verified_at", endISO)
          .order("id"),
      ),
      fetchAllRows(() =>
        sb
          .from("posts")
          .select("status")
          .gte("created_at", startISO)
          .lte("created_at", endISO)
          .order("id"),
      ),
    ]);

    const msgRes = await fetchAllRows(() =>
      sb
        .from("messages")
        .select("created_at")
        .gte("created_at", startISO)
        .lte("created_at", endISO)
        .order("id"),
    );

    const firstErr =
      postsRes.error ??
      interestsRes.error ??
      txRes.error ??
      profilesRes.error ??
      allStatusRes.error;

    if (firstErr) {
      return NextResponse.json(
        { error: `Supabase query failed: ${firstErr.message}` },
        { status: 500 },
      );
    }

    let messagesData: { created_at: string }[] = [];
    let msgCountFallback: number | null = null;

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

    return NextResponse.json({
      posts: postsRes.data ?? [],
      interests: interestsRes.data ?? [],
      transactions: txRes.data ?? [],
      profiles: profilesRes.data ?? [],
      allPostStatuses: allStatusRes.data ?? [],
      messages: messagesData,
      msgCountFallback,
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
