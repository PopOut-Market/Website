import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * Referral graph data: who invited whom, from `reward_invitations`. Service-role
 * behind requireAdmin (RLS-locked table, joins profiles for nicknames). Returns
 * { nodes, links } for a node-graph. Invitations with no invitee_id (phone-only,
 * not yet signed up) contribute to the inviter's count but have no edge/node.
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

type Embedded = { nickname: string | null } | { nickname: string | null }[] | null;
type Row = {
  inviter_id: string | null;
  invitee_id: string | null;
  paid: boolean | null;
  inviter: Embedded;
  invitee: Embedded;
};

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
    const { data, error } = await sb
      .from("reward_invitations")
      .select(
        "inviter_id, invitee_id, paid, created_at, inviter:profiles!inviter_id(nickname), invitee:profiles!invitee_id(nickname)",
      )
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: `Supabase query failed: ${error.message || "(empty)"}` },
        { status: 500 },
      );
    }

    type Node = { id: string; label: string; invites: number; invited: number };
    const nodes = new Map<string, Node>();
    const ensure = (id: string, label: string | null): Node => {
      const existing = nodes.get(id);
      if (existing) {
        if (label && existing.label.endsWith("…")) existing.label = label;
        return existing;
      }
      const created: Node = { id, label: label || `${id.slice(0, 6)}…`, invites: 0, invited: 0 };
      nodes.set(id, created);
      return created;
    };

    const links: { source: string; target: string; paid: boolean }[] = [];
    let pending = 0;
    for (const row of (data ?? []) as Row[]) {
      if (!row.inviter_id) continue;
      ensure(row.inviter_id, nick(row.inviter)).invites += 1;
      if (row.invitee_id) {
        ensure(row.invitee_id, nick(row.invitee)).invited += 1;
        links.push({ source: row.inviter_id, target: row.invitee_id, paid: !!row.paid });
      } else {
        pending += 1;
      }
    }

    return NextResponse.json({
      nodes: [...nodes.values()],
      links,
      pending,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
