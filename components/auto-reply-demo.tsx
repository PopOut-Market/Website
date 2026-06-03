"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteCopy } from "@/lib/site-i18n";
import { useSectionVisible } from "@/lib/use-section-visible";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** The ✦ marker that flags an AI-generated auto-reply. */
function AiStar({ className }: { className?: string }) {
  return (
    <span className={`text-brand-500 ${className ?? ""}`} aria-hidden>
      ✦
    </span>
  );
}

function BellIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

type Row = {
  name: string;
  avatar: string;
  thumb: string;
  /** When true the preview is an AI auto-reply (prefixed with ✦). */
  ai: boolean;
  /** Unread buyer message → orange dot, bold preview. */
  unread: boolean;
  message: string;
  time: string;
};

const ease = "transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]";

export function AutoReplyDemo({ t }: { t: SiteCopy }) {
  const { ref: sectionRef, active } = useSectionVisible({
    startThreshold: 0.14,
    stopThreshold: 0.04,
    pauseDelayMs: 1200,
  });
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const timerRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Reveal the rows one at a time, hold, then loop — conveys replies "landing".
  useEffect(() => {
    if (!active) {
      clear();
      return;
    }
    if (reduced) {
      setPhase(4);
      clear();
      return;
    }
    let cancelled = false;
    const step = (p: number) => {
      if (cancelled) return;
      setPhase(p);
      if (p < 4) {
        timerRef.current = window.setTimeout(() => step(p + 1), 420);
      } else {
        timerRef.current = window.setTimeout(() => {
          if (cancelled) return;
          setPhase(0);
          timerRef.current = window.setTimeout(() => step(1), 500);
        }, 3200);
      }
    };
    timerRef.current = window.setTimeout(() => step(1), 300);
    return () => {
      cancelled = true;
      clear();
    };
  }, [active, reduced, clear]);

  const rows: Row[] = [
    { name: "Tom", avatar: "🦙", thumb: "📦", ai: false, unread: true, message: t.autoReplyDemoMsgMeet, time: t.autoReplyDemoTimeNow },
    { name: "Tom", avatar: "🦙", thumb: "🎧", ai: true, unread: false, message: t.autoReplyDemoMsgPrice, time: t.autoReplyDemoTimeNow },
    { name: "Soojung", avatar: "🐻", thumb: "📚", ai: true, unread: false, message: t.autoReplyDemoMsgSelling, time: t.autoReplyDemoTimeNow },
    { name: "Soojung", avatar: "🐻", thumb: "🪑", ai: true, unread: false, message: t.autoReplyDemoMsgGreeting, time: t.autoReplyDemoTime1Min },
  ];

  // Heading: per-locale string; the *asterisked* span is brand-coloured.
  const renderHeading = () =>
    t.autoReplyDemoTitle.split(/(\*[^*]+\*)/).map((part, i) => {
      if (!part) return null;
      return part.startsWith("*") && part.endsWith("*") ? (
        <span key={i} className="text-brand-500">
          {part.slice(1, -1)}
        </span>
      ) : (
        <span key={i}>{part}</span>
      );
    });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="flex flex-col items-center px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28"
    >
      <div className="flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-balance text-xl font-semibold leading-tight tracking-tight text-gray-800 sm:text-2xl md:text-3xl">
          {renderHeading()}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-sm leading-relaxed text-gray-500 sm:text-base">
          {t.autoReplyDemoSubtitle}
        </p>
      </div>

      {/* Inbox mockup */}
      <div className="mt-10 w-full max-w-[380px]">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <span className="text-lg font-bold tracking-tight text-gray-900">
              {t.autoReplyDemoInboxTitle}
            </span>
            <BellIcon />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 px-5">
            <span className="rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-500">
              {t.autoReplyDemoTabBuying}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white">
              {t.autoReplyDemoTabSelling}
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[10px] font-bold leading-none text-white">
                1
              </span>
            </span>
          </div>

          {/* Auto-reply on pill */}
          <div className="px-5 pt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              <AiStar />
              {t.autoReplyDemoBadge}
            </span>
          </div>

          {/* Rows */}
          <ul className="mt-2 px-2 pb-2">
            {rows.map((row, idx) => {
              const shown = phase >= idx + 1;
              return (
                <li
                  key={idx}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 ${ease} ${
                    shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  {/* Avatar */}
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg"
                    aria-hidden
                  >
                    {row.avatar}
                  </span>

                  {/* Name + preview */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {row.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-gray-400">{row.time}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <p
                        className={`truncate text-[13px] ${
                          row.unread ? "font-semibold text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {row.ai ? (
                          <>
                            <AiStar className="mr-1 text-xs" />
                            {row.message}
                          </>
                        ) : (
                          row.message
                        )}
                      </p>
                      {row.unread ? (
                        <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden />
                      ) : null}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-base"
                    aria-hidden
                  >
                    <span className="opacity-70">{row.thumb}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
