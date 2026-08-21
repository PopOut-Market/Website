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
            "你上传商品图片后，系统会自动生成标题、描述和类别建议。你只需要检查内容、定好价格、选一个公共见面地点即可发布。你也可以一次性上传整个房间的照片，PopOut 会自动分组成一条条独立的草稿。",
        },
        {
          question: "2) PopOut 支持哪些语言？聊天也会翻译吗？",
          answer:
            "目前支持英语、简体中文、繁体中文、韩语、日语、法语、西班牙语和越南语。帖子与聊天会按用户语言进行理解和展示，减少跨语言买卖沟通成本。",
        },
        {
          question: "3) 如何让线下交易更安全？",
          answer:
            "PopOut 以邻里就近交易为核心，商品都是当面交付。发帖时卖家会从列表里选一个好辨认的公共地点作为见面点，买家在帖子上就能看到。每个账号都通过澳洲手机号和一次性位置校验完成验证，《PopOut Market 规则》以八种语言公开，不登录也能查看。",
        },
        {
          question: "4) PopOut 怎么确认用户是真人？",
          answer:
            "每个账号都需要用澳洲手机号验证，并做一次性的位置校验来确认你所在的 suburb，校验完位置信息即被丢弃——PopOut 不会保存你的定位轨迹。持续聊天和发帖的用户每 30 天会重新校验一次。任何帖子和消息都可以举报，违规帖子会被限制，被限制方也可以申诉。",
        },
        {
          question: "5) PopOut 只能买卖二手吗？",
          answer:
            "不只。社区（Community）版块专门用来看附近发生的事：本地折扣、关于你所在区域的提问、生活推荐，以及想收二手的人。还有一张本地商店地图，邻居会把逛到的折扣发上来，商品名和价格直接写在照片上，并翻译成 App 支持的每一种语言。",
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
            "上傳商品圖片後，系統會自動產生標題、描述與分類建議。你只需檢查內容、設定價格、選一個公共見面地點即可發佈。你也可以一次上傳整個房間的照片，PopOut 會自動分組成一則則獨立的草稿。",
        },
        {
          question: "2) PopOut 支援哪些語言？聊天也可翻譯嗎？",
          answer:
            "目前支援英語、簡中、繁中、韓語、日語、法語、西班牙語與越南語。貼文與聊天可依使用者語言呈現，降低跨語言溝通成本。",
        },
        {
          question: "3) 如何讓線下交易更安全？",
          answer:
            "PopOut 以鄰里就近交易為核心，商品都是當面交付。發文時賣家會從清單中挑一個好辨識的公共地點作為見面點，買家在貼文上就能看到。每個帳號都透過澳洲手機號碼與一次性位置驗證完成認證，《PopOut Market 規則》以八種語言公開，未登入也能閱讀。",
        },
        {
          question: "4) PopOut 怎麼確認使用者是真人？",
          answer:
            "每個帳號都需要用澳洲手機號碼驗證，並做一次性的位置驗證來確認你所在的 suburb，驗證完位置資訊即被丟棄——PopOut 不會保存你的定位軌跡。持續聊天與發文的使用者每 30 天會重新驗證一次。任何貼文與訊息都可以檢舉，違規貼文會被限制，被限制方也可以申訴。",
        },
        {
          question: "5) PopOut 只能買賣二手嗎？",
          answer:
            "不只。社群（Community）版塊專門用來看附近發生的事：在地折扣、關於你所在區域的提問、生活推薦，以及想收二手的人。還有一張在地商店地圖，鄰居會把逛到的折扣發上來，商品名與價格直接寫在照片上，並翻譯成 App 支援的每一種語言。",
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
          "After you upload photos of the item, PopOut drafts a title, description and category for you. You review it, set the price and pick a public meetup spot, then publish. You can add a whole room's photos at once and PopOut sorts them into separate drafts.",
      },
      {
        question: "2) Which languages are supported, and is chat included?",
        answer:
          "PopOut currently supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese. Both posts and chat can be understood in users' preferred language flow.",
      },
      {
        question: "3) How does PopOut support safer in-person trades?",
        answer:
          "PopOut is neighbourhood-first, so trades happen close to home and you hand the item over in person. When you post, you pick a recognisable public place as the meetup spot and the buyer sees it on the listing. Every account is verified with an Australian mobile number and a one-time location check, and the PopOut Market Rules are published in eight languages and readable without an account.",
      },
      {
        question: "4) How does PopOut check that people are real?",
        answer:
          "Every account is verified with an Australian mobile number and a one-time location check that confirms your suburb and is then discarded — PopOut does not keep your location history. The check is repeated every 30 days for people who keep chatting and posting. Listings and messages can be reported, a listing can be restricted, and a restriction can be appealed.",
      },
      {
        question: "5) Is PopOut only for buying and selling?",
        answer:
          "No. The Community tab is for neighbourhood life: local deals at nearby shops, questions about your area, recommendations, and people looking to buy. There is also a map of local shops, where neighbours post what they have found with the product name and price written on the photo and translated into every language the app speaks.",
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
        question:
          "8) How do multilingual users reduce communication friction in second-hand trading?",
        answer:
          "Using platforms that support multilingual communication can reduce misunderstandings in listing details and negotiation. PopOut supports multilingual trading use cases for Melbourne communities.",
      },
    ],
    backHome: "Back to home",
    comparisonCta: "Compare with other markets",
  };
}

export function FaqPageContent() {
  const { locale, localizePath, t } = useSiteShell();
  const copy = getCopy(locale);

  const faqJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: copy.faqs.map((item) => ({
        "@type": "Question",
        // Strip the visible "1) " ordinal. It is a layout affordance for the
        // on-page list; inside Question.name it becomes part of the question an
        // assistant quotes back ("1) How does PopOut…"), which reads as broken.
        name: item.question.replace(/^\d+\)\s*/, ""),
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
          <BackNavLink href={localizePath("/")}>{t.footerBackHome}</BackNavLink>
        </div>

        <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl md:text-[2rem] md:leading-snug">
              {t.faqTitle}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
              {t.faqIntro}
            </p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                {t.faqDisclaimerTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">{t.faqDisclaimerBody}</p>
            </div>

            <div className="mt-8 space-y-4">
              {copy.faqs.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft"
                >
                  <h2 className="text-base font-semibold text-gray-900">{item.question}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.answer}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={localizePath("/comparison")}
                className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-brand-500"
              >
                {t.faqComparisonCta}
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
