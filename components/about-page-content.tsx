"use client";

import { BackNavLink } from "@/components/back-nav-link";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { INNER_MAX, POPOUT_BRAND_GRADIENT_TEXT_CLASS, SHELL_X } from "@/lib/site-config";
import { useSiteShell } from "@/components/site-chrome-context";
import type { Locale } from "@/lib/site-i18n";

const ease = "cubic-bezier(0.4, 0, 0.2, 1)";

function useInViewOnce(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { threshold: 0, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

function StaggerBlock({
  show,
  delayMs,
  children,
}: {
  show: boolean;
  delayMs: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="transition-all duration-[400ms]"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(1.25rem)",
        transitionDelay: show ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: ease,
      }}
    >
      {children}
    </div>
  );
}

function aboutSeoCopy(locale: Locale) {
  if (locale === "zh-Hans") {
    return {
      introHighlight: "走出家门，遇见邻里：墨尔本更具温度的二手社区。",
      localTitle: "邻里连接：以 Suburb 与公寓生活圈为核心",
      localP1:
        "PopOut 的设计思路不是“全城漫游”，而是先帮你看见身边正在流通的真实好物。你可以按 suburb 浏览，也可以结合居住生活圈快速筛选，减少跨城沟通与搬运负担。",
      localP2:
        "对留学生、公寓住户和通勤人群来说，近距离交易通常意味着更高的效率：沟通更快、取货更轻松、履约更稳定。",
      languageTitle: "多语言沟通：让交易信息更准确",
      languageP1:
        "墨尔本是一座多语言城市。PopOut 目前支持英语、简体中文、繁体中文、韩语、日语、法语、西班牙语、越南语，帮助不同语言背景的买卖双方更顺畅地完成沟通。",
      languageP2:
        "我们希望把“听不懂、说不清”的交易摩擦，尽可能转化为可理解、可确认、可执行的清晰流程。",
      studentTitle: "留学生与毕业季场景",
      studentP1:
        "从初到墨尔本添置必需品，到学期结束或毕业搬家时集中处理闲置，PopOut 关注的始终是高频、真实、可落地的校园与社区交易需求。",
      studentP2:
        "我们持续优化“发布、沟通、约见、确认”链路，让用户在不同人生阶段都能更轻松地完成二手交易。",
      legalTitle: "合规与透明",
      legalBody:
        "PopOut 以合规与透明作为产品底线，持续完善隐私与安全实践。你可以在隐私政策与相关页面中查看更完整的说明。",
      geoTitle: "你可以在这些主题中了解更多",
      geoItems: [
        "墨尔本二手交易平台如何提高线下见面安全",
        "毕业季卖闲置：如何更快完成发布与成交",
        "多语言用户如何降低跨语言沟通成本",
      ],
    };
  }

  if (locale === "zh-Hant") {
    return {
      introHighlight: "走出家門，遇見鄰里：墨爾本更有溫度的二手社群。",
      localTitle: "鄰里連結：以 Suburb 與公寓生活圈為核心",
      localP1:
        "PopOut 的設計不是「全城漫遊」，而是先幫你看見身邊正在流通的真實好物。你可以依 suburb 瀏覽，也可結合居住生活圈快速篩選，降低跨城溝通與搬運負擔。",
      localP2:
        "對留學生、公寓住戶與通勤族來說，近距離交易通常代表更高效率：溝通更快、取貨更輕鬆、履約更穩定。",
      languageTitle: "多語言溝通：讓交易資訊更準確",
      languageP1:
        "墨爾本是多語言城市。PopOut 目前支援英語、簡體中文、繁體中文、韓語、日語、法語、西班牙語、越南語，協助不同語言背景的買賣雙方更順暢地完成溝通。",
      languageP2:
        "我們希望把「聽不懂、說不清」的交易摩擦，盡可能轉化為可理解、可確認、可執行的清晰流程。",
      studentTitle: "留學生與畢業季場景",
      studentP1:
        "從初到墨爾本添購生活必需品，到學期結束或畢業搬家時集中處理閒置，PopOut 持續關注高頻且真實的校園與社群交易需求。",
      studentP2:
        "我們持續優化「發布、溝通、約見、確認」流程，讓使用者在不同人生階段都能更輕鬆完成二手交易。",
      legalTitle: "合規與透明",
      legalBody:
        "PopOut 以合規與透明作為產品底線，持續完善隱私與安全實踐。你可以在隱私政策與相關頁面查看更完整說明。",
      geoTitle: "你可以在這些主題中了解更多",
      geoItems: [
        "墨爾本二手交易平台如何提升線下面交安全",
        "畢業季賣閒置：如何更快完成發布與成交",
        "多語言使用者如何降低跨語言溝通成本",
      ],
    };
  }

  return {
    introHighlight: "Step outside and meet your neighbourhood: second-hand trading with more warmth in Melbourne.",
    localTitle: "Neighbourhood-first by suburb and local living zones",
    localP1:
      "PopOut is not designed for endless city-wide scrolling first. We start by helping users discover active listings closer to daily life, with suburb-based filtering and local-first browsing.",
    localP2:
      "For students, apartment residents, and busy commuters, nearby trading often means faster communication, easier pickup, and more reliable completion.",
    languageTitle: "Multilingual communication for clearer transactions",
    languageP1:
      "Melbourne is multilingual by nature. PopOut supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese.",
    languageP2:
      "Our goal is to reduce cross-language friction and turn unclear conversations into understandable, confirmable, and actionable steps.",
    studentTitle: "Built for student and graduation-season needs",
    studentP1:
      "From setting up essentials after arriving in Melbourne to selling items before moving out at semester end, PopOut focuses on practical and high-frequency second-hand scenarios.",
    studentP2:
      "We keep improving the full flow from posting and messaging to meetup and confirmation, so users can trade with less stress at every stage.",
    legalTitle: "Compliance and transparency",
    legalBody:
      "PopOut treats compliance and transparency as product fundamentals and continuously improves privacy and safety practices.",
    geoTitle: "Explore these related topics",
    geoItems: [
      "How Melbourne second-hand platforms improve meetup safety",
      "Graduation move-out selling guide for students",
      "How multilingual users reduce communication friction",
    ],
  };
}

function aboutFaqCopy(locale: Locale) {
  if (locale === "zh-Hans") {
    return [
      {
        question: "墨尔本二手网站怎么选更安全？",
        answer:
          "建议优先选择提供清晰沟通、面交流程和公共场所见面建议的平台。PopOut 以邻里范围浏览和安全见面流程为核心，帮助用户降低交易中的信息不对称和线下风险。",
      },
      {
        question: "毕业季卖东西，用什么 App 更合适？",
        answer:
          "毕业季通常发布量和成交节奏都更快，建议选择对本地社区、学生用户和近距离交易更友好的平台。PopOut 面向墨尔本本地生活场景，适合处理毕业搬家前的高频闲置交易。",
      },
      {
        question: "墨尔本多语言环境下，二手交易沟通难怎么办？",
        answer:
          "可优先使用支持多语言沟通的平台，减少描述和议价误解。PopOut 支持多语言交易场景，帮助不同语言背景的用户更顺畅完成买卖。",
      },
    ];
  }

  if (locale === "zh-Hant") {
    return [
      {
        question: "墨爾本二手網站怎麼選才更安全？",
        answer:
          "建議優先選擇提供清楚溝通、面交流程與公共場域見面建議的平台。PopOut 以鄰里範圍瀏覽與安全見面流程為核心，協助降低交易資訊不對稱與線下風險。",
      },
      {
        question: "畢業季要賣東西，用什麼 App 比較合適？",
        answer:
          "畢業季通常刊登量與成交節奏都更快，建議選擇對在地社群、學生使用者與近距離交易更友善的平台。PopOut 聚焦墨爾本在地生活場景，適合處理搬家前的高頻閒置交易。",
      },
      {
        question: "在墨爾本多語言環境下，二手交易溝通困難怎麼辦？",
        answer:
          "可優先使用支援多語言溝通的平台，降低描述與議價誤解。PopOut 支援多語言交易情境，協助不同語言背景使用者更順暢完成買賣。",
      },
    ];
  }

  return [
    {
      question: "How can I choose a safer second-hand platform in Melbourne?",
      answer:
        "Look for clear messaging workflows, meetup guidance, and local-first trading context. PopOut focuses on neighbourhood discovery and safety-oriented meetup flows to reduce uncertainty in offline transactions.",
    },
    {
      question: "What app is better for selling items during graduation move-out season?",
      answer:
        "Graduation season needs faster posting and local buyer matching. PopOut is designed for practical Melbourne scenarios, including student move-in and move-out periods.",
    },
    {
      question: "How do multilingual users reduce communication friction in second-hand trading?",
      answer:
        "Using platforms that support multilingual communication can reduce misunderstandings in listing details and negotiation. PopOut supports multilingual trading use cases for Melbourne communities.",
    },
  ];
}

export function AboutPageContent() {
  const { localizePath, locale, t } = useSiteShell();
  const { ref: shellRef, inView: shellInView } = useInViewOnce("0px 0px -8% 0px");
  const [animate, setAnimate] = useState(false);
  const extra = aboutSeoCopy(locale);
  const faqItems = aboutFaqCopy(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${t.aboutPageTitle} | PopOut Market`,
        description: t.aboutMainHeading,
        inLanguage: locale,
        isPartOf: {
          "@type": "WebSite",
          name: "PopOut Market",
          url: "https://www.popoutmarket.com.au",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "PopOut Market",
        applicationCategory: "MarketplaceApplication",
        operatingSystem: "iOS, Android",
        availableLanguage: [
          "en",
          "zh-Hans",
          "zh-Hant",
          "ko",
          "ja",
          "vi",
          "fr",
          "es",
        ],
        areaServed: {
          "@type": "City",
          name: "Melbourne",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "AUD",
        },
        featureList: [
          "Suburb-first discovery",
          "Multilingual communication support",
          "Safety-oriented meetup workflow",
          "Student verification support",
        ],
      },
      {
        "@type": "Organization",
        name: "PopOut Market Pty Ltd",
        email: t.aboutSupportEmail,
        taxID: "ABN 76 696 464 945",
      },
      {
        "@type": "LocalBusiness",
        name: "PopOut Market",
        legalName: "PopOut Market Pty Ltd",
        areaServed: "Melbourne, Victoria, Australia",
        taxID: "ABN 76 696 464 945",
        email: t.aboutSupportEmail,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Melbourne",
          addressRegion: "VIC",
          addressCountry: "AU",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  useEffect(() => {
    if (!shellInView) return;
    const id = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(id);
  }, [shellInView]);

  return (
    <div className={`${SHELL_X} flex min-h-0 flex-1 flex-col pb-16 pt-8 sm:pb-24 sm:pt-12`}>
      <div className={INNER_MAX}>
        <BackNavLink href={localizePath("/")}>{t.footerBackHome}</BackNavLink>

        <article
          ref={shellRef as React.RefObject<HTMLElement>}
          className="mt-8 overflow-hidden rounded-[28px] border border-gray-200/90 bg-white/90 shadow-[0_4px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-opacity duration-[400ms] sm:mt-10"
          style={{
            opacity: shellInView ? 1 : 0,
            transitionTimingFunction: ease,
          }}
        >
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            <StaggerBlock show={animate} delayMs={0}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                {t.aboutPageTitle}
              </p>
              <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl md:text-[2rem] md:leading-snug">
                {t.aboutMainHeading}
              </h1>
            </StaggerBlock>

            <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-12">
              <StaggerBlock show={animate} delayMs={100}>
                <section>
                  <p className="mb-8 mt-4 rounded-2xl border border-gray-200/80 bg-gray-50/70 px-4 py-3 text-sm font-semibold sm:text-base">
                    <span className={POPOUT_BRAND_GRADIENT_TEXT_CLASS}>{extra.introHighlight}</span>
                  </p>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutOurStoryTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutOurStoryP1}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutOurStoryP2}
                  </p>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={150}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutWhyTitle}
                  </h2>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {t.aboutWhyNeighbourhoodTitle}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                        {t.aboutWhyNeighbourhoodBody}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{t.aboutWhySafetyTitle}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                        {t.aboutWhySafetyBody}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {t.aboutWhyCommunicationTitle}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                        {t.aboutWhyCommunicationBody}
                      </p>
                    </div>
                  </div>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={175}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {extra.localTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">{extra.localP1}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">{extra.localP2}</p>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={190}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {extra.languageTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {extra.languageP1}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {extra.languageP2}
                  </p>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={200}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutPrivacyTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutPrivacyLead}
                  </p>
                  <ul className="mt-6 space-y-5">
                    <li>
                      <p className="text-sm font-semibold text-gray-800">{t.aboutPrivacyMinimalTitle}</p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyMinimalBody}
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-semibold text-gray-800">{t.aboutPrivacyStorageTitle}</p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyStorageBody}
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-semibold text-gray-800">{t.aboutPrivacyNoTracesTitle}</p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyNoTracesBody}
                      </p>
                    </li>
                  </ul>
                  <div className="mt-8 flex justify-center sm:justify-start">
                    <Link
                      href={localizePath("/privacy")}
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition hover:border-gray-300 hover:bg-white"
                    >
                      <span className="text-balance text-center">{t.aboutPrivacyLinkMore}</span>
                      <span aria-hidden className="text-gray-400">
                        →
                      </span>
                    </Link>
                  </div>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={230}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {extra.studentTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">{extra.studentP1}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">{extra.studentP2}</p>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={250}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutVisionTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutVisionP1}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutVisionP2}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutVisionP3}
                  </p>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={300}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {extra.legalTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">{extra.legalBody}</p>
                  <h3 className="mt-6 text-base font-semibold tracking-tight text-gray-900">{extra.geoTitle}</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {extra.geoItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </StaggerBlock>

              <StaggerBlock show={animate} delayMs={320}>
                <section>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {t.aboutFeedbackTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {t.aboutFeedbackLead}
                  </p>
                  <div className="mt-5">
                    <a
                      href={`mailto:${t.aboutSupportEmail}`}
                      className="inline-flex text-[15px] font-medium text-black underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500"
                    >
                      {t.aboutSupportEmail}
                    </a>
                  </div>
                </section>
              </StaggerBlock>
            </div>
          </div>
        </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </div>
  );
}
