"use client";

import { useSiteShell } from "@/components/site-chrome-context";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { MARKET_SUBURBS, type MarketSuburb } from "@/lib/site-suburbs";
import { suburbSeoPath } from "@/lib/suburb-seo-pages";
import Link from "next/link";
import { useMemo } from "react";

type HubCopy = {
  title: string;
  intro: string;
  areaIntroTitle: string;
  guideTitle: string;
  guideBody: string;
  sections: { title: string; body: string }[];
  closing: string;
  cardTitle: string;
  cardHint: string;
  cta: string;
};

function hubCopy(locale: string): HubCopy {
  switch (locale) {
    case "zh-Hans":
      return {
        title: "了解更多墨尔本区域",
        intro:
          "墨尔本市中心及周边拥有多个主要城区，每个区域的居民结构和生活方式略有不同。下方覆盖墨尔本八个核心区域（CBD、Carlton、Parkville、Southbank、Docklands、Fitzory、North Melbourne、South Wharf），并附上各区简介和主要特色。",
        areaIntroTitle: "区域总览",
        guideTitle: "服务覆盖说明",
        guideBody:
          "这个页面主要用于展示 PopOut App 当前覆盖的墨尔本区域。为了更好地服务用户并管理社区，我们目前仅在下方 8 个区域开放服务。居住在这 8 个区域内的用户可以在 App 中发布和购买商品。希望每个区域的介绍都能帮助你更好了解墨尔本二手市场，并更准确地筛选适合自己的商品。",
        sections: [
          {
            title: "墨尔本中央商务区（Melbourne CBD）",
            body: "墨尔本CBD是市政中心，汇集金融、商业和高等教育机构（如RMIT大学）。区域内写字楼、公寓和游客密集，二手交易以小户型家居、办公与日常通勤用品为主。",
          },
          {
            title: "卡尔顿（Carlton）",
            body: "毗邻墨尔本大学与RMIT，学生群体集中，同时拥有意大利风情街区。咖啡馆与餐饮业发达，二手家具、教科书和小家电需求持续旺盛。",
          },
          {
            title: "帕克维尔（Parkville）",
            body: "墨大主校区与墨尔本皇家医院所在地，居民年轻化明显（2021年人口约7074，平均年龄约26岁）。周边学生公寓和科研机构密集，学习用品与家具交易活跃。",
          },
          {
            title: "南岸（Southbank）",
            body: "墨尔本艺术文化核心区域之一，公寓集中，住户多为白领和文化工作者。区域活动丰富，二手创意商品、服饰和艺术相关物品流通较多。",
          },
          {
            title: "码头区（Docklands）",
            body: "新兴滨水商务与住宅区，高层公寓密集，居民以年轻专业人士为主。二手交易常见家电、家具和儿童用品，适合新入住家庭和短租人群。",
          },
          {
            title: "菲茨罗伊（Fitzory / Fitzroy）",
            body: "创意氛围浓厚，复古店与设计工作室聚集。二手服饰、工艺品和个性家居需求明显，适合年轻创意人群和艺术爱好者。",
          },
          {
            title: "北墨尔本（North Melbourne）",
            body: "靠近市区与公园带，历史街区与现代生活混合。青年住户较多，二手家具、单车和运动装备需求较高，适合学生与合租群体。",
          },
          {
            title: "南码头（South Wharf）",
            body: "紧邻河畔与新开发公寓区，居住品质高、社区新。二手交易常见高品质家具、厨房电器与家庭类用品，适合公寓升级与品质换新。",
          },
        ],
        closing:
          "这些区域各具特色，可针对不同人群提供专属二手交易服务。你可以在下方点击进入具体区域页面，了解当地二手市场概况、热门商品、学生群体数量与实用交易信息。",
        cardTitle: "选择你关心的区域",
        cardHint: "点击任一 suburb 进入对应专属页面",
        cta: "查看该区域",
      };
    case "zh-Hant":
      return {
        title: "了解更多墨爾本區域",
        intro:
          "墨爾本市中心及周邊擁有多個主要城區，每個區域的居民結構與生活方式略有不同。下方整理墨爾本八個核心區域（CBD、Carlton、Parkville、Southbank、Docklands、Fitzory、North Melbourne、South Wharf），並附上各區簡介與特色。",
        areaIntroTitle: "區域總覽",
        guideTitle: "如何使用這個頁面",
        guideBody:
          "先依你的通勤範圍與預算選擇區域，再進入對應 suburb 頁面查看常見二手品類與交易建議。這樣能更快鎖定適合的商品範圍，減少盲目搜尋。",
        sections: [
          {
            title: "墨爾本中央商務區（Melbourne CBD）",
            body: "墨爾本CBD是市政核心，匯集金融、商業與高等教育機構（如RMIT）。區域內辦公樓、公寓與旅客密集，二手交易偏向小宅家居與日常用品。",
          },
          {
            title: "卡爾頓（Carlton）",
            body: "鄰近墨爾本大學與RMIT，學生族群集中，並具有義式街區特色。咖啡館與餐飲業活躍，二手家具、教科書與小家電需求高。",
          },
          {
            title: "帕克維爾（Parkville）",
            body: "墨大主校區與皇家醫院所在地，居民年齡結構偏年輕。周邊學生公寓與研究機構密集，學習用品與家具交易活躍。",
          },
          {
            title: "南岸（Southbank）",
            body: "墨爾本藝術文化重鎮，公寓密集，住戶多為白領與文化從業者。二手創意商品、服飾與藝術相關物品交易較多。",
          },
          {
            title: "碼頭區（Docklands）",
            body: "新興濱水商住區，高層住宅集中，年輕專業人士比例高。二手交易常見家電、家具與兒童用品。",
          },
          {
            title: "菲茨羅伊（Fitzory / Fitzroy）",
            body: "創意氛圍濃厚，復古店與設計工作室聚集。二手服飾、工藝品與個性家居需求明顯。",
          },
          {
            title: "北墨爾本（North Melbourne）",
            body: "靠近市區與公園帶，歷史街區與新住宅共存。青年住戶較多，二手家具、單車與運動裝備需求高。",
          },
          {
            title: "南碼頭（South Wharf）",
            body: "臨近河畔與新開發住宅，社區新且生活品質高。二手交易常見高品質家具、廚房電器與家庭用品。",
          },
        ],
        closing:
          "這些區域各具特色，可依不同族群提供專屬二手交易服務。點擊下方按鈕即可進入各區詳細頁面，了解當地二手市場概況、熱門商品、學生族群數量與實用交易資訊。",
        cardTitle: "選擇你關心的區域",
        cardHint: "點擊任一 suburb 進入對應專屬頁面",
        cta: "查看此區域",
      };
    default:
      return {
        title: "Learn More Melbourne Suburbs",
        intro:
          "Melbourne has multiple core suburbs around the city center, each with distinct resident profiles and lifestyles. This page brings together eight key areas — Melbourne CBD, Carlton, Parkville, Southbank, Docklands, Fitzroy, North Melbourne, and South Wharf — with practical second-hand market context for each.",
        areaIntroTitle: "Suburb Overview",
        guideTitle: "How to use this page",
        guideBody:
          "Pick a suburb based on your commute range and budget, then open its local guide to see typical second-hand categories and practical buying tips. This helps you narrow options faster and avoid random browsing.",
        sections: [
          {
            title: "Melbourne CBD",
            body: "The central business district with dense apartments, offices, and major institutions such as RMIT. Popular second-hand demand includes compact home essentials, commuting items, and practical daily-use goods.",
          },
          {
            title: "Carlton",
            body: "A student-heavy area near the University of Melbourne and RMIT, known for its lively cafe and cultural scene. Strong demand for second-hand furniture, textbooks, and small appliances.",
          },
          {
            title: "Parkville",
            body: "Home to the main UniMelb campus and major hospitals, with a younger resident profile and many student apartments. Typical second-hand demand centers on study gear, bikes, and room furniture.",
          },
          {
            title: "Southbank",
            body: "A high-density apartment and arts precinct with many professionals and creatives. More activity around design items, apparel, and lifestyle-oriented second-hand products.",
          },
          {
            title: "Docklands",
            body: "A newer waterfront residential-business district with many high-rise apartments and young professionals. Frequent second-hand categories include appliances, furniture, and family essentials.",
          },
          {
            title: "Fitzroy",
            body: "A creative, vintage-oriented inner suburb with strong design and independent retail culture. Second-hand demand often includes decor, fashion, and unique home items.",
          },
          {
            title: "North Melbourne",
            body: "An inner suburb with mixed historic and modern residential zones, popular among younger residents. Demand is strong for furniture, bicycles, and active-lifestyle products.",
          },
          {
            title: "South Wharf",
            body: "A newer riverside apartment zone with high-quality residential stock. Common second-hand activity includes premium furniture, kitchen appliances, and household upgrades.",
          },
        ],
        closing:
          "Each suburb serves different groups and needs. Use the buttons below to open detailed suburb pages for local market trends, popular item types, student population patterns, and practical second-hand guidance.",
        cardTitle: "Choose a Melbourne suburb",
        cardHint: "Open any suburb page to view local second-hand insights",
        cta: "View suburb page",
      };
  }
}

function suburbBlurb(locale: string, suburb: MarketSuburb): string {
  if (locale === "zh-Hans") {
    const map: Record<MarketSuburb, string> = {
      "Melbourne CBD": "商务与校园混合核心区：电子设备、公寓家具、通勤与学习用品需求高。",
      Carlton: "学生密集区：开学与搬家周期明显，书桌椅、教材、小家电流转快。",
      Parkville: "大学与医疗科研带：学习用品、短租家具与高频生活品类交易活跃。",
      Southbank: "艺术与公寓并存：家居升级、设计风格用品与家庭实用品并重。",
      Docklands: "高层公寓集中：家电、家具、儿童用品与同区高效率交易更常见。",
      Fitzory: "创意与复古氛围强：古着、装饰、唱片与个性化生活用品更有特色。",
      "North Melbourne": "社区感与居住多样性高：家具、电器、单车和家庭用品需求稳定。",
      "South Wharf": "品质导向公寓区：中高品质家具、厨房电器和家庭升级用品更突出。",
    };
    return map[suburb];
  }

  if (locale === "zh-Hant") {
    const map: Record<MarketSuburb, string> = {
      "Melbourne CBD": "商務與校園混合核心區：電子設備、公寓家具、通勤與學習用品需求高。",
      Carlton: "學生密集區：開學與搬家週期明顯，書桌椅、教材與小家電流通快速。",
      Parkville: "大學與醫療科研帶：學習用品、短租家具與高頻生活品類交易活躍。",
      Southbank: "藝術與公寓並存：家居升級、設計風格用品與家庭實用品並重。",
      Docklands: "高層公寓集中：家電、家具、兒童用品與同區高效率交易更常見。",
      Fitzory: "創意與復古氛圍強：古著、裝飾、唱片與個性化生活用品更具特色。",
      "North Melbourne": "社區感與居住多樣性高：家具、家電、單車與家庭用品需求穩定。",
      "South Wharf": "品質導向公寓區：中高品質家具、廚房家電與家庭升級用品更突出。",
    };
    return map[suburb];
  }

  const map: Record<MarketSuburb, string> = {
    "Melbourne CBD":
      "Business-and-campus core: strong demand for electronics, apartment furniture, and daily commuter essentials.",
    Carlton:
      "Student-dense zone: semester move cycles drive fast turnover in desks, textbooks, and small appliances.",
    Parkville:
      "University and medical precinct: active demand for study gear, practical furniture, and short-stay essentials.",
    Southbank:
      "Arts-meets-apartment district: home upgrades, design-led items, and family-use essentials all move steadily.",
    Docklands:
      "High-rise apartment hub: furniture, appliances, and child-related items with efficiency-focused local transactions.",
    Fitzory:
      "Creative vintage neighborhood: stronger circulation of fashion, decor, records, and unique lifestyle goods.",
    "North Melbourne":
      "Diverse inner-suburb community: stable demand across furniture, appliances, bikes, and practical household items.",
    "South Wharf":
      "Quality-focused riverside apartments: stronger interest in premium furniture, kitchen equipment, and upgrade items.",
  };
  return map[suburb];
}

export function MelbourneSuburbsHubContent() {
  const { locale, localizePath } = useSiteShell();
  const copy = hubCopy(locale);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: copy.title,
      description: copy.intro,
      about: {
        "@type": "Place",
        name: "Melbourne, Victoria",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Melbourne",
          addressRegion: "VIC",
          addressCountry: "AU",
        },
      },
      hasPart: MARKET_SUBURBS.map((suburb) => ({
        "@type": "WebPage",
        name: suburb,
        url: localizePath(suburbSeoPath(suburb)),
      })),
    }),
    [copy.intro, copy.title, localizePath],
  );

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-8 sm:py-10`}>
      <div className={`${INNER_MAX} max-w-5xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-700">
          {copy.intro}
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {copy.guideTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{copy.guideBody}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {copy.areaIntroTitle}
          </h2>
          <div className="mt-3 space-y-3">
            {copy.sections.map((section) => (
              <article key={section.title}>
                <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{section.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">{copy.closing}</p>
        </div>

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{copy.cardTitle}</h2>
            <p className="mt-1 text-sm text-gray-600">{copy.cardHint}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MARKET_SUBURBS.map((suburb) => (
              <Link
                key={suburb}
                href={localizePath(suburbSeoPath(suburb))}
                className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                <p className="text-base font-semibold text-gray-900">{suburb}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {suburbBlurb(locale, suburb)}
                </p>
                <span className="mt-3 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition group-hover:bg-gray-50">
                  {copy.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
