"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { useEffect, useRef } from "react";

export type MapSuburb = {
  id: number;
  name: string;
  lat: number | null;
  lng: number | null;
  users: number;
  banned: number;
  geometry: unknown;
};

/**
 * Sequential ramp: one hue (orange), light -> dark, so "darker = more users" is
 * the only thing the colour says. Steps were picked for monotonically falling
 * OKLab lightness (0.95 -> 0.52) with a near-constant hue, which is what keeps a
 * choropleth readable — and readable in greyscale, where lightness is all that
 * survives. Zero users is deliberately NOT the palest orange: it is grey, so an
 * empty suburb can never be misread as a faint one.
 *
 * Buckets are fixed, not quantile: user density here is extremely skewed (the
 * CBD alone holds a quarter of all users), and an equal-count scale would paint
 * a 2-user suburb the same as a 20-user one just to fill its bins.
 */
const NO_USERS_FILL = "#e9edf2";
export const USER_BUCKETS: { min: number; label: string; fill: string }[] = [
  { min: 100, label: "100+", fill: "#a84a00" },
  { min: 50, label: "50–99", fill: "#dd6a0c" },
  { min: 25, label: "25–49", fill: "#f98c33" },
  { min: 10, label: "10–24", fill: "#ffb069" },
  { min: 5, label: "5–9", fill: "#ffd0a4" },
  { min: 1, label: "1–4", fill: "#ffe9d5" },
  { min: 0, label: "0", fill: NO_USERS_FILL },
];

export function bucketFill(users: number): string {
  for (const b of USER_BUCKETS) {
    if (users >= b.min) return b.fill;
  }
  return NO_USERS_FILL;
}

/**
 * There is NO tile layer under this map, on purpose. The 336 active suburbs
 * tile the whole metro area contiguously, so the polygons draw a recognisable
 * Melbourne — Port Phillip Bay and all — with nothing behind them, and a plain
 * ground lets the sequential fills read at full strength instead of fighting
 * roads and labels.
 *
 * Do not "fix" this by adding CARTO tiles back: as of 2026-09 every keyless
 * CARTO basemap (Voyager and Positron alike) is stamped with an "API KEY
 * REQUIRED" watermark, so a tile layer here would need a paid key to look like
 * anything but a mistake.
 */
const MELBOURNE_FALLBACK: [number, number] = [-37.8136, 144.9631];
const INITIAL_ZOOM = 10;

/**
 * Every programmatic view change is unanimated. Leaflet queues an animated
 * fitBounds behind a CSS transition and simply drops any view change that
 * arrives while one is still running — which is exactly what "click a suburb,
 * then click Whole city" does. Instant jumps always land. Wheel and button
 * zooming, which the user drives, still animate normally.
 */
const FIT_WHOLE: Leaflet.FitBoundsOptions = { padding: [16, 16], animate: false };

const BORDER = "#ffffff"; // a hairline gap between neighbours, so shapes stay separable
const BORDER_HOVER = "#0f172a";

function baseStyle(users: number): Leaflet.PathOptions {
  return {
    color: BORDER,
    weight: 1,
    opacity: 1,
    fillColor: bucketFill(users),
    fillOpacity: 1,
  };
}

type Props = {
  suburbs: MapSuburb[];
  /** Suburb to frame and outline — set by a click on the map or on a ranked row. */
  focusId?: number | null;
  onSelect?: (id: number) => void;
  /**
   * Bumping this refits the map to every suburb and is the way out of a zoomed-in
   * view. A counter rather than a boolean, so pressing "Whole city" twice works.
   */
  resetToken?: number;
  className?: string;
};

export function SuburbUserMap({
  suburbs,
  focusId = null,
  onSelect,
  resetToken = 0,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const layersRef = useRef<Map<number, Leaflet.Path>>(new Map());
  const groupRef = useRef<Leaflet.GeoJSON | null>(null);
  // Kept in a ref so the focus effect below can restyle the previous pick
  // without re-running (and so re-rendering the map layer).
  const focusedRef = useRef<number | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          center: MELBOURNE_FALLBACK,
          zoom: INITIAL_ZOOM,
          // Quarter-steps, because whole-number zoom rounds DOWN to the level
          // that still contains the bounds — greater Melbourne needs ~9.6, so
          // the default snap would frame it at 9 and leave the city a stamp in
          // the middle of the card.
          zoomSnap: 0.25,
          zoomDelta: 0.5,
          minZoom: 8,
          // Nothing is drawn but the polygons, so there is no detail to reveal
          // past the point where a single inner-city suburb fills the card.
          maxZoom: 15,
          attributionControl: false,
        });
      }
      const map = mapRef.current;

      groupRef.current?.remove();
      groupRef.current = null;
      layersRef.current.clear();

      const features = suburbs
        .filter((s) => s.geometry)
        .map((s) => ({
          type: "Feature" as const,
          properties: { id: s.id, name: s.name, users: s.users, banned: s.banned },
          geometry: s.geometry,
        }));
      if (features.length === 0) return;

      const group = L.geoJSON({ type: "FeatureCollection", features } as GeoJSON.GeoJsonObject, {
        style: (feature) => baseStyle((feature?.properties as { users: number }).users),
        onEachFeature: (feature, layer) => {
          const p = feature.properties as { id: number; name: string; users: number };
          layersRef.current.set(p.id, layer as Leaflet.Path);
          layer.bindTooltip(
            `<span style="font-weight:600">${p.name}</span><br>${p.users.toLocaleString()} ${
              p.users === 1 ? "user" : "users"
            }`,
            { sticky: true, direction: "top", opacity: 1 },
          );
          layer.on({
            mouseover: () => {
              (layer as Leaflet.Path).setStyle({ color: BORDER_HOVER, weight: 2 });
              (layer as Leaflet.Path).bringToFront();
            },
            mouseout: () => {
              // Don't strip the outline off the suburb the list has selected.
              if (focusedRef.current !== p.id) {
                (layer as Leaflet.Path).setStyle({ color: BORDER, weight: 1 });
              }
            },
            click: () => onSelectRef.current?.(p.id),
          });
        },
      }).addTo(map);
      groupRef.current = group;

      const bounds = group.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, FIT_WHOLE);
    })();

    return () => {
      cancelled = true;
    };
  }, [suburbs]);

  // Frame + outline the selected suburb, and clear the previous one's outline.
  useEffect(() => {
    const prev = focusedRef.current;
    focusedRef.current = focusId;
    if (prev !== null && prev !== focusId) {
      layersRef.current.get(prev)?.setStyle({ color: BORDER, weight: 1 });
    }
    if (focusId === null) return;
    const layer = layersRef.current.get(focusId);
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.setStyle({ color: BORDER_HOVER, weight: 2.5 });
    layer.bringToFront();
    const b = (layer as unknown as { getBounds: () => Leaflet.LatLngBounds }).getBounds();
    // Capped well short of the container: filling the card with one suburb
    // strips away every neighbour, and "where is this?" is half the question a
    // click on the ranked list is asking. The black outline does the pointing.
    if (b.isValid()) map.fitBounds(b, { padding: [60, 60], maxZoom: 12.5, animate: false });
  }, [focusId]);

  // "Whole city" — refit to every suburb. Skipped on mount (token 0) so it
  // cannot fight the initial fitBounds, which may still be awaiting Leaflet.
  useEffect(() => {
    if (resetToken === 0) return;
    const map = mapRef.current;
    const bounds = groupRef.current?.getBounds();
    if (map && bounds?.isValid()) map.fitBounds(bounds, FIT_WHOLE);
  }, [resetToken]);

  // Tear the map down only on real unmount (it survives data refreshes above).
  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      groupRef.current = null;
      layersRef.current.clear();
    };
  }, []);

  // `isolate` keeps Leaflet's panes (z-index 200–700) under the legend overlay.
  // The inline background overrides Leaflet's own grey default — with no tile
  // layer, this colour is the bay and everything outside the service area.
  return (
    <div
      ref={containerRef}
      className={className ? `${className} isolate` : "isolate"}
      style={{ backgroundColor: "#f8fafc" }}
      // A region, not role="img": Leaflet's zoom buttons live inside this div,
      // and role="img" would hide them from assistive tech.
      role="region"
      aria-label="Map of Melbourne suburbs shaded by user count. The same figures are listed in the ranked table beside it."
    />
  );
}

/** Scale legend. A choropleth is unreadable without one — the colour has no meaning on its own. */
export function UserMapLegend() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
        Users per suburb
      </p>
      <div className="flex items-center gap-3">
        {[...USER_BUCKETS].reverse().map((b) => (
          <div key={b.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm ring-1 ring-inset ring-slate-900/10"
              style={{ backgroundColor: b.fill }}
              aria-hidden="true"
            />
            <span className="text-[11px] tabular-nums text-slate-600">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
