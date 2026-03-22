import { NextRequest, NextResponse } from "next/server";

import {
  formatDistanceOrSuburb,
  formatPrice,
  getPostImageUrl,
} from "@/lib/postImage";
import { getSupabaseAdmin } from "@/lib/getSupabaseAdmin";
import type { FeedFilter, PostListItem, PostsListResponse } from "@/types/post";

const VALID_FILTERS: FeedFilter[] = [
  "for_you",
  "freebies",
  "under_10",
  "electronics",
  "home-kitchen",
  "furniture",
  "fashion",
  "beauty",
  "books-education",
  "sports-outdoors",
  "mobility",
  "hobbies-collectibles",
  "kids-baby",
  "other",
];

function getFilter(value: string | null): FeedFilter {
  if (value && VALID_FILTERS.includes(value as FeedFilter)) {
    return value as FeedFilter;
  }
  return "for_you";
}

function toNumber(value: string | null, fallback: number): number {
  const n = Number(value ?? fallback);
  return Number.isFinite(n) ? n : fallback;
}

function mapFeedItem(row: Record<string, unknown>, supabaseUrl: string): PostListItem {
  const id = String(row.id ?? "");
  const title =
    String(row.title ?? row.post_title ?? row.localized_title ?? "Untitled listing");
  const priceCents = Number(row.price_cents ?? 0);
  const currency = String(row.currency ?? "AUD");
  const updatedAt = row.updated_at ? String(row.updated_at) : null;
  const suburbName = row.suburb_name ? String(row.suburb_name) : null;
  const distanceMeters =
    row.distance_meters === null || row.distance_meters === undefined
      ? null
      : Number(row.distance_meters);
  const thumbnailPath =
    row.thumbnail_path && String(row.thumbnail_path).length > 0
      ? String(row.thumbnail_path)
      : null;

  const thumbnailUrl = getPostImageUrl({
    supabaseUrl,
    thumbnailPath,
    updatedAt,
  });

  return {
    id,
    title,
    priceCents,
    currency,
    priceLabel: formatPrice(priceCents, currency),
    thumbnailUrl,
    distanceMeters: Number.isFinite(distanceMeters as number)
      ? (distanceMeters as number)
      : null,
    suburbName,
    distanceOrSuburb: formatDistanceOrSuburb(
      Number.isFinite(distanceMeters as number) ? (distanceMeters as number) : null,
      suburbName,
    ),
    updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const suburbId = params.get("suburbId");
  if (!suburbId) {
    return NextResponse.json(
      { error: "suburbId is required" },
      { status: 400 },
    );
  }

  const locale = params.get("locale") ?? "en";
  const filter = getFilter(params.get("filter"));
  const page = Math.max(0, Math.floor(toNumber(params.get("page"), 0)));
  const limit = Math.min(50, Math.max(1, Math.floor(toNumber(params.get("limit"), 20))));
  const offset = page * limit;

  const { data, error } = await getSupabaseAdmin.rpc("get_home_feed", {
    p_suburb_id: suburbId,
    p_locale: locale,
    p_filter: filter,
    p_offset: offset,
    p_limit: limit,
    p_jitter_seed: `web-${suburbId}-${locale}-${filter}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const rows = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
  const items = rows.map((row) => mapFeedItem(row, supabaseUrl));

  const response: PostsListResponse = {
    items,
    page,
    limit,
    hasMore: items.length === limit,
  };

  return NextResponse.json(response, { status: 200 });
}
