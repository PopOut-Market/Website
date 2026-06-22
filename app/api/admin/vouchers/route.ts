import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * Voucher (reward_vouchers) overview: how many remain, how many were revealed,
 * and who revealed them. Service-role behind requireAdmin. Deliberately does NOT
 * return the gift-card secrets (card_link / card_pin / *_number) — only counts
 * and recipients.
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

type Embedded = { nickname: string | null } | { nickname: string | null }[] | null;
function nick(e: Embedded): string | null {
  const o = Array.isArray(e) ? e[0] : e;
  return o?.nickname ?? null;
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

  try {
    const [totalRes, remainingRes, revealedRes, rowsRes] = await Promise.all([
      sb.from("reward_vouchers").select("*", { count: "exact", head: true }),
      sb
        .from("reward_vouchers")
        .select("*", { count: "exact", head: true })
        .eq("status", "available"),
      sb
        .from("reward_vouchers")
        .select("*", { count: "exact", head: true })
        .eq("status", "revealed"),
      sb
        .from("reward_vouchers")
        .select("id, revealed_to, revealed_at, recipient:profiles!revealed_to(nickname)")
        .eq("status", "revealed")
        .order("revealed_at", { ascending: false })
        .limit(500),
    ]);

    const firstErr = totalRes.error ?? remainingRes.error ?? revealedRes.error ?? rowsRes.error;
    if (firstErr) {
      return NextResponse.json(
        { error: `Supabase query failed: ${firstErr.message || "(empty)"}` },
        { status: 500 },
      );
    }

    type Row = {
      id: string;
      revealed_to: string | null;
      revealed_at: string | null;
      recipient: Embedded;
    };
    const rows = (rowsRes.data ?? []) as Row[];

    // Who got vouchers — aggregated by recipient (rows are newest-first, so the
    // first one seen per recipient is their latest reveal).
    const byRecipient = new Map<
      string,
      { nickname: string; count: number; lastAt: string | null }
    >();
    for (const r of rows) {
      const key = r.revealed_to ?? "(unknown)";
      const existing = byRecipient.get(key);
      if (existing) existing.count += 1;
      else
        byRecipient.set(key, {
          nickname: nick(r.recipient) ?? "Unknown",
          count: 1,
          lastAt: r.revealed_at,
        });
    }
    const recipients = [...byRecipient.values()].sort((a, b) => b.count - a.count);

    const recent = rows.slice(0, 25).map((r) => ({
      id: r.id,
      nickname: nick(r.recipient) ?? "Unknown",
      revealedAt: r.revealed_at,
    }));

    return NextResponse.json({
      total: totalRes.count ?? 0,
      remaining: remainingRes.count ?? 0,
      revealed: revealedRes.count ?? 0,
      recipients,
      recent,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
