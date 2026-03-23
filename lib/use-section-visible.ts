"use client";

import { useEffect, useRef, useState } from "react";

type SectionVisibleOptions = {
  /** Animation starts when visible ratio reaches this value (default 0.18). */
  startThreshold?: number;
  /** Animation pauses when visible ratio drops below this (default 0.06). */
  stopThreshold?: number;
  /** Delay in ms before pausing after leaving viewport (default 900). */
  pauseDelayMs?: number;
};

const DEFAULTS: Required<SectionVisibleOptions> = {
  startThreshold: 0.18,
  stopThreshold: 0.06,
  pauseDelayMs: 900,
};

/**
 * Returns a ref to attach to a section element and an `active` boolean.
 *
 * Animated sections should pause when `active` is false so only visible
 * sections consume resources.
 *
 * Accepts either a legacy numeric threshold or a full options object.
 */
export function useSectionVisible(
  arg?: number | SectionVisibleOptions,
) {
  const opts =
    typeof arg === "number"
      ? { ...DEFAULTS, startThreshold: arg }
      : { ...DEFAULTS, ...arg };

  const { startThreshold, stopThreshold, pauseDelayMs } = opts;

  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const pauseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const clearPauseTimer = () => {
      if (pauseTimerRef.current !== null) {
        window.clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
    };

    const schedulePause = () => {
      clearPauseTimer();
      pauseTimerRef.current = window.setTimeout(() => {
        setActive(false);
      }, pauseDelayMs);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearPauseTimer();
        setActive(false);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    const thresholds = Array.from(
      new Set([0, stopThreshold, startThreshold, 0.5, 1].sort((a, b) => a - b)),
    );

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const ratio = entry.intersectionRatio;

        if (entry.isIntersecting && ratio >= startThreshold) {
          clearPauseTimer();
          setActive(true);
          return;
        }

        if (activeRef.current && entry.isIntersecting && ratio > stopThreshold) {
          clearPauseTimer();
          return;
        }

        schedulePause();
      },
      { threshold: thresholds },
    );

    io.observe(el);

    return () => {
      clearPauseTimer();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      io.disconnect();
    };
  }, [pauseDelayMs, startThreshold, stopThreshold]);

  return { ref, active };
}
