"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { StarFull, StarHalf } from "@/components/stars";
import { SiteShellProvider } from "@/components/site-chrome-context";
import {
  APP_STORE_BADGE_SRC,
  APP_STORE_URL,
  FOOTER_CONTACT_EMAIL,
  FOOTER_SOCIAL_IMG_INSTAGRAM,
  FOOTER_SOCIAL_IMG_LINKEDIN,
  FOOTER_SOCIAL_IMG_REDNOTE,
  GOOGLE_PLAY_BADGE_SRC,
  GOOGLE_PLAY_URL,
  INNER_MAX,
  LOGO_MARK_SRC,
  LOGO_TEXT_SRC,
  RADIUS,
  SHELL_X,
  SITE_MAIN_SLOT_CLASS,
  footerSocialUrlInstagram,
  footerSocialUrlLinkedIn,
  footerSocialUrlRednote,
} from "@/lib/site-config";
import { readStoredMarketSuburb } from "@/lib/site-suburbs";
import { COPY, LANGUAGE_LIBRARY, LOCALES, type Locale } from "@/lib/site-i18n";
import { LOCALE_FONT_CLASS, fontLatinRounded } from "@/lib/site-fonts";
import {
  localeFromPathname,
  stripLocalePrefix,
  toLocalePath,
} from "@/lib/site-locale-routing";

function FooterSocialLink({
  href,
  ariaLabel,
  children,
}: {
  href: string | null;
  ariaLabel: string;
  children: ReactNode;
}) {
  const shell =
    "inline-flex h-10 w-10 items-center justify-center border border-gray-200/90 bg-white p-1.5 shadow-sm transition sm:h-11 sm:w-11";
  const radiusStyle = { borderRadius: RADIUS.sheet } as const;
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        style={radiusStyle}
        className={`${shell} hover:border-gray-300 hover:shadow`}
      >
        {children}
      </a>
    );
  }
  return (
    <span
      style={radiusStyle}
      className={`${shell} border-dashed border-gray-300/90`}
      aria-label={ariaLabel}
      role="group"
    >
      {children}
    </span>
  );
}

function suburbHubLabel(locale: Locale): string {
  switch (locale) {
    case "zh-Hans":
      return "了解更多墨尔本区域";
    case "zh-Hant":
      return "了解更多墨爾本區域";
    case "ko":
      return "멜버른 지역 더 알아보기";
    case "ja":
      return "メルボルンのエリアを詳しく見る";
    case "vi":
      return "Tìm hiểu thêm về các khu vực Melbourne";
    case "fr":
      return "En savoir plus sur les quartiers de Melbourne";
    case "es":
      return "Conoce más zonas de Melbourne";
    default:
      return "Learn More Melbourne Suburbs";
  }
}

function comparisonHubLabel(locale: Locale): string {
  switch (locale) {
    case "zh-Hans":
      return "对比其他二手平台";
    case "zh-Hant":
      return "比較其他二手平台";
    case "ko":
      return "다른 중고 마켓과 비교";
    case "ja":
      return "他の中古マーケットと比較";
    case "vi":
      return "So sánh với chợ đồ cũ khác";
    case "fr":
      return "Comparer avec d'autres marchés d'occasion";
    case "es":
      return "Comparar con otros mercados de segunda mano";
    default:
      return "Comparison with other second-hand markets";
  }
}

function footerFaqLabel(locale: Locale): string {
  switch (locale) {
    case "zh-Hans":
    case "zh-Hant":
      return "F&Q";
    default:
      return "F&Q";
  }
}

const FOOTER_COPYRIGHT_EN = "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.";
const FOOTER_ABN_EN = "ABN 76 696 464 945";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [marketHref, setMarketHref] = useState("/en/market");
  const [langOpen, setLangOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const languageModalRef = useRef<HTMLDivElement | null>(null);
  const t = COPY[locale];
  const localeFontClass = LOCALE_FONT_CLASS[locale] ?? fontLatinRounded.className;
  const basePath = stripLocalePrefix(pathname);
  const isMarket = basePath === "/market" || basePath.startsWith("/market/");

  function withLocale(href: string): string {
    if (href.startsWith("mailto:") || href.startsWith("http")) return href;
    return toLocalePath(href, locale);
  }

  function switchLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    setLangOpen(false);
    setLanguageModalOpen(false);
    const currentPath = typeof window !== "undefined" ? window.location.pathname : pathname;
    const nextPath = toLocalePath(currentPath, nextLocale);
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.push(`${nextPath}${search}`);
  }

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setLangOpen(false);
      }
      if (languageModalRef.current && !languageModalRef.current.contains(target)) {
        setLanguageModalOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLanguageModalOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const pathLocale =
      localeFromPathname(typeof window !== "undefined" ? window.location.pathname : pathname) ??
      "en";
    setLocale(pathLocale);
  }, [pathname]);

  useEffect(() => {
    const suburb = readStoredMarketSuburb();
    if (suburb) {
      setMarketHref(withLocale(`/market?area=${encodeURIComponent(suburb)}`));
    } else {
      setMarketHref(withLocale("/market"));
    }
  }, [pathname, locale]);

  return (
    <SiteShellProvider
      value={{
        locale,
        t,
        openLanguageModal: () => setLanguageModalOpen(true),
        localizePath: withLocale,
      }}
    >
      <main className={`flex min-h-screen flex-col bg-gray-100 ${localeFontClass}`}>
        <header className={`${SHELL_X} fixed inset-x-0 top-0 z-40 pb-4 pt-6`}>
          <div
            className={`${INNER_MAX} flex h-14 items-center justify-between gap-2 bg-white shadow-md`}
            style={{ borderRadius: RADIUS.sheet }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <Link
                href={withLocale("/")}
                className="flex min-h-0 min-w-0 shrink-0 items-center py-1"
                aria-label={t.homeAria}
              >
                <Image
                  src={LOGO_TEXT_SRC}
                  alt="PopOut"
                  width={320}
                  height={80}
                  priority
                  className="h-[clamp(1.15rem,3.2vw,2.5rem)] w-auto max-w-[min(56vw,220px)] object-contain object-left sm:max-w-[min(72vw,280px)]"
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 240px, 280px"
                />
              </Link>
              <Link
                href={marketHref}
                className={`inline-flex h-9 shrink-0 items-center rounded-[11px] border px-3 text-sm font-semibold backdrop-blur-xl transition ${
                  isMarket
                    ? "border-2 border-white/70 bg-white/70 text-gray-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_4px_12px_rgba(15,23,42,0.14)]"
                    : "border-white/70 bg-white/70 text-gray-800 hover:bg-white/85"
                }`}
              >
                {t.marketPageTitle}
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setLanguageModalOpen(true);
                    setLangOpen(false);
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-[11px] border border-white/70 bg-white/70 px-0 text-sm font-medium text-gray-700 backdrop-blur-xl transition hover:bg-white/85 sm:hidden"
                  aria-label={t.topLanguage}
                >
                  <svg
                    className="h-4.5 w-4.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M3.5 12h17" />
                    <path d="M12 3.5c2.5 2.2 4 5.3 4 8.5s-1.5 6.3-4 8.5" />
                    <path d="M12 3.5c-2.5 2.2-4 5.3-4 8.5s1.5 6.3 4 8.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setLangOpen((prev) => !prev)}
                  className="hidden h-9 items-center gap-1.5 rounded-[11px] border border-white/70 bg-white/70 px-3 text-sm font-medium text-gray-700 backdrop-blur-xl transition hover:bg-white/85 sm:inline-flex"
                  aria-haspopup="menu"
                  aria-expanded={langOpen}
                  aria-label={t.topLanguage}
                >
                  <svg
                    className="h-4.5 w-4.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M3.5 12h17" />
                    <path d="M12 3.5c2.5 2.2 4 5.3 4 8.5s-1.5 6.3-4 8.5" />
                    <path d="M12 3.5c-2.5 2.2-4 5.3-4 8.5s1.5 6.3 4 8.5" />
                  </svg>
                  <span>{t.topLanguage}</span>
                  <svg
                    className={`h-4 w-4 transition ${langOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.12l3.71-3.89a.75.75 0 1 1 1.08 1.04l-4.25 4.45a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {langOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 min-w-[11rem] overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur"
                  >
                    {LOCALES.map((item) => {
                      const selected = item.code === locale;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          role="menuitemradio"
                          aria-checked={selected}
                          onClick={() => {
                            switchLocale(item.code);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                            selected
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{item.label}</span>
                          {selected ? <span className="text-xs">✓</span> : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <a
                href="#download"
                aria-label={t.topDownload}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/70 bg-white/70 px-0 text-sm font-semibold text-blue-700 backdrop-blur-xl transition hover:bg-white/85 sm:w-auto sm:px-3.5"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M12 4v11" />
                  <path d="m7.5 11 4.5 4.5 4.5-4.5" />
                  <path d="M5 20h14" />
                </svg>
                <span className="hidden sm:inline">{t.topDownload}</span>
              </a>
            </div>
          </div>
        </header>

        {/* Spacer for fixed top bar: pt-6 + h-14 + pb-4 = 96px */}
        <div className="h-24 shrink-0" aria-hidden />

        <div className={SITE_MAIN_SLOT_CLASS}>{children}</div>

        {languageModalOpen ? (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/25 px-3 py-4 backdrop-blur-[2px] sm:px-4">
            <div
              ref={languageModalRef}
              className="w-full max-w-xl max-h-[84vh] overflow-y-auto rounded-[20px] border border-white/35 bg-white/85 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:rounded-[24px] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                    {t.languageModalTitle}
                  </h2>
                  <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                    {t.languageModalHint}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLanguageModalOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:text-gray-900"
                  aria-label="Close language picker"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {LANGUAGE_LIBRARY.map((item) => {
                  const selected = item.code === locale;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        switchLocale(item.code);
                      }}
                      className={`group rounded-2xl border px-3 py-2.5 text-left transition ${
                        selected
                          ? "border-blue-300 bg-blue-50/90"
                          : "border-gray-200 bg-white/80 hover:border-gray-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[1rem] font-semibold text-gray-900">
                          {item.display}
                        </span>
                        <span className="align-super text-[10px] font-semibold tracking-wide text-gray-500">
                          {item.short}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">{item.native}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        <footer
          id="download"
          className={`${SHELL_X} border-t border-gray-300 bg-gray-100 py-8`}
        >
          <div className={INNER_MAX}>
            <div className="py-4 sm:py-6">
              <div className="flex w-fit max-w-full flex-col gap-3 min-[760px]:w-full min-[760px]:max-w-none min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between min-[760px]:gap-5">
                <div className="flex min-w-0 items-center gap-3 min-[760px]:flex-1 sm:gap-4">
                  <Image
                    src={LOGO_MARK_SRC}
                    alt=""
                    width={112}
                    height={112}
                    className="h-12 w-12 shrink-0 rounded-xl border border-gray-200 bg-white object-cover shadow-sm sm:h-14 sm:w-14"
                  />
                  <div className="min-w-0">
                    <p className="text-balance text-sm font-semibold leading-snug text-gray-800 sm:text-base">
                      {t.downloadLine}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-gray-600 sm:text-sm">
                      {t.slogan}
                    </p>
                    <div
                      className="mt-2 inline-flex items-center gap-0.5"
                      role="img"
                      aria-label={t.ratingAria}
                    >
                      {[0, 1, 2, 3].map((i) => (
                        <StarFull
                          key={i}
                          className="h-3.5 w-3.5 text-black sm:h-4 sm:w-4"
                        />
                      ))}
                      <StarHalf />
                    </div>
                  </div>
                </div>

                <div className="flex w-full shrink-0 flex-row flex-wrap items-center justify-center gap-px self-stretch leading-none min-[760px]:w-auto min-[760px]:flex-nowrap min-[760px]:justify-end min-[760px]:gap-0 min-[760px]:self-auto">
                  <Link
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit justify-center leading-none min-[760px]:justify-end"
                  >
                    <Image
                      src={APP_STORE_BADGE_SRC}
                      alt={t.appStoreAlt}
                      width={300}
                      height={100}
                      className="block h-[4.75rem] w-auto max-w-[min(100%,440px)] object-contain sm:h-[5.5rem] md:h-24 lg:h-[6.5rem]"
                    />
                  </Link>
                  <Link
                    href={GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit justify-center leading-none min-[760px]:justify-end min-[760px]:-ml-2"
                  >
                    <Image
                      src={GOOGLE_PLAY_BADGE_SRC}
                      alt={t.googlePlayAlt}
                      width={320}
                      height={100}
                      className="block h-[4.75rem] w-auto max-w-[min(100%,460px)] object-contain sm:h-[5.5rem] md:h-24 lg:h-[6.5rem]"
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-6 sm:pt-8">
              <div className="flex flex-wrap items-center justify-center gap-4 min-[760px]:justify-start">
                <FooterSocialLink href={footerSocialUrlRednote()} ariaLabel={t.footerSocialRednoteAria}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                    <Image
                      src={FOOTER_SOCIAL_IMG_REDNOTE}
                      alt=""
                      width={32}
                      height={32}
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </FooterSocialLink>
                <FooterSocialLink href={footerSocialUrlInstagram()} ariaLabel={t.footerSocialInstagramAria}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                    <Image
                      src={FOOTER_SOCIAL_IMG_INSTAGRAM}
                      alt=""
                      width={32}
                      height={32}
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </FooterSocialLink>
                <FooterSocialLink href={footerSocialUrlLinkedIn()} ariaLabel={t.footerSocialLinkedInAria}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                    <Image
                      src={FOOTER_SOCIAL_IMG_LINKEDIN}
                      alt=""
                      width={32}
                      height={32}
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </FooterSocialLink>
              </div>

              <div className="mt-6 space-y-1 text-center text-xs leading-relaxed text-gray-600 sm:text-sm min-[760px]:text-left">
                <p>{FOOTER_COPYRIGHT_EN}</p>
                <p>{FOOTER_ABN_EN}</p>
                <p>
                  <a
                    href={`mailto:${FOOTER_CONTACT_EMAIL}`}
                    className="font-medium text-black underline decoration-gray-400 underline-offset-2 hover:text-black hover:decoration-gray-400"
                  >
                    {FOOTER_CONTACT_EMAIL}
                  </a>
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link
                  href={withLocale("/melbourne-suburbs")}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200/90 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-xl transition hover:bg-white"
                >
                  {suburbHubLabel(locale)}
                  <svg
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href={withLocale("/comparison")}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200/90 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-xl transition hover:bg-white"
                >
                  {comparisonHubLabel(locale)}
                  <svg
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>

              <nav
                className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-black sm:text-sm min-[760px]:justify-start"
                aria-label={t.footerLegalNavAria}
              >
                <Link
                  href={withLocale("/about")}
                  className="font-medium text-black underline-offset-2 decoration-gray-400 hover:text-black hover:underline hover:decoration-gray-400"
                >
                  {t.footerNavAbout}
                </Link>
                <span className="select-none text-gray-300" aria-hidden>
                  |
                </span>
                <Link
                  href={withLocale("/faq")}
                  className="font-medium text-black underline-offset-2 decoration-gray-400 hover:text-black hover:underline hover:decoration-gray-400"
                >
                  {footerFaqLabel(locale)}
                </Link>
                <span className="select-none text-gray-300" aria-hidden>
                  |
                </span>
                <Link
                  href={withLocale("/terms")}
                  className="font-medium text-black underline-offset-2 decoration-gray-400 hover:text-black hover:underline hover:decoration-gray-400"
                >
                  {t.footerNavTerms}
                </Link>
                <span className="select-none text-gray-300" aria-hidden>
                  |
                </span>
                <Link
                  href={withLocale("/privacy")}
                  className="font-medium text-black underline-offset-2 decoration-gray-400 hover:text-black hover:underline hover:decoration-gray-400"
                >
                  {t.footerNavPrivacy}
                </Link>
                <span className="select-none text-gray-300" aria-hidden>
                  |
                </span>
                <a
                  href={`mailto:${FOOTER_CONTACT_EMAIL}`}
                  className="font-medium text-black underline-offset-2 decoration-gray-400 hover:text-black hover:underline hover:decoration-gray-400"
                >
                  {t.footerNavContact}
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </main>
    </SiteShellProvider>
  );
}
