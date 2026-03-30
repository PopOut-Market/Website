"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { POPOUT_BRAND_GRADIENT_TEXT_CLASS } from "@/lib/site-config";
import type { SiteCopy } from "@/lib/site-i18n";
import { useSectionVisible } from "@/lib/use-section-visible";

type DemoScene = {
  area: string;
  spots: { name: string }[];
};

/** Melbourne public areas — illustrative meet-up suggestions. */
const DEMO_SCENES: DemoScene[] = [
  {
    area: "Carlton",
    spots: [{ name: "State Library Victoria" }, { name: "Melbourne Museum forecourt" }],
  },
  {
    area: "Melbourne CBD",
    spots: [{ name: "Melbourne Central" }, { name: "Federation Square" }],
  },
  {
    area: "Southbank",
    spots: [{ name: "Southbank Promenade" }, { name: "Queensbridge Square" }],
  },
];

/*
 * Phase timeline:
 *   0 — reset
 *   1 — map + area
 *   2 — scanning
 *   3 — suggestions card + row 1
 *   4 — row 2
 *   5 — highlight / glow, hold
 */
const PHASE_DELAY = [0, 600, 850, 500, 450, 0] as const;
const HOLD_MS = 3000;

const ease =
  "transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]";

function SafetyGlowWrap({
  glow,
  className,
  children,
}: {
  glow: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        className={`pointer-events-none absolute -inset-[1.5px] rounded-[25px] transition-opacity duration-700 ${
          glow ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf, #14b8a6, #0d9488)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "2px",
          borderRadius: "25px",
        }}
      />
      <div
        className={`pointer-events-none absolute -inset-1 rounded-[26px] blur-md transition-opacity duration-700 ${
          glow ? "opacity-30" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(135deg, #0d9488, #14b8a6, #5eead4)",
        }}
      />
      <div className="relative rounded-[24px] border border-gray-200/80 bg-white/90 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

function MapIllustration({ area }: { area: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-slate-100/90 to-slate-50/80">
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        aria-hidden
      >
        <defs>
          <pattern
            id="sz-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-300"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sz-grid)" />
        <path
          d="M10% 45% Q 35% 30%, 55% 50% T 90% 40%"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gray-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-teal-400/30">
          <svg
            className="h-6 w-6 text-teal-600"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <p className="text-center text-xs font-semibold text-gray-700">
          {area}
        </p>
      </div>
    </div>
  );
}

function BadgePill({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: "cctv" | "people" | "sun";
}) {
  const iconEl =
    icon === "cctv" ? (
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-.43l4.227 2.11a.75.75 0 0 0 1.073-.474l.15-.598A2.25 2.25 0 0 0 16.5 12V8a2.25 2.25 0 0 0-1.45-2.1l-4.227-2.11A.75.75 0 0 0 10 3.75v-.43A2.25 2.25 0 0 0 7.75 1h-4.5Z" />
      </svg>
    ) : icon === "people" ? (
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6.5 17a4.5 4.5 0 0 1 7 0h-7Zm8.06-1.5a6.5 6.5 0 1 0-9.12 0A6.98 6.98 0 0 0 10 18a6.98 6.98 0 0 0 4.56-2.5Z" />
      </svg>
    ) : (
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-1.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      </svg>
    );

  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
      {iconEl}
      {children}
    </span>
  );
}

export function SafetyZoneDemo({ t }: { t: SiteCopy }) {
  const { ref: sectionRef, active } = useSectionVisible({
    startThreshold: 0.14,
    stopThreshold: 0.04,
    pauseDelayMs: 1200,
  });
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const timerRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!active) {
      clear();
      return;
    }
    let cancelled = false;

    const advance = (p: number) => {
      if (cancelled) return;
      if (p <= 5) {
        setPhase(p);
        const delay = p < 5 ? (PHASE_DELAY[p] ?? 600) : HOLD_MS;
        timerRef.current = window.setTimeout(
          () => (p < 5 ? advance(p + 1) : advance(6)),
          delay,
        );
      } else {
        setPhase(0);
        timerRef.current = window.setTimeout(() => {
          if (cancelled) return;
          setItemIdx((prev) => (prev + 1) % DEMO_SCENES.length);
        }, 600);
      }
    };

    if (phase === 0) {
      timerRef.current = window.setTimeout(() => advance(1), 400);
    } else {
      advance(phase);
    }

    return () => {
      cancelled = true;
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, itemIdx]);

  const scene = DEMO_SCENES[itemIdx]!;
  const spot1 = scene.spots[0]!;
  const spot2 = scene.spots[1]!;
  const glow = phase >= 5;
  const isEnglishTitle = t.safetyZoneTitle === "Safer meetups. By design.";

  const vis = (atPhase: number) =>
    phase >= atPhase
      ? "translate-y-0 opacity-100 blur-0"
      : "translate-y-3 opacity-0 blur-[2px]";

  const mapCard = (
    <div className="flex flex-col gap-3 p-5">
      <div className={`${ease} ${vis(1)}`}>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.274 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
              clipRule="evenodd"
            />
          </svg>
          {t.safetyZoneNearLabel}
        </p>
        <div className="mt-2.5">
          <MapIllustration area={scene.area} />
        </div>
      </div>
      {/* Keep fixed space reserved so section height doesn't jump during phase changes. */}
      <div className="min-h-[42px]">
        <div
          className={`flex items-center gap-2 rounded-xl border border-teal-100/80 bg-teal-50/50 px-3 py-2.5 transition-all duration-300 ${
            phase === 2
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />
          <span className="text-xs font-medium text-teal-800">
            {t.safetyZoneFinding}
          </span>
        </div>
      </div>
    </div>
  );

  const suggestionsCard = (
    <div className="flex flex-col gap-3 p-5">
      <p
        className={`text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${ease} ${vis(3)}`}
      >
        {t.safetyZoneListTitle}
      </p>
      <div className={`space-y-2.5 ${ease} ${vis(3)}`}>
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5">
          <p className="text-sm font-semibold text-gray-900">{spot1.name}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <BadgePill icon="cctv">{t.safetyZoneBadgeCctv}</BadgePill>
            <BadgePill icon="people">{t.safetyZoneBadgeBusy}</BadgePill>
            <BadgePill icon="sun">{t.safetyZoneBadgeLit}</BadgePill>
          </div>
        </div>
      </div>
      <div className={`${ease} ${vis(4)}`}>
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5">
          <p className="text-sm font-semibold text-gray-900">{spot2.name}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <BadgePill icon="cctv">{t.safetyZoneBadgeCctv}</BadgePill>
            <BadgePill icon="people">{t.safetyZoneBadgeBusy}</BadgePill>
            <BadgePill icon="sun">{t.safetyZoneBadgeLit}</BadgePill>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="flex flex-col items-center px-6 pb-16 pt-20 sm:pb-20 sm:pt-28"
    >
      <div className="max-w-3xl text-center">
        <h2 className="text-balance text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl md:text-3xl">
          {isEnglishTitle ? (
            <>
              <span className={POPOUT_BRAND_GRADIENT_TEXT_CLASS}>Safer</span>
              <span> meetups. By design.</span>
            </>
          ) : (
            t.safetyZoneTitle
          )}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-sm leading-relaxed text-gray-500 sm:text-base">
          {t.safetyZoneSubtitle}
        </p>
      </div>

      <div className="mt-10 hidden w-full max-w-3xl items-start justify-center gap-8 sm:flex">
        <div className="w-full max-w-[280px] rounded-[24px] border border-gray-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          {mapCard}
        </div>

        <svg
          className={`mt-24 h-6 w-6 shrink-0 text-gray-300 ${ease} ${vis(3)}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>

        <SafetyGlowWrap glow={glow} className="w-full max-w-[300px]">
          {suggestionsCard}
        </SafetyGlowWrap>
      </div>

      <div className="relative mt-8 w-full max-w-[320px] sm:hidden">
        <div
          className={`pointer-events-none absolute -inset-[1.5px] rounded-[29px] transition-opacity duration-700 ${
            glow ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf, #14b8a6, #0d9488)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "2px",
            borderRadius: "29px",
          }}
        />
        <div
          className={`pointer-events-none absolute -inset-1 rounded-[30px] blur-md transition-opacity duration-700 ${
            glow ? "opacity-30" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(135deg, #0d9488, #14b8a6, #5eead4)",
          }}
        />
        <div className="relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          {mapCard}
          <div className="border-t border-gray-200/80">{suggestionsCard}</div>
        </div>
      </div>
    </section>
  );
}
