"use client";

import { AiPostDemo } from "@/components/ai-post-demo";
import { BrandEmphasis } from "@/components/brand-emphasis";
import { HomeListingStrip } from "@/components/home-listing-strip";
import { useSiteShell } from "@/components/site-chrome-context";
import { TranslationDemo } from "@/components/translation-demo";
import {
  APP_STORE_URL,
  INNER_MAX,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_PILL_CLASS,
} from "@/lib/site-config";
import type { FeedListing } from "@/lib/supabase/server-feed";
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

function Section({
  id,
  title,
  children,
  tone = "white",
}: {
  id: string;
  title: string;
  children: ReactNode;
  tone?: "white" | "raised";
}) {
  return (
    <section
      id={id}
      className={`w-full px-4 py-14 sm:px-6 sm:py-20 ${tone === "raised" ? "bg-surface-raised" : "bg-white"}`}
    >
      <div className={INNER_MAX}>
        <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight text-black sm:text-3xl md:text-4xl">
          <BrandEmphasis text={title} />
        </h2>
        {children}
      </div>
    </section>
  );
}

export function HomePageContent({
  listings,
  priceLabels,
  suburbCount,
}: {
  listings: FeedListing[];
  priceLabels: string[];
  suburbCount: number;
}) {
  const { t, localizePath } = useSiteShell();

  const trustLine = t.heroTrustLine.replace("{count}", String(suburbCount));
  const coverageTitle = t.homeCoverageTitle.replace("{count}", String(suburbCount));

  return (
    <>
      {/* 1 — Hero */}
      <section className="flex flex-col items-center bg-white px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 md:pt-24">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-balance text-[clamp(1.75rem,5.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-black">
            {t.heroTitle}
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
      <Section id="second-hand" title={t.homeMarketTitle} tone="raised">
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
          {t.homeMarketSubtitle}
        </p>

        <div className="mt-5 flex flex-wrap gap-2" aria-hidden>
          {[t.homeMarketFilterAll, t.homeMarketFilterGiveaway, t.homeMarketFilterUnder20].map(
            (chip, i) => (
              <span
                key={chip}
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
        </div>

        <div className="mt-6">
          <HomeListingStrip listings={listings} priceLabels={priceLabels} />
        </div>

        <div className="mt-7">
          <Link
            href={localizePath("/market")}
            className={`${SECONDARY_PILL_CLASS} px-6 py-3 text-sm sm:text-base`}
          >
            {t.homeMarketBrowseAll}
          </Link>
        </div>
      </Section>

      {/* 3 — Translation. Rescoped from listings-only to listings, chat AND
          community posts; all three are true today. */}
      <TranslationDemo t={t} />

      {/* 4 — AI listing creation, plus the bulk flow the site has never mentioned. */}
      <AiPostDemo t={t} />
      <div className="bg-white px-4 pb-14 sm:px-6">
        <div className={INNER_MAX}>
          <p className="text-balance text-center text-base font-medium text-black/55 sm:text-lg">
            {t.homeBulkListingLine}
          </p>
        </div>
      </div>

      {/* 5 — Local deals on the map. NEW: App Store pillar 1. */}
      <Section id="local-shops" title={t.homeShopsTitle} tone="raised">
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
          {t.homeShopsSubtitle}
        </p>
        <div className="mt-6">
          <Link
            href={localizePath("/melbourne-cbd-asian-grocery-guide")}
            className={`${SECONDARY_PILL_CLASS} px-6 py-3 text-sm sm:text-base`}
          >
            {t.homeShopsCta}
          </Link>
        </div>
      </Section>

      {/* 6 — Community. NEW: App Store pillar 3.
          No post content of any kind is rendered here, and none ever should be:
          the app's own spec forbids making a community post publicly searchable,
          and the live /l/ share handler serves `noindex, nofollow` to enforce it.
          The five topic names are product labels, not user content. */}
      <Section id="community" title={t.homeCommunityTitle}>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
          {t.homeCommunitySubtitle}
        </p>
        <p className="mt-5 text-sm font-semibold text-black/70 sm:text-base">
          {t.homeCommunityTopics}
        </p>
      </Section>

      {/* 7 — Verification. NEW: App Store pillar 4. Occupies the slot the
          auto-reply demo vacated. Phrasing is load-bearing: an Australian mobile
          number and a one-time location check, never an identity, ID, age or
          background check, and never a scam statistic. */}
      <Section id="real-neighbours" title={t.homeTrustTitle} tone="raised">
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">
          {t.homeTrustSubtitle}
        </p>
      </Section>

      {/* 8 — Coverage. `aboutVisionP1` is promoted out of /about, where the
          brand's clearest statement of what it is for was buried. */}
      <Section id="coverage" title={coverageTitle}>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">{t.aboutVisionP1}</p>
        <div className="mt-6">
          <Link
            href={localizePath("/melbourne-suburbs")}
            className={`${SECONDARY_PILL_CLASS} px-6 py-3 text-sm sm:text-base`}
          >
            {t.homeCoverageCta}
          </Link>
        </div>
      </Section>
    </>
  );
}
