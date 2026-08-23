"use client";

import { useEffect, useRef } from "react";
import { COUNT_MS } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The suburb count, animating in place inside the heading.
 *
 * No second big number is introduced anywhere on the page: the figure is already
 * in the `<h2>` and already brand-orange through `BrandEmphasis`. A separate
 * display figure would state the same claim twice on one screen and create a
 * divergence risk between two reads of the same table.
 *
 * Three non-negotiables, each learned the expensive way:
 *
 * 1. **Write `textContent` on a ref, never React state.** A state update per
 *    frame is ~66 full re-renders of an `<h2>` for a three-character string,
 *    each re-running `text-balance` line breaking.
 * 2. **Reserve the width.** `0` -> `12` -> `336` changes the character count,
 *    which changes the heading's width, which reflows the heading 66 times.
 *    `tabular-nums` plus a `ch` min-width pins it.
 * 3. **The server HTML contains the real number, not `0`.** The initial children
 *    are the final value; the animation only starts after mount, after the
 *    section is revealed, and only when motion is not reduced. The section sits
 *    far below the fold, so a JS-executing crawler never snapshots an
 *    intermediate value — and a non-JS one reads the true number directly.
 *
 * `requestAnimationFrame` is suspended automatically in a background tab, which
 * is why it is used here rather than the `setTimeout` chains the older demos use.
 */
export function HomeSuburbCount({ count, run }: { count: number; run: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!run || reduced) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS);
      // easeOutCubic — fast out of the gate, settles gently on the real figure.
      el.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * count));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduced, count]);

  return (
    <span
      ref={ref}
      className="inline-block text-left tabular-nums"
      style={{ minWidth: `${String(count).length}ch` }}
    >
      {count}
    </span>
  );
}
