/**
 * The shop directory, read server-side.
 *
 * `guide_shops` is not readable with the public anon key, so this module reads it
 * with the service-role key. That is contained three ways: the key is read only
 * here, in a module that throws if it is ever pulled into a client bundle; its
 * only caller is a `force-static` page, so the key is used at build and at
 * revalidation on the server and never on a request path a visitor controls; and
 * nothing here selects a column that is not already public in the app.
 *
 * If a public read path becomes available, switch `fetchGuideShops` to it and
 * delete the service-role path — that is the whole migration.
 *
 * ## Why the revalidate window is short
 *
 * The operator can correct a shop's address or withdraw the shop, and both take
 * effect immediately in the directory. A page that baked an address into a
 * static build would keep publishing a withdrawn one until the next deploy, so
 * this reads the directory on a short window instead and a withdrawn shop drops
 * off on its own. That is a correctness requirement, not a performance choice.
 */

import { getSupabaseStorageOrigin } from "@/lib/supabase/post-image-url";

/** The public bucket the operator's shopfront photographs live in. */
const SHOP_PHOTO_BUCKET = "guide_shop_photos";

/**
 * Shops the website does not list, by directory name.
 *
 * The page is about independent grocers, so chain supermarkets are left out of
 * it. Set `NEXT_PUBLIC_GUIDE_EXCLUDED_SHOPS` (comma-separated) to change the set
 * without a code change; the default covers the chains currently in the
 * directory.
 *
 * This is a name match, which is fragile by nature — a rename defeats it. It is
 * a stopgap until the directory carries a column that marks a shop as a chain.
 */
const EXCLUDED_SHOP_NAMES = new Set(
  (process.env.NEXT_PUBLIC_GUIDE_EXCLUDED_SHOPS ?? "Coles Southern Cross,Woolworths QV")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean),
);

/**
 * The directory's `kind` column is a closed list that includes non-grocery kinds
 * (bakery, cafe, takeaway, and others). This page's heading, its category label
 * and its `GroceryStore` structured data all assert "grocery store", so the
 * query filters on kind rather than trusting that only grocers are ever added.
 * Without this, the first bakery the operator adds is published as a grocery
 * store, in four languages, with no deploy.
 */
const GROCERY_KINDS = ["grocer"] as const;

export type GuideShop = {
  id: string;
  name: string;
  address: string;
  suburb: string | null;
  /** Full-size shopfront photograph, ~1.2 MB. */
  photoUrl: string | null;
  /**
   * The 256x256 map-pin crop of the same photograph, 33-37 KB.
   *
   * USE THIS, not `photoUrl`, anywhere a shop is shown as a thumbnail. Fourteen
   * full-size photographs would be ~17 MB of source images for tiles rendered at
   * ~148 px. Through `next/image` these come out around 4-6 KB each.
   */
  pinUrl: string | null;
};

type GuideShopRow = {
  id: number | string;
  name: string | null;
  address: string | null;
  suburb_id: number | null;
  photo_path: string | null;
  // Some rows store `-pin-256.jpg` and others `-pin.jpg`. Both are the same size.
  // Always read the stored value; never construct the filename.
  pin_path: string | null;
  kind: string | null;
  removed_at: string | null;
};

function supabaseUrl(): string {
  return (process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
    .trim()
    .replace(/\/$/, "");
}

function serviceRoleKey(): string {
  if (typeof window !== "undefined") {
    // Belt and braces. Next would already refuse to inline a non-NEXT_PUBLIC_
    // env var into the browser bundle, but this module must never be imported
    // from a client component and this makes that failure loud instead of silent.
    throw new Error(
      "lib/supabase/server-shops.ts is server-only and must not be imported by a client component.",
    );
  }
  return (process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "").trim();
}

function isConfigured(): boolean {
  return supabaseUrl().startsWith("http") && serviceRoleKey().length > 0;
}

/**
 * Returns rows, or `null` when the read itself failed.
 *
 * The distinction matters: an empty directory and an unreachable one look
 * identical to a caller that collapses both to `[]`, and the page's behaviour on
 * "no shops" is to 404. Under ISR a single failed revalidation would then cache a
 * 404 for a URL that is in the sitemap in four locales.
 */
async function restGet<T>(path: string, revalidate: number): Promise<T[] | null> {
  if (!isConfigured()) return null;
  const key = serviceRoleKey();
  try {
    const res = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return Array.isArray(json) ? (json as T[]) : null;
  } catch {
    return null;
  }
}

function photoUrl(path: string | null): string | null {
  if (!path) return null;
  const origin = getSupabaseStorageOrigin();
  if (!origin) return null;
  const clean = path.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
  return `${origin}/storage/v1/object/public/${SHOP_PHOTO_BUCKET}/${clean}`;
}

/**
 * Every independent grocery shop currently in the directory, alphabetical.
 *
 * `removed_at is null` and the kind filter are applied in the query rather than
 * in JS: a withdrawn shop, or one of a kind this page does not describe, must not
 * reach this process at all, so it cannot be rendered by mistake.
 *
 * Returns `null` when the directory could not be read, so the caller can tell
 * that apart from a directory that is genuinely empty.
 *
 * @param revalidate seconds. Keep this short — see the header comment.
 */
export async function fetchGuideShops(revalidate = 300): Promise<GuideShop[] | null> {
  const kinds = GROCERY_KINDS.join(",");
  const rows = await restGet<GuideShopRow>(
    `guide_shops?select=id,name,address,suburb_id,photo_path,pin_path,kind,removed_at&removed_at=is.null&kind=in.(${kinds})&order=name.asc`,
    revalidate,
  );
  if (!rows) return null;

  const suburbIds = [...new Set(rows.map((r) => r.suburb_id).filter((id): id is number => !!id))];
  const suburbRows = suburbIds.length
    ? await restGet<{ id: number; name: string }>(
        `suburbs?select=id,name&id=in.(${suburbIds.join(",")})`,
        revalidate,
      )
    : [];
  // A failed suburb lookup is not fatal — the shop cards still have their names
  // and addresses, which is the page's substance.
  const suburbs = new Map((suburbRows ?? []).map((s) => [s.id, s.name]));

  return rows
    .filter((r) => r.name && r.address && !EXCLUDED_SHOP_NAMES.has(r.name.trim()))
    .map((r) => ({
      id: String(r.id),
      name: r.name!.trim(),
      address: r.address!.trim(),
      suburb: r.suburb_id ? (suburbs.get(r.suburb_id) ?? null) : null,
      photoUrl: photoUrl(r.photo_path),
      pinUrl: photoUrl(r.pin_path),
    }));
}
