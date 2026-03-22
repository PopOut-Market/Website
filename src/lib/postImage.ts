const DEFAULT_CURRENCY = "AUD";

export function formatPrice(priceCents: number | null | undefined, currency?: string | null): string {
  const cents = Number(priceCents ?? 0);
  if (!Number.isFinite(cents) || cents <= 0) return "FREE";

  const amount = cents / 100;
  const formatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency || DEFAULT_CURRENCY,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function formatDistanceOrSuburb(distanceMeters: number | null, suburbName: string | null): string {
  if (distanceMeters !== null && Number.isFinite(distanceMeters)) {
    if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m away`;
    return `${(distanceMeters / 1000).toFixed(1)} km away`;
  }
  return suburbName || "Unknown area";
}

export function toConditionLabel(condition: string | null | undefined): string {
  const value = (condition || "").toLowerCase();
  const map: Record<string, string> = {
    new: "Brand New",
    like_new: "Like New",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    used: "Used",
  };
  return map[value] || (condition ? condition.replace(/_/g, " ") : "N/A");
}

export function getPostImageUrl(params: {
  supabaseUrl: string;
  thumbnailPath: string | null;
  updatedAt: string | null;
}): string | null {
  const { supabaseUrl, thumbnailPath, updatedAt } = params;
  if (!thumbnailPath) return null;

  const base = supabaseUrl.replace(/\/$/, "");
  const encodedPath = thumbnailPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const timestamp = updatedAt ? new Date(updatedAt).getTime() : Date.now();

  return `${base}/storage/v1/object/public/post_images/${encodedPath}?t=${timestamp}`;
}

export function getStoragePathUrl(supabaseUrl: string, storagePath: string): string {
  const base = supabaseUrl.replace(/\/$/, "");
  const encodedPath = storagePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${base}/storage/v1/object/public/post_images/${encodedPath}`;
}
