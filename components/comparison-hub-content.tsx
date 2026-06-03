"use client";

import { useSiteShell } from "@/components/site-chrome-context";
import type { SiteCopy } from "@/lib/site-i18n";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import Link from "next/link";
import { useMemo } from "react";

type ComparisonHubCopy = {
  title: string;
  intro: string;
  purposeTitle: string;
  purposeBody: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  cardsTitle: string;
  cardsHint: string;
  cards: { title: string; body: string; href: string; cta: string }[];
};

function getCopy(t: SiteCopy): ComparisonHubCopy {
  return {
    title: t.comparisonHubTitle,
    intro: t.comparisonHubIntro,
    purposeTitle: t.comparisonHubPurposeTitle,
    purposeBody: t.comparisonHubPurposeBody,
    disclaimerTitle: t.comparisonHubDisclaimerTitle,
    disclaimerBody: t.comparisonHubDisclaimerBody,
    cardsTitle: t.comparisonHubCardsTitle,
    cardsHint: t.comparisonHubCardsHint,
    cards: [
      {
        title: "PopOut vs Facebook Marketplace",
        body: t.comparisonHubCardFbBody,
        href: "/comparison/facebook-marketplace",
        cta: t.comparisonHubCardFbCta,
      },
      {
        title: "PopOut vs Gumtree",
        body: t.comparisonHubCardGumtreeBody,
        href: "/comparison/gumtree",
        cta: t.comparisonHubCardGumtreeCta,
      },
    ],
  };
}

export function ComparisonHubContent() {
  const { t, localizePath } = useSiteShell();
  const copy = getCopy(t);
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: copy.title,
      description: copy.intro,
      hasPart: copy.cards.map((card) => ({
        "@type": "WebPage",
        name: card.title,
        url: localizePath(card.href),
      })),
    }),
    [copy.cards, copy.intro, copy.title, localizePath],
  );

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-8 sm:py-10`}>
      <div className={`${INNER_MAX} max-w-5xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-700">{copy.intro}</p>

        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {copy.purposeTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.purposeBody}</p>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            {copy.disclaimerTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">{copy.disclaimerBody}</p>
        </div>

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{copy.cardsTitle}</h2>
            <p className="mt-1 text-sm text-gray-600">{copy.cardsHint}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {copy.cards.map((card) => (
              <Link
                key={card.href}
                href={localizePath(card.href)}
                className="group rounded-2xl border border-black/5 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200"
              >
                <p className="text-base font-semibold text-gray-900">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{card.body}</p>
                <span className="mt-3 inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition group-hover:border-brand-500">
                  {card.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
