"use client";

import { useSiteShell } from "@/components/site-chrome-context";
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

function getCopy(locale: string): ComparisonHubCopy {
  if (locale === "zh-Hans") {
    return {
      title: "对比其他二手平台",
      intro:
        "这个页面用于帮助你快速理解 PopOut 与其他常见二手平台在功能体验上的区别。我们希望提供清晰、友善、可执行的信息，帮助你根据自己的交易习惯选择合适的平台。",
      purposeTitle: "为什么做这个页面",
      purposeBody:
        "很多用户在发布和沟通阶段会遇到重复填写、语言障碍和线下见面安全等问题。我们将 PopOut 的核心流程做成结构化对比，让你更快判断哪些功能对你最有价值。",
      disclaimerTitle: "官方说明与免责声明",
      disclaimerBody:
        "本页面仅用于用户教育与产品说明，不构成对任何第三方平台的贬损或法律判断。文中提及的第三方名称属于其各自权利人；功能状态可能随第三方版本更新而变化，请以对方官方说明为准。",
      cardsTitle: "查看具体对比",
      cardsHint: "选择一个平台查看完整对比文章",
      cards: [
        {
          title: "PopOut vs Facebook Marketplace",
          body: "查看在发帖效率、跨语言沟通、交易安全流程等方面的差异。",
          href: "/comparison/facebook-marketplace",
          cta: "查看与 Facebook Marketplace 对比",
        },
        {
          title: "PopOut vs Gumtree",
          body: "查看在 AI 填写、学生验证、见面确认机制等方面的差异。",
          href: "/comparison/gumtree",
          cta: "查看与 Gumtree 对比",
        },
      ],
    };
  }

  if (locale === "zh-Hant") {
    return {
      title: "比較其他二手平台",
      intro:
        "此頁面用於幫助你快速理解 PopOut 與其他常見二手平台在功能體驗上的差異。我們希望提供清楚、友善、可執行的資訊，協助你依照自己的交易習慣做選擇。",
      purposeTitle: "為什麼做這個頁面",
      purposeBody:
        "許多使用者在發佈與溝通階段會遇到重複填寫、語言障礙與線下見面安全等問題。我們將 PopOut 的核心流程整理為結構化對比，讓你更快判斷哪些能力更符合需求。",
      disclaimerTitle: "官方說明與免責聲明",
      disclaimerBody:
        "本頁面僅用於使用者教育與產品資訊，不構成對任何第三方平台的貶抑或法律判斷。文中提及第三方名稱屬於其各自權利人；功能可能隨版本更新變動，請以各平台官方資訊為準。",
      cardsTitle: "查看詳細對比",
      cardsHint: "選擇一個平台查看完整對比文章",
      cards: [
        {
          title: "PopOut vs Facebook Marketplace",
          body: "查看在發文效率、跨語言溝通與交易安全流程上的差異。",
          href: "/comparison/facebook-marketplace",
          cta: "查看與 Facebook Marketplace 對比",
        },
        {
          title: "PopOut vs Gumtree",
          body: "查看在 AI 填寫、學生驗證與見面確認機制上的差異。",
          href: "/comparison/gumtree",
          cta: "查看與 Gumtree 對比",
        },
      ],
    };
  }

  return {
    title: "Comparison with Other Second-Hand Markets",
    intro:
      "This page helps users understand practical differences between PopOut and other commonly used second-hand marketplaces. The goal is a friendly, transparent guide so you can choose what fits your workflow.",
    purposeTitle: "Why this page exists",
    purposeBody:
      "Many users struggle with repetitive form filling, language barriers, and safer meetup coordination. We present PopOut's core experience in a structured format so feature differences are easier to evaluate.",
    disclaimerTitle: "Official note and disclaimer",
    disclaimerBody:
      "This page is for product education only. It is not legal advice and does not intend to discredit any third-party platform. Third-party trademarks and product names belong to their respective owners. Features can change over time; please verify current details on each platform's official channels.",
    cardsTitle: "Open detailed comparisons",
    cardsHint: "Choose a platform below for full article-style comparison",
    cards: [
      {
        title: "PopOut vs Facebook Marketplace",
        body: "Compare listing speed, multilingual messaging, and meetup safety workflow.",
        href: "/comparison/facebook-marketplace",
        cta: "Read PopOut vs Facebook Marketplace",
      },
      {
        title: "PopOut vs Gumtree",
        body: "Compare AI listing setup, student verification, and no-show prevention flow.",
        href: "/comparison/gumtree",
        cta: "Read PopOut vs Gumtree",
      },
    ],
  };
}

export function ComparisonHubContent() {
  const { locale, localizePath } = useSiteShell();
  const copy = getCopy(locale);
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

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {copy.purposeTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.purposeBody}</p>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
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
                className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                <p className="text-base font-semibold text-gray-900">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{card.body}</p>
                <span className="mt-3 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition group-hover:bg-gray-50">
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
