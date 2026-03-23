"use client";

import { AiPostDemo } from "@/components/ai-post-demo";
import { useSiteShell } from "@/components/site-chrome-context";
import { TranslationDemo } from "@/components/translation-demo";
import { POPOUT_BRAND_GRADIENT_TEXT_CLASS } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const { t, openLanguageModal } = useSiteShell();
  const [locationIndex, setLocationIndex] = useState(0);
  const [locationVisible, setLocationVisible] = useState(true);
  const locationCycleTimerRef = useRef<number | null>(null);
  const locationTransitionTimerRef = useRef<number | null>(null);

  const rotatingLocation = MARKET_SUBURBS[locationIndex] ?? "Melbourne";

  useEffect(() => {
    const runCycle = () => {
      setLocationVisible(false);

      locationTransitionTimerRef.current = window.setTimeout(() => {
        setLocationIndex((prev) => (prev + 1) % MARKET_SUBURBS.length);
        setLocationVisible(true);
        locationCycleTimerRef.current = window.setTimeout(runCycle, 3000);
      }, 620);
    };

    locationCycleTimerRef.current = window.setTimeout(runCycle, 3000);

    return () => {
      if (locationCycleTimerRef.current !== null) {
        window.clearTimeout(locationCycleTimerRef.current);
      }
      if (locationTransitionTimerRef.current !== null) {
        window.clearTimeout(locationTransitionTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center px-6 pb-16 pt-12 sm:pb-20 sm:pt-16 md:pt-24">
        <div className="flex max-w-4xl flex-col items-center text-center">
          <h1 className="text-balance text-[clamp(1.7rem,4vw,3rem)] font-semibold tracking-tight text-gray-800">
            <span className={POPOUT_BRAND_GRADIENT_TEXT_CLASS}>Popout Market</span>
            <span>, now in </span>
            <span
              aria-live="polite"
              className={`inline-block origin-left transform-gpu text-black transition-all duration-[620ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                locationVisible
                  ? "translate-y-0 scale-100 opacity-100 blur-0"
                  : "translate-y-1 scale-[0.97] opacity-0 blur-[0.8px]"
              }`}
            >
              {rotatingLocation}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-balance text-base text-gray-700 sm:text-lg">
            {t.heroSecondaryPrefix}{" "}
            <button
              type="button"
              onClick={() => openLanguageModal()}
              className="rounded-md px-1 font-bold text-gray-900 underline decoration-gray-400 underline-offset-4 transition hover:decoration-gray-800"
            >
              {t.heroSecondaryLink}
            </button>
            .
          </p>
        </div>
      </section>

      {/* ── Translation demo ─────────────────────────────── */}
      <TranslationDemo t={t} />

      {/* ── AI post demo ─────────────────────────────────── */}
      <AiPostDemo t={t} />
    </>
  );
}
