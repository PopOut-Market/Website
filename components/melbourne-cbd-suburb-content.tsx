"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { suburbDisplayName } from "@/lib/suburb-display";
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
        lead: "墨尔本CBD是维多利亚州核心商业与文化区域，拥有密集高层建筑、交通枢纽与大学资源（如RMIT市中心校区），兼具商务与学术氛围。",
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
          "CBD 在售物品多、更新也快，先把区域设为 Melbourne CBD，首页就会把离这里更近、发布更新的商品排在前面。首页的价格筛选只有“All”“免费赠送”“$20 以内”三个，想低价入手就切到后两个；要按品类翻书桌、椅子、冰箱、洗衣机，点同一行末尾的“分类”进入分类页面浏览。找具体物品用搜索更快：输入公寓名称或“书桌”这类关键词，八种语言互通，用中文也能搜到英文标题，再按价格收窄结果，最后和卖家约好当面交收。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先进入 CBD 列表查看当前在售，再按你的预算与实际居住时长判断要不要入手；若暂时没有匹配商品，可以继续浏览其他墨尔本区域页面，常能找到通勤可达且性价比更高的替代选择。",
        marketCta: "查看 Melbourne CBD 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "墨爾本中央商務區（Melbourne CBD）二手市場指南",
        lead: "墨爾本CBD是維多利亞州核心商業與文化區域，擁有密集高樓、交通樞紐與大學資源（如RMIT市中心校區），兼具商務與學術氛圍。",
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
          "CBD 在售商品多、更新也快，先把區域設為 Melbourne CBD，首頁就會把離這裡較近、剛刊登不久的商品排在前面。首頁的價格篩選只有「All」「免費贈送」「$20 以內」三個，想用低價入手就切到後兩個；想依品類翻書桌、椅子、冰箱、洗衣機，點同一列最後的「分類」進入分類頁面瀏覽。要找特定物品用搜尋更快：輸入公寓名稱或「書桌」之類的關鍵字，八種語言互通，用中文也能搜到英文標題，再依價格縮小結果，最後和賣家約好當面交收。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先進入 CBD 列表查看目前在售商品，再依預算與實際居住時間判斷要不要入手；若暫時沒有合適選項，可延伸瀏覽其他墨爾本區域，常能找到通勤可達且更高性價比的替代品。",
        marketCta: "查看 Melbourne CBD 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Melbourne CBD Second-Hand Market Guide",
        lead: "Melbourne CBD is one of Victoria's core business and cultural districts, with dense high-rise living, major transit hubs, and nearby university activity including RMIT's city campus.",
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
          "CBD listings are plentiful and turn over quickly, so set your suburb to Melbourne CBD first and the feed will put closer, more recently posted items ahead of the rest. The home feed carries three price chips — All, Giveaway, and Under $20 — and the Category pill at the end of that row opens category browsing for desks, chairs, refrigerators, and washing machines. For something specific, search the keyword in whichever of the eight languages you use, since a Chinese or Korean keyword still matches an English title, then narrow those results by price and message the seller to arrange the in-person handover.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Open the CBD listings first, then weigh each option against your budget and how long you plan to stay. If current supply is limited, check nearby Melbourne suburb pages below for commute-friendly alternatives with stronger value.",
        marketCta: "Explore Melbourne CBD listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneCbdSuburbContent() {
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
            href={localizePath("/market?area=Melbourne%20CBD")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Melbourne CBD").map((suburb) => (
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
