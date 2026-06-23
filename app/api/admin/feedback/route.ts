import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

type FeedbackRecord = {
  id: string;
  user_id: string | null;
  body: string | null;
  app_version: string | null;
  os_name: string | null;
  os_version: string | null;
  locale: string | null;
  created_at: string;
};

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

  const todayISO = new Date();
  todayISO.setHours(0, 0, 0, 0);

  const [{ count: total }, { count: today }, { data, error }] = await Promise.all([
    sb.from("user_feedback").select("*", { count: "exact", head: true }),
    sb
      .from("user_feedback")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO.toISOString()),
    sb
      .from("user_feedback")
      .select("id, user_id, body, app_version, os_name, os_version, locale, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  if (error) {
    return NextResponse.json({ error: `Query failed: ${error.message}` }, { status: 500 });
  }

  const records = (data ?? []) as FeedbackRecord[];

  // Resolve nicknames in one batched query (profiles has no avatar_url column).
  const userIds = Array.from(new Set(records.map((r) => r.user_id).filter(Boolean) as string[]));
  const nameMap = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: profiles } = await sb.from("profiles").select("id, nickname").in("id", userIds);
    profiles?.forEach((p: { id: string; nickname: string | null }) =>
      nameMap.set(p.id, p.nickname ?? "Unknown"),
    );
  }

  const rows = records.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    content: r.body,
    created_at: r.created_at,
    nickname: (r.user_id && nameMap.get(r.user_id)) || "Unknown",
    app_version: r.app_version,
    os_name: r.os_name,
    os_version: r.os_version,
    locale: r.locale,
  }));

  return NextResponse.json({
    total: total ?? 0,
    today: today ?? 0,
    rows,
  });
}
