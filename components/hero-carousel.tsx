"use client";

import { fetchHeroCarouselListings } from "@/lib/supabase/fetch-market-listings";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/browser-client";
import type { Locale, SiteCopy } from "@/lib/site-i18n";
import { useSiteShell } from "@/components/site-chrome-context";
import { toLocalePath } from "@/lib/site-locale-routing";
import { useSectionVisible } from "@/lib/use-section-visible";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DemoShowcaseItem = {
  emoji: string;
  gradient: string;
  titleCopyKey?: keyof SiteCopy;
  titleFallback: string;
  price: string;
};

const SHOWCASE: DemoShowcaseItem[] = [
  { emoji: "🪑", gradient: "from-amber-50 to-orange-100", titleCopyKey: "demoListingWoodenDiningChair", titleFallback: "Wooden Dining Chair", price: "$45" },
  { emoji: "🚲", gradient: "from-sky-50 to-blue-100", titleCopyKey: "demoListingMountainBike", titleFallback: "Mountain Bike", price: "$180" },
  { emoji: "📱", gradient: "from-gray-50 to-gray-200", titleFallback: "iPhone 14 Pro", price: "$890" },
  { emoji: "🎸", gradient: "from-rose-50 to-pink-100", titleCopyKey: "demoListingAcousticGuitar", titleFallback: "Acoustic Guitar", price: "$120" },
  { emoji: "🎧", gradient: "from-violet-50 to-purple-100", titleCopyKey: "demoListingWirelessHeadphones", titleFallback: "Wireless Headphones", price: "$65" },
  { emoji: "📚", gradient: "from-emerald-50 to-green-100", titleCopyKey: "demoListingTextbookBundle", titleFallback: "Textbook Bundle", price: "$30" },
  { emoji: "⌚", gradient: "from-yellow-50 to-amber-100", titleCopyKey: "demoListingSmartWatch", titleFallback: "Smart Watch", price: "$210" },
  { emoji: "🎮", gradient: "from-indigo-50 to-blue-100", titleCopyKey: "demoListingGameController", titleFallback: "Game Controller", price: "$55" },
];

const AUTO_INTERVAL = 3200;
// A gesture only becomes a drag after moving this many px; below it stays a tap.
const DRAG_THRESHOLD = 6;

type CarouselSlide = {
  reactKey: string;
  title: string;
  priceLabel: string;
  imageUrl: string | null;
  emoji: string;
  gradient: string;
  href?: string;
};

function demoSlides(t: SiteCopy): CarouselSlide[] {
  return SHOWCASE.map((s, i) => ({
    reactKey: `demo-${i}`,
    title: s.titleCopyKey ? (t[s.titleCopyKey] as string) : s.titleFallback,
    priceLabel: s.price,
    imageUrl: null,
    emoji: s.emoji,
    gradient: s.gradient,
  }));
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

type SlotConfig = {
  scale: number;
  offsetPercent: number;
  blur: number;
  opacity: number;
  zIndex: number;
};

/** Horizontal spread (% of card width from center). Larger = cards farther apart; keep scale/blur/opacity unchanged. */
const SLOT_CONFIG: Record<number, SlotConfig> = {
  0: { scale: 1, offsetPercent: 0, blur: 0, opacity: 1, zIndex: 5 },
  1: { scale: 0.82, offsetPercent: 108, blur: 0, opacity: 0.65, zIndex: 4 },
  2: { scale: 0.66, offsetPercent: 184, blur: 0, opacity: 0.3, zIndex: 3 },
};

function getSlotConfig(distance: number): SlotConfig | null {
  if (distance > 2) return null;
  return SLOT_CONFIG[distance] ?? null;
}

function CarouselCard({
  slide,
  style,
  noImageAria,
  priority,
  isCenter,
  onActivate,
}: {
  slide: CarouselSlide;
  style: React.CSSProperties;
  noImageAria: string;
  priority: boolean;
  isCenter: boolean;
  onActivate?: () => void;
}) {
  const inner = (
    <>
      <div
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-surface-raised"
        aria-label={slide.imageUrl ? undefined : noImageAria}
      >
        {slide.imageUrl ? (
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 640px) 180px, 220px"
          />
        ) : (
          <span className="text-5xl sm:text-6xl">{slide.emoji}</span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-[0.95rem] font-semibold leading-snug text-black sm:text-base">
          {slide.title}
        </p>
        <p className="text-lg font-bold tabular-nums text-black">
          {slide.priceLabel}
        </p>
      </div>
    </>
  );

  const focusRing =
    "block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 focus-visible:ring-offset-2";

  let body: React.ReactNode = inner;
  if (isCenter && slide.href) {
    // Centre card opens the listing.
    body = (
      <Link href={slide.href} className={focusRing}>
        {inner}
      </Link>
    );
  } else if (onActivate) {
    // Adjacent card: tap/click to bring it to the centre.
    body = (
      <button type="button" onClick={onActivate} aria-label={slide.title} className={focusRing}>
        {inner}
      </button>
    );
  }

  return (
    <div
      className="absolute left-1/2 top-0 w-[180px] sm:w-[200px] md:w-[220px] will-change-transform"
      style={style}
    >
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
        {body}
      </div>
    </div>
  );
}

export type HeroCarouselProps = {
  locale: Locale;
  noImageAria: string;
  loadingListingsAria: string;
};

export function HeroCarousel({ locale, noImageAria, loadingListingsAria }: HeroCarouselProps) {
  const { ref: sectionRef, active } = useSectionVisible({
    startThreshold: 0.15,
    stopThreshold: 0.05,
    pauseDelayMs: 900,
  });
  const reduced = useReducedMotion();
  const { t } = useSiteShell();

  const configured = isSupabaseBrowserConfigured();
  const demoItems = useMemo(() => demoSlides(t), [t]);

  const [slides, setSlides] = useState<CarouselSlide[]>(() =>
    configured ? [] : demoItems,
  );
  const [loadState, setLoadState] = useState<"loading" | "done">(() =>
    configured ? "loading" : "done",
  );

  useEffect(() => {
    if (!configured) {
      setSlides(demoItems);
      setLoadState("done");
      return;
    }

    let cancelled = false;
    setLoadState("loading");
    setSlides([]);

    (async () => {
      try {
        const client = getSupabaseBrowserClient();
        const { listings, errorMessage } = await fetchHeroCarouselListings(client, { locale });
        if (cancelled) return;
        if (errorMessage) {
          console.error("[PopOut Market] Hero carousel listings failed:", errorMessage);
          setSlides(demoItems);
          setLoadState("done");
          return;
        }
        if (listings.length === 0) {
          setSlides(demoItems);
          setLoadState("done");
          return;
        }
        setSlides(
          listings.map((L) => ({
            reactKey: `post-${L.id}`,
            title: L.title,
            priceLabel: L.priceLabel,
            imageUrl: L.imageUrl,
            emoji: "📦",
            gradient: "from-gray-50 to-gray-200",
            href: toLocalePath(`/market/p/${encodeURIComponent(L.id)}`, locale),
          })),
        );
        setLoadState("done");
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[PopOut Market] Hero carousel listings failed:", msg);
        setSlides(demoItems);
        setLoadState("done");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [configured, demoItems, locale]);

  const total = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const autoTimerRef = useRef<number | null>(null);
  const gestureRef = useRef({ active: false, startX: 0, time: 0, dragging: false });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (total === 0) return;
    setCurrentIndex((i) => mod(i, total));
  }, [total]);

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      if (total === 0) return;
      setCurrentIndex(mod(idx, total));
    },
    [total],
  );

  // Auto-play
  useEffect(() => {
    if (!active || isDragging || total === 0 || reduced) {
      clearAutoTimer();
      return;
    }
    autoTimerRef.current = window.setTimeout(() => {
      goTo(currentIndex + 1);
    }, AUTO_INTERVAL);
    return clearAutoTimer;
  }, [active, isDragging, currentIndex, goTo, clearAutoTimer, total, reduced]);

  // Pointer / touch drag. A gesture only becomes a drag after the pointer moves
  // past DRAG_THRESHOLD; below that it stays a tap, so clicks on the centre card
  // (open listing) and the adjacent cards (recenter) still fire normally, and we
  // don't capture the pointer for taps.
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    gestureRef.current = { active: true, startX: e.clientX, time: Date.now(), dragging: false };
    setDragOffset(0);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (!g.active) return;
    const dx = e.clientX - g.startX;
    if (!g.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      g.dragging = true;
      setIsDragging(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }
    setDragOffset(dx);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const g = gestureRef.current;
      if (!g.active) return;
      g.active = false;
      if (!g.dragging) return; // a tap — let the card's own click handler run
      setIsDragging(false);
      const dx = e.clientX - g.startX;
      const dt = Date.now() - g.time;
      const velocity = Math.abs(dx) / Math.max(dt, 1);
      const threshold = velocity > 0.3 ? 20 : 50;

      if (dx < -threshold) {
        goTo(currentIndex + 1);
      } else if (dx > threshold) {
        goTo(currentIndex - 1);
      }
      setDragOffset(0);
    },
    [currentIndex, goTo],
  );

  const cardWidth = 220;
  // Clamp so a long drag can't fling cards past the rendered neighbours.
  const dragFraction = isDragging
    ? Math.max(-1, Math.min(1, dragOffset / cardWidth))
    : 0;

  const cards: {
    slide: CarouselSlide;
    style: React.CSSProperties;
    dataIdx: number;
    priority: boolean;
    isCenter: boolean;
    onActivate?: () => void;
  }[] = [];

  if (total > 0) {
    for (let offset = -2; offset <= 2; offset++) {
      const dataIdx = mod(currentIndex + offset, total);
      const slide = slides[dataIdx]!;
      const absOffset = Math.abs(offset);
      const slot = getSlotConfig(absOffset);
      if (!slot) continue;

      const direction = offset < 0 ? -1 : offset > 0 ? 1 : 0;
      // Cards follow the drag: drag right → shift right (reveals the previous
      // card from the left); drag left → shift left (reveals the next card).
      const dragShift = dragFraction * SLOT_CONFIG[1]!.offsetPercent;
      const translateX = slot.offsetPercent * direction + dragShift;

      const isCenter = absOffset === 0;
      const isAdjacent = absOffset === 1;
      const style: React.CSSProperties = {
        transform: `translateX(calc(-50% + ${translateX}%)) scale(${slot.scale})`,
        filter: `blur(${slot.blur}px)`,
        opacity: slot.opacity,
        zIndex: slot.zIndex,
        transition: isDragging ? "none" : "all 520ms cubic-bezier(0.32, 0.72, 0, 1)",
        // Centre opens the listing; the two adjacent cards are clickable to
        // recenter. The far (±2) cards stay non-interactive.
        pointerEvents: absOffset <= 1 ? "auto" : "none",
        cursor: isAdjacent ? "pointer" : undefined,
      };

      // The initial centre card (largest, fully opaque) is the LCP element → load it
      // eagerly. Gate on currentIndex === 0 so cycling doesn't accumulate preload links.
      cards.push({
        slide,
        style,
        dataIdx,
        priority: isCenter && currentIndex === 0,
        isCenter,
        // Click an adjacent card to bring it to the centre (A B C → click A ⇒ Z A B).
        onActivate: isAdjacent ? () => goTo(currentIndex + offset) : undefined,
      });
    }
  }

  return (
    <div
      ref={(el) => {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
        containerRef.current = el;
      }}
      className="relative mx-auto w-full max-w-3xl select-none overflow-hidden"
      style={{ touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="relative mx-auto h-[280px] w-full sm:h-[300px] md:h-[320px]">
        {configured && loadState === "loading" ? (
          <div className="flex h-full items-center justify-center">
            <div
              className="h-9 w-9 animate-spin rounded-full border-2 border-black/10 border-t-black/40"
              role="status"
              aria-label={loadingListingsAria}
            />
          </div>
        ) : (
          cards.map(({ slide, style, dataIdx, priority, isCenter, onActivate }) => (
            <CarouselCard
              key={`${dataIdx}-${slide.reactKey}`}
              slide={slide}
              style={style}
              noImageAria={noImageAria}
              priority={priority}
              isCenter={isCenter}
              onActivate={onActivate}
            />
          ))
        )}
      </div>

      {total > 0 && !(configured && loadState === "loading") ? (
        <div className="mt-2 flex items-center justify-center gap-2 sm:mt-3">
          {slides.map((s, i) => (
            <button
              key={s.reactKey}
              type="button"
              aria-label={t.carouselGoToItemAria.replace("{index}", String(i + 1))}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-5 bg-brand-500" : "w-1.5 bg-black/15 hover:bg-black/30"
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
