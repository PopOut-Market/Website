"use client";

import { fetchHeroCarouselListings } from "@/lib/supabase/fetch-market-listings";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/browser-client";
import type { Locale } from "@/lib/site-i18n";
import { toLocalePath } from "@/lib/site-locale-routing";
import { useSectionVisible } from "@/lib/use-section-visible";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DemoShowcaseItem = {
  emoji: string;
  gradient: string;
  titleKey: string;
  price: string;
};

const SHOWCASE: DemoShowcaseItem[] = [
  { emoji: "🪑", gradient: "from-amber-50 to-orange-100", titleKey: "Wooden Dining Chair", price: "$45" },
  { emoji: "🚲", gradient: "from-sky-50 to-blue-100", titleKey: "Mountain Bike", price: "$180" },
  { emoji: "📱", gradient: "from-gray-50 to-slate-100", titleKey: "iPhone 14 Pro", price: "$890" },
  { emoji: "🎸", gradient: "from-rose-50 to-pink-100", titleKey: "Acoustic Guitar", price: "$120" },
  { emoji: "🎧", gradient: "from-violet-50 to-purple-100", titleKey: "Wireless Headphones", price: "$65" },
  { emoji: "📚", gradient: "from-emerald-50 to-green-100", titleKey: "Textbook Bundle", price: "$30" },
  { emoji: "⌚", gradient: "from-yellow-50 to-amber-100", titleKey: "Smart Watch", price: "$210" },
  { emoji: "🎮", gradient: "from-indigo-50 to-blue-100", titleKey: "Game Controller", price: "$55" },
];

const AUTO_INTERVAL = 3200;

type CarouselSlide = {
  reactKey: string;
  title: string;
  priceLabel: string;
  imageUrl: string | null;
  emoji: string;
  gradient: string;
  href?: string;
};

function demoSlides(): CarouselSlide[] {
  return SHOWCASE.map((s, i) => ({
    reactKey: `demo-${i}`,
    title: s.titleKey,
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
  1: { scale: 0.82, offsetPercent: 108, blur: 1.5, opacity: 0.65, zIndex: 4 },
  2: { scale: 0.66, offsetPercent: 184, blur: 4, opacity: 0.3, zIndex: 3 },
};

function getSlotConfig(distance: number): SlotConfig | null {
  if (distance > 2) return null;
  return SLOT_CONFIG[distance] ?? null;
}

function CarouselCard({
  slide,
  style,
  noImageAria,
}: {
  slide: CarouselSlide;
  style: React.CSSProperties;
  noImageAria: string;
}) {
  const inner = (
    <>
      <div
        className={`relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-gradient-to-b ${slide.gradient}`}
        aria-label={slide.imageUrl ? undefined : noImageAria}
      >
        {slide.imageUrl ? (
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 180px, 220px"
          />
        ) : (
          <span className="text-5xl sm:text-6xl drop-shadow-sm">{slide.emoji}</span>
        )}
      </div>
      <div className="px-3 py-2.5 sm:px-3.5">
        <p className="truncate text-[13px] font-semibold leading-tight text-gray-900 sm:text-sm">
          {slide.title}
        </p>
        <p className="mt-0.5 text-sm font-bold tabular-nums text-gray-800 sm:text-base">
          {slide.priceLabel}
        </p>
      </div>
    </>
  );

  return (
    <div
      className="absolute left-1/2 top-0 w-[180px] sm:w-[200px] md:w-[220px] will-change-transform"
      style={style}
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-lg shadow-black/[0.06]">
        {slide.href ? (
          <Link href={slide.href} className="block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 focus-visible:ring-offset-2">
            {inner}
          </Link>
        ) : (
          inner
        )}
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

  const configured = isSupabaseBrowserConfigured();
  const demoItems = useMemo(() => demoSlides(), []);

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
            gradient: "from-gray-50 to-slate-100",
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
  const dragStartRef = useRef({ x: 0, time: 0 });
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
    if (!active || isDragging || total === 0) {
      clearAutoTimer();
      return;
    }
    autoTimerRef.current = window.setTimeout(() => {
      goTo(currentIndex + 1);
    }, AUTO_INTERVAL);
    return clearAutoTimer;
  }, [active, isDragging, currentIndex, goTo, clearAutoTimer, total]);

  // Pointer / touch drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragOffset(0);
    dragStartRef.current = { x: e.clientX, time: Date.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      setDragOffset(dx);
    },
    [isDragging],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const dx = e.clientX - dragStartRef.current.x;
      const dt = Date.now() - dragStartRef.current.time;
      const velocity = Math.abs(dx) / Math.max(dt, 1);
      const threshold = velocity > 0.3 ? 20 : 50;

      if (dx < -threshold) {
        goTo(currentIndex + 1);
      } else if (dx > threshold) {
        goTo(currentIndex - 1);
      }
      setDragOffset(0);
    },
    [isDragging, currentIndex, goTo],
  );

  const cardWidth = 220;
  const dragFraction = isDragging ? dragOffset / cardWidth : 0;

  const cards: { slide: CarouselSlide; style: React.CSSProperties; dataIdx: number }[] = [];

  if (total > 0) {
    for (let offset = -2; offset <= 2; offset++) {
      const dataIdx = mod(currentIndex + offset, total);
      const slide = slides[dataIdx]!;
      const absOffset = Math.abs(offset);
      const slot = getSlotConfig(absOffset);
      if (!slot) continue;

      const direction = offset < 0 ? -1 : offset > 0 ? 1 : 0;
      const dragShift = dragFraction * -SLOT_CONFIG[1]!.offsetPercent;
      const translateX = slot.offsetPercent * direction + dragShift;

      const style: React.CSSProperties = {
        transform: `translateX(calc(-50% + ${translateX}%)) scale(${slot.scale})`,
        filter: `blur(${slot.blur}px)`,
        opacity: slot.opacity,
        zIndex: slot.zIndex,
        transition: isDragging ? "none" : "all 520ms cubic-bezier(0.32, 0.72, 0, 1)",
        pointerEvents: absOffset === 0 ? "auto" : "none",
      };

      cards.push({ slide, style, dataIdx });
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
      <div className="relative mx-auto h-[290px] w-full sm:h-[320px] md:h-[350px]">
        {configured && loadState === "loading" ? (
          <div className="flex h-full items-center justify-center">
            <div
              className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700"
              role="status"
              aria-label={loadingListingsAria}
            />
          </div>
        ) : (
          cards.map(({ slide, style, dataIdx }) => (
            <CarouselCard
              key={`${dataIdx}-${slide.reactKey}`}
              slide={slide}
              style={style}
              noImageAria={noImageAria}
            />
          ))
        )}
      </div>

      {total > 0 && !(configured && loadState === "loading") ? (
        <div className="mt-2 flex items-center justify-center gap-1.5 sm:mt-3">
          {slides.map((s, i) => (
            <button
              key={s.reactKey}
              type="button"
              aria-label={`Go to item ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-5 bg-gray-800" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
