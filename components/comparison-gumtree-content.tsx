"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import Link from "next/link";
import { useMemo } from "react";

type Section = { title: string; body: string };
type Feature = { title: string; popout: string; other: string };
type Copy = {
  h1: string;
  lead: string;
  disclaimer: string;
  sections: Section[];
  tableTitle: string;
  tableNote: string;
  features: Feature[];
  finalTitle: string;
  finalBody: string;
  backLabel: string;
};

export function ComparisonGumtreeContent() {
  const { t, localizePath } = useSiteShell();
  const copy: Copy = {
    h1: t.comparisonGumtreeH1,
    lead: t.comparisonGumtreeLead,
    disclaimer: t.comparisonGumtreeDisclaimer,
    sections: [
      { title: t.comparisonGumtreeSection1Title, body: t.comparisonGumtreeSection1Body },
      { title: t.comparisonGumtreeSection2Title, body: t.comparisonGumtreeSection2Body },
      { title: t.comparisonGumtreeSection3Title, body: t.comparisonGumtreeSection3Body },
      { title: t.comparisonGumtreeSection4Title, body: t.comparisonGumtreeSection4Body },
    ],
    tableTitle: t.comparisonGumtreeTableTitle,
    tableNote: t.comparisonGumtreeTableNote,
    features: [
      {
        title: t.comparisonGumtreeFeature1Title,
        popout: t.comparisonGumtreeFeature1Popout,
        other: t.comparisonGumtreeFeature1Other,
      },
      {
        title: t.comparisonGumtreeFeature2Title,
        popout: t.comparisonGumtreeFeature2Popout,
        other: t.comparisonGumtreeFeature2Other,
      },
      {
        title: t.comparisonGumtreeFeature3Title,
        popout: t.comparisonGumtreeFeature3Popout,
        other: t.comparisonGumtreeFeature3Other,
      },
      {
        title: t.comparisonGumtreeFeature4Title,
        popout: t.comparisonGumtreeFeature4Popout,
        other: t.comparisonGumtreeFeature4Other,
      },
    ],
    finalTitle: t.comparisonGumtreeFinalTitle,
    finalBody: t.comparisonGumtreeFinalBody,
    backLabel: t.comparisonBackLabel,
  };
  const visualCards = [
    { icon: "AI", title: t.comparisonGumtreeCard1Title, body: t.comparisonGumtreeCard1Body },
    { icon: "8L", title: t.comparisonGumtreeCard2Title, body: t.comparisonGumtreeCard2Body },
    { icon: "SAFE", title: t.comparisonGumtreeCard3Title, body: t.comparisonGumtreeCard3Body },
  ];

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: copy.h1,
      description: copy.lead,
      isPartOf: {
        "@type": "CollectionPage",
        name: t.comparisonHubTitle,
        url: localizePath("/comparison"),
      },
    }),
    [copy.h1, copy.lead, localizePath, t.comparisonHubTitle],
  );

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <BackNavLink href={localizePath("/comparison")} className="mb-5">
          {copy.backLabel}
        </BackNavLink>

        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {copy.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{copy.lead}</p>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-amber-900">{copy.disclaimer}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {visualCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-brand-tint p-4 shadow-soft"
            >
              <div className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-white px-2 text-sm font-semibold text-gray-700 shadow-sm">
                {card.icon}
              </div>
              <h2 className="mt-3 text-sm font-semibold text-gray-900">{card.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{card.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 space-y-6 rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-gray-900">{copy.tableTitle}</h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">{copy.tableNote}</p>
          <div className="mt-4 space-y-3">
            {copy.features.map((feature) => (
              <article key={feature.title} className="rounded-xl border border-black/5 bg-white p-4 shadow-card">
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">PopOut:</span> {feature.popout}
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Gumtree:</span> {feature.other}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-brand-tint p-5 shadow-soft">
          <h2 className="text-base font-semibold text-gray-900">{copy.finalTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.finalBody}</p>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
