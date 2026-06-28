import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

type ReportRow = {
  id: string;
  kind: "post" | "user";
  reason: string;
  details: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reporterName: string;
  // target description: post title (post reports) or reported user nickname (user reports)
  target: string;
  // ids the client uses to lazily load expand detail
  postId: number | null;
  conversationId: string | null;
  reporterId: string | null;
  reportedId: string | null;
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

  const [postRes, userRes] = await Promise.all([
    sb
      .from("post_reports")
      .select("id, reporter_id, post_id, reason, details, status, admin_notes, created_at")
      .order("created_at", { ascending: false }),
    sb
      .from("user_reports")
      .select(
        "id, reporter_id, reported_id, conversation_id, reason, details, status, admin_notes, created_at",
      )
      .order("created_at", { ascending: false }),
  ]);

  const firstErr = postRes.error ?? userRes.error;
  if (firstErr) {
    return NextResponse.json({ error: `Query failed: ${firstErr.message}` }, { status: 500 });
  }

  const postReports = (postRes.data ?? []) as Array<{
    id: string;
    reporter_id: string | null;
    post_id: number;
    reason: string;
    details: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
  }>;
  const userReports = (userRes.data ?? []) as Array<{
    id: string;
    reporter_id: string | null;
    reported_id: string | null;
    conversation_id: string | null;
    reason: string;
    details: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
  }>;

  // Batch-resolve referenced post titles and profile nicknames.
  const postIds = Array.from(new Set(postReports.map((r) => r.post_id)));
  const userIds = Array.from(
    new Set(
      [
        ...postReports.map((r) => r.reporter_id),
        ...userReports.map((r) => r.reporter_id),
        ...userReports.map((r) => r.reported_id),
      ].filter(Boolean) as string[],
    ),
  );

  const [postsData, profilesData] = await Promise.all([
    postIds.length > 0
      ? sb.from("posts").select("id, raw_title").in("id", postIds)
      : Promise.resolve({ data: [] as { id: number; raw_title: string | null }[] }),
    userIds.length > 0
      ? sb.from("profiles").select("id, nickname").in("id", userIds)
      : Promise.resolve({ data: [] as { id: string; nickname: string | null }[] }),
  ]);

  const titleMap = new Map<number, string>();
  (postsData.data ?? []).forEach((p: { id: number; raw_title: string | null }) =>
    titleMap.set(p.id, p.raw_title?.trim() || `Post #${p.id}`),
  );
  const nameMap = new Map<string, string>();
  (profilesData.data ?? []).forEach((p: { id: string; nickname: string | null }) =>
    nameMap.set(p.id, p.nickname ?? "Unknown"),
  );

  const rows: ReportRow[] = [
    ...postReports.map((r) => ({
      id: r.id,
      kind: "post" as const,
      reason: r.reason,
      details: r.details,
      status: r.status,
      admin_notes: r.admin_notes,
      created_at: r.created_at,
      reporterName: (r.reporter_id && nameMap.get(r.reporter_id)) || "Unknown",
      target: titleMap.get(r.post_id) ?? `Post #${r.post_id}`,
      postId: r.post_id,
      conversationId: null,
      reporterId: r.reporter_id,
      reportedId: null,
    })),
    ...userReports.map((r) => ({
      id: r.id,
      kind: "user" as const,
      reason: r.reason,
      details: r.details,
      status: r.status,
      admin_notes: r.admin_notes,
      created_at: r.created_at,
      reporterName: (r.reporter_id && nameMap.get(r.reporter_id)) || "Unknown",
      target: (r.reported_id && nameMap.get(r.reported_id)) || "Unknown user",
      postId: null,
      conversationId: r.conversation_id,
      reporterId: r.reporter_id,
      reportedId: r.reported_id,
    })),
  ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  const stats = {
    total: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    reviewed: rows.filter((r) => r.status === "reviewed").length,
    actioned: rows.filter((r) => r.status === "actioned").length,
    dismissed: rows.filter((r) => r.status === "dismissed").length,
  };

  return NextResponse.json({ stats, rows });
}

const VALID_STATUSES = new Set(["pending", "reviewed", "actioned", "dismissed"]);

export async function PATCH(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;

  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Missing server key." }, { status: 500 });
  }

  let body: { id?: string; kind?: string; status?: string; admin_notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { id, kind, status } = body;
  const admin_notes = body.admin_notes?.trim() || null;

  if (!id || (kind !== "post" && kind !== "user") || !status || !VALID_STATUSES.has(status)) {
    return NextResponse.json(
      { error: "Require id, kind ('post'|'user'), and a valid status." },
      { status: 400 },
    );
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const table = kind === "post" ? "post_reports" : "user_reports";
  const { error: updateErr } = await sb.from(table).update({ status, admin_notes }).eq("id", id);

  if (updateErr) {
    return NextResponse.json({ error: `Update failed: ${updateErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
