import {
  fallbackShareImageUrl,
  fetchSharePreview,
  isHousingShareToken,
} from "@/lib/share-link/preview";
import { getSharePreviewSupabaseClient } from "@/lib/supabase/share-preview-client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Messengers may fetch the thumbnail long after fetching its HTML. Keep the
// OG URL stable and sign only the current, anonymously visible cover on demand.
export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const token = (await context.params).token.toLowerCase();
  const preview = isHousingShareToken(token) ? await fetchSharePreview(token) : null;
  let url = fallbackShareImageUrl();
  if (preview?.kind === "housing" && preview.photoPath) {
    const { data } = await getSharePreviewSupabaseClient()
      .storage.from("housing_upload_images")
      .createSignedUrl(preview.photoPath, 60);
    if (data?.signedUrl) url = data.signedUrl;
  }
  return NextResponse.redirect(url, {
    status: 302,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
