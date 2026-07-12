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

export function ComparisonFacebookMarketplaceContent() {
  const { localizePath, t } = useSiteShell();
  const copy: Copy = {
    h1: t.comparisonFbH1,
    lead: t.comparisonFbLead,
    disclaimer: t.comparisonFbDisclaimer,
    sections: [
      { title: t.comparisonFbSection1Title, body: t.comparisonFbSection1Body },
      { title: t.comparisonFbSection2Title, body: t.comparisonFbSection2Body },
      { title: t.comparisonFbSection3Title, body: t.comparisonFbSection3Body },
      { title: t.comparisonFbSection4Title, body: t.comparisonFbSection4Body },
    ],
    tableTitle: t.comparisonFbTableTitle,
    tableNote: t.comparisonFbTableNote,
    features: [
      {
        title: t.comparisonFbFeature1Title,
        popout: t.comparisonFbFeature1Popout,
        other: t.comparisonFbFeature1Other,
      },
      {
        title: t.comparisonFbFeature2Title,
        popout: t.comparisonFbFeature2Popout,
        other: t.comparisonFbFeature2Other,
      },
      {
        title: t.comparisonFbFeature3Title,
        popout: t.comparisonFbFeature3Popout,
        other: t.comparisonFbFeature3Other,
      },
      {
        title: t.comparisonFbFeature4Title,
        popout: t.comparisonFbFeature4Popout,
        other: t.comparisonFbFeature4Other,
      },
    ],
    finalTitle: t.comparisonFbFinalTitle,
    finalBody: t.comparisonFbFinalBody,
    backLabel: t.comparisonBackLabel,
  };
  const visualCards = [
    { icon: "AI", title: t.comparisonFbCard1Title, body: t.comparisonFbCard1Body },
    { icon: "LANG", title: t.comparisonFbCard2Title, body: t.comparisonFbCard2Body },
    { icon: "AI", title: t.comparisonFbCard3Title, body: t.comparisonFbCard3Body },
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
              <article
                key={feature.title}
                className="rounded-xl border border-black/5 bg-white p-4 shadow-card"
              >
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">PopOut:</span> {feature.popout}
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Facebook Marketplace:</span>{" "}
                  {feature.other}
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
