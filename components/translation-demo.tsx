"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteCopy } from "@/lib/site-i18n";
import type { Locale } from "@/lib/site-i18n";
import { POPOUT_BRAND_GRADIENT_TEXT_CLASS } from "@/lib/site-config";
import { useSectionVisible } from "@/lib/use-section-visible";

const LOCALE_FLAG: Record<Locale, string> = {
  en: "🇦🇺",
  "zh-Hans": "🇨🇳",
  "zh-Hant": "🇹🇼",
  ko: "🇰🇷",
  ja: "🇯🇵",
  vi: "🇻🇳",
  fr: "🇫🇷",
  es: "🇪🇸",
};

const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  "zh-Hans": "中文",
  "zh-Hant": "繁體中文",
  ko: "한국어",
  ja: "日本語",
  vi: "Tiếng Việt",
  fr: "Français",
  es: "Español",
};

type ChatPair = {
  from: Locale;
  to: Locale;
  fromText: string;
  toText: string;
};

const CHAT_PAIRS: ChatPair[] = [
  { from: "zh-Hans", to: "ko",      fromText: "这个桌子还在吗？",                   toText: "이 테이블 아직 있나요?" },
  { from: "vi",      to: "en",      fromText: "Bàn này còn không?",               toText: "Is this table still available?" },
  { from: "ja",      to: "fr",      fromText: "このテーブルまだありますか？",           toText: "Cette table est-elle encore disponible ?" },
  { from: "es",      to: "zh-Hans", fromText: "¿Esta mesa sigue disponible?",     toText: "这张桌子还在吗？" },
  { from: "ko",      to: "ja",      fromText: "이 테이블 아직 있나요?",              toText: "このテーブルまだありますか？" },
  { from: "en",      to: "vi",      fromText: "Is this table still available?",   toText: "Bàn này còn không?" },
  { from: "zh-Hant", to: "es",      fromText: "這張桌子還在嗎？",                    toText: "¿Sigue disponible esta mesa?" },
  { from: "fr",      to: "zh-Hant", fromText: "Cette table est-elle disponible ?", toText: "這張桌子還在嗎？" },
];

const CYCLE_MS = 4000;
const FADE_MS = 600;

function PhoneFrame({
  flag,
  label,
  bubble,
  align,
  visible,
}: {
  flag: string;
  label: string;
  bubble: string;
  align: "right" | "left";
  visible: boolean;
}) {
  const isRight = align === "right";
  return (
    <div className="flex w-full max-w-[280px] flex-col overflow-hidden rounded-[28px] border border-gray-200/80 bg-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:max-w-[300px]">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <span className="text-lg leading-none">{flag}</span>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>

      <div className="flex min-h-[120px] flex-col justify-end px-4 py-5 sm:min-h-[140px]">
        <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isRight
                ? "rounded-br-md bg-gradient-to-br from-[#FF0048] to-[#FF6600] text-white"
                : "rounded-bl-md bg-gray-100 text-gray-900"
            } ${
              visible
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-2 opacity-0 blur-[1px]"
            }`}
          >
            {bubble}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

export function TranslationDemo({ t }: { t: SiteCopy }) {
  const { ref: sectionRef, active } = useSectionVisible({
    startThreshold: 0.16,
    stopThreshold: 0.05,
    pauseDelayMs: 1000,
  });
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const cycleRef = useRef<number | null>(null);
  const fadeRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (cycleRef.current !== null) { window.clearTimeout(cycleRef.current); cycleRef.current = null; }
    if (fadeRef.current !== null) { window.clearTimeout(fadeRef.current); fadeRef.current = null; }
  }, []);

  useEffect(() => {
    if (!active) { clear(); return; }
    const run = () => {
      setVisible(false);
      fadeRef.current = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % CHAT_PAIRS.length);
        setVisible(true);
        cycleRef.current = window.setTimeout(run, CYCLE_MS);
      }, FADE_MS);
    };
    cycleRef.current = window.setTimeout(run, CYCLE_MS);
    return clear;
  }, [active, clear]);

  const pair = CHAT_PAIRS[index]!;
  const isEnglishTitle = t.translationDemoTitle === "Say it once. Everyone understands.";

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="flex flex-col items-center px-[1.05rem] pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28"
    >
      <div className="max-w-3xl text-center">
        <h2 className="text-balance text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl md:text-3xl">
          {isEnglishTitle ? (
            <>
              <span>Say it once. </span>
              <span className={POPOUT_BRAND_GRADIENT_TEXT_CLASS}>Everyone</span>
              <span> understands.</span>
            </>
          ) : (
            t.translationDemoTitle
          )}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-sm leading-relaxed text-gray-500 sm:text-base">
          {t.translationDemoSubtitle}
        </p>
      </div>

      {/* Desktop: side by side */}
      <div className="mt-10 hidden items-center gap-6 sm:flex md:gap-10">
        <PhoneFrame
          flag={LOCALE_FLAG[pair.from]}
          label={LOCALE_LABEL[pair.from]}
          bubble={pair.fromText}
          align="right"
          visible={visible}
        />
        <div className="flex flex-col items-center gap-1">
          <ArrowIcon className="h-6 w-6 text-gray-300" />
        </div>
        <PhoneFrame
          flag={LOCALE_FLAG[pair.to]}
          label={LOCALE_LABEL[pair.to]}
          bubble={pair.toText}
          align="left"
          visible={visible}
        />
      </div>

      {/* Mobile: stacked */}
      <div className="mt-8 flex flex-col items-center gap-4 sm:hidden">
        <PhoneFrame
          flag={LOCALE_FLAG[pair.from]}
          label={LOCALE_LABEL[pair.from]}
          bubble={pair.fromText}
          align="right"
          visible={visible}
        />
        <svg
          className="h-5 w-5 rotate-90 text-gray-300"
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
        <PhoneFrame
          flag={LOCALE_FLAG[pair.to]}
          label={LOCALE_LABEL[pair.to]}
          bubble={pair.toText}
          align="left"
          visible={visible}
        />
      </div>
    </section>
  );
}
