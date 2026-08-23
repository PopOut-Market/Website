"use client";

import { EASE_OUT, REVEAL_MS, STAGGER_CAP, STAGGER_MS } from "@/lib/motion";
import type { CSSProperties, ElementType, ReactNode } from "react";

const DISTANCE = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  /** Negative: the element arrives from ABOVE. Shop-wall pin drop only. */
  drop: "-10px",
} as const;

/**
 * One element arriving as its section scrolls into view.
 *
 * Hard rules, encoded here rather than left to each caller:
 *
 * - **`transform` and `opacity` only.** No width, height, top, left, margin,
 *   padding, filter, box-shadow or border-radius is ever transitioned. Both of
 *   these are compositor properties: zero layout and zero paint per frame.
 * - **`translateY` only, never `translateX`.** A horizontal start offset near the
 *   viewport edge creates horizontal overflow on narrow screens, which on an
 *   eight-locale page (where text lengths vary wildly) is a real bug class.
 * - **No `will-change`.** Nothing here is perpetual, so no element benefits from
 *   a permanently promoted layer, and holding sixty of them costs memory.
 * - **`transitionDelay` returns to `0ms` in the pending state**, so a flip back
 *   to pending never staggers in reverse.
 * - **The hidden state is CSS, never inline.** It lives in `globals.css` scoped
 *   to `@media (scripting: enabled)`. Setting `opacity: 0` inline here would
 *   ship a homepage whose entire lower half is invisible without JavaScript —
 *   throwing away exactly the no-JS readability the server-rendered feed exists
 *   to provide, on the sections most likely to be read by a crawler.
 */
export function Reveal({
  show,
  delayIndex,
  delayMs,
  distance = "md",
  durationMs = REVEAL_MS,
  easing = EASE_OUT,
  staggerMs = STAGGER_MS,
  staggerCap = STAGGER_CAP,
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  show: boolean;
  /** Position in a staggered group. Capped so long groups do not become a queue. */
  delayIndex?: number;
  /** Explicit delay, for sequenced (not staggered) arrivals. Wins over delayIndex. */
  delayMs?: number;
  distance?: keyof typeof DISTANCE;
  durationMs?: number;
  easing?: string;
  staggerMs?: number;
  staggerCap?: number;
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const delay = delayMs ?? Math.min(delayIndex ?? 0, staggerCap) * staggerMs;

  return (
    <Tag
      className={className}
      data-reveal={show ? "shown" : "pending"}
      style={
        {
          "--reveal-y": DISTANCE[distance],
          "--reveal-dur": `${durationMs}ms`,
          "--reveal-ease": easing,
          transitionDelay: show ? `${delay}ms` : "0ms",
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
