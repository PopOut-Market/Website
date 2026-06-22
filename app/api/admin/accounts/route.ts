import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * "My accounts" desktop view: for a fixed set of operator-owned accounts, the
 * posts they listed and the most recent messages they received. Service-role
 * behind requireAdmin (reads posts/messages/profiles, all RLS-locked to anon).
 */

// Operator-owned accounts to surface. Edit this list to add/remove accounts.
const ACCOUNTS: { id: string; fallback: string; phone?: string }[] = [
  { id: "db926bb7-0ecb-4bec-88bc-a858fec96b01", fallback: "Sooyoung" },
  { id: "011f01af-8cc4-4df4-85a3-0c9c5ef3a399", fallback: "Tig", phone: "432 487 228" },
  { id: "93045619-bb07-4026-b5c6-ef97d53d20e2", fallback: "terry", phone: "421 871 961" },
];
const POST_LIMIT = 50;
const MESSAGE_LIMIT = 25;

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

type Embedded = { nickname: string | null } | { nickname: string | null }[] | null;
function nick(e: Embedded): string | null {
  const o = Array.isArray(e) ? e[0] : e;
  return o?.nickname ?? null;
}
function preview(messageType: string | null, content: string | null): string {
  if (messageType === "image") return "📷 Photo";
  const text = (content ?? "").trim();
  if (!text) return "(no text)";
  return text.length > 140 ? `${text.slice(0, 139)}…` : text;
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (gate instanceof NextResponse) return gate;

  const supabaseUrl = env("EXPO_PUBLIC_SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase admin is not configured on the server." },
      { status: 500 },
    );
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  type PostRow = {
    id: string;
    raw_title: string | null;
    price_cents: number | null;
    status: string | null;
    thumbnail_path: string | null;
    created_at: string;
  };
  type MsgRow = {
    id: string;
    content: string | null;
    message_type: string | null;
    created_at: string;
    sender: Embedded;
  };

  try {
    const accounts = await Promise.all(
      ACCOUNTS.map(async (acc) => {
        const [profileRes, postsRes, msgsRes] = await Promise.all([
          sb.from("profiles").select("nickname").eq("id", acc.id).maybeSingle(),
          sb
            .from("posts")
            .select("id, raw_title, price_cents, status, thumbnail_path, created_at", {
              count: "exact",
            })
            .eq("seller_id", acc.id)
            .eq("status", "available")
            .order("created_at", { ascending: false })
            .limit(POST_LIMIT),
          sb
            .from("messages")
            .select("id, content, message_type, created_at, sender:profiles!sender_id(nickname)", {
              count: "exact",
            })
            .eq("recipient_id", acc.id)
            .order("created_at", { ascending: false })
            .limit(MESSAGE_LIMIT),
        ]);

        const posts = ((postsRes.data ?? []) as PostRow[]).map((p) => ({
          id: p.id,
          title: p.raw_title,
          price_cents: p.price_cents,
          status: p.status,
          thumbnail_path: p.thumbnail_path,
          created_at: p.created_at,
        }));
        const messages = ((msgsRes.data ?? []) as MsgRow[]).map((m) => ({
          id: m.id,
          from: nick(m.sender) ?? "Unknown",
          preview: preview(m.message_type, m.content),
          created_at: m.created_at,
        }));

        return {
          id: acc.id,
          nickname: profileRes.data?.nickname || acc.fallback,
          phone: acc.phone ?? null,
          totalPosts: postsRes.count ?? posts.length,
          totalMessages: msgsRes.count ?? messages.length,
          posts,
          messages,
        };
      }),
    );

    return NextResponse.json({ accounts, generatedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
