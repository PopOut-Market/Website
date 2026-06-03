"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { POPOUT_BRAND_GRADIENT_TEXT_CLASS } from "@/lib/site-config";
import type { SiteCopy } from "@/lib/site-i18n";
import { useSectionVisible } from "@/lib/use-section-visible";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type DemoItem = {
  emoji: string;
  title: string;
  category: string;
  description: string;
};

const DEMO_ITEMS: DemoItem[] = [
  {
    emoji: "🪑",
    title: "Wooden Dining Table",
    category: "Furniture",
    description: "Solid oak dining table, seats 4–6. Minor surface scratches, great condition overall.",
  },
  {
    emoji: "🚲",
    title: "Mountain Bike — 21 Speed",
    category: "Sports & Outdoors",
    description: "Shimano gears, front suspension fork. Tires recently replaced. Perfect for weekend rides.",
  },
  {
    emoji: "📱",
    title: "iPhone 14 Pro — 128 GB",
    category: "Electronics",
    description: "Space Black, battery health 91%. Includes original box and charger. Screen in perfect condition.",
  },
  {
    emoji: "🎸",
    title: "Acoustic Guitar — Yamaha F310",
    category: "Musical Instruments",
    description: "Spruce top, meranti back and sides. Lightly used with a soft case. Sounds warm and full.",
  },
];

/*
 * Animation phases:
 *   0 — blank / transitioning
 *   1 — viewfinder corners appear + emoji
 *   2 — shutter flash
 *   3 — AI shimmer starts on fields card, title appears
 *   4 — category appears
 *   5 — description appears
 *   6 — shimmer stops, user fields appear, hold
 */
const PHASE_DELAY = [0, 600, 800, 700, 600, 600, 0] as const;
const HOLD_MS = 3000;

function AiStar() {
  return (
    <span
      className={`mr-1 inline-block text-xs font-bold ${POPOUT_BRAND_GRADIENT_TEXT_CLASS}`}
      aria-hidden
    >
      ✦
    </span>
  );
}

/** Camera viewfinder bracket corners. */
function ViewfinderCorners({ visible }: { visible: boolean }) {
  const base =
    "absolute h-5 w-5 border-gray-800 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]";
  const show = visible ? "opacity-100 scale-100" : "opacity-0 scale-75";
  return (
    <>
      <span className={`${base} ${show} left-3 top-3 rounded-tl-md border-l-[2.5px] border-t-[2.5px]`} />
      <span className={`${base} ${show} right-3 top-3 rounded-tr-md border-r-[2.5px] border-t-[2.5px]`} />
      <span className={`${base} ${show} bottom-3 left-3 rounded-bl-md border-b-[2.5px] border-l-[2.5px]`} />
      <span className={`${base} ${show} bottom-3 right-3 rounded-br-md border-b-[2.5px] border-r-[2.5px]`} />
    </>
  );
}

/** Full-area shutter flash overlay. */
function ShutterFlash({ fire }: { fire: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-white transition-opacity ${
        fire ? "duration-[120ms] opacity-70" : "duration-500 opacity-0"
      }`}
    />
  );
}

const ease = "transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]";

/**
 * Card wrapper — flat surface; shows a brand-coloured border highlight while `shimmer` is true.
 */
function AiShimmerCard({
  shimmer,
  className,
  children,
}: {
  shimmer: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        className={`relative rounded-2xl border bg-white shadow-card transition-colors ${
          shimmer ? "border-brand-500" : "border-black/5"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function AiPostDemo({ t }: { t: SiteCopy }) {
  const { ref: sectionRef, active } = useSectionVisible({
    startThreshold: 0.14,
    stopThreshold: 0.04,
    pauseDelayMs: 1200,
  });
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const reduced = useReducedMotion();
  const timerRef = useRef<number | null>(null);
  const [flash, setFlash] = useState(false);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!active) { clear(); return; }
    if (reduced) { setPhase(6); clear(); return; }
    let cancelled = false;

    const advance = (p: number) => {
      if (cancelled) return;
      if (p === 2) {
        setFlash(true);
        timerRef.current = window.setTimeout(() => {
          if (cancelled) return;
          setFlash(false);
          setPhase(2);
          timerRef.current = window.setTimeout(() => advance(3), PHASE_DELAY[2]);
        }, 180);
        return;
      }
      if (p <= 6) {
        setPhase(p);
        const delay = p < 6 ? PHASE_DELAY[p] ?? 600 : HOLD_MS;
        timerRef.current = window.setTimeout(
          () => (p < 6 ? advance(p + 1) : advance(7)),
          delay,
        );
      } else {
        setPhase(0);
        timerRef.current = window.setTimeout(() => {
          if (cancelled) return;
          setItemIdx((prev) => (prev + 1) % DEMO_ITEMS.length);
        }, 600);
      }
    };

    if (phase === 0) {
      timerRef.current = window.setTimeout(() => advance(1), 400);
    } else {
      advance(phase);
    }

    return () => { cancelled = true; clear(); };
  }, [active, itemIdx, reduced]);

  const item = DEMO_ITEMS[itemIdx]!;
  const showCorners = phase >= 1;
  const shimmer = phase >= 3 && phase < 6;
  const vis = (atPhase: number) =>
    phase >= atPhase ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0";

  const photoCard = (
    <div
      className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-soft ${ease} ${vis(1)}`}
    >
      <ViewfinderCorners visible={showCorners} />
      <ShutterFlash fire={flash} />
      <span className="text-5xl">{item.emoji}</span>
    </div>
  );

  const fieldsContent = (
    <div className="flex flex-col gap-3.5 px-5 py-5">
      <div className={`${ease} ${vis(3)}`}>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          <AiStar />{t.aiPostDemoFieldTitle}
        </p>
        <p className="mt-0.5 text-base font-semibold text-gray-900">{item.title}</p>
      </div>
      <div className={`${ease} ${vis(4)}`}>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          <AiStar />{t.marketPostCategoryLabel}
        </p>
        <span className="mt-1 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {item.category}
        </span>
      </div>
      <div className={`${ease} ${vis(5)}`}>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          <AiStar />{t.marketPostDescriptionHeading}
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{item.description}</p>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="flex flex-col items-center px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28"
    >
      <div className="flex min-h-[116px] max-w-3xl flex-col items-center text-center sm:min-h-[132px] md:min-h-[148px]">
        <h2 className="text-balance text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl md:text-3xl">
          {/* The emphasised word is wrapped in *asterisks* per locale → brand-coloured. */}
          {t.aiPostDemoTitle.split(/(\*[^*]+\*)/).map((part, i) => {
            if (!part) return null;
            return part.startsWith("*") && part.endsWith("*") ? (
              <span key={i} className="text-brand-500">
                {part.slice(1, -1)}
              </span>
            ) : (
              <span key={i}>{part}</span>
            );
          })}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-sm leading-relaxed text-gray-500 sm:text-base">
          {t.aiPostDemoSubtitle}
        </p>
      </div>

      {/* Desktop */}
      <div className="mt-10 hidden w-full max-w-3xl items-start justify-center gap-8 sm:flex">
        <div className="w-full max-w-[260px]">{photoCard}</div>

        <svg
          className={`mt-20 h-6 w-6 shrink-0 text-gray-300 ${ease} ${vis(2)}`}
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

        <AiShimmerCard shimmer={shimmer} className="w-full max-w-[320px]">
          {fieldsContent}
        </AiShimmerCard>
      </div>

      {/* Mobile */}
      <div className="relative mt-8 w-full max-w-[320px] sm:hidden">
        <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
          <div className="relative">
            <div
              className={`flex aspect-[16/10] w-full items-center justify-center bg-gray-50 ${ease} ${vis(1)}`}
            >
              <span className="text-5xl">{item.emoji}</span>
            </div>
            <ViewfinderCorners visible={showCorners} />
            <ShutterFlash fire={flash} />
          </div>
          {fieldsContent}
        </div>
      </div>
    </section>
  );
}
