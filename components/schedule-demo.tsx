"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { POPOUT_BRAND_GRADIENT_TEXT_CLASS } from "@/lib/site-config";
import type { SiteCopy } from "@/lib/site-i18n";
import { useSectionVisible } from "@/lib/use-section-visible";

type DemoMeetup = { date: string; time: string; location: string };

const DEMO_MEETUPS: DemoMeetup[] = [
  { date: "Sat, Mar 29", time: "2:00 PM", location: "Melbourne Central" },
  { date: "Sun, Mar 30", time: "10:30 AM", location: "Flinders St Station" },
  { date: "Mon, Mar 31", time: "5:00 PM", location: "State Library" },
  { date: "Tue, Apr 1", time: "11:00 AM", location: "QV Melbourne" },
];

/*
 * Phase timeline:
 *   0 — blank / reset
 *   1 — date field
 *   2 — time field
 *   3 — location field
 *   4 — "Scheduled ✓"
 *   5 — QR card + scan line
 *   6 — "Verified ✓", hold
 */
const PHASE_DELAY = [0, 700, 550, 550, 650, 1200, 0] as const;
const HOLD_MS = 3200;

const ease =
  "transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]";

/* ── Decorative QR pattern (13 × 13 with corner markers) ── */

const QR_GRID = [
  1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
  1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
  0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
  1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0,
  1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0,
  1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1,
  1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0,
];
const QR_COLS = 13;

function QrCodeVisual({
  visible,
  scanning,
}: {
  visible: boolean;
  scanning: boolean;
}) {
  return (
    <div className="relative mx-auto w-28">
      <div
        className={`grid gap-[2px] ${ease} ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{ gridTemplateColumns: `repeat(${QR_COLS}, 1fr)` }}
        aria-hidden
      >
        {QR_GRID.map((cell, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[1px] ${
              cell ? "bg-gray-800" : "bg-transparent"
            }`}
          />
        ))}
      </div>
      <div
        className={`pointer-events-none absolute inset-x-0 h-[2px] rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(16,185,129,0.4)] transition-opacity duration-300 ${
          scanning ? "opacity-100" : "opacity-0"
        }`}
        style={{
          animation: scanning
            ? "schedule-scan-line 1.8s ease-in-out infinite"
            : "none",
        }}
      />
    </div>
  );
}

function VerifyGlowWrap({
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
            "linear-gradient(135deg, #10b981, #34d399, #6ee7b7, #34d399, #10b981)",
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
          background: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)",
        }}
      />
      <div className="relative rounded-[24px] border border-gray-200/80 bg-white/90 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

/* ── Main component ── */

export function ScheduleDemo({ t }: { t: SiteCopy }) {
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
      if (p <= 6) {
        setPhase(p);
        const delay = p < 6 ? (PHASE_DELAY[p] ?? 600) : HOLD_MS;
        timerRef.current = window.setTimeout(
          () => (p < 6 ? advance(p + 1) : advance(7)),
          delay,
        );
      } else {
        setPhase(0);
        timerRef.current = window.setTimeout(() => {
          if (cancelled) return;
          setItemIdx((prev) => (prev + 1) % DEMO_MEETUPS.length);
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

  const meetup = DEMO_MEETUPS[itemIdx]!;
  const scanning = phase === 5;
  const verified = phase >= 6;
  const isEnglishTitle =
    t.scheduleDemoTitle === "Meet with confidence.";

  const vis = (atPhase: number) =>
    phase >= atPhase
      ? "translate-y-0 opacity-100 blur-0"
      : "translate-y-3 opacity-0 blur-[2px]";

  /* ── Schedule fields card content ── */

  const scheduleFields = (
    <div className="flex flex-col gap-3.5 p-5">
      {/* Date */}
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
              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
              clipRule="evenodd"
            />
          </svg>
          {t.scheduleDemoDate}
        </p>
        <p className="mt-0.5 text-base font-semibold text-gray-900">
          {meetup.date}
        </p>
      </div>

      {/* Time */}
      <div className={`${ease} ${vis(2)}`}>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
              clipRule="evenodd"
            />
          </svg>
          {t.scheduleDemoTime}
        </p>
        <p className="mt-0.5 text-base font-semibold text-gray-900">
          {meetup.time}
        </p>
      </div>

      {/* Location */}
      <div className={`${ease} ${vis(3)}`}>
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
          {t.scheduleDemoLocation}
        </p>
        <p className="mt-0.5 text-base font-semibold text-gray-900">
          {meetup.location}
        </p>
      </div>

      {/* Scheduled badge */}
      <div
        className={`border-t border-dashed border-gray-200 ${ease} ${vis(4)}`}
      />
      <div className={`flex items-center gap-2 ${ease} ${vis(4)}`}>
        <svg
          className="h-5 w-5 text-emerald-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-semibold text-emerald-600">
          {t.scheduleDemoScheduled}
        </span>
      </div>
    </div>
  );

  /* ── QR verify card content ── */

  const qrContent = (
    <div className="flex flex-col items-center gap-4 p-5">
      <p
        className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${ease} ${vis(5)}`}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <line x1="7" y1="12" x2="17" y2="12" />
        </svg>
        {t.scheduleDemoScanHint}
      </p>
      <QrCodeVisual visible={phase >= 5} scanning={scanning} />
      <div className={`flex items-center gap-2 ${ease} ${vis(6)}`}>
        <svg
          className="h-5 w-5 text-emerald-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-semibold text-emerald-600">
          {t.scheduleDemoVerified}
        </span>
      </div>
    </div>
  );

  /* ── Render ── */

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="flex flex-col items-center px-6 pb-16 pt-20 sm:pb-20 sm:pt-28"
    >
      <style>{`
        @keyframes schedule-scan-line {
          0%, 100% { top: 5%; }
          50% { top: 90%; }
        }
      `}</style>

      {/* Heading */}
      <div className="max-w-3xl text-center">
        <h2 className="text-balance text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl md:text-3xl">
          {isEnglishTitle ? (
            <>
              <span>Meet with </span>
              <span className={POPOUT_BRAND_GRADIENT_TEXT_CLASS}>
                confidence
              </span>
              <span>.</span>
            </>
          ) : (
            t.scheduleDemoTitle
          )}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-sm leading-relaxed text-gray-500 sm:text-base">
          {t.scheduleDemoSubtitle}
        </p>
      </div>

      {/* Desktop: side-by-side */}
      <div className="mt-10 hidden w-full max-w-3xl items-start justify-center gap-8 sm:flex">
        <div className="w-full max-w-[280px] rounded-[24px] border border-gray-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          {scheduleFields}
        </div>

        <svg
          className={`mt-24 h-6 w-6 shrink-0 text-gray-300 ${ease} ${vis(5)}`}
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

        <VerifyGlowWrap glow={verified} className="w-full max-w-[280px]">
          {qrContent}
        </VerifyGlowWrap>
      </div>

      {/* Mobile: single combined card */}
      <div className="relative mt-8 w-full max-w-[320px] sm:hidden">
        <div
          className={`pointer-events-none absolute -inset-[1.5px] rounded-[29px] transition-opacity duration-700 ${
            verified ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(135deg, #10b981, #34d399, #6ee7b7, #34d399, #10b981)",
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
            verified ? "opacity-25" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)",
          }}
        />
        <div className="relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          {scheduleFields}
          <div className="border-t border-gray-200/80">{qrContent}</div>
        </div>
      </div>
    </section>
  );
}
