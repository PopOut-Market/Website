import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

export async function GET() {
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

  const todayISO = new Date();
  todayISO.setHours(0, 0, 0, 0);

  const [{ count: total }, { count: today }, { data, error }] =
    await Promise.all([
      sb.from("feedbacks").select("*", { count: "exact", head: true }),
      sb
        .from("feedbacks")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO.toISOString()),
      sb
        .from("feedbacks")
        .select(
          "id, user_id, content, image_urls, created_at, profiles(nickname, avatar_url)",
        )
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

  if (error) {
    return NextResponse.json(
      { error: `Query failed: ${error.message}` },
      { status: 500 },
    );
  }

  const rows = data ?? [];

  const allPaths: string[] = [];
  for (const row of rows) {
    const urls = (row as { image_urls?: string[] | null }).image_urls;
    if (urls) {
      for (const p of urls) {
        if (p && !p.startsWith("http")) allPaths.push(p);
      }
    }
  }

  const signedMap = new Map<string, string>();
  if (allPaths.length > 0) {
    const { data: signed } = await sb.storage
      .from("feedback")
      .createSignedUrls(allPaths, 3600);
    if (signed) {
      for (const s of signed) {
        if (s.signedUrl && !s.error) {
          signedMap.set(allPaths[signed.indexOf(s)], s.signedUrl);
        }
      }
    }
  }

  const rowsWithUrls = rows.map((row) => {
    const r = row as { image_urls?: string[] | null };
    if (!r.image_urls) return row;
    return {
      ...row,
      image_urls: r.image_urls.map((p) =>
        p.startsWith("http") ? p : (signedMap.get(p) ?? p),
      ),
    };
  });

  return NextResponse.json({
    total: total ?? 0,
    today: today ?? 0,
    rows: rowsWithUrls,
  });
}
