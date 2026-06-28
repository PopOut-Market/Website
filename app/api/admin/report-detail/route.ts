import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * Lazy detail for one report row, fetched when an admin expands it:
 * - ?postId=N            -> the reported post's full info (for post reports)
 * - ?conversationId=UUID -> the post the chat was about + the full message thread
 *                           (for user reports, which carry a conversation_id)
 *
 * Service-role behind requireAdmin. Post photos are derived from the thumbnail
 * path pattern `{seller}/{post}/{i}.webp` (no post_images table); the client turns
 * the returned storage paths into URLs via getPostImageUrl.
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

const MESSAGE_LIMIT = 300;

type PostRow = {
  id: number;
  seller_id: string | null;
  raw_title: string | null;
  raw_description: string | null;
  price_cents: number | null;
  status: string | null;
  thumbnail_path: string | null;
  photo_count: number | null;
  created_at: string;
  original_locale: string | null;
};

function photoPaths(thumbnail: string | null, photoCount: number | null): string[] {
  if (!thumbnail) return [];
  const prefix = thumbnail.replace(/\d+\.webp$/i, "");
  if (prefix === thumbnail) return [thumbnail]; // unexpected pattern — just the thumb
  const n = Math.max(1, photoCount ?? 1);
  return Array.from({ length: n }, (_, i) => `${prefix}${i}.webp`);
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

  const url = new URL(req.url);
  const postIdParam = url.searchParams.get("postId");
  const conversationId = url.searchParams.get("conversationId");

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const POST_COLS =
    "id, seller_id, raw_title, raw_description, price_cents, status, thumbnail_path, photo_count, created_at, original_locale";

  async function nameOf(ids: (string | null)[]): Promise<Map<string, string>> {
    const unique = [...new Set(ids.filter((x): x is string => Boolean(x)))];
    const map = new Map<string, string>();
    if (unique.length === 0) return map;
    const { data } = await sb.from("profiles").select("id, nickname").in("id", unique);
    for (const p of (data ?? []) as { id: string; nickname: string | null }[]) {
      map.set(p.id, p.nickname || "Unknown");
    }
    return map;
  }

  function shapePost(p: PostRow | null, sellerName: string | null) {
    if (!p) return null;
    return {
      id: p.id,
      title: p.raw_title,
      description: p.raw_description,
      priceCents: p.price_cents,
      status: p.status,
      sellerId: p.seller_id,
      sellerName,
      createdAt: p.created_at,
      originalLocale: p.original_locale,
      photos: photoPaths(p.thumbnail_path, p.photo_count),
    };
  }

  try {
    // ---- Post report: just the post ----
    if (postIdParam) {
      const postId = Number(postIdParam);
      if (!Number.isFinite(postId)) {
        return NextResponse.json({ error: "Bad postId." }, { status: 400 });
      }
      const { data: post, error } = await sb
        .from("posts")
        .select(POST_COLS)
        .eq("id", postId)
        .maybeSingle();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      const names = await nameOf([(post as PostRow | null)?.seller_id ?? null]);
      const p = post as PostRow | null;
      return NextResponse.json({
        post: shapePost(p, p?.seller_id ? (names.get(p.seller_id) ?? null) : null),
      });
    }

    // ---- User report: the conversation's post + the message thread ----
    if (conversationId) {
      const { data: conv, error: convErr } = await sb
        .from("conversations")
        .select("id, post_id, buyer_id, seller_id")
        .eq("id", conversationId)
        .maybeSingle();
      if (convErr) return NextResponse.json({ error: convErr.message }, { status: 500 });
      const c = conv as { id: string; post_id: number | null; buyer_id: string | null; seller_id: string | null } | null;

      const [postRes, msgsRes] = await Promise.all([
        c?.post_id
          ? sb.from("posts").select(POST_COLS).eq("id", c.post_id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        sb
          .from("messages")
          .select(
            "id, sender_id, content, translated_content, target_locale, source_locale, message_type, created_at",
          )
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })
          .limit(MESSAGE_LIMIT),
      ]);

      const msgs = (msgsRes.data ?? []) as {
        id: string;
        sender_id: string | null;
        content: string | null;
        translated_content: string | null;
        target_locale: string | null;
        source_locale: string | null;
        message_type: string | null;
        created_at: string;
      }[];

      const names = await nameOf([
        c?.buyer_id ?? null,
        c?.seller_id ?? null,
        (postRes.data as PostRow | null)?.seller_id ?? null,
        ...msgs.map((m) => m.sender_id),
      ]);

      const p = postRes.data as PostRow | null;
      return NextResponse.json({
        post: shapePost(p, p?.seller_id ? (names.get(p.seller_id) ?? null) : null),
        conversation: c
          ? {
              buyerId: c.buyer_id,
              sellerId: c.seller_id,
              buyerName: c.buyer_id ? (names.get(c.buyer_id) ?? null) : null,
              sellerName: c.seller_id ? (names.get(c.seller_id) ?? null) : null,
            }
          : null,
        messages: msgs.map((m) => ({
          id: m.id,
          senderId: m.sender_id,
          senderName: m.sender_id ? (names.get(m.sender_id) ?? "Unknown") : "Unknown",
          type: m.message_type,
          content: m.message_type === "image" ? null : (m.content ?? ""),
          translatedContent: m.message_type === "image" ? null : (m.translated_content ?? null),
          targetLocale: m.target_locale ?? null,
          sourceLocale: m.source_locale ?? null,
          createdAt: m.created_at,
        })),
      });
    }

    return NextResponse.json({ error: "Provide postId or conversationId." }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
