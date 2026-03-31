"use client";

import { BackNavLink } from "@/components/back-nav-link";
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
        lead:
          "North Melbourne 是距离 CBD 很近的内城区，住宅类型多样，既有传统联排住宅也有公寓租住社区。区域内年轻人、家庭和职场人群并存，二手需求长期稳定。",
        overviewTitle: "区域概况",
        overviewBody:
          "该区生活便利、通勤半径短，常见二手品类覆盖家具、电器、厨房用品、儿童相关用品，以及运动和通勤类物品。由于居住结构多元，买卖双方需求跨度较大，容易形成高匹配交易。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "North Melbourne 社区感较强，居民在搬家、换租和家庭升级时会持续释放可再利用物品。部分住户会在本地社区渠道发布信息，因此同区交易通常更强调响应速度和取货便利。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "家庭住户更新家具时，出售大件家具、窗帘、收纳和厨房电器。",
          "新租户集中采购实用家居用品，优先关注可快速取货的同区卖家。",
          "运动氛围较强区域内，单车、运动装备和乐器类商品流转活跃。",
        ],
        practicalTitle: "如何更高效在 North Melbourne 找到合适二手物品",
        practicalBody:
          "建议先按“可送货”“同区发布”“发布时间新”筛选，再使用“North Melbourne + 品类”关键词检索。若你通勤依赖火车或电车，可追加附近站点关键词（如 South Kensington）来提高就近匹配效率。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先查看 North Melbourne 列表，再与 Carlton、Flemington 等邻近区域对比同类商品。若价格接近，优先选择同区自提或送货条件明确的卖家，通常更省时省力。",
        marketCta: "查看 North Melbourne 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "北墨爾本（North Melbourne）二手市場指南",
        lead:
          "North Melbourne 是距離 CBD 很近的內城區，住宅型態多元，包含傳統聯排住宅與公寓租住社區。區內年輕住戶、家庭與上班族並存，二手需求長期穩定。",
        overviewTitle: "區域概況",
        overviewBody:
          "此區通勤便利、生活機能完整，常見二手品類涵蓋家具、家電、廚房用品、兒童用品，以及運動與通勤類物件。因住戶結構多樣，買賣需求跨度大，媒合機會高。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "North Melbourne 社區感較強，住戶在搬家、換租與家庭升級時會持續釋出可再利用物品。部分住戶會透過在地社群管道發布資訊，因此同區交易更重視回覆速度與取貨便利。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "家庭住戶更新家居時，釋出大件家具、窗簾、收納與廚房家電。",
          "新租戶集中採購實用生活用品，偏好可快速取貨的同區賣家。",
          "在運動氛圍較強的社區，單車、運動裝備與樂器流通活躍。",
        ],
        practicalTitle: "如何更有效在 North Melbourne 找到合適二手物品",
        practicalBody:
          "建議先用「可送貨」「同區發布」「發布時間新」篩選，再以「North Melbourne + 品類」關鍵字搜尋。若你仰賴大眾運輸，可加入附近站點詞（如 South Kensington）提高就近匹配效率。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 North Melbourne 列表，再與 Carlton、Flemington 交叉比價。若價格接近，優先選擇同區自提或送貨條件明確的賣家，通常交易更省時。",
        marketCta: "查看 North Melbourne 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "North Melbourne Second-Hand Market Guide",
        lead:
          "North Melbourne is a close-to-CBD inner suburb with mixed housing stock, combining terrace homes and apartment rentals. Its resident mix creates steady second-hand demand across practical categories.",
        overviewTitle: "Area overview",
        overviewBody:
          "With convenient access and diverse households, common second-hand demand includes furniture, appliances, kitchen essentials, child-related items, and mobility or sport gear.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "North Melbourne has strong neighborhood-level activity. Move-outs, lease changes, and household upgrades keep reusable goods circulating regularly, with local convenience often driving purchase decisions.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Family home updates listing larger furniture, soft furnishings, storage, and kitchen appliances.",
          "New renters sourcing practical essentials with priority on quick local pickup.",
          "Active-lifestyle demand for bicycles, sports equipment, and music-related items.",
        ],
        practicalTitle: "How to find better second-hand options in North Melbourne",
        practicalBody:
          "Start with filters like delivery available, same-area listings, and recently posted. Then combine “North Melbourne + item keywords”. If you rely on transit, nearby station terms (such as South Kensington) can improve local matching.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Review North Melbourne listings first, then compare similar items in Carlton and Flemington. If prices are similar, prioritize local pickup or clearly defined delivery terms.",
        marketCta: "Explore North Melbourne listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneNorthMelbourneSuburbContent() {
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
            href={localizePath("/market?area=North%20Melbourne")}
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
            {MARKET_SUBURBS.filter((s) => s !== "North Melbourne").map((suburb) => (
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
