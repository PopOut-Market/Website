"use client";

import { Reveal } from "@/components/motion/reveal";
import { useSiteShell } from "@/components/site-chrome-context";
import type { ReactNode } from "react";

/**
 * The five Community topic names, as labels.
 *
 * ## What this section is forbidden to show, and why the design is this plain
 *
 * The app's own spec forbids making a community post publicly searchable, and
 * the live `/l/<token>` share handler serves `noindex, nofollow` to enforce it.
 * So this section may show the topic *names* — which are product labels — and
 * nothing else. Two treatments were designed, reviewed and rejected outright:
 *
 * - **Grey skeleton bars.** Two stacked grey rounded rectangles is the universal
 *   glyph for post text. Removing the pixels does not remove the depiction; it
 *   reads as redacted content, which is still content. Banned.
 * - **Avatar circles, timestamps, reply counts, a card with a header and a body,
 *   or a selected/filtered state.** Each asserts something about posts that
 *   nobody verified. A topic pill must be unmistakably a *label*: one line, one
 *   icon, one name.
 *
 * This is the lightest section on the page. That is deliberate — it is the
 * section with the least it is permitted to show, and inventing weight for it is
 * exactly how the truth constraint gets broken.
 */

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-4 w-4 shrink-0 text-brand-500",
  "aria-hidden": true,
};

/** Icons are positional: they follow the order of the topic names in the copy string. */
const TOPIC_ICONS: ReactNode[] = [
  // Local deals — price tag
  <svg key="deals" {...ICON_PROPS}>
    <path d="M20.6 13.4 12 4.8H4.8V12l8.6 8.6a1.7 1.7 0 0 0 2.4 0l4.8-4.8a1.7 1.7 0 0 0 0-2.4Z" />
    <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
  </svg>,
  // Ask & News — question mark in a circle
  <svg key="ask" {...ICON_PROPS}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.8 9.3a2.3 2.3 0 1 1 3.2 2.1c-.7.3-1 .9-1 1.6v.3" />
    <path d="M12 17h.01" />
  </svg>,
  // Local life — small house
  <svg key="life" {...ICON_PROPS}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9.8V20h12V9.8" />
    <path d="M10 20v-5h4v5" />
  </svg>,
  // Looking to buy — magnifier
  <svg key="buy" {...ICON_PROPS}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>,
  // Other — horizontal ellipsis
  <svg key="other" {...ICON_PROPS}>
    <circle cx="6" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="18" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>,
];

export function HomeCommunityTopics({ show, labelledBy }: { show: boolean; labelledBy: string }) {
  const { t } = useSiteShell();

  // One line per topic, saying what that topic actually holds. These describe
  // CATEGORIES, never posts — the app's spec forbids making a community post
  // publicly searchable, so no excerpt, author, count or example may appear here.
  const descriptions = [t.topicDeals, t.topicAsk, t.topicLife, t.topicBuy, t.topicOther];

  // Split the string that already ships rather than adding eight new arrays of
  // five strings. Verified in all 8 locales: each uses " · " and yields exactly
  // five parts. If a translation ever breaks that, fall back to the plain
  // sentence rather than rendering a wrong number of pills.
  const topics = t.homeCommunityTopics
    .split(/\s*·\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (topics.length !== TOPIC_ICONS.length) {
    return (
      <p className="mt-6 text-center text-sm font-semibold text-black/70 sm:text-base">
        {t.homeCommunityTopics}
      </p>
    );
  }

  return (
    <ul
      aria-labelledby={labelledBy}
      className="mx-auto mt-9 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {topics.map((topic, i) => (
        <Reveal
          as="li"
          key={topic}
          show={show}
          delayMs={140 + Math.min(i, 5) * 70}
          className="h-full"
        >
          <div className="flex h-full items-start gap-3 rounded-2xl border border-black/5 bg-white p-4 text-left shadow-card">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50">
              {TOPIC_ICONS[i]}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-900">{topic}</span>
              <span className="mt-1 block text-[0.8rem] leading-relaxed text-gray-500">
                {descriptions[i]}
              </span>
            </span>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
