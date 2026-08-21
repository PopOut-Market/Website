"use client";

import { BackNavLink } from "@/components/back-nav-link";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { INNER_MAX, POPOUT_BRAND_GRADIENT_TEXT_CLASS, SHELL_X } from "@/lib/site-config";
import { SITE_ORIGIN } from "@/lib/seo";
import { useSiteShell } from "@/components/site-chrome-context";
import type { Locale } from "@/lib/site-i18n";

const ease = "cubic-bezier(0.4, 0, 0.2, 1)";

function useInViewOnce(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
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
    introHighlight:
      "Step outside and meet your neighbourhood: second-hand trading with more warmth in Melbourne.",
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

export function AboutPageContent() {
  const { localizePath, locale, t } = useSiteShell();
  const { ref: shellRef, inView: shellInView } = useInViewOnce("0px 0px -8% 0px");
  const [animate, setAnimate] = useState(false);
  const extra = aboutSeoCopy(locale);

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
        "@id": `${SITE_ORIGIN}/#app`,
        name: "PopOut Market",
        // "MarketplaceApplication" is not in Google's supported applicationCategory
        // list and is not a schema.org value either — it was silently ignored.
        applicationCategory: "ShoppingApplication",
        operatingSystem: "iOS 17.0+, Android",
        availableLanguage: ["en", "zh-Hans", "zh-Hant", "ko", "ja", "vi", "fr", "es"],
        areaServed: {
          "@type": "City",
          name: "Melbourne",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "AUD",
        },
        // Shipped features only. "Student verification support" was here and no
        // such feature has ever existed in the app — grep for "student" in the
        // app repo's src/ returns nothing. Do not re-add a feature to this list
        // without confirming it against the app.
        featureList: [
          "Suburb-first discovery across Melbourne",
          "Listing and chat translation across eight languages",
          "AI-drafted listings from photos, including bulk drafts from a whole room",
          "Public meetup spot chosen when a listing is created",
          "Accounts verified by Australian mobile number and a one-time location check",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "PopOut Market",
        // Matches the ASIC register and the homepage graph exactly. A one-character
        // difference in the name across sources splits the entity into two nodes.
        legalName: "POPOUT MARKET PTY LTD",
        email: t.aboutSupportEmail,
        // `taxID` in Australia means the ABN, not the ACN, and the previous value
        // baked the label inside the value ("ACN 696 464 945"). Both identifiers
        // are carried properly here instead.
        identifier: [
          { "@type": "PropertyValue", propertyID: "ABN", value: "76696464945" },
          { "@type": "PropertyValue", propertyID: "ACN", value: "696464945" },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "1003/151 City Rd",
          addressLocality: "Southbank",
          addressRegion: "VIC",
          postalCode: "3006",
          addressCountry: "AU",
        },
      },
      // Deliberately absent:
      // - LocalBusiness. It asserts premises a customer can visit; this address is
      //   an office unit for a software company with no walk-in trade. It produces
      //   no rich result, and PopOut is not eligible for a Google Business Profile
      //   anyway, so the local pack is closed to it either way. The same facts sit
      //   on Organization above, where a corporate address is correct.
      // - FAQPage. Its three Q&As were never rendered anywhere on this page —
      //   marking up content a visitor cannot see is a direct policy breach. The
      //   rich result was deprecated on 7 May 2026 in any case.
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
          className="mt-8 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-opacity duration-[400ms] sm:mt-10"
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
                  <p className="mb-8 mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold sm:text-base">
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
                      <h3 className="text-base font-semibold text-gray-800">
                        {t.aboutWhySafetyTitle}
                      </h3>
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
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {extra.localP1}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {extra.localP2}
                  </p>
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
                  <ul className="mt-6 space-y-6">
                    <li>
                      <p className="text-sm font-semibold text-gray-800">
                        {t.aboutPrivacyMinimalTitle}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyMinimalBody}
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-semibold text-gray-800">
                        {t.aboutPrivacyStorageTitle}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyStorageBody}
                      </p>
                    </li>
                    <li>
                      <p className="text-sm font-semibold text-gray-800">
                        {t.aboutPrivacyNoTracesTitle}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                        {t.aboutPrivacyNoTracesBody}
                      </p>
                    </li>
                  </ul>
                  <div className="mt-8 flex justify-center sm:justify-start">
                    <Link
                      href={localizePath("/privacy")}
                      className="inline-flex max-w-full items-center gap-2 rounded-xl border border-black/5 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition hover:border-brand-500"
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
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {extra.studentP1}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {extra.studentP2}
                  </p>
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
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {extra.legalBody}
                  </p>
                  <h3 className="mt-6 text-base font-semibold tracking-tight text-gray-900">
                    {extra.geoTitle}
                  </h3>
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
