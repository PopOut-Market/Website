"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";

type CarltonCopy = {
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

function getCopy(locale: string): CarltonCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        h1: "卡尔顿（Carlton）二手市场指南",
        lead:
          "卡尔顿是墨尔本内城区里学术氛围最浓的区域之一，毗邻墨尔本大学与RMIT相关校区，学生与年轻从业者占比高，二手交易需求长期活跃。",
        overviewTitle: "区域概况",
        overviewBody:
          "根据近年人口结构特征，Carlton整体呈年轻化，20-29岁人群占比较高。这里文化多元、生活节奏快，常见二手需求集中在寝具、书桌椅、教材、单车与小家电等“搬家高频品类”。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "Carlton学生公寓和租住社区密集，学期开始和学期结束会出现明显的买卖高峰。新入住用户倾向低预算快速配齐生活用品，毕业或搬离人群则更愿意集中出售自用家具和电器，供需匹配效率高。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "新学期开学前后，学生快速购置书桌、床垫、台灯、厨房基础用品。",
          "学期结束或毕业搬家时，集中上架单车、乐器、运动装备与宿舍家具。",
          "合租家庭更换家电时，释放可继续使用的微波炉、电饭煲与储物家具。",
        ],
        practicalTitle: "如何更高效在 Carlton 找到合适二手物品",
        practicalBody:
          "建议按“可送货”“学生发布”“距离近”优先筛选，并结合你居住的公寓或街区关键词进行搜索。Carlton供给更新快，持续浏览几天通常能找到更匹配预算和成色的商品。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先查看 Carlton 列表并保存目标品类，再与附近区域（如 Melbourne CBD、Parkville）交叉比较。若同类商品价格接近，优先选择取货更方便或沟通响应更快的卖家。",
        marketCta: "查看 Carlton 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "卡爾頓（Carlton）二手市場指南",
        lead:
          "Carlton 是墨爾本內城學術氛圍濃厚的區域之一，鄰近墨爾本大學與RMIT相關校區，學生與年輕工作族群比例高，二手交易長期活躍。",
        overviewTitle: "區域概況",
        overviewBody:
          "從近年人口結構來看，Carlton 整體偏年輕，20-29歲族群比例較高。此區文化多元、租住流動快，常見二手需求集中在寢具、書桌椅、教材、單車與小家電等高頻品類。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "Carlton 學生公寓與租屋社區密集，學期初與學期末常出現交易高峰。新入住用戶偏好快速補齊生活用品，搬離與畢業族群則集中釋出家具家電，供需銜接效率高。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "新學期前後，學生快速採購書桌、床墊、檯燈與廚房用品。",
          "學期結束或畢業搬家時，集中刊登單車、樂器、運動裝備與宿舍家具。",
          "合租住戶汰換家電時，釋出可持續使用的微波爐、電鍋與收納家具。",
        ],
        practicalTitle: "如何更有效在 Carlton 找到合適二手物品",
        practicalBody:
          "建議優先篩選「可送貨」「學生發布」「距離近」，並搭配你居住的公寓或街區關鍵字搜尋。Carlton 供給更新快，持續瀏覽數日通常能找到更符合預算與成色的選項。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先查看 Carlton 在售列表並收藏目標品類，再與 Melbourne CBD、Parkville 做交叉比價；若價格接近，可優先考慮取貨便利與回覆效率更高的賣家。",
        marketCta: "查看 Carlton 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Carlton Second-Hand Market Guide",
        lead:
          "Carlton is one of Melbourne's strongest student-oriented inner-city suburbs, close to major university zones and known for fast-moving second-hand demand.",
        overviewTitle: "Area overview",
        overviewBody:
          "Carlton has a notably young resident mix, with strong student and early-career renter presence. Typical second-hand demand includes bedding, desks, chairs, textbooks, bikes, and small appliances.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "Dense student housing and frequent move cycles create recurring buy/sell peaks around semester transitions. New arrivals usually buy practical essentials first, while outgoing residents list reusable furniture and appliances in batches.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Semester-start setup: desks, mattresses, task lighting, and kitchen basics.",
          "Semester-end move-out: bikes, instruments, sports gear, and dorm furniture.",
          "Shared-house upgrades: microwaves, rice cookers, and compact storage furniture.",
        ],
        practicalTitle: "How to find better second-hand options in Carlton",
        practicalBody:
          "Filter first by delivery availability, student-posted listings, and short pickup distance. Searching by your apartment or nearby street names can surface same-area sellers and make pickup coordination much easier.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Start with Carlton listings, then compare nearby options in Melbourne CBD and Parkville. If prices are similar, prioritize pickup convenience, seller response speed, and clearer condition details.",
        marketCta: "Explore Carlton listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneCarltonSuburbContent() {
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
            href={localizePath("/market?area=Carlton")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Carlton").map((suburb) => (
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
