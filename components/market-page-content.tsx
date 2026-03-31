"use client";

import { MarketFeed } from "@/components/market-feed";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import {
  DEFAULT_MARKET_SUBURB,
  MARKET_SUBURBS,
  isMarketSuburb,
  readStoredMarketSuburb,
  writeStoredMarketSuburb,
  type MarketSuburb,
} from "@/lib/site-suburbs";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function MarketPageContent() {
  const { t, locale } = useSiteShell();
  const searchParams = useSearchParams();
  const [area, setArea] = useState<MarketSuburb>(DEFAULT_MARKET_SUBURB);

  useLayoutEffect(() => {
    const areaParam = searchParams.get("area");
    if (areaParam && isMarketSuburb(areaParam)) {
      setArea(areaParam);
      writeStoredMarketSuburb(areaParam);
      return;
    }
    const stored = readStoredMarketSuburb();
    if (stored) {
      setArea(stored);
    }
  }, [searchParams]);
  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const areaModalRef = useRef<HTMLDivElement | null>(null);
  const areaTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
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
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section className={`${SHELL_X} flex min-h-0 flex-1 flex-col`}>
      <div className={`${INNER_MAX} flex min-h-0 flex-1 flex-col`}>
        <div className="flex w-full shrink-0 justify-start pt-1">
          <button
            ref={areaTriggerRef}
            type="button"
            onClick={() => setAreaModalOpen((open) => !open)}
            aria-haspopup="dialog"
            aria-expanded={areaModalOpen}
            aria-label={`${t.marketAreaPickerAria}: ${area}`}
            className="inline-flex h-9 max-w-full items-center gap-1.5 rounded-[11px] border border-gray-200 bg-white/90 px-3 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-xl transition hover:border-gray-300 hover:bg-white"
          >
            <span className="truncate">{area}</span>
            <svg
              className={`h-4 w-4 shrink-0 text-gray-600 transition ${areaModalOpen ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.12l3.71-3.89a.75.75 0 1 1 1.08 1.04l-4.25 4.45a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <MarketFeed area={area} locale={locale} t={t} />
      </div>

      {areaModalOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/25 px-3 py-4 backdrop-blur-[2px] sm:px-4">
          <div
            ref={areaModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-area-modal-title"
            className="w-full max-w-xl max-h-[84vh] overflow-y-auto rounded-[20px] border border-white/35 bg-white/85 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:rounded-[24px] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="market-area-modal-title" className="text-lg font-semibold text-gray-900 sm:text-xl">
                  {t.marketAreaModalTitle}
                </h2>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">{t.marketAreaModalHint}</p>
              </div>
              <button
                type="button"
                onClick={() => setAreaModalOpen(false)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:text-gray-900"
                aria-label={t.marketAreaCloseAria}
              >
                ×
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {MARKET_SUBURBS.map((name) => {
                const selected = name === area;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setArea(name);
                      writeStoredMarketSuburb(name);
                      setAreaModalOpen(false);
                    }}
                    className={`rounded-2xl border px-3 py-2.5 text-left text-[1rem] font-semibold transition ${
                      selected
                        ? "border-blue-300 bg-blue-50/90 text-gray-900"
                        : "border-gray-200 bg-white/80 text-gray-900 hover:border-gray-300 hover:bg-white"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      {name}
                      {selected ? <span className="text-xs font-semibold text-blue-700">✓</span> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
