"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { suburbDisplayName } from "@/lib/suburb-display";
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
        lead: "Docklands 位于墨尔本 CBD 西北侧，是近年来发展迅速的滨水商住区，以高层公寓和商务配套见长。区域内年轻专业人士与家庭住户较多，二手交易需求稳定。",
        overviewTitle: "区域概况",
        overviewBody:
          "Docklands 的公寓型居住结构明显，常见二手交易品类集中在家具、电器、收纳用品和儿童相关用品。由于临近 CBD 与 South Wharf，跨区看货与取货也相对方便。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "该区住户更新节奏快，搬家、换租和家庭结构变化会持续释放可再利用物品。相比传统街区线下交易，Docklands 用户更偏好先在线上快速匹配，再约时间当面交收。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "公寓住户搬迁时批量出售沙发、床架、餐桌和厨房电器。",
          "年轻家庭置换婴儿车、儿童座椅和成长型家具。",
          "新入住用户一次性采购基础生活用品，偏好就近挑选、当面交收。",
        ],
        practicalTitle: "如何更高效在 Docklands 找到合适二手物品",
        practicalBody:
          "先把所在区选为 Docklands，首页就会优先排出离你更近、更新的物品；预算有限可点“免费赠送”或“$20 以内”价格标签，只想看某一类就点“分类”进入餐桌、婴儿车、咖啡机等分类页浏览。搜索时把楼盘名称或附近地标关键词与物品名一起输入，再按价格范围缩小结果；用中文搜也可以，跨语言匹配会把英文标题一并找出来。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先查看 Docklands 列表，再与 Melbourne CBD、South Wharf 对比同类商品。若价格接近，优先选择已在商品上标明面交地点的卖家，约时间当面交收更省事。",
        marketCta: "查看 Docklands 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "碼頭區（Docklands）二手市場指南",
        lead: "Docklands 位於墨爾本 CBD 西北側，是近年發展快速的濱水商住區，以高層公寓與商務配套著稱。區內年輕專業人士與家庭住戶比例高，二手需求穩定。",
        overviewTitle: "區域概況",
        overviewBody:
          "Docklands 具有明顯公寓型居住結構，常見二手品類包括家具、家電、收納用品與兒童用品。因鄰近 CBD 與 South Wharf，跨區看貨與取貨相對方便。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "住戶更新節奏快，搬家、換租與家庭需求變化會持續釋出可再利用物品。相較傳統街區線下交易，Docklands 使用者更偏好先在線上快速媒合，再約時間當面交收。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "公寓住戶搬遷時集中出售沙發、床架、餐桌與廚房家電。",
          "年輕家庭置換嬰兒車、兒童座椅與成長型家具。",
          "新入住住戶一次採購生活基礎用品，偏好就近挑選、當面交收。",
        ],
        practicalTitle: "如何更有效在 Docklands 找到合適二手物品",
        practicalBody:
          "先把所在區設為 Docklands，首頁就會優先排出離你較近、較新的物品；預算有限可點「免費贈送」或「$20 以內」價格標籤，只想看某一類就點「分類」進入餐桌、嬰兒車、咖啡機等分類頁瀏覽。搜尋時把大樓名稱或附近地標關鍵字與物品名一起輸入，再依價格區間縮小結果；用中文搜尋也可以，跨語言比對會一併找出英文標題。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 Docklands 列表，再與 Melbourne CBD、South Wharf 比較同類商品。若價格接近，優先選擇已在商品上標明面交地點的賣家，約時間當面交收更省事。",
        marketCta: "查看 Docklands 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Docklands Second-Hand Market Guide",
        lead: "Docklands is a newer waterfront residential-business district northwest of Melbourne CBD, known for high-rise apartment living and a strong young professional and family mix.",
        overviewTitle: "Area overview",
        overviewBody:
          "Second-hand demand in Docklands is driven by apartment turnover and practical home setup needs. Common categories include furniture, appliances, storage solutions, and child-related items.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "Because many residents move between apartments or upgrade home setups, reusable goods are listed regularly. Compared with traditional inner suburbs, Docklands users often prioritize faster online matching, then arrange the handover in person.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Apartment move-outs listing sofas, bed frames, dining sets, and kitchen appliances.",
          "Young families rotating strollers, child seats, and growth-stage furniture.",
          "New arrivals sourcing practical essentials from nearby listings and collecting them in person.",
        ],
        practicalTitle: "How to find better second-hand options in Docklands",
        practicalBody:
          "Set your suburb to Docklands first, and the feed ranks closer and fresher listings higher. Tap the Giveaway or Under $20 chip when the budget is tight, or open Category to browse dining tables, strollers and coffee machines on their own page. In search, pair an apartment building or nearby landmark keyword with the item word and narrow the results by price; searching in your own language works too, because matching runs across all eight.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Start with Docklands listings, then compare similar items in Melbourne CBD and South Wharf. If prices are similar, prioritize sellers who have already set a meetup spot on the listing, so the in-person handover is easy to arrange.",
        marketCta: "Explore Docklands listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneDocklandsSuburbContent() {
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
            href={localizePath("/market?area=Docklands")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Docklands").map((suburb) => (
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
