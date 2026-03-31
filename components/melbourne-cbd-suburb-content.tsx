"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";

type CbdCopy = {
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

function getCopy(locale: string): CbdCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        h1: "墨尔本中央商务区（Melbourne CBD）二手市场指南",
        lead:
          "墨尔本CBD是维多利亚州核心商业与文化区域，拥有密集高层建筑、交通枢纽与大学资源（如RMIT市中心校区），兼具商务与学术氛围。",
        overviewTitle: "区域概况",
        overviewBody:
          "CBD及其周边城市核心地带常住与流动人口密集，上班族、学生、短租人群占比高，推动了本地二手交易的持续需求。常见品类包括办公家具、电子设备、出租公寓家具、学生教材与自行车等。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "由于靠近大学和就业中心，CBD具有明显的“高流动、高换租、高频补给”特征。新生与新入职人群常需要预算友好的家具和电器，而搬家用户会集中释放可再利用物品，因此供需两端都非常活跃。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "大学新生入住市区或校园周边，快速采购书桌、椅子、床垫、厨房基础用品。",
          "租客换房或退租时，转售冰箱、洗衣机、沙发等公寓家具家电。",
          "短期停留人群（如WHV或交换生）在离开前集中出售可搬运物品。",
        ],
        practicalTitle: "如何更高效在 CBD 找到合适二手物品",
        practicalBody:
          "建议你多浏览 App 并持续筛选，因为 CBD 在售物品数量大、更新快，花更多时间更容易找到性价比高或有惊喜的商品。筛选时可优先关注“可送货”“学生发布”，并尝试搜索你居住的公寓名称，查看是否有同一学生公寓内的用户在售卖，通常沟通和取货都会更方便。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先进入 CBD 列表查看当前在售，再根据你的预算与居住周期缩小范围；若暂时没有匹配商品，可以继续浏览其他墨尔本区域页面，常能找到通勤可达且性价比更高的替代选择。",
        marketCta: "查看 Melbourne CBD 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "墨爾本中央商務區（Melbourne CBD）二手市場指南",
        lead:
          "墨爾本CBD是維多利亞州核心商業與文化區域，擁有密集高樓、交通樞紐與大學資源（如RMIT市中心校區），兼具商務與學術氛圍。",
        overviewTitle: "區域概況",
        overviewBody:
          "CBD與周邊城市核心地帶常住與流動人口密集，上班族、學生與短租族群比例高，帶動在地二手交易需求。常見品類包含辦公家具、電子設備、公寓家具、教材與自行車等。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "由於接近大學與就業中心，CBD具有高流動與高換租特性。新生與新就業族群偏好預算型家具家電，而搬家用戶會集中釋出可再利用物品，供需雙方都相當活躍。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "大學新生入住市區或校園周邊，快速採購書桌、椅子、床墊與廚房用品。",
          "租客換屋或退租時，轉售冰箱、洗衣機、沙發等公寓家具家電。",
          "短期停留族群（如WHV或交換生）離開前集中出售可搬運物品。",
        ],
        practicalTitle: "如何更有效在 CBD 找到合適二手物品",
        practicalBody:
          "建議優先篩選「可當日面交」「公寓尺寸友善」「可短期使用」的商品，並比較賣家刊登時長、物品狀況與取貨便利性。對學生族群而言，可先鎖定學習與租住必需品組合，避免重複購買。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先進入 CBD 列表查看目前在售商品，再依預算與居住週期縮小範圍；若暫時沒有合適選項，可延伸瀏覽其他墨爾本區域，常能找到通勤可達且更高性價比的替代品。",
        marketCta: "查看 Melbourne CBD 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Melbourne CBD Second-Hand Market Guide",
        lead:
          "Melbourne CBD is one of Victoria's core business and cultural districts, with dense high-rise living, major transit hubs, and nearby university activity including RMIT's city campus.",
        overviewTitle: "Area overview",
        overviewBody:
          "The CBD and surrounding city-core precincts have high resident and visitor turnover. This supports strong second-hand demand for apartment furniture, electronics, study materials, and mobility items like bikes.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "Because the area is close to campuses and employment centers, CBD has frequent move-ins and move-outs. New students and early-career workers often buy budget essentials, while relocating tenants frequently resell usable home items.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Students moving into city accommodation buying desks, chairs, mattresses, and kitchen basics.",
          "Renters leaving apartments listing refrigerators, washing machines, sofas, and storage units.",
          "Short-stay residents (including WHV and exchange students) selling practical items before departure.",
        ],
        practicalTitle: "How to find better second-hand options in CBD",
        practicalBody:
          "Start with listings that are same-day pickup friendly, apartment-size suitable, and practical for short stays. Compare listing freshness, item condition, and pickup convenience before deciding. Students usually save more by prioritizing study-and-living essentials first.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Open the CBD listings first, then narrow by budget and length of stay. If current supply is limited, check nearby Melbourne suburb pages below for commute-friendly alternatives with stronger value.",
        marketCta: "Explore Melbourne CBD listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneCbdSuburbContent() {
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
            href={localizePath("/market?area=Melbourne%20CBD")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Melbourne CBD").map((suburb) => (
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
