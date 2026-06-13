import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { getServerLocale } from "@/lib/server-locale";
import { localizedAlternates, siteUrl } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";
import Link from "next/link";

const PATH = "/melbourne-second-hand-market";

type Section = { heading: string; paragraphs?: string[]; list?: string[] };

type PageContent = {
  title: string;
  description: string;
  h1: string;
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
    title: "Melbourne Second-Hand Market | Local Trading Platform and Listings",
    description:
      "Explore how a Melbourne second-hand market works across suburbs, with local listings, multilingual communication, and practical trading workflows through PopOut Market.",
    h1: "Melbourne Second-Hand Market",
    inLanguage: "en-AU",
    sections: [
      {
        heading: "How local trading works in Melbourne",
        paragraphs: [
          "In a real Melbourne second-hand market, people rarely care only about price. They also care about pickup convenience, suburb familiarity, seller responsiveness, and whether the item fits a short move-in or move-out timeline. Those practical factors decide whether a listing is truly useful.",
          "PopOut is built around those realities. It supports neighbourhood-level discovery, multilingual communication, and clearer meetup planning for people buying and selling inside Melbourne rather than across an abstract national feed.",
        ],
      },
      {
        heading: "Strong-fit use cases",
        list: [
          "Student move-in: beds, desks and kitchen items are easier to compare when pickup stays close to where you live.",
          "Graduation move-out: faster local matching helps sellers clear items before lease deadlines or flights.",
          "Apartment living: short pickup distance lowers the hassle of bulky furniture and same-day collection.",
        ],
      },
      {
        heading: "Across Melbourne, centred on the CBD",
        paragraphs: [
          "The CBD and inner-city apartments are the busiest part of the local second-hand market, driven by dense living and frequent move-in and move-out cycles. But the same local trading works across the wider city: because listings are discovered by suburb, people anywhere in Melbourne can buy and sell quickly with others nearby.",
        ],
      },
    ],
    faqHeading: "FAQ",
    faq: [
      {
        q: "What does Melbourne second-hand market usually mean online?",
        a: "It can mean many things: local listing platforms, buy-and-sell apps, suburb-based marketplaces, or general used-goods communities. People usually want a practical place to browse and trade nearby items rather than a generic classifieds directory.",
      },
      {
        q: "Where can I buy and sell second-hand near me in Melbourne?",
        a: "PopOut shows second-hand listings by suburb, so you can browse furniture, appliances and everyday items close to where you live and arrange a nearby pickup, anywhere across Melbourne.",
      },
      {
        q: "Why is suburb-based browsing important in Melbourne?",
        a: "Melbourne is spread across many distinct suburbs. A suburb-first view makes second-hand discovery more useful because pickup distance, timing and convenience strongly affect whether a trade actually happens.",
      },
    ],
    relatedHeading: "Related pages",
    related: [
      { href: "/market", label: "Open Melbourne market listings" },
      { href: "/melbourne-second-hand-app", label: "Melbourne second-hand app" },
      { href: "/melbourne-second-hand-marketplace", label: "Melbourne second-hand marketplace" },
    ],
  },

  "zh-Hans": {
    title: "墨尔本二手市场 | 同城二手交易市集与本地买卖 · PopOut Market",
    description:
      "了解墨尔本二手市场怎么运作：墨尔本二手交易、同城二手买卖、二手市集与本地挂牌，按社区发现身边的二手家具、电器与闲置，多语言沟通 + 更安全的当面交易，适合留学生与公寓生活。",
    h1: "墨尔本二手市场",
    inLanguage: "zh-CN",
    sections: [
      {
        heading: "墨尔本本地二手交易是怎么运作的",
        paragraphs: [
          "真实的墨尔本二手市场里，大家在意的不只是价格，还有取货是否方便、是不是同一片社区、卖家回不回消息，以及东西能不能赶上搬家的时间。这些现实因素，才决定一条二手信息是否真的好用。",
          "PopOut 正是围绕这些现实打造：按社区发现身边好物、多语言沟通、更清晰的约见取货流程，服务的是在墨尔本同城买卖二手的人，而不是面向全国的笼统列表。它既是墨尔本二手交易市集，也是同城二手买卖平台。",
        ],
      },
      {
        heading: "最适合的场景",
        list: [
          "留学生入住：床、书桌、厨房用品在就近取货时更好比较和挑选。",
          "毕业搬走：更快的本地配对，帮卖家在退租或回国前清掉闲置。",
          "公寓生活：取货距离近，大件二手家具与当天提货省心很多。",
        ],
      },
      {
        heading: "以社区为中心，全墨尔本可用",
        paragraphs: [
          "墨尔本市区和内城公寓是本地二手市场最活跃的部分，但同样的同城二手交易在全城都适用：因为信息按社区展示，墨尔本各区的人都能就近买卖二手、快速和附近的人完成交易。无论你想逛墨尔本二手市集、找墨尔本跳蚤市场式的本地好物，还是直接做二手买卖，都用得上。",
        ],
      },
    ],
    faqHeading: "常见问题",
    faq: [
      {
        q: "墨尔本二手市场 / 二手市集一般指什么？",
        a: "它可以指很多东西：本地挂牌平台、二手买卖 App、按社区的二手市集，或综合的闲置社区。大多数人其实想要一个能就近浏览、就近交易的实用地方，而不是笼统的分类信息目录。",
      },
      {
        q: "在墨尔本怎么找附近的二手买卖？",
        a: "PopOut 按社区展示二手信息，你可以浏览身边的二手家具、电器和日常闲置，并就近约见取货，墨尔本各个区都能用。",
      },
      {
        q: "墨尔本跳蚤市场和二手 App 有什么区别？",
        a: "线下跳蚤市场时间地点固定、品类随缘；而墨尔本二手交易 App 能随时按社区搜索、和卖家直接沟通，把同城二手买卖安排得更灵活、更高效。",
      },
      {
        q: "留学生在墨尔本怎么买卖二手？",
        a: "搬家、毕业清仓或换新时，留学生都能用 PopOut 按社区快速找到附近的买家或卖家，多语言沟通，让墨尔本二手交易更省心。",
      },
    ],
    relatedHeading: "相关页面",
    related: [
      { href: "/market", label: "浏览墨尔本在售二手" },
      { href: "/melbourne-second-hand-app", label: "墨尔本二手 App" },
      { href: "/melbourne-second-hand-marketplace", label: "墨尔本二手交易平台" },
    ],
  },

  ko: {
    title: "멜버른 중고 시장 | 동네 중고거래·중고 장터와 직거래 · PopOut Market",
    description:
      "멜버른 중고 시장이 어떻게 돌아가는지 알아보세요. 멜버른 중고거래, 동네 중고 장터, 중고마켓과 현지 매물을 동네별로 찾고, 중고 가구·가전을 다국어 채팅과 안전한 직거래로 거래하세요. 유학생과 아파트 생활에 적합합니다.",
    h1: "멜버른 중고 시장",
    inLanguage: "ko",
    sections: [
      {
        heading: "멜버른 현지 중고 거래는 어떻게 이루어지나요",
        paragraphs: [
          "실제 멜버른 중고 시장에서 사람들이 신경 쓰는 것은 가격만이 아닙니다. 가져오기 편한지, 같은 동네인지, 판매자가 답을 잘 하는지, 이사 일정에 맞는지도 중요합니다. 이런 현실적인 요소가 매물이 정말 쓸모 있는지를 결정합니다.",
          "PopOut은 바로 이런 현실에 맞춰 만들어졌습니다. 동네별 탐색, 다국어 소통, 더 명확한 약속과 직거래 과정으로 멜버른 안에서 중고를 사고파는 사람들을 위한 서비스입니다. 멜버른 중고거래 장터이자 동네 중고 거래 플랫폼입니다.",
        ],
      },
      {
        heading: "이런 상황에 잘 맞아요",
        list: [
          "유학생 입주: 침대·책상·주방용품은 가까이에서 가져올 때 비교하고 고르기 쉽습니다.",
          "졸업 이사: 더 빠른 현지 매칭으로 임대 만료나 출국 전에 물건을 정리하기 좋습니다.",
          "아파트 생활: 가까운 직거래로 큰 가구와 당일 수령의 번거로움을 줄입니다.",
        ],
      },
      {
        heading: "동네 중심, 멜버른 전역에서",
        paragraphs: [
          "시내와 도심 아파트가 현지 중고 시장에서 가장 활발하지만, 같은 동네 중고 거래는 멜버른 전역에서 통합니다. 매물이 동네별로 보이기 때문에 멜버른 어느 지역에 있든 가까운 사람과 빠르게 중고를 사고팔 수 있습니다. 멜버른 중고 장터든 벼룩시장 같은 현지 물건이든, 바로 직거래로 이어집니다.",
        ],
      },
    ],
    faqHeading: "자주 묻는 질문",
    faq: [
      {
        q: "멜버른 중고 시장·중고 장터는 보통 무엇을 말하나요?",
        a: "현지 매물 플랫폼, 중고 거래 앱, 동네 기반 중고마켓, 종합 중고 커뮤니티 등 여러 가지를 뜻할 수 있습니다. 대부분은 막연한 분류 광고 디렉터리보다, 가까이에서 둘러보고 거래할 수 있는 실용적인 곳을 원합니다.",
      },
      {
        q: "멜버른에서 가까운 중고 거래는 어떻게 찾나요?",
        a: "PopOut은 동네별로 중고 매물을 보여주므로, 가까운 중고 가구·가전·생활용품을 둘러보고 근처에서 직거래 약속을 잡을 수 있습니다. 멜버른 전역에서 사용할 수 있습니다.",
      },
      {
        q: "멜버른 벼룩시장과 중고 앱은 무엇이 다른가요?",
        a: "오프라인 벼룩시장은 시간·장소가 정해져 있지만, 멜버른 중고 거래 앱은 언제든 동네별로 검색하고 판매자와 바로 소통하며 동네 중고 거래를 더 유연하고 효율적으로 할 수 있습니다.",
      },
      {
        q: "유학생은 멜버른에서 중고를 어떻게 사고파나요?",
        a: "이사, 졸업 정리, 집 새단장 등 어떤 상황에서도 유학생은 PopOut으로 동네에서 가까운 구매자·판매자를 빠르게 찾고 다국어로 소통하여 멜버른 중고 거래를 편하게 할 수 있습니다.",
      },
    ],
    relatedHeading: "관련 페이지",
    related: [
      { href: "/market", label: "멜버른 중고 매물 둘러보기" },
      { href: "/melbourne-second-hand-app", label: "멜버른 중고거래 앱" },
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

export default async function MelbourneSecondHandMarketPage() {
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
        about: { "@type": "Place", name: "Melbourne, Victoria, Australia" },
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
