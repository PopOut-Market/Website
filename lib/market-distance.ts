import { haversineMeters } from "@/lib/geo/meetup-point";
import type { MarketProduct } from "@/lib/market-product";

export function formatMarketDistanceKm(meters: number | null | undefined, kmSuffix: string): string {
  if (meters == null || Number.isNaN(meters)) {
    return `— ${kmSuffix}`;
  }
  const km = meters / 1000;
  return `${km < 10 ? km.toFixed(1) : km.toFixed(0)} ${kmSuffix}`;
}

/** When the browser has a position, replace distance labels for rows that include `meetupPoint`. */
export function applyUserGeolocationToProductDistances(
  products: MarketProduct[],
  userLat: number | undefined,
  userLng: number | undefined,
  kmSuffix: string,
): MarketProduct[] {
  if (userLat == null || userLng == null || !Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    return products;
  }
  return products.map((p) => {
    const pt = p.meetupPoint;
    if (!pt || !Number.isFinite(pt.lat) || !Number.isFinite(pt.lng)) {
      return p;
    }
    const m = haversineMeters(userLat, userLng, pt.lat, pt.lng);
    return { ...p, distanceLabel: formatMarketDistanceKm(m, kmSuffix) };
  });
}
