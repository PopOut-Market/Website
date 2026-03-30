"use client";

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
        lead:
          "帕克维尔位于墨尔本大学及医疗科研带周边，是学术与医疗资源高度集中的内城区。学生、实习生、研究人员与年轻租住群体共同构成了活跃的本地二手交易需求。",
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
          "建议优先使用区域筛选并结合关键词搜索（如“Parkville”“可送货”“学生发布”）。如果你住在学生公寓或共享住宅，可直接搜索公寓名称，通常更容易找到距离近、沟通快的卖家。",
        nextStepTitle: "下一步建议",
        nextStepBody:
          "先浏览 Parkville 在售列表，再与邻近的 Carlton、Melbourne CBD 对比同类商品。若预算有限，优先选择“同区可自提”或“可送货”的选项，能显著降低整体交易成本与时间成本。",
        marketCta: "查看 Parkville 在售二手商品",
        relatedTitle: "浏览其他墨尔本区域",
      };
    case "zh-Hant":
      return {
        h1: "帕克維爾（Parkville）二手市場指南",
        lead:
          "Parkville 位於墨爾本大學與醫療科研帶周邊，是學術與醫療資源高度集中的內城區。學生、實習生、研究人員與年輕租住族群共同形成活躍二手需求。",
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
          "建議優先使用區域篩選並搭配關鍵字搜尋（如「Parkville」「可送貨」「學生發布」）。若居住在學生公寓或共享住宅，可直接搜尋公寓名稱，通常更容易找到距離近、回覆快的賣家。",
        nextStepTitle: "下一步建議",
        nextStepBody:
          "先看 Parkville 列表，再與 Carlton、Melbourne CBD 比較同類商品。若預算有限，優先選擇「同區可自提」或「可送貨」選項，通常可有效降低交易成本與時間成本。",
        marketCta: "查看 Parkville 在售二手商品",
        relatedTitle: "瀏覽其他墨爾本區域",
      };
    default:
      return {
        h1: "Parkville Second-Hand Market Guide",
        lead:
          "Parkville sits beside major university and medical precincts, creating strong second-hand demand from students, interns, researchers, and young renters.",
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
          "Use area filters first, then combine search terms like “Parkville”, “delivery available”, and “student posted”. If you live in student accommodation, searching by building name often surfaces nearby sellers with easier pickup coordination.",
        nextStepTitle: "Suggested next step",
        nextStepBody:
          "Review Parkville listings first, then compare similar items in Carlton and Melbourne CBD. If budget is tight, prioritize same-area pickup or delivery-enabled listings to reduce time and total transaction cost.",
        marketCta: "Explore Parkville listings",
        relatedTitle: "Explore other Melbourne suburbs",
      };
  }
}

export function MelbourneParkvilleSuburbContent() {
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
            href={localizePath("/market?area=Parkville")}
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
            {MARKET_SUBURBS.filter((s) => s !== "Parkville").map((suburb) => (
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
