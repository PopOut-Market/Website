"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` setting. Returns `true` when the
 * user has asked for reduced motion, so callers can skip auto-advancing timers,
 * carousels, and reveal animations (WCAG 2.2.2 / 2.3.3).
 *
 * Starts `false` so SSR + first paint render the static/initial state; updates
 * after mount and on media-query change.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
