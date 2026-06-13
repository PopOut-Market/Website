import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { getServerLocale } from "@/lib/server-locale";
import { localizedAlternates, siteUrl } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";
import Link from "next/link";

const PATH = "/melbourne-second-hand-app";

type Section = { heading: string; paragraphs?: string[]; list?: string[] };

type PageContent = {
  title: string;
  description: string;
  h1: string;
  aboutThing: string;
  inLanguage: string;
  sections: Section[];
  faqHeading: string;
  faq: { q: string; a: string }[];
  relatedHeading: string;
  related: { href: string; label: string }[];
};

// en / zh-Hans / ko have full localized copy; other locales fall back to en.
const CONTENT: Partial<Record<Locale, PageContent>> & { en: PageContent } = {
  en: {
    title: "Melbourne Second-Hand App | Buy & Sell Locally with PopOut Market",
    description:
      "PopOut Market is a Melbourne second-hand app for local buying and selling, with suburb-based discovery, multilingual communication, and safer meetup workflows.",
    h1: "Melbourne Second-Hand App",
    aboutThing: "Melbourne second-hand app",
    inLanguage: "en-AU",
    sections: [
      {
        heading: "Why a local app matters in Melbourne",
        paragraphs: [
          "Melbourne second-hand trading mostly happens close to home — apartment towers, student areas and nearby suburbs. A local-first app helps you compare listings that are realistically close enough to inspect, collect and complete without a long trip.",
          "Instead of one flat, statewide feed, PopOut emphasises suburb-level browsing, easier communication and a clearer path from finding a listing to meeting up.",
        ],
      },
      {
        heading: "Who it is for",
        list: [
          "Students setting up or clearing out rooms near universities and campuses.",
          "Apartment residents and renters across Melbourne who prefer nearby pickup.",
          "Local buyers and sellers who want multilingual communication and clearer coordination.",
          "Graduation-season movers selling practical household items quickly.",
        ],
      },
      {
        heading: "What you can buy and sell",
        paragraphs: [
          "The app is most active around everyday Melbourne living — the things people need when they move in, move out, or refresh a room:",
        ],
        list: [
          "Furniture such as beds, desks, chairs, sofas and wardrobes.",
          "Appliances and kitchen gear like fridges, microwaves and cookware.",
          "Bikes, scooters and study or work-from-home setups.",
          "Move-in bundles and clear-out items around exam and graduation season.",
        ],
      },
    ],
    faqHeading: "FAQ",
    faq: [
      {
        q: "What makes a Melbourne second-hand app useful for local trading?",
        a: "The most useful apps help people browse nearby listings, message clearly, and finish pickups with less friction. Suburb-based discovery and clearer meetup coordination matter more than generic city-wide scrolling.",
      },
      {
        q: "Is PopOut a free buy-and-sell app for Melbourne?",
        a: "Yes. PopOut is a free second-hand app for buying and selling locally across Melbourne, from furniture and appliances to bikes and everyday essentials.",
      },
      {
        q: "Is PopOut designed only for students?",
        a: "No. PopOut is useful for students, apartment residents, recent movers and local households across Melbourne, not just one area.",
      },
    ],
    relatedHeading: "Related pages",
    related: [
      { href: "/market", label: "Browse Melbourne listings" },
      { href: "/melbourne-second-hand-market", label: "Melbourne second-hand market guide" },
      { href: "/melbourne-second-hand-marketplace", label: "Melbourne second-hand marketplace" },
    ],
  },

  "zh-Hans": {
    title: "墨尔本二手App | 二手交易软件与同城二手平台 · PopOut Market",
    description:
      "PopOut Market 是墨尔本的二手交易 App（二手软件 / 二手应用）和同城二手平台：免费买卖二手家具、电器、数码、自行车等闲置，按社区发现身边好物，多语言沟通 + 更安全的当面交易，适合留学生搬家和毕业清仓。",
    h1: "墨尔本二手 App",
    aboutThing: "墨尔本二手App",
    inLanguage: "zh-CN",
    sections: [
      {
        heading: "为什么用本地的墨尔本二手 App",
        paragraphs: [
          "在墨尔本，二手交易大多发生在你身边——公寓、学生区和附近社区。一个本地优先的二手 App（很多人也叫它二手软件、二手应用）能帮你只看那些距离合适、方便看货和当面取货的物品，不用为一件二手家具跑很远。",
          "PopOut 不是把全州混在一个长长的列表里，而是按社区 / 郊区浏览，沟通更简单，从看到商品到约见面取货的流程也更清晰。它既是墨尔本二手交易软件，也是同城二手买卖平台。",
        ],
      },
      {
        heading: "适合哪些人",
        list: [
          "在大学和校园附近布置或清空房间的留学生。",
          "墨尔本各区、希望就近取货的公寓租客和居民。",
          "想要多语言沟通、约见更清楚的本地买家和卖家。",
          "毕业季搬家、需要快速卖掉家具家电的人。",
        ],
      },
      {
        heading: "可以买卖什么",
        paragraphs: [
          "这款墨尔本二手买卖 App 最活跃的就是日常生活用品——搬入、搬出或换新时最常需要的东西：",
        ],
        list: [
          "二手家具：床、书桌、椅子、沙发、衣柜等。",
          "二手电器与厨房用品：冰箱、微波炉、锅具等。",
          "自行车、滑板车，以及学习 / 居家办公装备。",
          "入住套装，以及考试季、毕业季的清仓闲置。",
        ],
      },
    ],
    faqHeading: "常见问题",
    faq: [
      {
        q: "墨尔本有哪些好用的二手 App 或二手软件？",
        a: "好用的墨尔本二手 App 关键是能浏览附近商品、沟通清楚、取货省事。PopOut 按社区发现身边二手好物，比在全城范围里漫无目的地刷更实用，适合想就近买卖二手的人。",
      },
      {
        q: "PopOut 是免费的墨尔本二手交易平台吗？",
        a: "是的。PopOut 是一款免费的墨尔本二手交易 App / 同城二手平台，可以买卖二手家具、电器、数码、自行车等各类闲置，覆盖墨尔本各个社区。",
      },
      {
        q: "墨尔本二手交易安全吗？怎么当面交易？",
        a: "PopOut 鼓励在公共、明亮的地点当面交易，并提供更清晰的约见与确认流程，让买卖双方在见面前就清楚安排，让墨尔本同城二手交易更放心。",
      },
      {
        q: "适合留学生在墨尔本卖闲置吗？",
        a: "很适合。无论是搬家、毕业清仓还是公寓换新，留学生都能用这款墨尔本二手软件按社区快速找到附近的买家或卖家，多语言沟通也更省心。",
      },
    ],
    relatedHeading: "相关页面",
    related: [
      { href: "/market", label: "浏览墨尔本在售二手" },
      { href: "/melbourne-second-hand-market", label: "墨尔本二手市场介绍" },
      { href: "/melbourne-second-hand-marketplace", label: "墨尔本二手交易平台" },
    ],
  },

  ko: {
    title: "멜버른 중고거래 앱 | 중고 거래 플랫폼·동네 중고마켓 · PopOut Market",
    description:
      "PopOut Market는 멜버른 중고거래 앱이자 동네 중고마켓·중고 거래 플랫폼입니다. 중고 가구, 가전, 전자기기, 자전거를 무료로 사고팔고, 동네별로 가까운 물건을 찾고, 다국어 채팅과 안전한 직거래로 거래하세요. 유학생 이사·졸업 정리에 딱 맞습니다.",
    h1: "멜버른 중고거래 앱",
    aboutThing: "멜버른 중고거래 앱",
    inLanguage: "ko",
    sections: [
      {
        heading: "왜 멜버른 중고거래 앱이 동네 기반이어야 할까요",
        paragraphs: [
          "멜버른에서 중고 거래는 대부분 집 근처에서 이루어집니다 — 아파트, 학생 밀집 지역, 가까운 동네. 동네 우선 중고 앱은 직접 보고 가져오기 좋은, 현실적으로 가까운 매물만 비교하게 해줘서 중고 가구 하나 때문에 멀리 갈 필요가 없습니다.",
          "PopOut은 주 전체를 하나의 긴 목록으로 보여주는 대신, 동네별 탐색과 더 쉬운 소통, 그리고 매물 발견부터 직거래 약속까지 더 명확한 과정을 제공합니다. 멜버른 중고 거래 플랫폼이자 동네 중고마켓입니다.",
        ],
      },
      {
        heading: "이런 분께 잘 맞아요",
        list: [
          "대학·캠퍼스 근처에서 방을 꾸미거나 정리하는 유학생.",
          "가까운 직거래를 선호하는 멜버른 전역의 아파트 거주자와 세입자.",
          "다국어 소통과 명확한 약속을 원하는 현지 구매자·판매자.",
          "졸업 시즌에 이사하며 생활용품을 빠르게 팔아야 하는 분.",
        ],
      },
      {
        heading: "무엇을 사고팔 수 있나요",
        paragraphs: [
          "이 멜버른 중고 거래 앱은 이사 들어오고 나갈 때, 방을 새로 꾸밀 때 필요한 일상용품 거래가 가장 활발합니다:",
        ],
        list: [
          "중고 가구: 침대, 책상, 의자, 소파, 옷장 등.",
          "중고 가전·주방용품: 냉장고, 전자레인지, 조리도구 등.",
          "자전거, 전동킥보드, 공부·재택근무 장비.",
          "입주 세트, 시험·졸업 시즌 정리 물품.",
        ],
      },
    ],
    faqHeading: "자주 묻는 질문",
    faq: [
      {
        q: "멜버른 중고거래 앱·중고 앱은 어떤 게 좋나요?",
        a: "좋은 멜버른 중고 앱은 가까운 매물을 둘러보고, 깔끔하게 소통하고, 직거래를 수월하게 마치도록 도와줍니다. PopOut은 동네별로 가까운 중고 물품을 보여줘서 도시 전체를 막연히 스크롤하는 것보다 실용적입니다.",
      },
      {
        q: "PopOut은 무료 멜버른 중고 거래 플랫폼인가요?",
        a: "네. PopOut은 무료 멜버른 중고거래 앱이자 동네 중고 거래 플랫폼으로, 중고 가구·가전·전자기기·자전거 등 다양한 물품을 멜버른 전역에서 사고팔 수 있습니다.",
      },
      {
        q: "멜버른 중고 직거래는 안전한가요?",
        a: "PopOut은 공공장소에서의 직거래를 권장하고, 약속과 확인을 더 명확하게 하는 흐름을 제공해서 만나기 전에 양쪽 모두 준비할 수 있도록 돕습니다.",
      },
      {
        q: "유학생이 멜버른에서 중고를 사고팔기에 좋나요?",
        a: "아주 좋습니다. 이사, 졸업 정리, 집 새단장 등 어떤 상황에서도 유학생은 이 멜버른 중고 거래 앱으로 동네에서 가까운 구매자·판매자를 빠르게 찾고 다국어로 소통할 수 있습니다.",
      },
    ],
    relatedHeading: "관련 페이지",
    related: [
      { href: "/market", label: "멜버른 중고 매물 둘러보기" },
      { href: "/melbourne-second-hand-market", label: "멜버른 중고 시장 안내" },
      { href: "/melbourne-second-hand-marketplace", label: "멜버른 중고마켓" },
    ],
  },
};

function contentFor(locale: Locale): PageContent {
  return CONTENT[locale] ?? CONTENT.en;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const c = contentFor(locale);
  const selfPath = toLocalePath(PATH, locale);
  return {
    title: { absolute: c.title },
    description: c.description,
    alternates: {
      canonical: selfPath,
      languages: localizedAlternates(PATH),
    },
    openGraph: {
      title: c.title,
      description: c.description,
      url: `${siteUrl().replace(/\/$/, "")}${selfPath}`,
      type: "website",
      siteName: "PopOut Market",
    },
  };
}

export default async function MelbourneSecondHandAppPage() {
  const locale = await getServerLocale();
  const c = contentFor(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: c.title,
        description: c.description,
        inLanguage: c.inLanguage,
        about: { "@type": "Thing", name: c.aboutThing },
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {c.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{c.description}</p>

        {c.sections.map((s) => (
          <section
            key={s.heading}
            className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm first:mt-8"
          >
            <h2 className="text-lg font-semibold text-gray-900">{s.heading}</h2>
            {s.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-gray-700">
                {p}
              </p>
            ))}
            {s.list ? (
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-700">
                {s.list.map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{c.relatedHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {c.related.map((r) => (
              <Link
                key={r.href}
                href={toLocalePath(r.href, locale)}
                className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{c.faqHeading}</h2>
          <div className="mt-4 space-y-4">
            {c.faq.map((item) => (
              <article key={item.q} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <h3 className="text-sm font-semibold text-gray-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
