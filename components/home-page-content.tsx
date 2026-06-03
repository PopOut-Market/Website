"use client";

import { AiPostDemo } from "@/components/ai-post-demo";
import { HeroCarousel } from "@/components/hero-carousel";
import { useSiteShell } from "@/components/site-chrome-context";
import { TranslationDemo } from "@/components/translation-demo";
import { useSectionVisible } from "@/lib/use-section-visible";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect on the client (sync, pre-paint), useEffect on the server (no SSR warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function HomePageContent() {
  const { locale, t, openLanguageModal, localizePath } = useSiteShell();
  const { ref: heroRef, active: heroActive } = useSectionVisible({
    startThreshold: 0.12,
    stopThreshold: 0.05,
    pauseDelayMs: 700,
  });
  const reducedMotion = useReducedMotion();
  const [locationIndex, setLocationIndex] = useState(0);
  const [locationVisible, setLocationVisible] = useState(true);
  const locationCycleTimerRef = useRef<number | null>(null);
  const locationTransitionTimerRef = useRef<number | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [slotWidth, setSlotWidth] = useState<number>();

  const items = t.heroRotatingItems;
  const rotatingItem = items[locationIndex % items.length] ?? "";

  // Per-locale H1 template with {brand} + {item}; word order is locale-native.
  const titleParts = t.heroTitleTemplate.split(/(\{brand\}|\{item\})/);
  const rotatingClass = `text-black transition-opacity duration-300 ease-out ${
    locationVisible ? "opacity-100" : "opacity-0"
  }`;

  const clearLocationTimers = useCallback(() => {
    if (locationCycleTimerRef.current !== null) {
      window.clearTimeout(locationCycleTimerRef.current);
      locationCycleTimerRef.current = null;
    }
    if (locationTransitionTimerRef.current !== null) {
      window.clearTimeout(locationTransitionTimerRef.current);
      locationTransitionTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!heroActive || reducedMotion) {
      clearLocationTimers();
      return;
    }

    // Fade the word out → resize the slot to the next word while it's hidden → fade
    // the new word in at its settled width. The length eases between widths with no
    // overlap and no trailing gap (the word is never shown at a mismatched width).
    const runCycle = () => {
      setLocationVisible(false);
      locationTransitionTimerRef.current = window.setTimeout(() => {
        setLocationIndex((prev) => prev + 1);
        locationCycleTimerRef.current = window.setTimeout(() => {
          setLocationVisible(true);
          locationTransitionTimerRef.current = window.setTimeout(runCycle, 1500);
        }, 400);
      }, 300);
    };

    locationCycleTimerRef.current = window.setTimeout(runCycle, 1500);

    return clearLocationTimers;
  }, [heroActive, reducedMotion, clearLocationTimers]);

  // Measure the new word SYNCHRONOUSLY (before paint) so the slot's width transition
  // starts immediately on change and reliably settles before the word fades back in.
  useIsoLayoutEffect(() => {
    const w = measureRef.current?.offsetWidth;
    if (w) setSlotWidth(w); // ignore 0 → slot stays auto (= word width), never collapses
  }, [rotatingItem]);

  // Re-measure after first paint (layout settled) and on font resize (the title is
  // clamp()-sized, so word widths change). Zero widths are ignored, as above.
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (w) setSlotWidth(w);
    };
    const raf = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section
        ref={heroRef as React.RefObject<HTMLElement>}
        className="flex flex-col items-center justify-center bg-white px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:pt-24"
      >
        <div className="flex max-w-4xl flex-col items-center text-center">
          <h1 className="whitespace-nowrap text-[clamp(1rem,4.5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-black">
            {titleParts.map((part, i) => {
              if (part === "{brand}") {
                return (
                  <span key={i} className="text-black">
                    PopOut Market
                  </span>
                );
              }
              if (part === "{item}") {
                return (
                  <span
                    key={i}
                    className="relative inline-block transition-[width] duration-[360ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    style={{ width: slotWidth }}
                  >
                    {/* Invisible in-flow measurer: sets height/baseline + the target width. */}
                    <span ref={measureRef} aria-hidden className="invisible whitespace-nowrap">
                      {rotatingItem}
                    </span>
                    {/* Visible word — only ever shown at the settled width (it fades while
                        the slot resizes), so it never overflows or leaves a gap. */}
                    <span
                      aria-live="polite"
                      className={`absolute left-0 top-0 whitespace-nowrap ${rotatingClass}`}
                    >
                      {rotatingItem}
                    </span>
                  </span>
                );
              }
              return part ? <span key={i}>{part}</span> : null;
            })}
          </h1>

          <p className="mt-4 max-w-2xl text-balance text-base text-black/55 sm:text-lg">
            {t.heroSecondaryPrefix}
            <button
              type="button"
              onClick={() => openLanguageModal()}
              className="rounded-sm font-bold text-black transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              {t.heroSecondaryLink}
            </button>
            {t.heroSecondarySuffix}
          </p>
        </div>

        <div className="mt-10 w-full sm:mt-12">
          <HeroCarousel
            locale={locale}
            noImageAria={t.marketPostNoImageAria}
            loadingListingsAria={t.marketSupabaseLoadingAria}
          />
        </div>

        <Link
          href={localizePath("/market")}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-500 px-8 py-4 text-base font-bold text-white shadow-[0_5px_0_0_var(--color-brand-700)] transition-all duration-100 hover:bg-brand-600 active:translate-y-[5px] active:shadow-[0_0_0_0_var(--color-brand-700)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 motion-reduce:transition-none sm:mt-10 sm:text-lg"
        >
          {t.heroExploreCta}
        </Link>
      </section>

      <TranslationDemo t={t} />
      <AiPostDemo t={t} />
    </>
  );
}
