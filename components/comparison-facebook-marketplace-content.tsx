"use client";

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

function getCopy(locale: string): Copy {
  if (locale === "zh-Hans") {
    return {
      h1: "PopOut vs Facebook Marketplace：功能体验对比",
      lead:
        "这是一份面向用户的功能对比页，重点解释发布效率、跨语言沟通和线下交易安全流程上的体验差异。我们的目标是帮助你判断哪种流程更适合你的日常买卖节奏。",
      disclaimer:
        "免责声明：本页仅用于产品信息说明，不构成法律意见，也不对第三方平台作价值判断。Facebook Marketplace 及相关名称为其权利人所有；功能会随版本调整，请以官方信息为准。",
      sections: [
        {
          title: "1) AI 图片发帖，减少第一步的重复劳动",
          body: "在 PopOut，你上传图片后可自动生成标题、描述和类别建议。你只需快速检查并补充细节，再选择成色和价格即可发布。对于新用户或分类不熟悉的用户，这能显著减少初次发帖耗时。",
        },
        {
          title: "2) 多语言实时翻译，降低沟通门槛",
          body: "PopOut 支持英语、简体中文、繁体中文、韩语、日语、法语、西班牙语、越南语的输入与理解。帖子与聊天可以按用户语言实时展示，适合墨尔本多语言社区场景。",
        },
        {
          title: "3) 安全交易区域与约见确认机制",
          body: "PopOut 会推荐附近的安全见面区域，并提供 schedule 流程。约定完成后，卖家可出示 QR code，买家在见面地点扫码确认。未完成扫码会进入 no-show 记录逻辑，帮助提升履约透明度。",
        },
        {
          title: "4) 面向学生群体的身份验证通道",
          body: "针对墨尔本学生与学生公寓用户，PopOut 提供学生身份验证能力，帮助用户更容易识别同校或同住宿圈层的交易对象，提升交易匹配效率与信任感。",
        },
      ],
      tableTitle: "核心功能对照（用户视角）",
      tableNote: "注：右侧为公开可观察到的通用体验描述，具体能力可能因地区、账号类型和产品版本而变化。",
      features: [
        {
          title: "发帖启动效率",
          popout: "图片上传后由 AI 生成标题/描述/类别建议，用户补充即可完成",
          other: "通常需要手动填写多个字段并自行选择分类",
        },
        {
          title: "跨语言沟通",
          popout: "帖子和聊天支持多语言实时理解与呈现",
          other: "多语言沟通一般依赖用户自行翻译",
        },
        {
          title: "线下见面安全流程",
          popout: "安全区域建议 + schedule + 见面扫码确认",
          other: "常以用户自行约定为主，流程一致性依赖个人习惯",
        },
        {
          title: "学生场景支持",
          popout: "提供学生验证通道，便于校园与宿舍圈层匹配",
          other: "通常没有面向学生交易链路的专门身份流程",
        },
      ],
      finalTitle: "如何使用这页信息",
      finalBody:
        "如果你最在意“发帖快、跨语言沟通顺、线下履约可追踪”，PopOut 的流程会更适配。建议你结合自己常用语言、交易频率和见面场景做选择。",
      backLabel: "返回对比总览",
    };
  }

  if (locale === "zh-Hant") {
    return {
      h1: "PopOut vs Facebook Marketplace：功能體驗比較",
      lead:
        "這是一頁以使用者為中心的功能比較，聚焦發佈效率、跨語言溝通與線下交易安全流程差異，幫助你判斷哪種流程更符合日常買賣習慣。",
      disclaimer:
        "免責聲明：本頁僅供產品資訊參考，不構成法律意見，也不對第三方平台作價值判斷。Facebook Marketplace 及相關名稱屬其權利人所有；功能可能隨版本調整，請以官方資訊為準。",
      sections: [
        {
          title: "1) AI 圖片發文，減少重複填寫",
          body: "在 PopOut，上傳圖片後可自動生成標題、描述與分類建議。你只需快速檢查與補充，再填入成色與價格即可發佈，可有效縮短初次上架時間。",
        },
        {
          title: "2) 多語言即時翻譯，降低溝通門檻",
          body: "PopOut 支援英語、簡中、繁中、韓語、日語、法語、西班牙語、越南語。貼文與聊天可依使用者語言即時呈現，適合墨爾本多語社群。",
        },
        {
          title: "3) 安全見面區與約見確認機制",
          body: "PopOut 提供安全交易區域建議與 schedule 流程。完成約定後，賣家可出示 QR code，買家於見面地點掃碼確認；未完成掃碼會進入 no-show 記錄邏輯。",
        },
        {
          title: "4) 面向學生族群的身份驗證",
          body: "對於墨爾本學生與學生公寓族群，PopOut 提供學生驗證能力，讓同校或同住宿圈層更容易互相發現與交易。",
        },
      ],
      tableTitle: "核心功能對照（使用者視角）",
      tableNote: "註：右側為常見公開體驗描述，實際能力可能因地區、帳號與版本而異。",
      features: [
        {
          title: "發文啟動效率",
          popout: "圖片上傳後由 AI 生成標題/描述/分類建議",
          other: "通常需手動填寫多個欄位並自行選分類",
        },
        {
          title: "跨語言溝通",
          popout: "貼文與聊天支援多語言即時理解與呈現",
          other: "多語溝通常仰賴使用者自行翻譯",
        },
        {
          title: "線下交易安全流程",
          popout: "安全區建議 + schedule + 見面掃碼確認",
          other: "多以雙方自行約定為主，流程一致性因人而異",
        },
        {
          title: "學生場景支援",
          popout: "提供學生驗證通道，提升校園圈層匹配效率",
          other: "通常缺少學生交易鏈路的專門身份流程",
        },
      ],
      finalTitle: "如何使用這頁資訊",
      finalBody:
        "若你重視「發文效率、跨語言溝通與履約可追蹤」，PopOut 流程通常更貼近需求。建議依照你的交易頻率與見面場景做最終選擇。",
      backLabel: "返回比較總覽",
    };
  }

  return {
    h1: "PopOut vs Facebook Marketplace: Experience Comparison",
    lead: "This article compares practical workflow differences in listing setup, multilingual communication, and in-person trade safety. The intent is to help users choose a marketplace flow that fits everyday needs.",
    disclaimer:
      "Disclaimer: this page is for product education only, not legal advice or a negative statement about any third-party platform. Facebook Marketplace and related marks belong to their respective owners. Feature availability may vary by region, account type, and product updates.",
    sections: [
      {
        title: "1) AI-assisted listing from photos",
        body: "On PopOut, uploading item photos can generate draft title, description, and category suggestions. Users review, add context, set condition and price, then publish faster with fewer manual steps.",
      },
      {
        title: "2) Real-time multilingual communication",
        body: "PopOut supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese. Posts and chats can be read in each user's preferred language flow.",
      },
      {
        title: "3) Safety-zone guidance and meetup confirmation",
        body: "PopOut recommends nearby safer meetup areas and provides a schedule flow. After agreement, seller QR and buyer on-site scan can be used as a confirmation step, supporting clearer no-show handling.",
      },
      {
        title: "4) Student verification pathway in Melbourne",
        body: "For student communities and accommodation clusters, PopOut includes a student verification channel to improve trust and discoverability in campus-related transactions.",
      },
    ],
    tableTitle: "Feature snapshot (user-oriented)",
    tableNote:
      "Note: the right column reflects common public usage patterns and may change over time.",
    features: [
      {
        title: "Listing start speed",
        popout: "AI drafts title/description/category from photos",
        other: "Often relies on manual form filling and category selection",
      },
      {
        title: "Multilingual messaging",
        popout: "Post and chat content can be understood across supported languages",
        other: "Cross-language communication often depends on self-translation",
      },
      {
        title: "Meetup safety workflow",
        popout: "Safer area suggestion + schedule + on-site QR confirmation",
        other: "Meetup process is generally user-defined and less structured",
      },
      {
        title: "Student-focused trust layer",
        popout: "Student verification pathway for campus/accommodation matching",
        other: "Student-specific identity flow is commonly limited or unavailable",
      },
    ],
    finalTitle: "How to use this comparison",
    finalBody:
      "If your priorities are faster posting, smoother multilingual communication, and clearer meetup accountability, PopOut's workflow may fit better. Always verify current feature details in your own usage context.",
    backLabel: "Back to comparisons",
  };
}

export function ComparisonFacebookMarketplaceContent() {
  const { locale, localizePath } = useSiteShell();
  const copy = getCopy(locale);
  const visualCards =
    locale === "zh-Hans"
      ? [
          { icon: "AI", title: "AI 发帖引导", body: "上传图片后自动给出标题与描述建议" },
          { icon: "LANG", title: "实时翻译沟通", body: "多语言帖子与聊天更顺畅" },
          { icon: "QR", title: "约见确认", body: "schedule + 到场扫码，减少 no-show" },
        ]
      : locale === "zh-Hant"
        ? [
            { icon: "AI", title: "AI 發文引導", body: "上傳圖片後自動產生標題與描述建議" },
            { icon: "LANG", title: "即時翻譯溝通", body: "多語貼文與聊天更順暢" },
            { icon: "QR", title: "約見確認", body: "schedule + 到場掃碼，降低 no-show" },
          ]
        : [
            { icon: "AI", title: "AI Listing Assist", body: "Photo-based draft title and description" },
            { icon: "LANG", title: "Live Translation", body: "Smoother cross-language posts and chat" },
            { icon: "QR", title: "Meetup Confirmation", body: "Schedule plus on-site QR check-in flow" },
          ];

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: copy.h1,
      description: copy.lead,
      isPartOf: {
        "@type": "CollectionPage",
        name: "Comparison with Other Second-Hand Markets",
        url: localizePath("/comparison"),
      },
    }),
    [copy.h1, copy.lead, localizePath],
  );

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <Link
          href={localizePath("/comparison")}
          className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {copy.backLabel}
        </Link>

        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {copy.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{copy.lead}</p>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-amber-900">{copy.disclaimer}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {visualCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 shadow-sm"
            >
              <div className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-white px-2 text-sm font-semibold text-gray-700 shadow-sm">
                {card.icon}
              </div>
              <h2 className="mt-3 text-sm font-semibold text-gray-900">{card.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{card.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-7 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{copy.tableTitle}</h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">{copy.tableNote}</p>
          <div className="mt-4 space-y-3">
            {copy.features.map((feature) => (
              <article key={feature.title} className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
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

        <div className="mt-7 rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5 shadow-sm">
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
