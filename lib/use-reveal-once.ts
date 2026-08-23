"use client";

import { useEffect, useRef, useState } from "react";
import { REVEAL_ROOT_MARGIN, REVEAL_THRESHOLD } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Fire-once scroll reveal.
 *
 * **Observe the section, not the item.** The revealed sections hold roughly
 * sixty individually-animated elements between them; one observer per element
 * would be sixty observers and sixty intersection computations on the first
 * scroll. Instead each `<section>` gets one of these, and every child derives
 * its motion from the single returned boolean plus its own `transitionDelay`.
 *
 * ## Failing safe without breaking the effect
 *
 * The hidden state is CSS (`[data-reveal="pending"]`), so anything that stops
 * this hook from ever setting `shown` leaves content invisible. Three guards,
 * and the shape of them matters:
 *
 * 1. **Reduced motion → reveal on mount.** This has to be a JS gate. The
 *    `prefers-reduced-motion` block in `globals.css` only zeroes
 *    `transition-duration`, which cannot reveal an element CSS has set to
 *    `opacity: 0`.
 * 2. **No `IntersectionObserver` → reveal on mount.** No observer, no trigger.
 * 3. **Already at or above the viewport on mount → reveal immediately.** This is
 *    the case an observer genuinely can miss in practice: a restored scroll
 *    position, an in-page anchor, or a back-navigation that lands the reader
 *    below the section.
 *
 * There is deliberately **no timer-based watchdog**. A plain
 * `setTimeout(reveal, 2500)` on mount looks like a safety net and is really an
 * off switch: every section reveals 2.5s after load whether or not the reader
 * has scrolled, so anyone who reads slower than that never sees the animation at
 * all — the failure it is supposed to prevent, applied unconditionally. Guard 3
 * covers the real miss case without touching the normal path.
 *
 * Crawlers are covered by the CSS instead: the pending rule is scoped to
 * `@media (scripting: enabled)`, so a text extractor never applies it, and a
 * JS-executing renderer scrolls the page before snapshotting it.
 */
export function useRevealOnce<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (shown) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    // Guard 3: the section is already in or above the viewport, so an observer
    // may never report a fresh intersection.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio >= REVEAL_THRESHOLD) {
          setShown(true);
          // Disconnect here rather than on unmount: a fired observer should stop
          // costing anything immediately.
          io.disconnect();
        }
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN },
    );
    io.observe(el);

    return () => io.disconnect();
  }, [reduced, shown]);

  return { ref, shown } as const;
}
