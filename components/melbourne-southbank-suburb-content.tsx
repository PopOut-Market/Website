"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { suburbDisplayName } from "@/lib/suburb-display";
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
        lead: "Southbank 是亚拉河沿岸的艺术与高密度住宅区域，兼具文化活动与公寓生活场景。区域内白领、创意从业者与家庭住户并存，形成了多元且持续的二手交易需求。",
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
          "建议先把区域设为 Southbank，首页会自动把离你更近、发布更新的商品排在前面；预算有限就点“免费赠送”或“$20 以内”价格标签，想整类慢慢逛就点同一行末尾的“分类”进入分类页，浏览沙发、餐桌、床架与小家电。目标明确时直接搜关键词（如 sofa、dining table、microwave），再在结果页按价格区间收窄。若你住在公寓楼，可把楼名或附近地标与物品名一起输入；用中文搜也能命中英文标题，因为搜索在八种语言之间互通。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先查看 Southbank 在售列表，再与 Melbourne CBD、South Wharf 交叉对比。若同类商品价格接近，优先选择已在商品上标明面交地点的卖家，约时间当面交收更省事，整体体验通常也更好。",
        marketCta: "查看 Southbank 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "南岸（Southbank）二手市場指南",
        lead: "Southbank 是亞拉河沿岸的藝術與高密度住宅區域，兼具文化活動與公寓生活場景。區內白領、創意從業者與家庭住戶並存，二手交易需求多元且持續。",
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
          "建議先把地區設為 Southbank，首頁會自動把離你較近、刊登較新的商品排在前面；預算有限就點「免費贈送」或「$20 以內」價格標籤，想整類慢慢逛就點同一列最後的「分類」進入分類頁，瀏覽沙發、餐桌、床架與小家電。目標明確時直接輸入關鍵字（例如 sofa、dining table、microwave），再於結果頁依價格區間縮小範圍。若你住在公寓大樓，可把大樓名稱或附近地標與物品名一起輸入；用中文搜尋同樣能對應到英文標題，因為搜尋在八種語言之間互通。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 Southbank 列表，再與 Melbourne CBD、South Wharf 比較同類商品。若價格接近，優先選擇已在商品上標明面交地點的賣家，約時間當面交收更省事，交易效率通常也更高。",
        marketCta: "查看 Southbank 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Southbank Second-Hand Market Guide",
        lead: "Southbank is a riverside arts-and-residential district with dense apartment living. Its mix of professionals, creative workers, and families creates diverse second-hand demand.",
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
          "Set your suburb to Southbank first — the feed already ranks closer and more recently posted listings ahead — then tap the Giveaway or Under $20 price chip when the budget is tight, or open the Category pill at the end of that row to browse sofas, dining tables, bed frames and small appliances on their own page. When you know what you want, search the item word (sofa, dining table, microwave) and narrow those results by price. If you live in an apartment tower, pair the building name or a nearby landmark with the item word; searching in your own language works too, because matching runs across all eight.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Start with Southbank listings, then compare similar items in Melbourne CBD and South Wharf. If prices are close, prioritize sellers who have already set a meetup spot on the listing, so the in-person handover is quicker to arrange.",
        marketCta: "Explore Southbank listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneSouthbankSuburbContent() {
  const { locale, localizePath, t } = useSiteShell();
  const copy = getCopy(locale);
  const backLabel = t.suburbBackToHub;

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

        <div className="mt-6 space-y-6 rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
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

        <div className="mt-6">
          <Link
            href={localizePath("/market?area=Southbank")}
            className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 active:bg-brand-700"
          >
            {copy.marketCta}
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            {copy.relatedTitle}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {MARKET_SUBURBS.filter((s) => s !== "Southbank").map((suburb) => (
              <Link
                key={suburb}
                href={localizePath(suburbSeoPath(suburb))}
                className="rounded-full border border-black/5 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:border-brand-500"
              >
                {suburbDisplayName(suburb)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
