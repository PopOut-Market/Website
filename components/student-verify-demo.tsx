"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { POPOUT_BRAND_GRADIENT_TEXT_CLASS } from "@/lib/site-config";
import type { SiteCopy } from "@/lib/site-i18n";
import { useSectionVisible } from "@/lib/use-section-visible";

type DemoStudent = {
  email: string;
  university: string;
  name: string;
  initials: string;
};

/** Demo profiles — all institutions are Melbourne metro universities. */
const DEMO_STUDENTS: DemoStudent[] = [
  {
    email: "j.smith@student.unimelb.edu.au",
    university: "University of Melbourne",
    name: "Jamie S.",
    initials: "JS",
  },
  {
    email: "m.chen@student.monash.edu",
    university: "Monash University",
    name: "Ming C.",
    initials: "MC",
  },
  {
    email: "a.nguyen@student.rmit.edu.au",
    university: "RMIT University",
    name: "An N.",
    initials: "AN",
  },
  {
    email: "k.park@student.swin.edu.au",
    university: "Swinburne University of Technology",
    name: "Kyung P.",
    initials: "KP",
  },
];

/*
 * Phase timeline:
 *   0 — blank / reset
 *   1 — email field appears
 *   2 — university auto-detected
 *   3 — verifying spinner
 *   4 — "Email Verified ✓"
 *   5 — profile badge card appears, hold
 */
const PHASE_DELAY = [0, 700, 600, 900, 600, 0] as const;
const HOLD_MS = 3200;

const ease =
  "transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]";

/* ── Trust-blue glow wrapper (indigo theme) ── */

function TrustGlowWrap({
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
            "linear-gradient(135deg, #6366f1, #818cf8, #a5b4fc, #818cf8, #6366f1)",
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
          background: "linear-gradient(135deg, #6366f1, #818cf8, #a5b4fc)",
        }}
      />
      <div className="relative rounded-[24px] border border-gray-200/80 bg-white/90 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

/* ── Main component ── */

export function StudentVerifyDemo({ t }: { t: SiteCopy }) {
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
          setItemIdx((prev) => (prev + 1) % DEMO_STUDENTS.length);
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

  const student = DEMO_STUDENTS[itemIdx]!;
  const verified = phase >= 5;
  const isEnglishTitle =
    t.studentVerifyTitle === "Verified students. Trusted trades.";

  const vis = (atPhase: number) =>
    phase >= atPhase
      ? "translate-y-0 opacity-100 blur-0"
      : "translate-y-3 opacity-0 blur-[2px]";

  /* ── Email verification card ── */

  const emailCard = (
    <div className="flex flex-col gap-3.5 p-5">
      {/* Email */}
      <div className={`${ease} ${vis(1)}`}>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
            <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
          </svg>
          {t.studentVerifyEmailLabel}
        </p>
        <p className="mt-1 truncate rounded-lg border border-gray-200/80 bg-gray-50/80 px-3 py-2 font-mono text-xs text-gray-800">
          {student.email}
        </p>
      </div>

      {/* University detected */}
      <div className={`${ease} ${vis(2)}`}>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-7.86-3.83.75.75 0 0 1-.254-1.285 41.059 41.059 0 0 1 8.198-5.424Z" />
            <path d="M6 11.459a29.848 29.848 0 0 0-2.455-1.158 41.029 41.029 0 0 0-.39 3.114.75.75 0 0 0 .419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 1 0 1.06 1.06c.37-.369.69-.77.96-1.193a26.613 26.613 0 0 1 3.095 2.348.75.75 0 0 0 .992 0 26.613 26.613 0 0 1 3.095-2.348c.27.424.59.824.96 1.193a.75.75 0 0 0 1.06-1.06 5.857 5.857 0 0 1-.739-.914c.508-.29 1.026-.564 1.554-.82a.75.75 0 0 0 .419-.74 41.058 41.058 0 0 0-.39-3.114A29.849 29.849 0 0 0 14 11.46V15a.75.75 0 0 1-.08.336A24.298 24.298 0 0 0 10 14a24.298 24.298 0 0 0-3.92 1.336.75.75 0 0 1-.08-.336v-3.54Z" />
          </svg>
          {t.studentVerifyUniversity}
        </p>
        <p className="mt-0.5 text-base font-semibold text-gray-900">
          {student.university}
        </p>
      </div>

      {/* Verifying → Verified */}
      <div
        className={`border-t border-dashed border-gray-200 ${ease} ${vis(3)}`}
      />
      <div className={`flex items-center gap-2 ${ease} ${vis(3)}`}>
        {phase >= 4 ? (
          <>
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
              {t.studentVerifyVerified}
            </span>
          </>
        ) : (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500" />
            <span className="text-sm font-medium text-indigo-500">
              {t.studentVerifyVerifying}
            </span>
          </>
        )}
      </div>
    </div>
  );

  /* ── Profile badge card ── */

  const profileCard = (
    <div className="flex flex-col items-center gap-3 p-6">
      <div className={`${ease} ${vis(5)}`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-base font-bold text-white shadow-md">
          {student.initials}
        </div>
      </div>
      <div className={`text-center ${ease} ${vis(5)}`}>
        <p className="text-base font-semibold text-gray-900">{student.name}</p>
        <p className="mt-0.5 text-sm text-gray-500">{student.university}</p>
      </div>
      <div className={`${ease} ${vis(5)}`}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.564 2 12.163 2 7c0-.54.035-1.07.104-1.59a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749ZM14.196 8.61a.75.75 0 0 0-1.142-.975l-3.64 4.26-1.96-1.96a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.101-.042l4.201-4.843Z"
              clipRule="evenodd"
            />
          </svg>
          {t.studentVerifyBadge}
        </span>
      </div>
    </div>
  );

  /* ── Render ── */

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="flex flex-col items-center px-[1.05rem] pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28"
    >
      {/* Heading */}
      <div className="max-w-3xl text-center">
        <h2 className="text-balance text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl md:text-3xl">
          {isEnglishTitle ? (
            <>
              <span>Verified students. </span>
              <span className={POPOUT_BRAND_GRADIENT_TEXT_CLASS}>Trusted</span>
              <span> trades.</span>
            </>
          ) : (
            t.studentVerifyTitle
          )}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-sm leading-relaxed text-gray-500 sm:text-base">
          {t.studentVerifySubtitle}
        </p>
      </div>

      {/* Desktop: side-by-side */}
      <div className="mt-10 hidden w-full max-w-3xl items-start justify-center gap-8 sm:flex">
        <div className="w-full max-w-[280px] rounded-[24px] border border-gray-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          {emailCard}
        </div>

        <svg
          className={`mt-20 h-6 w-6 shrink-0 text-gray-300 ${ease} ${vis(5)}`}
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

        <TrustGlowWrap glow={verified} className="w-full max-w-[280px]">
          {profileCard}
        </TrustGlowWrap>
      </div>

      {/* Mobile: single combined card */}
      <div className="relative mt-8 w-full max-w-[320px] sm:hidden">
        <div
          className={`pointer-events-none absolute -inset-[1.5px] rounded-[29px] transition-opacity duration-700 ${
            verified ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(135deg, #6366f1, #818cf8, #a5b4fc, #818cf8, #6366f1)",
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
            background: "linear-gradient(135deg, #6366f1, #818cf8, #a5b4fc)",
          }}
        />
        <div className="relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          {emailCard}
          <div className="border-t border-gray-200/80">{profileCard}</div>
        </div>
      </div>
    </section>
  );
}
