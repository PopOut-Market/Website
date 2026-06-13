import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { getServerLocale } from "@/lib/server-locale";
import { localizedAlternates, siteUrl } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";
import Link from "next/link";

const PATH = "/melbourne-cbd-second-hand-marketplace";
const ABOUT_NAME = "Melbourne CBD, Victoria, Australia";

type Section = { heading: string; paragraphs?: string[]; list?: string[] };
type PageContent = {
  title: string;
  description: string;
  h1: string;
  inLanguage: string;
  sections: Section[];
  faq: { q: string; a: string }[];
  faqHeading: string;
  relatedHeading: string;
  related: { href: string; label: string }[];
};

const CONTENT: Partial<Record<Locale, PageContent>> & { en: PageContent } = {
  "en": {
    "title": "Melbourne CBD Second-Hand Marketplace | PopOut Market City Listings & Safer Local Trading",
    "description": "PopOut Market is a free Melbourne CBD second-hand marketplace for city residents, students and apartment movers. Buy and sell nearby furniture and essentials across all of Melbourne.",
    "h1": "Melbourne CBD Second-Hand Marketplace",
    "inLanguage": "en-AU",
    "sections": [
      {
        "heading": "What city-centre users usually need",
        "paragraphs": [
          "Melbourne CBD search intent is almost always practical: furnishing a studio fast, replacing household basics, selling items before a move, or comparing nearby options without travelling far. City users want close-by pickup, quick replies, and listings that are easy to judge from photos and descriptions.",
          "PopOut Market is free to use and built around suburb-based discovery, so the closer a listing sits to your daily movement, the more smoothly the trade tends to go. The CBD is the busiest hub, but PopOut works across all of Melbourne, not the city centre alone."
        ]
      },
      {
        "heading": "Why the CBD is a strong second-hand area",
        "paragraphs": [
          "Melbourne CBD combines apartment density, university traffic, and fast move-in and move-out cycles. That creates steady demand for second-hand furniture, small appliances, and everyday household goods you can collect close by."
        ],
        "list": [
          "Melbourne city second-hand market and CBD listings",
          "CBD furniture and apartment move-in essentials",
          "Carlton, Southbank, Docklands and North Melbourne pickups",
          "Inner-city trading that extends to every Melbourne suburb"
        ]
      },
      {
        "heading": "Trade safely and chat in your language",
        "paragraphs": [
          "PopOut Market includes in-app multilingual chat, so you can agree on price, condition and pickup time in the language you are most comfortable with. A safer in-person meetup flow helps buyers and sellers connect in busy, well-trafficked CBD spots.",
          "Popular with international students, renters and apartment movers, PopOut keeps city-centre trading simple while reaching the whole of Melbourne."
        ]
      }
    ],
    "faq": [
      {
        "q": "Where can I buy second-hand furniture in Melbourne CBD?",
        "a": "On PopOut Market you can browse Melbourne CBD second-hand furniture and essentials listed by people nearby, then arrange a convenient city pickup. Because discovery is suburb-based, you also see options across the rest of Melbourne."
      },
      {
        "q": "Is there a free second-hand marketplace app for Melbourne CBD?",
        "a": "Yes. PopOut Market is a free app for buying and selling second-hand goods in Melbourne CBD and every other Melbourne suburb, with no listing fees."
      },
      {
        "q": "How do I sell my stuff before moving out of a CBD apartment?",
        "a": "List your items on PopOut Market with clear photos and a realistic pickup time. CBD apartment turnover is high, so practical household goods often sell quickly to buyers close by."
      },
      {
        "q": "Does the Melbourne CBD marketplace work outside the city centre?",
        "a": "Absolutely. PopOut Market works across all of Melbourne. CBD search intent often overlaps with Carlton, Southbank, Docklands and North Melbourne, and you can trade in any suburb."
      },
      {
        "q": "Can I chat with sellers in my own language on PopOut Market?",
        "a": "Yes. PopOut Market has built-in multilingual chat, which is especially handy for international students and new arrivals trading in the Melbourne CBD area."
      }
    ],
    "faqHeading": "FAQ",
    "relatedHeading": "Related pages",
    "related": [
      {
        "href": "/market",
        "label": "Browse the marketplace"
      },
      {
        "href": "/melbourne-second-hand-marketplace",
        "label": "Melbourne second-hand marketplace"
      },
      {
        "href": "/melbourne-suburbs/melbourne-cbd",
        "label": "Melbourne CBD"
      }
    ]
  },
  "zh-Hans": {
    "title": "墨尔本CBD二手市场 | PopOut Market 市区二手买卖与更安全的本地交易",
    "description": "PopOut Market 是免费的墨尔本CBD二手交易平台，方便市区居民、留学生与搬家人群就近买卖二手家具与生活用品，覆盖整个墨尔本，不限于市中心。",
    "h1": "墨尔本CBD二手市场",
    "inLanguage": "zh-CN",
    "sections": [
      {
        "heading": "市中心用户最看重什么",
        "paragraphs": [
          "墨尔本市中心的搜索需求往往很实际：快速布置公寓、更换生活必需品、搬家前出手物品，或在不远行的情况下比较附近的选择。市区用户希望就近自提、回复迅速，并且能从照片和描述中轻松判断商品状况。",
          "PopOut Market 完全免费，以社区和街区为核心进行匹配。商品离你的日常活动范围越近，同城二手交易通常就越顺畅。CBD 是最繁忙的核心，但 PopOut 覆盖整个墨尔本，并不局限于市中心。"
        ]
      },
      {
        "heading": "为何 CBD 是活跃的二手区域",
        "paragraphs": [
          "墨尔本CBD公寓密集、临近多所大学，入住与退租周期都很快。这让墨尔本市区的二手买卖需求持续旺盛，二手家具、小家电和日常用品都能就近完成交易。"
        ],
        "list": [
          "墨尔本市中心二手与墨尔本CBD二手市场信息",
          "墨尔本CBD二手家具与公寓入住必备",
          "卡尔顿、南岸、码头区与北墨尔本就近自提",
          "从城区延伸至全墨尔本各区的二手交易"
        ]
      },
      {
        "heading": "用母语沟通，更安心地交易",
        "paragraphs": [
          "PopOut Market 内置多语言聊天，你可以用最习惯的语言确认价格、成色与自提时间。更安全的当面交易流程，帮助买卖双方在 CBD 人流密集、明亮安全的地点见面完成交易。",
          "PopOut 深受留学生、租房者和搬家人群欢迎，让墨尔本市区的二手买卖简单顺畅，同时触达整个墨尔本。"
        ]
      }
    ],
    "faq": [
      {
        "q": "墨尔本CBD哪里可以买二手家具？",
        "a": "在 PopOut Market 上，你可以浏览附近用户发布的墨尔本CBD二手家具和生活用品，再约定方便的市区自提地点。由于匹配以街区为基础，你还能看到墨尔本其他区域的选择。"
      },
      {
        "q": "有没有免费的墨尔本CBD二手交易App？",
        "a": "有。PopOut Market 是一款免费App，可在墨尔本CBD以及墨尔本各个社区买卖二手物品，发布信息不收任何费用。"
      },
      {
        "q": "退租前如何在 CBD 公寓出手二手物品？",
        "a": "在 PopOut Market 上发布物品，配上清晰照片和合理的自提时间即可。CBD 公寓换租频繁，实用的家居用品常常很快就被附近买家收走。"
      },
      {
        "q": "墨尔本CBD二手市场在市中心以外也能用吗？",
        "a": "当然可以。PopOut Market 覆盖整个墨尔本。墨尔本市中心的二手搜索需求常与卡尔顿、南岸、码头区和北墨尔本重叠，你可以在任意社区交易。"
      },
      {
        "q": "在 PopOut Market 上能用自己的语言和卖家沟通吗？",
        "a": "可以。PopOut Market 内置多语言聊天，对在墨尔本城区进行二手交易的留学生和新到墨尔本的人尤其方便。"
      }
    ],
    "faqHeading": "常见问题",
    "relatedHeading": "相关页面",
    "related": [
      {
        "href": "/market",
        "label": "浏览二手市场"
      },
      {
        "href": "/melbourne-second-hand-marketplace",
        "label": "墨尔本二手市场"
      },
      {
        "href": "/melbourne-suburbs/melbourne-cbd",
        "label": "墨尔本CBD"
      }
    ]
  },
  "ko": {
    "title": "멜버른 CBD 중고마켓 | PopOut Market 시티 중고거래와 더 안전한 동네 직거래",
    "description": "PopOut Market은 무료 멜버른 CBD 중고거래 플랫폼입니다. 시내 거주자, 유학생, 이사하는 분들이 가까운 곳에서 중고 가구와 생활용품을 사고팔며, 멜버른 전역에서 이용할 수 있습니다.",
    "h1": "멜버른 CBD 중고마켓",
    "inLanguage": "ko",
    "sections": [
      {
        "heading": "시내 이용자가 정말 필요로 하는 것",
        "paragraphs": [
          "멜버른 시내 검색은 대체로 매우 실용적입니다. 원룸을 빠르게 채우거나, 생활필수품을 교체하거나, 이사 전에 물건을 정리하거나, 멀리 가지 않고 근처 매물을 비교하려는 경우가 많습니다. 시티 이용자는 가까운 직거래, 빠른 답장, 그리고 사진과 설명만으로 상태를 판단하기 쉬운 매물을 원합니다.",
          "PopOut Market은 무료이며 동네 기반 탐색을 중심으로 만들어졌습니다. 매물이 내 생활 동선에 가까울수록 멜버른 중고거래는 더 매끄럽게 이뤄집니다. CBD가 가장 붐비는 거점이지만, PopOut은 시내에만 한정되지 않고 멜버른 전역에서 이용할 수 있습니다."
        ]
      },
      {
        "heading": "CBD가 활발한 중고거래 지역인 이유",
        "paragraphs": [
          "멜버른 CBD는 아파트 밀집도, 대학가 유동 인구, 빠른 입주·퇴거 주기가 맞물려 있습니다. 그래서 가까이서 받을 수 있는 중고 가구, 소형 가전, 생활용품에 대한 멜버른 도심 중고 수요가 꾸준합니다."
        ],
        "list": [
          "멜버른 시티 중고거래와 CBD 중고마켓 매물",
          "멜버른 CBD 중고 가구와 입주 필수품",
          "칼튼, 사우스뱅크, 도클랜즈, 노스 멜버른 근거리 직거래",
          "도심을 넘어 멜버른 모든 동네로 이어지는 중고 거래"
        ]
      },
      {
        "heading": "내 언어로 대화하며 더 안전하게 거래",
        "paragraphs": [
          "PopOut Market에는 앱 내 다국어 채팅이 있어 가장 편한 언어로 가격, 상태, 직거래 시간을 정할 수 있습니다. 더 안전한 대면 거래 절차는 사람이 많고 밝은 CBD 장소에서 구매자와 판매자가 만나도록 돕습니다.",
          "유학생, 세입자, 이사하는 분들에게 인기 있는 PopOut은 멜버른 시내 중고거래를 간편하게 유지하면서 멜버른 전역까지 닿습니다."
        ]
      }
    ],
    "faq": [
      {
        "q": "멜버른 CBD에서 중고 가구는 어디서 사나요?",
        "a": "PopOut Market에서 가까운 이웃이 올린 멜버른 CBD 중고 가구와 생활용품을 둘러보고 편한 시티 직거래 장소를 정할 수 있습니다. 동네 기반 탐색이라 멜버른 다른 지역 매물도 함께 볼 수 있습니다."
      },
      {
        "q": "멜버른 CBD 중고거래용 무료 앱이 있나요?",
        "a": "네. PopOut Market은 멜버른 CBD를 비롯해 멜버른 모든 동네에서 중고 물품을 사고팔 수 있는 무료 앱이며, 등록 수수료가 없습니다."
      },
      {
        "q": "CBD 아파트에서 이사 가기 전에 물건을 어떻게 파나요?",
        "a": "PopOut Market에 선명한 사진과 현실적인 직거래 시간을 적어 매물을 올리면 됩니다. CBD 아파트는 회전이 빨라 실용적인 생활용품은 근처 구매자에게 금방 팔리는 경우가 많습니다."
      },
      {
        "q": "멜버른 CBD 중고마켓은 시내 밖에서도 쓸 수 있나요?",
        "a": "물론입니다. PopOut Market은 멜버른 전역에서 이용할 수 있습니다. 멜버른 시내 중고거래 검색은 칼튼, 사우스뱅크, 도클랜즈, 노스 멜버른과 자주 겹치며 어느 동네에서나 거래할 수 있습니다."
      },
      {
        "q": "PopOut Market에서 내 언어로 판매자와 채팅할 수 있나요?",
        "a": "네. PopOut Market은 다국어 채팅을 기본 지원하여, 멜버른 도심에서 중고 거래를 하는 유학생과 새로 온 분들에게 특히 편리합니다."
      }
    ],
    "faqHeading": "자주 묻는 질문",
    "relatedHeading": "관련 페이지",
    "related": [
      {
        "href": "/market",
        "label": "중고마켓 둘러보기"
      },
      {
        "href": "/melbourne-second-hand-marketplace",
        "label": "멜버른 중고마켓"
      },
      {
        "href": "/melbourne-suburbs/melbourne-cbd",
        "label": "멜버른 CBD"
      }
    ]
  }
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
    alternates: { canonical: selfPath, languages: localizedAlternates(PATH) },
    openGraph: {
      title: c.title,
      description: c.description,
      url: siteUrl().replace(/\/$/, "") + selfPath,
      type: "website",
      siteName: "PopOut Market",
    },
  };
}

export default async function Page() {
  const locale = await getServerLocale();
  const c = contentFor(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: c.title, description: c.description, inLanguage: c.inLanguage, about: { "@type": "Place", name: ABOUT_NAME } },
      { "@type": "FAQPage", mainEntity: c.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
    ],
  };
  return (
    <section className={SHELL_X + " flex flex-1 flex-col py-10"}>
      <div className={INNER_MAX + " max-w-4xl"}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {c.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{c.description}</p>

        {c.sections.map((s) => (
          <section key={s.heading} className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm first:mt-8">
            <h2 className="text-lg font-semibold text-gray-900">{s.heading}</h2>
            {s.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-gray-700">{p}</p>
            ))}
            {s.list ? (
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-700">
                {s.list.map((li, i) => (<li key={i}>{li}</li>))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{c.relatedHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {c.related.map((r) => (
              <Link key={r.href} href={toLocalePath(r.href, locale)} className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500">
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
                <h3 className="text-sm font-semibold text-gray-900">{item.q.charAt(0).toUpperCase() + item.q.slice(1)}</h3>
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
