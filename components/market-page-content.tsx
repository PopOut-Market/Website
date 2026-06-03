"use client";

import { MarketFeed } from "@/components/market-feed";
import { SuburbBoundaryMap } from "@/components/suburb-boundary-map";
import { useSiteShell } from "@/components/site-chrome-context";
import { SUBURB_COORDS } from "@/lib/market-map";
import { marketSuburbDbId } from "@/lib/market-suburb-ids";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import {
  DEFAULT_MARKET_SUBURB,
  MARKET_SUBURBS,
  type MarketSuburb,
} from "@/lib/site-suburbs";
import { suburbDisplayLabel } from "@/lib/suburb-display";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/browser-client";
import {
  fetchActiveSuburbs,
  matchSuburbByName,
  type ActiveSuburb,
} from "@/lib/supabase/fetch-active-suburbs";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** New key (the frozen `popout-market-suburb` only validated the 8 picker values). */
const SELECTION_STORAGE_KEY = "popout-market-suburb-v2";

/** Seed an ActiveSuburb from the frozen picker set — instant render + offline fallback. */
function seedSuburb(name: MarketSuburb): ActiveSuburb {
  return { id: marketSuburbDbId(name) ?? 0, name, center: SUBURB_COORDS[name] };
}

const SEED_SUBURBS: ActiveSuburb[] = MARKET_SUBURBS.map(seedSuburb);

function readStoredSuburbName(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(SELECTION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeSuburbName(name: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(SELECTION_STORAGE_KEY, name);
  } catch {
    /* ignore quota / private mode */
  }
}

export function MarketPageContent() {
  const { t, locale } = useSiteShell();
  const searchParams = useSearchParams();

  const [suburbs, setSuburbs] = useState<ActiveSuburb[]>(SEED_SUBURBS);
  const [selected, setSelected] = useState<ActiveSuburb>(() =>
    seedSuburb(DEFAULT_MARKET_SUBURB),
  );

  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const areaModalRef = useRef<HTMLDivElement | null>(null);
  const areaTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mapModalRef = useRef<HTMLDivElement | null>(null);
  /** Set once the user picks from the list, so the in-flight fetch can't override them. */
  const userPickedRef = useRef(false);

  // Load the live active-suburb list, then resolve the selection
  // (?area= link → stored → default) against it.
  useEffect(() => {
    const param = searchParams.get("area");
    const wanted = param ?? readStoredSuburbName() ?? DEFAULT_MARKET_SUBURB;

    // Resolve against the seed set first so links work pre-fetch / offline.
    const seedMatch = matchSuburbByName(SEED_SUBURBS, wanted);
    if (seedMatch) {
      setSelected(seedMatch);
      storeSuburbName(seedMatch.name);
    }

    if (!isSupabaseBrowserConfigured()) {
      return;
    }
    let cancelled = false;
    fetchActiveSuburbs(getSupabaseBrowserClient())
      .then((list) => {
        const fallback = list[0];
        if (cancelled || !fallback) {
          return;
        }
        setSuburbs(list);
        // If the user picked from the seed list while this was loading, keep their
        // choice (its id/center from the seed 8 are valid) — don't snap them back.
        if (userPickedRef.current) {
          return;
        }
        const match =
          matchSuburbByName(list, wanted) ??
          matchSuburbByName(list, DEFAULT_MARKET_SUBURB) ??
          fallback;
        setSelected(match);
        storeSuburbName(match.name);
      })
      .catch(() => {
        /* keep the seed set */
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (mapModalRef.current && !mapModalRef.current.contains(target)) {
        setMapOpen(false);
      }
      if (areaTriggerRef.current?.contains(target)) {
        return;
      }
      if (areaModalRef.current && !areaModalRef.current.contains(target)) {
        setAreaModalOpen(false);
      }
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAreaModalOpen(false);
        setMapOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function chooseSuburb(suburb: ActiveSuburb) {
    userPickedRef.current = true;
    setSelected(suburb);
    storeSuburbName(suburb.name);
    setAreaModalOpen(false);
  }

  const selectedLabel = suburbDisplayLabel(selected.name);

  return (
    <section className={`${SHELL_X} flex min-h-0 flex-1 flex-col bg-surface-base`}>
      <div className={`${INNER_MAX} flex min-h-0 flex-1 flex-col`}>
        <div className="w-full shrink-0 pb-6 pt-8">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-black sm:text-2xl">
            <button
              ref={areaTriggerRef}
              type="button"
              onClick={() => setAreaModalOpen((open) => !open)}
              aria-haspopup="dialog"
              aria-expanded={areaModalOpen}
              aria-label={`${t.marketAreaPickerAria}: ${selectedLabel}`}
              className="group inline-flex items-center gap-1.5 rounded text-black transition-transform hover:-translate-y-px motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              <span className="underline-offset-4 group-hover:underline">{selectedLabel}</span>
              <svg
                className={`h-[1em] w-[1em] shrink-0 transition-transform ${areaModalOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M3 7l7 6 7-6z" />
              </svg>
            </button>
          </h1>
        </div>

        <div className="w-full shrink-0 pb-5">
          <div className="group relative h-28 w-full overflow-hidden rounded-2xl border border-black/5 bg-surface-raised shadow-card transition-colors hover:border-black/25 sm:h-36">
            <SuburbBoundaryMap
              suburbId={selected.id}
              center={selected.center}
              title={t.marketSuburbMapTitle.replace("{suburb}", selectedLabel)}
              className="pointer-events-none absolute inset-0 h-full w-full border-0"
            />
            <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
              </svg>
              {t.marketSeoIntroNearLabel} {selectedLabel}
            </span>
            <span className="pointer-events-none absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black/60 shadow-card transition-colors group-hover:text-black">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              aria-label={`${t.marketSeoIntroNearLabel} ${selectedLabel}`}
              className="absolute inset-0 z-[1] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-700"
            />
          </div>
        </div>

        <MarketFeed
          suburbId={selected.id}
          suburbName={selected.name}
          locale={locale}
          t={t}
        />
      </div>

      {areaModalOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4 py-4 sm:px-6">
          <div
            ref={areaModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-area-modal-title"
            className="w-full max-w-xl max-h-[84vh] overflow-y-auto rounded-3xl border border-black/10 bg-white p-4 shadow-card sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="market-area-modal-title" className="text-lg font-semibold text-black sm:text-xl">
                  {t.marketAreaModalTitle}
                </h2>
                <p className="mt-1 text-xs text-black/55 sm:text-sm">{t.marketAreaModalHint}</p>
              </div>
              <button
                type="button"
                onClick={() => setAreaModalOpen(false)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-surface-base text-black/55 transition-colors hover:border-brand-500 hover:text-black"
                aria-label={t.marketAreaCloseAria}
              >
                ×
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {suburbs.map((suburb) => {
                const isSelected = suburb.id === selected.id;
                return (
                  <button
                    key={suburb.id}
                    type="button"
                    onClick={() => chooseSuburb(suburb)}
                    className={`rounded-2xl border px-4 py-3 text-left text-base font-semibold transition-colors ${
                      isSelected
                        ? "border-brand-500 bg-brand-tint text-black"
                        : "border-black/10 bg-surface-base text-black hover:border-brand-500"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      {suburb.name}
                      {isSelected ? <span className="text-xs font-semibold text-brand-700">✓</span> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {mapOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4 sm:p-6">
          <div
            ref={mapModalRef}
            role="dialog"
            aria-modal="true"
            aria-label={selectedLabel}
            className="flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-card"
          >
            <SuburbBoundaryMap
              suburbId={selected.id}
              center={selected.center}
              interactive
              title={selectedLabel}
              className="h-[60vh] w-full border-0"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
