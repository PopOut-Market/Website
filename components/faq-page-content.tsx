"use client";

import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { BackNavLink } from "@/components/back-nav-link";
import Link from "next/link";
import { useMemo } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  faqs: FaqItem[];
  backHome: string;
  comparisonCta: string;
};

function getCopy(locale: string): FaqCopy {
  if (locale === "zh-Hans") {
    return {
      eyebrow: "FAQ",
      title: "PopOut 常见问题",
      intro:
        "这里整理了用户最常问的 8 个问题，帮助你快速理解 PopOut 在发帖效率、多语言沟通、交易安全与毕业季出货上的核心能力。",
      disclaimerTitle: "官方说明",
      disclaimerBody:
        "本页用于产品信息说明，不构成法律、财务或安全承诺。不同地区与版本的功能可能存在差异，请以 App 内实际页面和官方公告为准。",
      faqs: [
        {
          question: "1) PopOut 的 AI 发帖功能如何节省时间？",
          answer:
            "你上传商品图片后，系统可自动生成标题、描述和类别建议。你只需要检查内容、补充细节，再选择成色和价格即可发布，通常比从零填写更快。",
        },
        {
          question: "2) PopOut 支持哪些语言？聊天也会翻译吗？",
          answer:
            "目前支持英语、简体中文、繁体中文、韩语、日语、法语、西班牙语和越南语。帖子与聊天会按用户语言进行理解和展示，减少跨语言买卖沟通成本。",
        },
        {
          question: "3) 如何提升线下见面交易的安全性？",
          answer:
            "PopOut 会推荐附近更合适的见面区域，并支持 schedule 约见流程。交易双方可在见面环节使用 QR 扫码确认，提高流程清晰度与履约记录完整度。",
        },
        {
          question: "4) PopOut 如何处理 no-show（临时不赴约）？",
          answer:
            "在完整约见流程下，系统可通过见面确认步骤辅助识别 no-show 行为，帮助双方减少沟通争议并优化后续交易安排。",
        },
        {
          question: "5) 学生用户在 PopOut 有什么优势？",
          answer:
            "PopOut 提供学生身份验证通道，帮助同校、同学区或同学生公寓用户更高效地发现彼此，提升交易匹配效率和基础信任感。",
        },
        {
          question: "6) 墨尔本二手网站怎么选更安全？",
          answer:
            "建议优先选择提供清晰沟通、面交流程和公共场所见面建议的平台。PopOut 以邻里范围浏览和安全见面流程为核心，帮助用户降低交易中的信息不对称和线下风险。",
        },
        {
          question: "7) 毕业季卖东西，用什么 App 更合适？",
          answer:
            "毕业季通常发布量和成交节奏都更快，建议选择对本地社区、学生用户和近距离交易更友好的平台。PopOut 面向墨尔本本地生活场景，适合处理毕业搬家前的高频闲置交易。",
        },
        {
          question: "8) 墨尔本多语言环境下，二手交易沟通难怎么办？",
          answer:
            "可优先使用支持多语言沟通的平台，减少描述和议价误解。PopOut 支持多语言交易场景，帮助不同语言背景的用户更顺畅完成买卖。",
        },
      ],
      backHome: "返回首页",
      comparisonCta: "查看与其他平台对比",
    };
  }

  if (locale === "zh-Hant") {
    return {
      eyebrow: "FAQ",
      title: "PopOut 常見問題",
      intro:
        "這裡整理了 8 個最常見問題，幫助你快速理解 PopOut 在發文效率、多語言溝通、交易安全與畢業季出貨上的核心能力。",
      disclaimerTitle: "官方說明",
      disclaimerBody:
        "本頁僅供產品資訊參考，不構成法律、財務或安全承諾。不同地區與版本的功能可能有所差異，請以 App 內實際功能與官方公告為準。",
      faqs: [
        {
          question: "1) PopOut 的 AI 發文功能如何節省時間？",
          answer:
            "上傳商品圖片後，系統可自動產生標題、描述與分類建議。你只需檢查與補充內容，再設定成色與價格即可發佈，通常比從零填寫更有效率。",
        },
        {
          question: "2) PopOut 支援哪些語言？聊天也可翻譯嗎？",
          answer:
            "目前支援英語、簡中、繁中、韓語、日語、法語、西班牙語與越南語。貼文與聊天可依使用者語言呈現，降低跨語言溝通成本。",
        },
        {
          question: "3) 如何提升線下見面交易安全？",
          answer:
            "PopOut 會推薦附近較合適的見面區域，並提供 schedule 約見流程。雙方可在見面環節以 QR 掃碼確認，提升流程清晰度與履約記錄完整性。",
        },
        {
          question: "4) PopOut 如何處理 no-show（未赴約）？",
          answer:
            "在完整約見流程下，系統可透過見面確認步驟協助識別 no-show 行為，降低溝通爭議並改善後續交易安排。",
        },
        {
          question: "5) 學生使用者在 PopOut 有什麼優勢？",
          answer:
            "PopOut 提供學生身份驗證通道，讓同校、同學區或同學生宿舍使用者更容易互相發現，提升配對效率與基礎信任。",
        },
        {
          question: "6) 墨爾本二手網站怎麼選才更安全？",
          answer:
            "建議優先選擇提供清楚溝通、面交流程與公共場域見面建議的平台。PopOut 以鄰里範圍瀏覽與安全見面流程為核心，協助降低交易資訊不對稱與線下風險。",
        },
        {
          question: "7) 畢業季要賣東西，用什麼 App 比較合適？",
          answer:
            "畢業季通常刊登量與成交節奏都更快，建議選擇對在地社群、學生使用者與近距離交易更友善的平台。PopOut 聚焦墨爾本在地生活場景，適合處理搬家前的高頻閒置交易。",
        },
        {
          question: "8) 在墨爾本多語言環境下，二手交易溝通困難怎麼辦？",
          answer:
            "可優先使用支援多語言溝通的平台，降低描述與議價誤解。PopOut 支援多語言交易情境，協助不同語言背景使用者更順暢完成買賣。",
        },
      ],
      backHome: "返回首頁",
      comparisonCta: "查看與其他平台比較",
    };
  }

  return {
    eyebrow: "FAQ",
    title: "PopOut FAQ",
    intro:
      "These eight FAQs explain how PopOut supports faster posting, multilingual communication, safer transactions, and graduation season selling in Melbourne.",
    disclaimerTitle: "Official note",
    disclaimerBody:
      "This page is for product information only and does not constitute legal, financial, or safety guarantees. Features may vary by app version, region, and account context.",
    faqs: [
      {
        question: "1) How does PopOut's AI listing assist save time?",
        answer:
          "After you upload item photos, PopOut can draft a title, description, and category suggestions. You review and adjust details, set condition and price, then publish with fewer manual steps.",
      },
      {
        question: "2) Which languages are supported, and is chat included?",
        answer:
          "PopOut currently supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese. Both posts and chat can be understood in users' preferred language flow.",
      },
      {
        question: "3) How does PopOut support safer in-person meetups?",
        answer:
          "PopOut can recommend nearby meetup areas and provides a schedule flow. The QR-based meetup confirmation step helps keep the process clearer for both sides.",
      },
      {
        question: "4) How does PopOut handle no-show situations?",
        answer:
          "With a completed schedule flow, meetup confirmation records can help identify no-show behavior and reduce ambiguity in follow-up communication.",
      },
      {
        question: "5) What is the benefit for student communities?",
        answer:
          "PopOut includes a student verification pathway that helps users in campus and accommodation circles discover each other faster with stronger baseline trust.",
      },
      {
        question: "6) How can I choose a safer second-hand platform in Melbourne?",
        answer:
          "Look for clear messaging workflows, meetup guidance, and local-first trading context. PopOut focuses on neighbourhood discovery and safety-oriented meetup flows to reduce uncertainty in offline transactions.",
      },
      {
        question: "7) What app is better for selling items during graduation move-out season?",
        answer:
          "Graduation season needs faster posting and local buyer matching. PopOut is designed for practical Melbourne scenarios, including student move-in and move-out periods.",
      },
      {
        question: "8) How do multilingual users reduce communication friction in second-hand trading?",
        answer:
          "Using platforms that support multilingual communication can reduce misunderstandings in listing details and negotiation. PopOut supports multilingual trading use cases for Melbourne communities.",
      },
    ],
    backHome: "Back to home",
    comparisonCta: "Compare with other markets",
  };
}

export function FaqPageContent() {
  const { locale, localizePath } = useSiteShell();
  const copy = getCopy(locale);

  const faqJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: copy.faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }),
    [copy.faqs],
  );

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <div className="mb-4">
          <BackNavLink href={localizePath("/")}>{copy.backHome}</BackNavLink>
        </div>

        <article className="overflow-hidden rounded-[28px] border border-gray-200/90 bg-white/90 shadow-[0_4px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{copy.eyebrow}</p>
            <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl md:text-[2rem] md:leading-snug">
              {copy.title}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">{copy.intro}</p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                {copy.disclaimerTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">{copy.disclaimerBody}</p>
            </div>

            <div className="mt-8 space-y-4">
              {copy.faqs.map((item) => (
                <article key={item.question} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900">{item.question}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.answer}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={localizePath("/comparison")}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
              >
                {copy.comparisonCta}
              </Link>
            </div>
          </div>
        </article>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
