"use client";

import { AiPostDemo } from "@/components/ai-post-demo";
import { BrandEmphasis } from "@/components/brand-emphasis";
import { HeroSuburbRotator } from "@/components/hero-suburb-rotator";
import { HomeCommunityTopics } from "@/components/home-community-topics";
import { isGuideLocale } from "@/lib/grocery-guide-copy";
import { HERO_SUBURBS } from "@/lib/hero-suburbs";
import { HomeListingStrip } from "@/components/home-listing-strip";
import { HomeShopWall } from "@/components/home-shop-wall";
import { HomeSuburbCount } from "@/components/home-suburb-count";
import { HomeSuburbField } from "@/components/home-suburb-field";
import { HomeTrustChain } from "@/components/home-trust-chain";
import { useSiteShell } from "@/components/site-chrome-context";
import { Reveal } from "@/components/motion/reveal";
import { TranslationDemo } from "@/components/translation-demo";
import {
  APP_STORE_URL,
  INNER_MAX,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_PILL_CLASS,
} from "@/lib/site-config";
import type { FeedListing } from "@/lib/supabase/server-feed";
import type { GuideShop } from "@/lib/supabase/server-shops";
import { useRevealOnce } from "@/lib/use-reveal-once";
import { useSectionVisible } from "@/lib/use-section-visible";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The homepage, rebuilt around the app's actual positioning.
 *
 * Two rules govern the section order, and both were deliberate:
 *
 *  1. The second-hand block stays first and stays the largest. This page is the
 *     one URL verified to rank #1 and to be quoted first by an answer engine for
 *     `melbourne second hand marketplace app`. Leading with Local Deals would
 *     demote a vertical holding ~1,100 live listings in favour of one that is a
 *     few weeks old and covers 16 CBD shops. The repositioning is *added*
 *     (sections 4-6), not substituted.
 *  2. Every claim maps to something the app ships today. The previous version of
 *     this page led with an AI auto-reply demo for a feature switched off for
 *     every user on 2026-06-19.
 *
 * The rotating-word <h1> is gone. It hard-coded "used {item}" with no geography,
 * and its invisible width-measuring span meant the server HTML read
 * "Find used furniturefurniture in PopOut Market" — the doubled word being
 * exactly what a text-extracting crawler took as the page's primary heading.
 */

/**
 * One scroll-revealed section.
 *
 * The reveal trigger lives HERE, on the section, not on each child: these
 * sections hold roughly sixty animated elements between them, and one observer
 * per element would mean sixty observers and sixty intersection computations on
 * the first scroll. Children take the single `shown` boolean and add their own
 * `transitionDelay`.
 */

/**
 * ONE design language for every band on this page.
 *
 * The page had two of them fighting: the older demos are centred, restrained and
 * sit on the page's own white, while the sections added with the repositioning
 * were left-aligned, heavier, and alternated white and grey. Read together that
 * looked like two different pages stitched at the middle.
 *
 * These constants settle it in favour of the demos, because that is the look
 * that was already here and already worked: a centred heading and subtitle in a
 * narrow measure, then the section's content full width beneath them. Every
 * section uses these — do not hand-roll a heading class.
 */
const SECTION_PADDING = "px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28";
const SECTION_HEADING =
  "text-balance text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl md:text-3xl";
const SECTION_SUBTITLE =
  "mx-auto mt-3 max-w-xl text-balance text-sm leading-relaxed text-gray-500 sm:text-base";

/**
 * The background rhythm, strictly alternating from the hero down so no two
 * neighbouring bands share a tone. The footer is white with a top border, so the
 * last section is deliberately grey and the two never merge.
 */
type SectionTone = "white" | "raised";
const TONE_CLASS: Record<SectionTone, string> = {
  white: "bg-white",
  raised: "bg-surface-raised",
};

/** Wraps a demo component that renders its own transparent <section>. */
function ToneBand({ tone, children }: { tone: SectionTone; children: ReactNode }) {
  return <div className={TONE_CLASS[tone]}>{children}</div>;
}

function Section({
  id,
  title,
  subtitle,
  children,
  tone = "white",
  titleSlot,
}: {
  id: string;
  title: string;
  /** Rendered under the heading, centred, in the shared subtitle style. */
  subtitle?: string;
  children?: (shown: boolean) => ReactNode;
  tone: SectionTone;
  /** Receives the section's own reveal flag, so a heading can animate with it. */
  titleSlot?: (shown: boolean) => { token: string; node: ReactNode };
}) {
  const { ref, shown } = useRevealOnce<HTMLElement>();

  return (
    <section id={id} ref={ref} className={`w-full ${SECTION_PADDING} ${TONE_CLASS[tone]}`}>
      <div className={INNER_MAX}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal as="h2" show={shown} id={`${id}-title`} className={SECTION_HEADING}>
            <BrandEmphasis text={title} slot={titleSlot?.(shown)} />
          </Reveal>
          {subtitle ? (
            <Reveal as="p" show={shown} delayMs={80} className={SECTION_SUBTITLE}>
              {subtitle}
            </Reveal>
          ) : null}
        </div>
        {children?.(shown)}
      </div>
    </section>
  );
}

export function HomePageContent({
  listings,
  priceLabels,
  suburbCount,
  suburbNames,
  shops,
}: {
  listings: FeedListing[];
  priceLabels: string[];
  suburbCount: number;
  suburbNames: string[];
  shops: GuideShop[];
}) {
  const { t, localizePath, locale } = useSiteShell();

  const trustLine = t.heroTrustLine.replace("{count}", String(suburbCount));

  // Split on the slot, keeping it, so each locale decides where the place name
  // sits — Chinese, Japanese and Korean all lead with it, English does not.
  const heroTitleParts = t.heroTitle.split(/(\{suburb\})/);

  const { ref: heroRef, active: heroActive } = useSectionVisible({
    startThreshold: 0.12,
    stopThreshold: 0.05,
    pauseDelayMs: 700,
  });

  return (
    <>
      {/* 1 — Hero. `heroTitle` is a template with one {suburb} slot; real,
          currently-active Melbourne suburbs rotate through it (lib/hero-suburbs.ts).
          This is the page's only perpetual animation, which is why it is gated on
          `heroActive` — off screen or in a background tab, it stops. */}
      <section
        ref={heroRef as React.RefObject<HTMLElement>}
        className="flex flex-col items-center bg-white px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 md:pt-24"
      >
        <div className="flex max-w-3xl flex-col items-center text-center">
          {/* `text-pretty`, not `text-balance`: balancing re-computes the line break
              from the full text, so every rotation of the suburb name would shift
              where the heading wraps. `text-pretty` only guards against orphans. */}
          <h1 className="text-pretty text-[clamp(1.75rem,5.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-black">
            {heroTitleParts.map((part, i) =>
              part === "{suburb}" ? (
                <HeroSuburbRotator key={i} suburbs={HERO_SUBURBS} active={heroActive} />
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-black/60 sm:text-lg">
            {t.heroLead}
          </p>
          <p className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-black/45">
            {trustLine}
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${PRIMARY_BUTTON_CLASS} w-full px-8 py-4 text-base sm:w-auto sm:text-lg`}
            >
              {t.heroGetAppCta}
            </Link>
            <Link
              href={localizePath("/market")}
              className={`${SECONDARY_PILL_CLASS} w-full px-8 py-4 text-base sm:w-auto sm:text-lg`}
            >
              {t.heroBrowseCta}
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — Second-hand. First and largest, on purpose: this is the equity. */}
      <Section
        id="second-hand"
        tone="raised"
        title={t.homeMarketTitle}
        subtitle={t.homeMarketSubtitle}
      >
        {(shown) => (
          <>
            <Reveal show={shown} delayMs={160} className="mt-7 flex flex-wrap justify-center gap-2">
              {[t.homeMarketFilterAll, t.homeMarketFilterGiveaway, t.homeMarketFilterUnder20].map(
                (chip, i) => (
                  <span
                    key={chip}
                    aria-hidden
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
                      i === 0
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-gray-400 bg-white text-gray-900"
                    }`}
                  >
                    {chip}
                  </span>
                ),
              )}
            </Reveal>

            <Reveal show={shown} delayMs={240} className="mt-8">
              <HomeListingStrip listings={listings} priceLabels={priceLabels} />
            </Reveal>

            <Reveal show={shown} delayMs={360} className="mt-8 text-center">
              <Link
                href={localizePath("/market")}
                className={`${SECONDARY_PILL_CLASS} px-6 py-3 text-sm sm:text-base`}
              >
                {t.homeMarketBrowseAll}
              </Link>
            </Reveal>
          </>
        )}
      </Section>

      {/* 3 — Translation. Rescoped from listings-only to listings, chat AND
          community posts; all three are true today. The component renders its own
          transparent <section>, so the band tone is applied by the wrapper. */}
      <ToneBand tone="white">
        <TranslationDemo t={t} />
      </ToneBand>

      {/* 4 — AI listing creation, plus the bulk flow the site has never mentioned.
          The bulk line lives inside this band so it cannot end up on a different
          background from the demo it describes. */}
      <ToneBand tone="raised">
        <AiPostDemo t={t} />
        <div className="px-4 pb-16 sm:px-6 sm:pb-20">
          <div className={INNER_MAX}>
            <p className={`${SECTION_SUBTITLE} text-center`}>{t.homeBulkListingLine}</p>
          </div>
        </div>
      </ToneBand>

      {/* 5 — Local deals on the map. NEW: App Store pillar 1. */}
      <Section
        id="local-shops"
        tone="white"
        title={t.homeShopsTitle}
        subtitle={t.homeShopsSubtitle}
      >
        {(shown) => (
          <>
            <HomeShopWall shops={shops} show={shown} labelledBy="local-shops-title" />
            {/* The guide ships in four locales only, so the link is hidden in the
                other four rather than pointing them at a 404. A missing link is a
                smaller harm than a dead one — especially directly beneath
                fourteen photographs promising the page exists. */}
            {isGuideLocale(locale) ? (
              <Reveal show={shown} delayMs={560} className="mt-8 text-center">
                <Link
                  href={localizePath("/melbourne-cbd-asian-grocery-guide")}
                  className={`${SECONDARY_PILL_CLASS} px-6 py-3 text-sm sm:text-base`}
                >
                  {t.homeShopsCta}
                </Link>
              </Reveal>
            ) : null}
          </>
        )}
      </Section>

      {/* 6 — Community. NEW: App Store pillar 3.
          No post content of any kind is rendered here, and none ever should be:
          the app's own spec forbids making a community post publicly searchable,
          and the live /l/ share handler serves `noindex, nofollow` to enforce it.
          The five topic names are product labels, not user content. */}
      <Section
        id="community"
        tone="raised"
        title={t.homeCommunityTitle}
        subtitle={t.homeCommunitySubtitle}
      >
        {(shown) => <HomeCommunityTopics show={shown} labelledBy="community-title" />}
      </Section>

      {/* 7 — Verification. NEW: App Store pillar 4. Occupies the slot the
          auto-reply demo vacated. Phrasing is load-bearing: an Australian mobile
          number and a one-time location check, never an identity, ID, age or
          background check, and never a scam statistic. */}
      <Section
        id="real-neighbours"
        tone="white"
        title={t.homeTrustTitle}
        subtitle={t.homeTrustSubtitle}
      >
        {(shown) => <HomeTrustChain show={shown} />}
      </Section>

      {/* 8 — Coverage. `aboutVisionP1` is promoted out of /about, where the
          brand's clearest statement of what it is for was buried. Grey, so it
          does not merge into the white footer directly below. */}
      <Section
        id="coverage"
        tone="raised"
        title={t.homeCoverageTitle}
        subtitle={t.aboutVisionP1}
        titleSlot={(shown) => ({
          token: "{count}",
          node: <HomeSuburbCount count={suburbCount} run={shown} />,
        })}
      >
        {(shown) => (
          <>
            <HomeSuburbField names={suburbNames} show={shown} />
            <Reveal show={shown} delayMs={580} className="mt-8 text-center">
              <Link
                href={localizePath("/melbourne-suburbs")}
                className={`${SECONDARY_PILL_CLASS} px-6 py-3 text-sm sm:text-base`}
              >
                {t.homeCoverageCta}
              </Link>
            </Reveal>
          </>
        )}
      </Section>
    </>
  );
}
