"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { suburbDisplayName } from "@/lib/suburb-display";
import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";

type ParkvilleCopy = {
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

function getCopy(locale: string): ParkvilleCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        h1: "帕克维尔（Parkville）二手市场指南",
        lead: "帕克维尔位于墨尔本大学及医疗科研带周边，是学术与医疗资源高度集中的内城区。学生、实习生、研究人员与年轻租住群体共同构成了活跃的本地二手交易需求。",
        overviewTitle: "区域概况",
        overviewBody:
          "Parkville人口结构整体偏年轻，学习与工作节奏快，居住流动性较高。二手市场常见商品包括课本、电子设备、学习桌椅、床垫、沙发与厨房用品等高频生活品类。",
        communityTitle: "社区特点与交易需求",
        communityBody:
          "由于大学、医院与科研机构集中，Parkville有明显的“短周期更替”特征：新入住用户会快速补齐基础生活物品，而搬离用户通常会在较短时间内集中出售家具家电，供需匹配效率高。",
        scenariosTitle: "典型二手交易场景",
        scenarios: [
          "新学期或新轮岗开始前，集中采购书桌椅、学习灯、收纳柜与厨房基础用品。",
          "毕业、换租或实习结束时，转售床垫、沙发、小家电与学习设备。",
          "研究生与医疗相关人群交换实用物品，如电子配件、搬家工具和短租家具。",
        ],
        practicalTitle: "如何更高效在 Parkville 找到合适二手物品",
        practicalBody:
          "先把区域设为 Parkville，首页就会把离你更近、发布更新的商品排在前面；预算有限就切到价格标签里的“免费赠送”或“$20 以内”，想按品类慢慢逛，点同一行末尾的“分类”进入分类页浏览书桌椅、床垫、咖啡机。找具体物品用搜索更快：输入公寓名称或“书桌”“微波炉”这类关键词，再在结果里按价格收窄；八种语言互相匹配，用中文搜也能命中英文标题的商品。如果你住在学生公寓或共享住宅，直接搜索公寓名称通常更容易找到距离近、沟通快的卖家，谈好后约当面交收。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先浏览 Parkville 在售列表，再与邻近的 Carlton、Melbourne CBD 对比同类商品。若预算有限，先用“免费赠送”和“$20 以内”把首页过一遍，再搜索沙发、床垫、咖啡机等具体品类并按价格收窄结果，能显著降低整体交易成本与时间成本。所有交易都是当面完成，出发前先和卖家约好时间与见面地点。",
        marketCta: "查看 Parkville 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "帕克維爾（Parkville）二手市場指南",
        lead: "Parkville 位於墨爾本大學與醫療科研帶周邊，是學術與醫療資源高度集中的內城區。學生、實習生、研究人員與年輕租住族群共同形成活躍二手需求。",
        overviewTitle: "區域概況",
        overviewBody:
          "Parkville 人口結構整體偏年輕，學習與工作節奏快，居住流動性高。常見二手品類包含教材、電子設備、桌椅、床墊、沙發與廚房用品。",
        communityTitle: "社群特徵與交易需求",
        communityBody:
          "由於大學、醫院與研究機構密集，Parkville 具有短週期更替特性：新入住族群快速補齊生活物品，搬離族群則集中釋出家具家電，供需銜接效率高。",
        scenariosTitle: "典型二手交易場景",
        scenarios: [
          "新學期或新輪班前，集中採購書桌椅、檯燈、收納與廚房用品。",
          "畢業、換租或實習結束時，轉售床墊、沙發、小家電與學習設備。",
          "研究生與醫療相關住戶交換電子配件、搬家工具與短租家具。",
        ],
        practicalTitle: "如何更有效在 Parkville 找到合適二手物品",
        practicalBody:
          "先把地區設為 Parkville，首頁就會把離你較近、刊登較新的商品排在前面；預算有限就切到價格標籤中的「免費贈送」或「$20 以內」，想依類別慢慢逛，就點同一列最後的「分類」進入分類頁瀏覽書桌椅、床墊、咖啡機。要找特定物品用搜尋更快：輸入大樓名稱或「書桌」「微波爐」之類的關鍵字，再於結果中依價格縮小範圍；八種語言可互相對應，用中文搜尋一樣找得到英文標題的商品。若你住在學生宿舍或分租公寓，直接搜尋大樓名稱通常較容易找到距離近、回覆快的賣家，談妥後再約當面交收。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 Parkville 列表，再與 Carlton、Melbourne CBD 比較同類商品。若預算有限，先用「免費贈送」與「$20 以內」把首頁掃過一遍，再搜尋沙發、床墊、咖啡機等具體品類並依價格縮小結果，通常可有效降低交易成本與時間成本。所有交易都是當面完成，出發前先與賣家約好時間與碰面地點。",
        marketCta: "查看 Parkville 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Parkville Second-Hand Market Guide",
        lead: "Parkville sits beside major university and medical precincts, creating strong second-hand demand from students, interns, researchers, and young renters.",
        overviewTitle: "Area overview",
        overviewBody:
          "Parkville has a generally young resident profile with fast-moving study and work cycles. Common second-hand demand includes textbooks, electronics, study desks, bedding, sofas, and kitchen essentials.",
        communityTitle: "Community profile and demand pattern",
        communityBody:
          "With universities, hospitals, and research institutions concentrated nearby, Parkville has recurring move-in and move-out waves. New arrivals buy practical essentials quickly, while outgoing residents often list furniture and appliances in short bursts.",
        scenariosTitle: "Typical second-hand scenarios",
        scenarios: [
          "Semester or placement starts: desks, lighting, storage, and kitchen basics.",
          "Graduation or lease turnover: mattresses, sofas, small appliances, and study gear.",
          "Research and medical residents exchanging practical electronics and temporary-living items.",
        ],
        practicalTitle: "How to find better second-hand options in Parkville",
        practicalBody:
          "Set your suburb to Parkville first — the feed puts closer and more recently posted listings near the top — then switch to the Giveaway or Under $20 price chip when budget is tight, or open Category to browse desks, chairs, mattresses, and coffee machines. For something specific, search is faster: type the building name or an item word such as desk or microwave, then narrow those results by price; matching works across all eight languages, so a search in your own language still finds English titles. If you live in student accommodation, searching by building name often surfaces nearby sellers, and you arrange the in-person handover from there.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Review Parkville listings first, then compare similar items in Carlton and Melbourne CBD. If budget is tight, sweep the home feed with the Giveaway and Under $20 chips, then search a specific category — sofa, mattress, coffee machine — and narrow those results by price to cut both time and total transaction cost. Every handover is in person, so agree on a time and meetup spot with the seller before you set out.",
        marketCta: "Explore Parkville listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneParkvilleSuburbContent() {
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
            href={localizePath("/market?area=Parkville")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Parkville").map((suburb) => (
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
