"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";

type SouthbankCopy = {
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

function getCopy(locale: string): SouthbankCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        h1: "南岸（Southbank）二手市场指南",
        lead:
          "Southbank 是亚拉河沿岸的艺术与高密度住宅区域，兼具文化活动与公寓生活场景。区域内白领、创意从业者与家庭住户并存，形成了多元且持续的二手交易需求。",
        overviewTitle: "区域概况",
        overviewBody:
          "Southbank 靠近城市核心交通与文娱设施，生活便利度高。常见二手交易品类包括沙发、床架、餐桌、小家电、儿童用品，以及部分艺术与创意相关物品。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "由于高层公寓集中，住户在换租、搬家和家居升级时会持续释放可再利用物品；同时，创意行业人群也会带来更具风格化的家居和文化消费品供给，使该区品类丰富度较高。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "公寓住户搬家或升级家居时，集中上架沙发、床架、餐桌与厨房电器。",
          "家庭用户置换儿童用品或生活设备，形成高频、实用型供给。",
          "创意从业者流转家居装饰、乐器配件或风格化用品。",
        ],
        practicalTitle: "如何更高效在 Southbank 找到合适二手物品",
        practicalBody:
          "建议先按“可送货”“距离近”“发布时间新”筛选，再结合“Southbank + 品类词”检索（如 sofa、dining table、microwave）。若你住在公寓楼，可尝试搜索楼名或附近地标关键词，提高同区匹配效率。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先查看 Southbank 在售列表，再与 Melbourne CBD、South Wharf 交叉对比。若同类商品价格接近，优先选择送货条件更明确、沟通更及时的卖家，通常整体体验更好。",
        marketCta: "查看 Southbank 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "南岸（Southbank）二手市場指南",
        lead:
          "Southbank 是亞拉河沿岸的藝術與高密度住宅區域，兼具文化活動與公寓生活場景。區內白領、創意從業者與家庭住戶並存，二手交易需求多元且持續。",
        overviewTitle: "區域概況",
        overviewBody:
          "Southbank 鄰近市中心交通與文娛設施，生活便利。常見二手品類包括沙發、床架、餐桌、小家電、兒童用品，以及部分藝術與創意相關物件。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "高層公寓密集使得換租、搬家與家居升級更頻繁，持續帶來可再利用物品供給；創意行業人群也使區域內商品風格更加多樣化。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "公寓住戶搬家或升級時，集中刊登沙發、床架、餐桌與廚房電器。",
          "家庭住戶替換兒童用品或生活設備，形成實用型高頻供給。",
          "創意從業者流轉家居裝飾、樂器配件與風格化用品。",
        ],
        practicalTitle: "如何更有效在 Southbank 找到合適二手物品",
        practicalBody:
          "建議先用「可送貨」「距離近」「發布時間新」篩選，再搭配「Southbank + 品類」關鍵字搜尋。若你住在公寓，可加上樓名或附近地標詞，通常更容易找到同區賣家。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 Southbank 列表，再與 Melbourne CBD、South Wharf 比較同類商品。若價格接近，優先選擇送貨條件清楚、回覆更快的賣家，通常交易效率更高。",
        marketCta: "查看 Southbank 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Southbank Second-Hand Market Guide",
        lead:
          "Southbank is a riverside arts-and-residential district with dense apartment living. Its mix of professionals, creative workers, and families creates diverse second-hand demand.",
        overviewTitle: "Area overview",
        overviewBody:
          "With strong transport access and high-rise housing, Southbank has steady turnover in practical household items. Common categories include sofas, bed frames, dining sets, small appliances, and family essentials.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "Frequent apartment move cycles and home upgrades keep supply active, while creative residents add more design-oriented and lifestyle-driven listings to the local second-hand mix.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Apartment move-outs listing sofas, bed frames, dining tables, and kitchen appliances.",
          "Family users rotating children-related items and daily-use household goods.",
          "Creative workers reselling decor pieces, accessories, and selective niche items.",
        ],
        practicalTitle: "How to find better second-hand options in Southbank",
        practicalBody:
          "Filter first by delivery availability, pickup distance, and recent posting time. Then combine “Southbank” with item terms (for example, sofa, dining table, microwave) for faster matching.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Start with Southbank listings, then compare similar items in Melbourne CBD and South Wharf. If prices are close, prioritize sellers with clearer delivery terms and faster response time.",
        marketCta: "Explore Southbank listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneSouthbankSuburbContent() {
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
            href={localizePath("/market?area=Southbank")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Southbank").map((suburb) => (
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
