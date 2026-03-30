"use client";

import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";

type SouthWharfCopy = {
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

function getCopy(locale: string): SouthWharfCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        h1: "南码头（South Wharf）二手市场指南",
        lead:
          "South Wharf 位于亚拉河畔，连接 CBD 与 Southbank，是近年持续发展的高品质商住区域。这里公寓新、生活配套集中，二手交易更偏向品质型与功能型需求。",
        overviewTitle: "区域概况",
        overviewBody:
          "South Wharf 的二手供需以中高品质家居用品为主，常见品类包括设计家具、厨房电器、儿童家具与居家升级类商品。由于区域人口规模相对更小，优质商品通常更依赖精准匹配。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "该区住户对商品成色、品牌与交付体验要求较高，交易关注点常落在“真实图片”“维护状态”“配送方式”与“沟通效率”。相比大范围撒网，定向筛选和及时沟通更容易成交。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "家庭升级家居时，转售高品质餐桌、灯具、收纳系统与厨房设备。",
          "亲子家庭更换婴儿车、儿童床或成长型家具。",
          "公寓住户搬迁时集中出售体积较大的耐用品，并偏好上门自提或定时配送。",
        ],
        practicalTitle: "如何更高效在 South Wharf 找到合适二手物品",
        practicalBody:
          "建议优先筛选“可送货”“支持上门自提”“图片完整”，并使用 “South Wharf + 品类” 关键词（如 dining table、stroller、coffee machine）做精确检索。对于大件商品，优先确认搬运条件与时间窗口。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先浏览 South Wharf 在售列表，再与 Docklands、Melbourne CBD 的同类商品比较。若你重视品质与交付稳定性，可优先选择描述细致、历史评价更好的卖家。",
        marketCta: "查看 South Wharf 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "南碼頭（South Wharf）二手市場指南",
        lead:
          "South Wharf 位於亞拉河畔，連接 CBD 與 Southbank，是近年持續發展的高品質商住區域。區內公寓新、配套完整，二手交易偏向品質與功能兼具的需求。",
        overviewTitle: "區域概況",
        overviewBody:
          "South Wharf 的二手供需以中高品質家居用品為主，常見品類包含設計家具、廚房家電、兒童家具與居家升級用品。由於人口規模相對較小，優質商品更依賴精準媒合。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "住戶對商品成色、品牌與交付體驗要求較高，交易重點常在「實拍完整」「保養狀態」「配送方式」與「回覆效率」。相較廣泛搜尋，定向篩選更容易快速成交。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "家庭升級家居時，轉售高品質餐桌、燈具、收納與廚房設備。",
          "親子家庭更換嬰兒車、兒童床與成長型家具。",
          "公寓住戶搬遷時，集中出售大件耐用品並偏好上門自提或定時配送。",
        ],
        practicalTitle: "如何更有效在 South Wharf 找到合適二手物品",
        practicalBody:
          "建議優先使用「可送貨」「支援上門自提」「圖片完整」篩選，並搭配 “South Wharf + 品類” 關鍵字（如 dining table、stroller、coffee machine）精準搜尋。大件商品建議先確認搬運條件與時段。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 South Wharf 列表，再與 Docklands、Melbourne CBD 比較同類商品。若你重視品質與交付穩定性，可優先選擇描述更完整、回覆更快的賣家。",
        marketCta: "查看 South Wharf 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "South Wharf Second-Hand Market Guide",
        lead:
          "South Wharf is a riverside district linking Melbourne CBD and Southbank, with newer residential stock and a quality-focused second-hand buying pattern.",
        overviewTitle: "Area overview",
        overviewBody:
          "Local second-hand demand often centers on better-condition home goods, including design-forward furniture, kitchen appliances, child-related items, and apartment-upgrade essentials.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "Buyers in South Wharf usually prioritize condition transparency, brand quality, and smooth delivery. Clear photos, accurate descriptions, and reliable logistics tend to drive faster conversions.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Household upgrades listing dining sets, lighting, storage systems, and kitchen equipment.",
          "Family rotations for strollers, children furniture, and practical home essentials.",
          "Apartment move-outs listing larger durable items with pickup or scheduled delivery.",
        ],
        practicalTitle: "How to find better second-hand options in South Wharf",
        practicalBody:
          "Start with filters for delivery availability, pickup support, and complete photos. Then search with “South Wharf + item keywords” (for example, dining table, stroller, coffee machine). For larger items, confirm access and moving conditions early.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Review South Wharf listings first, then compare similar items in Docklands and Melbourne CBD. If quality and reliability matter most, prioritize detailed posts and responsive sellers.",
        marketCta: "Explore South Wharf listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneSouthWharfSuburbContent() {
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
            href={localizePath("/market?area=South%20Wharf")}
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
            {MARKET_SUBURBS.filter((s) => s !== "South Wharf").map((suburb) => (
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
