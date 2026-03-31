"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";

type FitzroyCopy = {
  h1: string;
  lead: string;
  overviewTitle: string;
  overviewBody: string;
  communityTitle: string;
  communityBody: string;
  scenariosTitle: string;
  scenarios: string[];
  practicalTitle: string;
  practicalBody: string;
  nextStepTitle: string;
  nextStepBody: string;
  marketCta: string;
  relatedTitle: string;
};

function getCopy(locale: string): FitzroyCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        h1: "菲茨罗伊（Fitzroy）二手市场指南",
        lead:
          "Fitzroy 位于墨尔本内城区北侧，以独立文化、创意产业和复古消费场景闻名。这里聚集了大量年轻住户与创意从业者，二手交易风格鲜明、更新频繁。",
        overviewTitle: "区域概况",
        overviewBody:
          "Fitzroy 的二手需求不仅集中在家具和日常家电，还包括古着服饰、装饰摆件、乐器和个性化通勤用品。区域内店铺与社区活动密度高，商品类型更偏向“实用 + 风格化”并存。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "本区用户普遍关注可持续消费与再利用，愿意购买有设计感或可长期使用的二手物品。相比标准化家居区，Fitzroy 的交易更强调风格匹配与成色细节，优质商品流转速度通常更快。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "创意行业用户更新工作室或居家布置，出售装饰品、乐器配件与风格家具。",
          "年轻租客搬家时上架复古桌椅、照明设备、收纳与厨房用品。",
          "个人卖家发布古着、唱片与精选生活用品，形成小批量高频流通。",
        ],
        practicalTitle: "如何更高效在 Fitzroy 找到合适二手物品",
        practicalBody:
          "建议先按“最近发布”“同区距离”“成色描述完整”筛选，再使用 “Fitzory/Fitzroy + 品类词” 搜索（如 vintage chair、record、lamp）。若你有明确风格偏好，可先收藏关键词并持续追踪新上架。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先浏览 Fitzroy 在售列表，再对比 Carlton 与 North Melbourne 的同类商品。若你更看重风格和独特性，优先选择描述清晰、图片完整且可快速沟通的卖家。",
        marketCta: "查看 Fitzroy 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "菲茨羅伊（Fitzroy）二手市場指南",
        lead:
          "Fitzroy 位於墨爾本內城北側，以獨立文化、創意產業與復古消費場景聞名。區內聚集大量年輕住戶與創意從業者，二手交易風格鮮明且更新頻繁。",
        overviewTitle: "區域概況",
        overviewBody:
          "Fitzroy 二手需求除了家具與日常家電，也涵蓋古著、裝飾擺件、樂器與個性化通勤用品。此區商品供給呈現「實用 + 風格化」並存的特點。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "本區使用者普遍重視可持續消費與再利用，偏好具設計感或可長期使用的二手物件。相較標準化家居區，Fitzroy 交易更重視風格匹配與成色細節。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "創意工作者更新工作室或住家配置，轉售裝飾品、樂器配件與風格家具。",
          "年輕租客搬家時刊登復古桌椅、照明設備、收納與廚房用品。",
          "個人賣家流轉古著、唱片與精選生活用品，形成小批量高頻供給。",
        ],
        practicalTitle: "如何更有效在 Fitzroy 找到合適二手物品",
        practicalBody:
          "建議先用「最近發布」「同區距離」「成色描述完整」篩選，再用 “Fitzory/Fitzroy + 品類詞” 搜尋（如 vintage chair、record、lamp）。若有明確風格偏好，可先收藏關鍵字並持續追蹤。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 Fitzroy 列表，再與 Carlton、North Melbourne 的同類商品比較。若你更重視風格與獨特性，優先選擇圖片完整、描述清楚且可快速回覆的賣家。",
        marketCta: "查看 Fitzroy 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Fitzroy Second-Hand Market Guide",
        lead:
          "Fitzroy is one of Melbourne's most creative inner suburbs, known for independent culture, vintage retail energy, and a strong young-resident base.",
        overviewTitle: "Area overview",
        overviewBody:
          "Second-hand demand in Fitzroy goes beyond standard furniture and appliances. Popular categories include vintage clothing, decor pieces, music-related gear, and distinctive lifestyle items.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "Local buyers often value sustainability, design, and item character. Compared with more utility-driven suburbs, Fitzroy listings tend to emphasize style, condition detail, and uniqueness.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Creative workers rotating studio decor, accessories, and design-forward furniture.",
          "Young renters listing vintage desks, lighting, storage, and compact home essentials.",
          "Individual sellers posting curated clothing, records, and niche lifestyle goods.",
        ],
        practicalTitle: "How to find better second-hand options in Fitzroy",
        practicalBody:
          "Filter by recently posted, nearby distance, and complete condition notes first. Then search with “Fitzory/Fitzroy + item terms” (for example, vintage chair, record, lamp) to surface more relevant local listings.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Start with Fitzroy listings, then compare similar items in Carlton and North Melbourne. If style and uniqueness matter most, prioritize posts with clearer photos and faster seller response.",
        marketCta: "Explore Fitzroy listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneFitzroySuburbContent() {
  const { locale, localizePath } = useSiteShell();
  const copy = getCopy(locale);
  const backLabel =
    locale === "zh-Hans"
      ? "返回墨尔本区域页"
      : locale === "zh-Hant"
        ? "返回墨爾本區域頁"
        : "Back to Melbourne suburbs";

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <BackNavLink href={localizePath("/melbourne-suburbs")} className="mb-5">
          {backLabel}
        </BackNavLink>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {copy.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{copy.lead}</p>

        <div className="mt-7 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <section>
            <h2 className="text-base font-semibold text-gray-900">{copy.overviewTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.overviewBody}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-gray-900">{copy.communityTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.communityBody}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-gray-900">{copy.scenariosTitle}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
              {copy.scenarios.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-base font-semibold text-gray-900">{copy.practicalTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.practicalBody}</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-gray-900">{copy.nextStepTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.nextStepBody}</p>
          </section>
        </div>

        <div className="mt-7">
          <Link
            href={localizePath("/market?area=Fitzory")}
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            {copy.marketCta}
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {copy.relatedTitle}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {MARKET_SUBURBS.filter((s) => s !== "Fitzory").map((suburb) => (
              <Link
                key={suburb}
                href={localizePath(suburbSeoPath(suburb))}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
              >
                {suburb}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
