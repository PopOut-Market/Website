"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { suburbDisplayName } from "@/lib/suburb-display";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";

type NorthMelbourneCopy = {
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

function getCopy(locale: string): NorthMelbourneCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        h1: "北墨尔本（North Melbourne）二手市场指南",
        lead: "North Melbourne 是距离 CBD 很近的内城区，住宅类型多样，既有传统联排住宅也有公寓租住社区。区域内年轻人、家庭和职场人群并存，二手需求长期稳定。",
        overviewTitle: "区域概况",
        overviewBody:
          "该区生活便利、通勤半径短，常见二手品类覆盖家具、电器、厨房用品、儿童相关用品，以及运动和通勤类物品。由于居住结构多元，买卖双方需求跨度较大，容易形成高匹配交易。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "North Melbourne 社区感较强，居民在搬家、换租和家庭升级时会持续释放可再利用物品。部分住户会在本地社区渠道发布信息，因此同区交易通常更看重当面取货是否顺路。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "家庭住户更新家具时，出售大件家具、窗帘、收纳和厨房电器。",
          "新租户集中采购实用家居用品，优先关注可快速取货的同区卖家。",
          "运动氛围较强区域内，单车、运动装备和乐器类商品流转活跃。",
        ],
        practicalTitle: "如何更高效在 North Melbourne 找到合适二手物品",
        practicalBody:
          "建议先把首页的区域设为 North Melbourne：首页会自动把距离更近、发布更新的商品排在前面，再用“免费赠送”或“$20 以内”价格标签收窄到预算之内。想整类慢慢逛，就点价格标签后面的“分类”进入分类页；目标明确时直接搜索品类关键词（餐桌、婴儿推车、咖啡机），并在结果页按价格区间筛选。用中文输入也能匹配到英文标题，因为搜索在八种语言之间互通；若你通勤依赖火车或电车，可优先联系碰面地点靠近 South Kensington 等站点的卖家，取货更顺路。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先查看 North Melbourne 列表，再把区域切到 Carlton 或 Parkville 对比同类商品。若价格接近，优先选择碰面地点更好到达的卖家；所有交易都是当面完成，取货是否顺路通常更省时省力。",
        marketCta: "查看 North Melbourne 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "北墨爾本（North Melbourne）二手市場指南",
        lead: "North Melbourne 是距離 CBD 很近的內城區，住宅型態多元，包含傳統聯排住宅與公寓租住社區。區內年輕住戶、家庭與上班族並存，二手需求長期穩定。",
        overviewTitle: "區域概況",
        overviewBody:
          "此區通勤便利、生活機能完整，常見二手品類涵蓋家具、家電、廚房用品、兒童用品，以及運動與通勤類物件。因住戶結構多樣，買賣需求跨度大，媒合機會高。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "North Melbourne 社區感較強，住戶在搬家、換租與家庭升級時會持續釋出可再利用物品。部分住戶會透過在地社群管道發布資訊，因此同區交易更看重當面取貨是否順路。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "家庭住戶更新家居時，釋出大件家具、窗簾、收納與廚房家電。",
          "新租戶集中採購實用生活用品，偏好可快速取貨的同區賣家。",
          "在運動氛圍較強的社區，單車、運動裝備與樂器流通活躍。",
        ],
        practicalTitle: "如何更有效在 North Melbourne 找到合適二手物品",
        practicalBody:
          "建議先把首頁的區域設為 North Melbourne：首頁會自動把距離較近、發布較新的商品排在前面，再用「免費贈送」或「$20 以內」價格標籤收窄到預算之內。想整類慢慢逛，就點價格標籤後面的「分類」進入分類頁；目標明確時直接搜尋品類關鍵字（餐桌、嬰兒推車、咖啡機），並在結果頁依價格區間篩選。用中文輸入同樣能對應到英文標題，因為搜尋在八種語言之間互通；若你仰賴大眾運輸，可優先聯絡碰面地點靠近 South Kensington 等站點的賣家，取貨更順路。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 North Melbourne 列表，再把區域切到 Carlton 或 Parkville 交叉比價。若價格接近，優先選擇碰面地點較好到達的賣家；所有交易都是當面完成，取貨是否順路通常就決定了省不省時。",
        marketCta: "查看 North Melbourne 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "North Melbourne Second-Hand Market Guide",
        lead: "North Melbourne is a close-to-CBD inner suburb with mixed housing stock, combining terrace homes and apartment rentals. Its resident mix creates steady second-hand demand across practical categories.",
        overviewTitle: "Area overview",
        overviewBody:
          "With convenient access and diverse households, common second-hand demand includes furniture, appliances, kitchen essentials, child-related items, and mobility or sport gear.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "North Melbourne has strong neighborhood-level activity. Move-outs, lease changes, and household upgrades keep reusable goods circulating regularly, with how easy the in-person pickup is often driving purchase decisions.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Family home updates listing larger furniture, soft furnishings, storage, and kitchen appliances.",
          "New renters sourcing practical essentials with priority on quick local pickup.",
          "Active-lifestyle demand for bicycles, sports equipment, and music-related items.",
        ],
        practicalTitle: "How to find better second-hand options in North Melbourne",
        practicalBody:
          "Set your suburb to North Melbourne first: the feed already ranks nearer and newer listings ahead, and the Giveaway or Under $20 chip narrows it to your budget. To browse a whole category, tap the Category pill at the end of that row; when you know what you want, search the item word instead — dining table, stroller, coffee machine — and narrow those results by price. Typing in your own language still matches English titles, because search works across all eight; and if you rely on transit, favour sellers whose meetup spot sits near a station such as South Kensington.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Review North Melbourne listings first, then set your suburb to Carlton or Parkville to compare similar items. If prices are similar, prioritize the seller whose meetup spot is easiest to reach — every handover is in person, so a convenient pickup usually saves the most time.",
        marketCta: "Explore North Melbourne listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneNorthMelbourneSuburbContent() {
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
            href={localizePath("/market?area=North%20Melbourne")}
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
            {MARKET_SUBURBS.filter((s) => s !== "North Melbourne").map((suburb) => (
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
