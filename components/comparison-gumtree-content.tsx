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

function getCopy(locale: string): Copy {
  if (locale === "zh-Hans") {
    return {
      h1: "PopOut vs Gumtree：功能体验对比",
      lead:
        "这页聚焦发布链路、沟通效率和线下安全流程，帮助你理解 PopOut 在墨尔本二手交易场景中的实际使用价值。",
      disclaimer:
        "免责声明：本页仅用于用户教育和产品说明，不构成法律意见。Gumtree 及相关名称属于其权利人。第三方平台功能可能变化，请以其官方信息为准。",
      sections: [
        {
          title: "1) AI 帮你完成初稿，缩短发布路径",
          body: "PopOut 支持图片生成标题、描述与分类建议，用户只需要核对并补充即可。完成成色、价格、配送与议价选项后，就能更快发布，避免在大量分类中反复查找。",
        },
        {
          title: "2) 多语言买卖沟通，覆盖墨尔本多民族用户",
          body: "用户使用英语、简体中文、繁体中文、韩语、日语、法语、西班牙语、越南语输入后，可在帖子和聊天场景中按不同语言实时理解，降低沟通误解与等待成本。",
        },
        {
          title: "3) 安全见面建议 + schedule + QR 确认",
          body: "PopOut 会推荐附近安全交易区域，并将约见流程结构化。完成 schedule 后，卖家提供 QR code，买家到场扫码确认，有助于减少 no-show 并提升交易履约透明度。",
        },
        {
          title: "4) 学生身份验证，服务校园与宿舍交易",
          body: "针对墨尔本学生群体，PopOut 提供身份验证通道，帮助同校、同宿舍或相近学习生活圈用户更快建立信任并完成交易。",
        },
      ],
      tableTitle: "核心能力对照（用户视角）",
      tableNote: "注：右侧内容为常见公开体验概述，具体功能会因版本和地区更新而变化。",
      features: [
        {
          title: "发帖准备时间",
          popout: "AI 先生成主要文案和分类建议，人工做最后确认",
          other: "更多依赖从零手动填写与筛选",
        },
        {
          title: "语言覆盖与翻译体验",
          popout: "多语言输入与阅读链路一体化，覆盖发帖和聊天场景",
          other: "常见方式是用户自行切换语言或外部翻译",
        },
        {
          title: "约见履约可追踪性",
          popout: "schedule + QR 到场确认，便于识别 no-show",
          other: "履约证明通常由双方私下沟通记录决定",
        },
        {
          title: "学生圈层交易效率",
          popout: "学生验证帮助提升校园场景匹配效率",
          other: "通常没有专门的学生身份识别流程",
        },
      ],
      finalTitle: "选择建议",
      finalBody:
        "如果你想减少发布时间、降低跨语言沟通成本，并获得更清晰的约见确认流程，PopOut 会更贴近你的使用目标。建议结合你常见的交易对象和频率做最终判断。",
      backLabel: "返回对比总览",
    };
  }

  if (locale === "zh-Hant") {
    return {
      h1: "PopOut vs Gumtree：功能體驗比較",
      lead:
        "本頁聚焦發佈流程、溝通效率與線下安全機制，協助你理解 PopOut 在墨爾本二手交易中的實際體驗差異。",
      disclaimer:
        "免責聲明：本頁僅供使用者教育與產品資訊參考，不構成法律意見。Gumtree 及相關名稱屬其權利人；功能可能隨版本更新調整，請以官方資訊為準。",
      sections: [
        {
          title: "1) AI 協助完成初稿，縮短發佈路徑",
          body: "PopOut 可由圖片生成標題、描述與分類建議，使用者只需檢查補充，再設定成色、價格、配送與議價選項，即可更快完成發佈。",
        },
        {
          title: "2) 多語言買賣溝通，適配多元社群",
          body: "支援英語、簡中、繁中、韓語、日語、法語、西班牙語、越南語。貼文與聊天可依不同語言即時理解，降低溝通落差。",
        },
        {
          title: "3) 安全見面建議 + schedule + QR 確認",
          body: "PopOut 提供安全見面區建議與約見流程。完成 schedule 後，賣家提供 QR code，買家到場掃碼確認，有助降低 no-show 並提升履約透明度。",
        },
        {
          title: "4) 學生驗證支援校園與宿舍交易",
          body: "針對墨爾本學生族群，PopOut 提供身份驗證通道，讓同校或同宿舍圈層更容易互相發現與建立交易信任。",
        },
      ],
      tableTitle: "核心能力對照（使用者視角）",
      tableNote: "註：右側為常見公開體驗概述，實際功能可能因地區與版本變動。",
      features: [
        {
          title: "發文準備時間",
          popout: "AI 先生成文案與分類建議，使用者做最後確認",
          other: "較依賴手動填寫與自行篩選",
        },
        {
          title: "語言覆蓋與翻譯體驗",
          popout: "發文與聊天具備多語言理解流程",
          other: "常需使用者自行翻譯或切換語言",
        },
        {
          title: "約見履約可追蹤性",
          popout: "schedule + QR 到場確認，較易識別 no-show",
          other: "履約證明多依靠雙方私下溝通紀錄",
        },
        {
          title: "學生圈層交易效率",
          popout: "學生驗證提升校園場景匹配效率",
          other: "通常缺少學生身份識別流程",
        },
      ],
      finalTitle: "選擇建議",
      finalBody:
        "若你重視發佈效率、跨語言溝通與約見確認流程，PopOut 通常更符合需求。建議依你的交易頻率與買賣對象做最終選擇。",
      backLabel: "返回比較總覽",
    };
  }

  return {
    h1: "PopOut vs Gumtree: Experience Comparison",
    lead: "This page compares real-world workflow differences around listing setup, multilingual communication, and meetup safety in Melbourne second-hand use cases.",
    disclaimer:
      "Disclaimer: this page is for user education and product communication only. It is not legal advice. Gumtree and related marks belong to their respective owners. Third-party features may change over time.",
    sections: [
      {
        title: "1) AI-assisted listing setup",
        body: "PopOut can draft title, description, and category suggestions from item photos. Users then review, set condition and target price, and choose options like delivery and negotiation to publish more quickly.",
      },
      {
        title: "2) Built-in multilingual flow",
        body: "PopOut supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese across posting and messaging, reducing language friction in a diverse city environment.",
      },
      {
        title: "3) Structured meetup safety and no-show handling",
        body: "PopOut combines safer meetup area suggestions, schedule planning, and QR-based on-site confirmation. This creates clearer completion records and helps address no-show behavior.",
      },
      {
        title: "4) Student verification for campus communities",
        body: "A student verification pathway helps improve trust and matching quality for university and accommodation-based transactions in Melbourne.",
      },
    ],
    tableTitle: "Feature snapshot (user-oriented)",
    tableNote:
      "Note: the right column describes broad public usage patterns and may vary by account, region, or product updates.",
    features: [
      {
        title: "Time to prepare a listing",
        popout: "AI drafts key fields first, user finalizes details",
        other: "Commonly more manual from-start form work",
      },
      {
        title: "Language support in trading flow",
        popout: "Multilingual understanding across posts and chat",
        other: "Cross-language communication often depends on user-side translation",
      },
      {
        title: "Meetup accountability",
        popout: "Schedule + on-site QR confirmation supports clearer records",
        other: "Accountability usually relies on private message history",
      },
      {
        title: "Student-specific trust mechanism",
        popout: "Student verification helps campus-related matching",
        other: "Dedicated student identity pathway may be limited",
      },
    ],
    finalTitle: "Recommendation",
    finalBody:
      "If your priorities are posting speed, multilingual clarity, and stronger meetup confirmation workflow, PopOut may be the better fit. Validate current features based on your own region and usage.",
    backLabel: "Back to comparisons",
  };
}

export function ComparisonGumtreeContent() {
  const { locale, localizePath } = useSiteShell();
  const copy = getCopy(locale);
  const visualCards =
    locale === "zh-Hans"
      ? [
          { icon: "AI", title: "AI 快速发布", body: "减少分类查找和重复填写时间" },
          { icon: "LANG", title: "多语言交易", body: "覆盖主要跨语言买卖场景" },
          { icon: "SAFE", title: "安全与履约", body: "安全区建议与 no-show 识别机制" },
        ]
      : locale === "zh-Hant"
        ? [
            { icon: "AI", title: "AI 快速發佈", body: "減少分類查找與重複填寫時間" },
            { icon: "LANG", title: "多語言交易", body: "覆蓋主要跨語買賣場景" },
            { icon: "SAFE", title: "安全與履約", body: "安全區建議與 no-show 識別機制" },
          ]
        : [
            { icon: "AI", title: "Fast AI Posting", body: "Less category hunting and form repetition" },
            { icon: "8L", title: "Multilingual Trade", body: "Supports key cross-language transaction flows" },
            { icon: "SAFE", title: "Safety & Follow-through", body: "Safer meetup guidance and no-show logic" },
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
        <BackNavLink href={localizePath("/comparison")} className="mb-5">
          {copy.backLabel}
        </BackNavLink>

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
                  <span className="font-semibold text-gray-900">Gumtree:</span> {feature.other}
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
