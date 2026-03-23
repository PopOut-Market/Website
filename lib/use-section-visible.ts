"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref to attach to a section element and a boolean indicating
 * whether that section occupies a meaningful portion of the viewport.
 * Animated sections should pause when `active` is false so that only
 * the section the user is actually looking at cycles its content.
 */
export function useSectionVisible(threshold = 0.45) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry?.isIntersecting ?? false),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, active };
}
