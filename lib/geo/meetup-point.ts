/** Parse PostGIS / PostgREST GeoJSON-ish `meetup_location` into WGS84 degrees. */
export function parseMeetupLocationPoint(value: unknown): { lat: number; lng: number } | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const wkt = /^POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i.exec(trimmed);
    if (wkt) {
      const lng = Number(wkt[1]);
      const lat = Number(wkt[2]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      return parseMeetupLocationPoint(parsed);
    } catch {
      return null;
    }
  }

  if (typeof value !== "object") {
    return null;
  }

  const o = value as Record<string, unknown>;

  if (o.type === "Point" && Array.isArray(o.coordinates) && o.coordinates.length >= 2) {
    const lng = Number(o.coordinates[0]);
    const lat = Number(o.coordinates[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  if (Array.isArray(o.coordinates) && o.coordinates.length >= 2) {
    const lng = Number(o.coordinates[0]);
    const lat = Number(o.coordinates[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  if (typeof o.lat === "number" && typeof o.lng === "number") {
    if (Number.isFinite(o.lat) && Number.isFinite(o.lng)) {
      return { lat: o.lat, lng: o.lng };
    }
  }

  return null;
}

/** Great-circle distance in metres (WGS84). */
export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
