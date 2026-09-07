"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { suburbDisplayName } from "@/lib/suburb-display";
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
        lead: "South Wharf 位于亚拉河畔，连接 CBD 与 Southbank，是近年持续发展的高品质商住区域。这里公寓新、生活配套集中，二手交易更偏向品质型与功能型需求。",
        overviewTitle: "区域概况",
        overviewBody:
          "South Wharf 的二手供需以中高品质家居用品为主，常见品类包括设计家具、厨房电器、儿童家具与居家升级类商品。由于区域人口规模相对更小，优质商品通常更依赖精准匹配。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "该区住户找二手多半带着明确目标：先把所在区域设为 South Wharf，再用 “免费赠送” 或 “$20 以内” 价格标签缩小范围。想按品类看货，可点开 Category 进入分类页，用子分类标签浏览设计家具、厨房电器与儿童家具。相比大范围撒网，定向浏览和及时沟通更容易成交。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "家庭升级家居时，转售高品质餐桌、灯具、收纳系统与厨房设备。",
          "亲子家庭更换婴儿车、儿童床或成长型家具。",
          "公寓住户搬迁时集中出售体积较大的耐用品，卖家可在发布时标注见面地点，由买卖双方当面交易。",
        ],
        practicalTitle: "如何更高效在 South Wharf 找到合适二手物品",
        practicalBody:
          "建议先把所在区域设为 South Wharf，首页会把更近、更新的商品排在前面；预算有限时切换到 “免费赠送” 或 “$20 以内” 价格标签。再用 “South Wharf + 品类” 关键词（如 dining table、stroller、coffee machine）做精确检索，并在结果页用价格区间进一步缩小范围；搜索支持八种语言互通，用中文关键词也能找到英文标题的商品。对于大件商品，优先确认搬运条件与时间窗口。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先浏览 South Wharf 在售列表，再与 Docklands、Melbourne CBD 的同类商品比较。若你重视品质，可优先挑选照片清晰、描述细致的商品，看中后联系卖家约好时间地点，当面交易。",
        marketCta: "查看 South Wharf 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "南碼頭（South Wharf）二手市場指南",
        lead: "South Wharf 位於亞拉河畔，連接 CBD 與 Southbank，是近年持續發展的高品質商住區域。區內公寓新、配套完整，二手交易偏向品質與功能兼具的需求。",
        overviewTitle: "區域概況",
        overviewBody:
          "South Wharf 的二手供需以中高品質家居用品為主，常見品類包含設計家具、廚房家電、兒童家具與居家升級用品。由於人口規模相對較小，優質商品更依賴精準媒合。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "區內住戶找二手多半帶著明確目標：先把所在區域設為 South Wharf，再用「免費贈送」或「$20 以內」價格標籤縮小範圍。想依品類看貨，可點開 Category 進入分類頁，用子分類標籤瀏覽設計家具、廚房家電與兒童家具。相較廣泛搜尋，定向瀏覽與即時溝通更容易快速成交。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "家庭升級家居時，轉售高品質餐桌、燈具、收納與廚房設備。",
          "親子家庭更換嬰兒車、兒童床與成長型家具。",
          "公寓住戶搬遷時，集中出售大件耐用品；賣家可在刊登時標註見面地點，由雙方當面點交。",
        ],
        practicalTitle: "如何更有效在 South Wharf 找到合適二手物品",
        practicalBody:
          "建議先把所在區域設為 South Wharf，首頁會把較近、較新的商品排在前面；預算有限時切換到「免費贈送」或「$20 以內」價格標籤。接著搭配 “South Wharf + 品類” 關鍵字（如 dining table、stroller、coffee machine）精準搜尋，並在結果頁以價格區間再縮小範圍；搜尋支援八種語言互通，用中文關鍵字也找得到英文標題的商品。大件商品建議先確認搬運條件與時段。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 South Wharf 列表，再與 Docklands、Melbourne CBD 比較同類商品。若你重視品質，可優先挑選照片清楚、描述更完整的商品，看中後聯絡賣家約好時間地點，當面點交。",
        marketCta: "查看 South Wharf 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "South Wharf Second-Hand Market Guide",
        lead: "South Wharf is a riverside district linking Melbourne CBD and Southbank, with newer residential stock and a quality-focused second-hand buying pattern.",
        overviewTitle: "Area overview",
        overviewBody:
          "Local second-hand demand often centers on better-quality home goods, including design-forward furniture, kitchen appliances, child-related items, and apartment-upgrade essentials.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "Buyers in South Wharf usually shop with a clear target: set South Wharf as your suburb, then narrow the feed with the Giveaway or Under $20 price chip. To browse by type instead, open Category and use the subcategory chips for design furniture, kitchen appliances, and children's items. Targeted browsing and prompt replies tend to drive faster conversions.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Household upgrades listing dining sets, lighting, storage systems, and kitchen equipment.",
          "Family rotations for strollers, children furniture, and practical home essentials.",
          "Apartment move-outs listing larger durable items, with a meetup spot noted in the post and the handover done in person.",
        ],
        practicalTitle: "How to find better second-hand options in South Wharf",
        practicalBody:
          "Set your suburb to South Wharf first — the feed puts closer and newer listings ahead — and tap the Giveaway or Under $20 chip when the budget is tight. Then search “South Wharf + item keywords” (for example, dining table, stroller, coffee machine) and narrow the results by price; search matches across all eight languages, so your own language still finds English titles. For larger items, confirm access and moving conditions early.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Review South Wharf listings first, then compare similar items in Docklands and Melbourne CBD. If quality matters most, prioritize posts with clear photos and detailed descriptions, then message the seller to agree a time and place and complete the handover in person.",
        marketCta: "Explore South Wharf listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneSouthWharfSuburbContent() {
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
            href={localizePath("/market?area=South%20Wharf")}
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
            {MARKET_SUBURBS.filter((s) => s !== "South Wharf").map((suburb) => (
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
