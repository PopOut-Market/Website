"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/browser-client";
import { fetchSuburbBoundary, type SuburbBoundary } from "@/lib/supabase/fetch-suburb-boundary";
import { useEffect, useRef } from "react";

const FILL_COLOR = "#404040"; // neutral grey — a faint wash over the selected suburb
const OUTLINE_COLOR = "#171717"; // near-black — a clearly visible dotted boundary
const MARKER_COLOR = "#ff8c00"; // brand orange — the meet-up pin

// OpenStreetMap's standard raster tiles. Keyless; attribution is required. The
// OSMF tile policy wants this exact host (no a/b/c subdomains) and a Referer,
// which the site's `strict-origin-when-cross-origin` policy already sends.
// Light use from a website is fine; bulk prefetching or offline use is not.
//
// Replaced CARTO Voyager (2026-09): CARTO's keyless endpoint now answers every
// request with a blank tile reading "API KEY REQUIRED" — no map at all, and
// HTTP 200, so nothing errors. An invalid key gets the same blank tile. To go
// back to Voyager, register a CARTO basemaps key (free for commercial use up to
// 1M requests/month) and use CARTO's documented form,
// `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=…`.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const TILE_MAX_ZOOM = 19; // the standard layer's deepest level

const MELBOURNE_FALLBACK: [number, number] = [-37.8136, 144.9631];
const INITIAL_ZOOM = 13;
const MARKER_ZOOM = 16; // street-level framing when a pin is shown

type SuburbBoundaryMapProps = {
  /** `public.suburbs.id` — drives the boundary RPC. */
  suburbId: number;
  /** [lat, lng] centroid for initial framing (optional; map fits to the boundary). */
  center?: [number, number] | null;
  /** [lat, lng] for a meet-up pin. When set, the map centres on it at street zoom. */
  marker?: [number, number] | null;
  /** Full pan/zoom (modal). Default is a static framed preview (banner). */
  interactive?: boolean;
  className?: string;
  title?: string;
};

export function SuburbBoundaryMap({
  suburbId,
  center,
  marker,
  interactive = false,
  className,
  title,
}: SuburbBoundaryMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const boundaryRef = useRef<Leaflet.GeoJSON | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);

  // Primitive deps so a freshly-built `marker` array each render doesn't re-run us.
  const markerLat = marker?.[0] ?? null;
  const markerLng = marker?.[1] ?? null;

  useEffect(() => {
    let cancelled = false;
    const hasMarker = markerLat !== null && markerLng !== null;
    const initialCenter: [number, number] = hasMarker
      ? [markerLat, markerLng]
      : (center ?? MELBOURNE_FALLBACK);
    const initialZoom = hasMarker ? MARKER_ZOOM : INITIAL_ZOOM;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) {
        return;
      }

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: interactive,
          doubleClickZoom: interactive,
          touchZoom: interactive,
          boxZoom: interactive,
          keyboard: interactive,
        });
        L.tileLayer(TILE_URL, {
          attribution: TILE_ATTRIBUTION,
          maxZoom: TILE_MAX_ZOOM,
        }).addTo(mapRef.current);
      }
      const map = mapRef.current;
      // Fixed zoom (not getZoom()) so a suburb whose boundary is slow/missing isn't
      // framed at the previous suburb's fitted zoom; fitBounds overrides when it loads.
      map.setView(initialCenter, initialZoom);

      // Drop the previous overlays.
      boundaryRef.current?.remove();
      boundaryRef.current = null;
      markerRef.current?.remove();
      markerRef.current = null;

      // Meet-up pin (brand teardrop drawn as a divIcon so we need no image assets).
      if (hasMarker) {
        const icon = L.divIcon({
          className: "",
          html: `<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${MARKER_COLOR}" stroke="#ffffff" stroke-width="1.5"/><circle cx="12" cy="9" r="2.6" fill="#ffffff"/></svg>`,
          iconSize: [30, 30],
          iconAnchor: [15, 28],
        });
        markerRef.current = L.marker([markerLat, markerLng], {
          icon,
          interactive: false,
          keyboard: false,
        }).addTo(map);
      }

      let boundary: SuburbBoundary | null = null;
      if (suburbId > 0 && isSupabaseBrowserConfigured()) {
        try {
          boundary = await fetchSuburbBoundary(getSupabaseBrowserClient(), suburbId);
        } catch {
          boundary = null;
        }
      }
      if (cancelled || !boundary) {
        return;
      }

      // Leaflet's GeoJSON layer handles MultiPolygon + holes natively and flips
      // [lng,lat] -> LatLng for us. dashArray + round caps = a dotted outline.
      const layer = L.geoJSON(boundary as unknown as GeoJSON.GeoJsonObject, {
        interactive: false,
        style: {
          color: OUTLINE_COLOR,
          weight: 3,
          opacity: 1,
          dashArray: "1 9",
          lineCap: "round",
          fillColor: FILL_COLOR,
          fillOpacity: 0.15,
        },
      }).addTo(map);
      boundaryRef.current = layer;

      // Frame to the suburb only when there's no pin to stay centred on.
      if (!hasMarker) {
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: interactive ? [28, 28] : [12, 12] });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // `center` is intentionally omitted: it only seeds initial framing, and the
    // boundary's fitBounds overrides it — re-running on centroid changes for the
    // same suburb would refetch the same boundary needlessly.
  }, [suburbId, interactive, markerLat, markerLng]);

  // Tear the map down only on real unmount (survives suburb changes above).
  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      boundaryRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // `isolate` keeps Leaflet's internal panes (z-index 200–700) from painting over
  // sibling overlays (the banner's label pill / expand cue / click target).
  return (
    <div
      ref={containerRef}
      className={className ? `${className} isolate` : "isolate"}
      // A bare <div> exposes no role, so `aria-label` on it was announced by
      // nothing. The static banner is a picture of a suburb; the interactive
      // instance is a region the reader can pan and zoom, and must NOT be
      // `img` or its Leaflet controls disappear from assistive technology.
      role={interactive ? "region" : "img"}
      aria-label={title}
    />
  );
}
