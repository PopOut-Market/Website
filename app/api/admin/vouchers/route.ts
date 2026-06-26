import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-server-auth";

/**
 * Voucher (reward_vouchers) overview, BROKEN DOWN BY PRODUCT.
 *
 * The pool is no longer a single $5 Woolworths card: reward_voucher_products is a
 * catalog (retailer + denomination — e.g. woolworths_5 / woolworths_10, Coles-ready)
 * and every reward_vouchers row carries a product_id FK. This returns per-product
 * counts (total / remaining / revealed), the overall roll-up, and who revealed what.
 * Service-role behind requireAdmin. Deliberately never returns the gift-card secrets
 * (card_link / card_pin / *_number) — only counts and recipients.
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

type Embedded = { nickname: string | null } | { nickname: string | null }[] | null;
function nick(e: Embedded): string | null {
  const o = Array.isArray(e) ? e[0] : e;
  return o?.nickname ?? null;
}

function productLabel(valueCents: number, retailer: string): string {
  const dollars = valueCents % 100 === 0 ? String(valueCents / 100) : (valueCents / 100).toFixed(2);
  return `$${dollars} ${retailer}`;
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
    // 1. Product catalog (tiny, static). Driving the breakdown off the catalog means a
    //    product with zero loaded cards still shows, and inactive ones are flagged.
    const productsRes = await sb
      .from("reward_voucher_products")
      .select("id, retailer, value_cents, coin_cost, sort_order, is_active")
      .order("sort_order", { ascending: true });
    if (productsRes.error) {
      return NextResponse.json(
        { error: `Supabase query failed: ${productsRes.error.message || "(empty)"}` },
        { status: 500 },
      );
    }
    type ProductRow = {
      id: string;
      retailer: string;
      value_cents: number;
      coin_cost: number;
      sort_order: number;
      is_active: boolean;
    };
    const catalog = (productsRes.data ?? []) as ProductRow[];

    // 2. Exact per-product counts. head:true COUNT queries (not row selects), so we
    //    never hit PostgREST's 1000-row cap and never pull a single secret column.
    //    The catalog is a handful of rows, so a few counts each — run in parallel — is cheap.
    const products = await Promise.all(
      catalog.map(async (p) => {
        const [totalRes, remainingRes, revealedRes] = await Promise.all([
          sb
            .from("reward_vouchers")
            .select("*", { count: "exact", head: true })
            .eq("product_id", p.id),
          sb
            .from("reward_vouchers")
            .select("*", { count: "exact", head: true })
            .eq("product_id", p.id)
            .eq("status", "available"),
          sb
            .from("reward_vouchers")
            .select("*", { count: "exact", head: true })
            .eq("product_id", p.id)
            .eq("status", "revealed"),
        ]);
        const err = totalRes.error ?? remainingRes.error ?? revealedRes.error;
        if (err) throw new Error(err.message || "(empty)");
        return {
          id: p.id,
          retailer: p.retailer,
          valueCents: p.value_cents,
          coinCost: p.coin_cost,
          isActive: p.is_active,
          total: totalRes.count ?? 0,
          remaining: remainingRes.count ?? 0,
          revealed: revealedRes.count ?? 0,
        };
      }),
    );

    // 3. Who got vouchers + recent reveals (cross-product). 500 newest reveals, each
    //    tagged with its product so the recent list reads "$5 Woolworths" etc.
    const labelOf = new Map(catalog.map((p) => [p.id, productLabel(p.value_cents, p.retailer)]));
    const rowsRes = await sb
      .from("reward_vouchers")
      .select("id, revealed_to, revealed_at, product_id, recipient:profiles!revealed_to(nickname)")
      .eq("status", "revealed")
      .order("revealed_at", { ascending: false })
      .limit(500);
    if (rowsRes.error) {
      return NextResponse.json(
        { error: `Supabase query failed: ${rowsRes.error.message || "(empty)"}` },
        { status: 500 },
      );
    }
    type Row = {
      id: string;
      revealed_to: string | null;
      revealed_at: string | null;
      product_id: string | null;
      recipient: Embedded;
    };
    const rows = (rowsRes.data ?? []) as Row[];

    // Aggregated by recipient (rows are newest-first, so the first seen per recipient
    // is their latest reveal).
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
      product: (r.product_id && labelOf.get(r.product_id)) || "—",
    }));

    // 4. Overall roll-up = sum across products. product_id is NOT NULL, so every
    //    voucher belongs to exactly one product and is counted exactly once.
    const totals = products.reduce(
      (acc, p) => ({
        total: acc.total + p.total,
        remaining: acc.remaining + p.remaining,
        revealed: acc.revealed + p.revealed,
      }),
      { total: 0, remaining: 0, revealed: 0 },
    );

    return NextResponse.json({
      ...totals,
      products,
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
