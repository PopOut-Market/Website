import { marketImagesBucketName } from "@/lib/supabase/browser-client";

function supabaseProjectOrigin(): string {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  )
    .trim()
    .replace(/\/$/, "");
}

/**
 * Same idea as Expo `getPostImageUrl`: public bucket object URL + optional `?t=` from `updated_at`.
 * Set `NEXT_PUBLIC_SUPABASE_MARKET_IMAGES_BUCKET` to your posts image bucket (e.g. same as app `BUCKET`).
 */
export function getPostImageUrl(
  storagePath: string | null | undefined,
  updatedAt?: string | null,
): string | null {
  if (!storagePath || storagePath === "MISSING_THUMBNAIL") {
    return null;
  }

  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    if (!updatedAt) {
      return storagePath;
    }
    const ts = new Date(updatedAt).getTime();
    if (!Number.isFinite(ts)) {
      return storagePath;
    }
    const sep = storagePath.includes("?") ? "&" : "?";
    return `${storagePath}${sep}t=${ts}`;
  }

  const bucket = marketImagesBucketName();
  if (!bucket) {
    return null;
  }

  const origin = supabaseProjectOrigin();
  if (!origin) {
    return null;
  }

  const normalizedPath = storagePath.replace(/^\/+/, "");
  const pathSegments = normalizedPath.split("/").map((seg) => encodeURIComponent(seg));
  const objectPath = pathSegments.join("/");
  const base = `${origin}/storage/v1/object/public/${bucket}/${objectPath}`;

  if (!updatedAt) {
    return base;
  }

  const ts = new Date(updatedAt).getTime();
  return Number.isFinite(ts) ? `${base}?t=${ts}` : base;
}
