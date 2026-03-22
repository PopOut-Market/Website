import { NextRequest, NextResponse } from "next/server";

import { parseEwkbPoint } from "@/lib/ewkb";
import {
  formatPrice,
  getPostImageUrl,
  getStoragePathUrl,
  toConditionLabel,
} from "@/lib/postImage";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { PostDetail, PostDetailResponse } from "@/types/post";

type PostI18n = {
  title: string | null;
  description: string | null;
  meetup_label: string | null;
  locale: string | null;
};

type PostPhoto = {
  storage_path: string | null;
  sort_order: number | null;
};

function chooseI18n(rows: PostI18n[], locale: string): PostI18n | null {
  if (!rows.length) return null;
  return (
    rows.find((x) => (x.locale ?? "").toLowerCase() === locale.toLowerCase()) ||
    rows.find((x) => (x.locale ?? "").toLowerCase() === "en") ||
    rows[0]
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const postId = params.id;
  const locale = request.nextUrl.searchParams.get("locale") ?? "en";

  const { data, error } = await supabaseAdmin
    .from("posts")
    .select(`
      id, price_cents, currency, condition, status, is_deliverable, accept_offers,
      photo_count, interest_count, created_at, updated_at, thumbnail_path, seller_id, meetup_location,
      post_i18n ( title, description, meetup_label, locale ),
      post_photos ( storage_path, sort_order ),
      suburbs!posts_suburb_id_fkey ( name ),
      categories!posts_category_id_fkey ( slug, name )
    `)
    .eq("id", postId)
    .in("status", ["available"])
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  const i18nRows = Array.isArray(data.post_i18n)
    ? (data.post_i18n as PostI18n[])
    : [];
  const i18n = chooseI18n(i18nRows, locale);

  const photosRaw = Array.isArray(data.post_photos)
    ? (data.post_photos as PostPhoto[])
    : [];
  const photos = photosRaw
    .filter((p) => Boolean(p.storage_path))
    .sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));

  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const imageUrls = photos.map((photo) => ({
    url: getStoragePathUrl(supabaseUrl, String(photo.storage_path)),
    sortOrder: photo.sort_order ?? 0,
  }));

  if (imageUrls.length === 0) {
    const fallback = getPostImageUrl({
      supabaseUrl,
      thumbnailPath: data.thumbnail_path ?? null,
      updatedAt: data.updated_at ?? null,
    });
    if (fallback) {
      imageUrls.push({ url: fallback, sortOrder: 0 });
    }
  }

  const suburbName = data.suburbs?.name ? String(data.suburbs.name) : null;
  const locationLabel = i18n?.meetup_label?.trim() || suburbName || "N/A";

  const detail: PostDetail = {
    id: String(data.id),
    title: i18n?.title?.trim() || "Untitled listing",
    description: i18n?.description?.trim() || "No description.",
    priceCents: Number(data.price_cents ?? 0),
    currency: String(data.currency ?? "AUD"),
    priceLabel: formatPrice(
      Number(data.price_cents ?? 0),
      String(data.currency ?? "AUD"),
    ),
    condition: toConditionLabel(data.condition),
    quantity: "N/A",
    locationLabel,
    latLng:
      typeof data.meetup_location === "string"
        ? parseEwkbPoint(data.meetup_location)
        : null,
    images: imageUrls,
    categorySlug: data.categories?.slug ? String(data.categories.slug) : null,
    categoryName: data.categories?.name ? String(data.categories.name) : null,
    isDeliverable: Boolean(data.is_deliverable),
    acceptOffers: Boolean(data.accept_offers),
    photoCount: Number(data.photo_count ?? imageUrls.length),
    interestCount: Number(data.interest_count ?? 0),
    updatedAt: data.updated_at ? String(data.updated_at) : null,
  };

  const response: PostDetailResponse = { item: detail };
  return NextResponse.json(response, { status: 200 });
}
