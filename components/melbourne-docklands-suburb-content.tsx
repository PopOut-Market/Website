"use client";

import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";

type DocklandsCopy = {
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

function getCopy(locale: string): DocklandsCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        h1: "码头区（Docklands）二手市场指南",
        lead:
          "Docklands 位于墨尔本 CBD 西北侧，是近年来发展迅速的滨水商住区，以高层公寓和商务配套见长。区域内年轻专业人士与家庭住户较多，二手交易需求稳定。",
        overviewTitle: "区域概况",
        overviewBody:
          "Docklands 的公寓型居住结构明显，常见二手交易品类集中在家具、电器、收纳用品和儿童相关用品。由于临近 CBD 与 South Wharf，跨区看货与取货也相对方便。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "该区住户更新节奏快，搬家、换租和家庭结构变化会持续释放可再利用物品。相比传统街区线下交易，Docklands 用户更偏好线上快速匹配，注重效率和沟通响应速度。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "公寓住户搬迁时批量出售沙发、床架、餐桌和厨房电器。",
          "年轻家庭置换婴儿车、儿童座椅和成长型家具。",
          "新入住用户一次性采购基础生活用品，追求就近和高效率交付。",
        ],
        practicalTitle: "如何更高效在 Docklands 找到合适二手物品",
        practicalBody:
          "建议优先筛选“可送货”“同区发布”“发布时间新”，并结合楼盘名称或附近地标关键词搜索。若同类商品较多，可先按取货便利度与沟通响应速度排序，提高成交效率。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先查看 Docklands 列表，再与 Melbourne CBD、South Wharf 对比同类商品。若价格接近，优先选择交付条件更清晰、可快速确认时间的卖家，通常体验更稳定。",
        marketCta: "查看 Docklands 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "碼頭區（Docklands）二手市場指南",
        lead:
          "Docklands 位於墨爾本 CBD 西北側，是近年發展快速的濱水商住區，以高層公寓與商務配套著稱。區內年輕專業人士與家庭住戶比例高，二手需求穩定。",
        overviewTitle: "區域概況",
        overviewBody:
          "Docklands 具有明顯公寓型居住結構，常見二手品類包括家具、家電、收納用品與兒童用品。因鄰近 CBD 與 South Wharf，跨區看貨與取貨相對方便。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "住戶更新節奏快，搬家、換租與家庭需求變化會持續釋出可再利用物品。相較傳統街區線下交易，Docklands 使用者更偏好線上快速媒合與高效率溝通。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "公寓住戶搬遷時集中出售沙發、床架、餐桌與廚房家電。",
          "年輕家庭置換嬰兒車、兒童座椅與成長型家具。",
          "新入住住戶一次採購生活基礎用品，偏好就近與快速交付。",
        ],
        practicalTitle: "如何更有效在 Docklands 找到合適二手物品",
        practicalBody:
          "建議優先使用「可送貨」「同區發布」「發布時間新」篩選，並搭配樓盤名稱或地標關鍵字搜尋。若同類商品供給多，可優先比較取貨便利與回覆速度。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 Docklands 列表，再與 Melbourne CBD、South Wharf 比較同類商品。若價格接近，優先選擇交付條件清楚、可快速確認時段的賣家。",
        marketCta: "查看 Docklands 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Docklands Second-Hand Market Guide",
        lead:
          "Docklands is a newer waterfront residential-business district northwest of Melbourne CBD, known for high-rise apartment living and a strong young professional and family mix.",
        overviewTitle: "Area overview",
        overviewBody:
          "Second-hand demand in Docklands is driven by apartment turnover and practical home setup needs. Common categories include furniture, appliances, storage solutions, and child-related items.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "Because many residents move between apartments or upgrade home setups, reusable goods are listed regularly. Compared with traditional inner suburbs, Docklands users often prioritize faster online matching and delivery-ready transactions.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Apartment move-outs listing sofas, bed frames, dining sets, and kitchen appliances.",
          "Young families rotating strollers, child seats, and growth-stage furniture.",
          "New arrivals sourcing practical essentials quickly from nearby listings.",
        ],
        practicalTitle: "How to find better second-hand options in Docklands",
        practicalBody:
          "Use filters like delivery available, same-area listings, and recently posted. Adding apartment building or nearby landmark keywords in search usually improves local matching speed.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Start with Docklands listings, then compare similar items in Melbourne CBD and South Wharf. If prices are similar, prioritize clearer delivery terms and faster response from sellers.",
        marketCta: "Explore Docklands listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneDocklandsSuburbContent() {
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
        <Link
          href={localizePath("/melbourne-suburbs")}
          className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>
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
            href={localizePath("/market?area=Docklands")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Docklands").map((suburb) => (
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
