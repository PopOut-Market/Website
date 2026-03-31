import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import type { Metadata } from "next";
import Link from "next/link";

const title =
  "2026 墨尔本留学生毕业季回血指南 | 墨大/RMIT/Monash 卖闲置攻略 - PopOut Market";
const description =
  "准备离开墨尔本？PopOut Market 为 2026 届墨大、RMIT、Monash 留学生提供卖闲置实用指南，覆盖 Carlton、Parkville、CBD 等高频区域与学生公寓交易节奏。";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "墨尔本留学生毕业",
    "2026墨尔本大学校历",
    "RMIT毕业季卖东西",
    "Monash毕业卖闲置",
    "墨尔本卖二手家具",
    "Scape卖闲置",
    "UniLodge搬家清仓",
    "Melbourne student move out sale",
    "graduate moving out Melbourne",
  ],
  alternates: {
    canonical: "/melbourne-graduation-move-out-guide-2026",
    languages: {
      en: "/en/melbourne-graduation-move-out-guide-2026",
      "zh-CN": "/zh-cn/melbourne-graduation-move-out-guide-2026",
      "zh-TW": "/zh-tw/melbourne-graduation-move-out-guide-2026",
      ko: "/ko/melbourne-graduation-move-out-guide-2026",
      ja: "/ja/melbourne-graduation-move-out-guide-2026",
      vi: "/vi/melbourne-graduation-move-out-guide-2026",
      fr: "/fr/melbourne-graduation-move-out-guide-2026",
      es: "/es/melbourne-graduation-move-out-guide-2026",
      "x-default": "/en/melbourne-graduation-move-out-guide-2026",
    },
  },
  openGraph: {
    title,
    description,
    type: "article",
    locale: "zh_CN",
    url: "https://www.popoutmarket.com.au/melbourne-graduation-move-out-guide-2026",
  },
};

const faqItems = [
  {
    q: "毕业季卖大件家具，什么时候发最合适？",
    a: "通常建议离澳前 4-6 周发布大件（床、桌、沙发）。这样买家有时间预约，卖家也有空间分批清仓，成交稳定性更高。",
  },
  {
    q: "在墨尔本卖闲置，哪个区域成交更快？",
    a: "学生密度高且公寓集中的区域通常流转更快，例如 Carlton、Parkville、Melbourne CBD。近距离取货可显著降低沟通与履约成本。",
  },
  {
    q: "毕业搬家交易，如何兼顾效率与安全？",
    a: "建议使用站内聊天沟通，在公寓 Lobby 或公共区域交接，避免公开私人联系方式，并提前明确取货时间和搬运条件。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: title,
      description,
      inLanguage: "zh-CN",
      datePublished: "2026-04-01",
      dateModified: "2026-04-01",
      author: {
        "@type": "Organization",
        name: "PopOut Market",
      },
      publisher: {
        "@type": "Organization",
        name: "PopOut Market Pty Ltd",
      },
      about: [
        { "@type": "EducationalOrganization", name: "University of Melbourne" },
        { "@type": "EducationalOrganization", name: "RMIT University" },
        { "@type": "EducationalOrganization", name: "Monash University" },
      ],
      spatialCoverage: {
        "@type": "Place",
        name: "Melbourne, Victoria, Australia",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://www.popoutmarket.com.au/melbourne-graduation-move-out-guide-2026",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.popoutmarket.com.au/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Melbourne Graduation Move-out Guide 2026",
          item: "https://www.popoutmarket.com.au/melbourne-graduation-move-out-guide-2026",
        },
      ],
    },
  ],
};

export default function GraduationMoveOutGuidePage() {
  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{description}</p>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">1) 2026 关键卖货时间表</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            根据 UniMelb 与 RMIT 常见学期节奏，交易高峰通常集中在 6 月下旬与 11 月中旬到 12 月初。
          </p>
          <div className="mt-4 rounded-xl border border-transparent bg-[linear-gradient(135deg,rgba(255,0,72,0.10)_0%,rgba(255,102,0,0.10)_100%)] p-4">
            <p className="text-sm font-semibold text-gray-900">S1 搬家高峰：6 月下旬</p>
            <p className="mt-1 text-sm text-gray-700">考试周后 1 周通常是家具与教材出货黄金窗口。</p>
            <p className="mt-3 text-sm font-semibold text-gray-900">S2 毕业清仓：11 月中旬 - 12 月初</p>
            <p className="mt-1 text-sm text-gray-700">全年需求最强窗口，建议提前备图并分批上架。</p>
            <p className="mt-3 text-sm font-semibold text-gray-900">春节前离澳人群提醒</p>
            <p className="mt-1 text-sm text-gray-700">
              如计划春节前回国，建议 1 月初先处理大件物品，减少最后一周集中清仓压力。
            </p>
          </div>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">2) 核心区域与公寓交易场景</h2>
          <h3 className="mt-4 text-base font-semibold text-gray-900">Parkville & Carlton（墨大主场）</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            常见学生居住圈覆盖 Little Hall、UniLodge、Scape 等。区域内买家同校比例高，近距离面交效率更高。
          </p>
          <h3 className="mt-4 text-base font-semibold text-gray-900">Melbourne CBD（RMIT / Monash City）</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            常见公寓群包括 Scape Swanston、Journal、Iglu。适合“下楼即取”类型交易，对响应速度要求更高。
          </p>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">3) 在 PopOut 高效出货策略</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 font-semibold text-gray-900">物品类别</th>
                  <th className="border border-gray-200 px-3 py-2 font-semibold text-gray-900">建议挂牌时间</th>
                  <th className="border border-gray-200 px-3 py-2 font-semibold text-gray-900">PopOut 小贴士</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">大件家具（床/桌）</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">离澳前 4-6 周</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">
                    描述中写明可取货时段，并优先约在 Lobby 或公共区域。
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">生活小家电</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">离澳前 2 周</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">补充细节图与功能状态，提升决策效率。</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">教材/文具</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">考试周结束后 3 天内</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">需求高峰短，定价合理更容易快速成交。</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            安全提示：即使同楼交易，也建议在 Lobby 或公共区域交接。优先使用站内聊天沟通，避免泄露私人联系方式。
          </p>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">常见问题（FAQ）</h2>
          <div className="mt-4 space-y-4">
            {faqItems.map((item) => (
              <article key={item.q} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <h3 className="text-sm font-semibold text-gray-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/market?area=Carlton"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            查看 Carlton 在售
          </Link>
          <Link
            href="/market?area=Parkville"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            查看 Parkville 在售
          </Link>
          <Link
            href="/market?area=Melbourne%20CBD"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            查看 CBD 在售
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
