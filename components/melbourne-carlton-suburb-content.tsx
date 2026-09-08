"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { suburbDisplayName } from "@/lib/suburb-display";
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
        lead: "卡尔顿是墨尔本内城区里学术氛围最浓的区域之一，毗邻墨尔本大学与RMIT相关校区，学生与年轻从业者占比高，二手交易需求长期活跃。",
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
          "建议先把区域设为 Carlton，首页会把离你更近、发布更新的商品排在前面；再用价格标签里的“免费赠送”或“$20 以内”缩小预算，或点开“分类”按品类浏览书桌椅、床垫、单车与小家电。要找具体物品时直接搜关键词，例如书桌、微波炉、单车，再在搜索结果里按价格筛选；八种语言互相匹配，用中文搜也能命中英文标题的商品。Carlton供给更新快，持续浏览几天通常能找到更匹配预算的商品。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先在 Carlton 浏览目标品类，再把区域切换到 Melbourne CBD、Parkville 做交叉比较。若同类商品价格接近，优先选择碰面地点更顺路的卖家；PopOut 的交易一律当面完成，联系上之后先把碰面时间和地点谈好。",
        marketCta: "查看 Carlton 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "卡爾頓（Carlton）二手市場指南",
        lead: "Carlton 是墨爾本內城學術氛圍濃厚的區域之一，鄰近墨爾本大學與RMIT相關校區，學生與年輕工作族群比例高，二手交易長期活躍。",
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
          "建議先把地區設為 Carlton，首頁會把離你較近、刊登較新的商品排在前面；再用價格標籤中的「免費贈送」或「$20 以內」縮小預算，或點開「分類」依類別瀏覽書桌椅、床墊、單車與小家電。想找特定物品時直接輸入關鍵字，例如書桌、微波爐、單車，再於搜尋結果依價格篩選；八種語言可互相對應，用中文搜尋一樣找得到英文標題的商品。Carlton 供給更新快，持續瀏覽數日通常能找到更符合預算的選項。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先在 Carlton 瀏覽目標品類，再把地區切換到 Melbourne CBD、Parkville 做交叉比價；若價格接近，可優先考慮碰面地點較順路的賣家。PopOut 的交易一律當面完成，聯絡上之後先把碰面時間與地點談好。",
        marketCta: "查看 Carlton 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Carlton Second-Hand Market Guide",
        lead: "Carlton is one of Melbourne's strongest student-oriented inner-city suburbs, close to major university zones and known for fast-moving second-hand demand.",
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
          "Set your suburb to Carlton first — the feed puts closer and newer listings near the top — then use the Giveaway or Under $20 price chip to narrow your budget, or open Category to browse desks, chairs, mattresses, bikes and small appliances. For something specific, search the item word (desk, microwave, bike) and narrow the results by price; matching works across all eight languages, so a search in your own language still finds English titles. Carlton stock turns over quickly, so checking back over a few days usually surfaces a better match for your budget.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Start with Carlton listings, then switch the suburb to Melbourne CBD or Parkville to compare. If prices are similar, prioritize the seller whose pickup is easiest to reach; every handover happens in person, so agree on a time and meeting spot once you are in touch.",
        marketCta: "Explore Carlton listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneCarltonSuburbContent() {
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
            href={localizePath("/market?area=Carlton")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Carlton").map((suburb) => (
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
