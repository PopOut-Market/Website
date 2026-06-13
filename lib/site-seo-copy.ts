import type { Metadata } from "next";
import type { Locale } from "@/lib/site-i18n";
import { localizedAlternates, siteUrl } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";

type SeoEntry = {
  title: string;
  description: string;
  keywords?: string[];
};

// Localized SEO copy per logical path. `en` is the fallback for any locale that
// is not translated yet, so partial language coverage is always safe.
// This version covers en / zh-Hans (简体中文) / ko (한국어).
const SEO_COPY: Record<string, Partial<Record<Locale, SeoEntry>>> = {
  "/": {
    "zh-Hant": {"title":"PopOut Market | 墨爾本二手 App 與同城二手交易平台","description":"PopOut Market 是墨爾本的二手 App 與同城二手交易平台：依郊區／社區發現身邊的二手好物，支援多語言聊天翻譯與更安全的當面交易，適合留學生搬家、畢業清倉與公寓生活。"},
    ja: {"title":"PopOut Market | メルボルンの中古売買アプリ・地元フリマアプリ","description":"PopOut Marketはメルボルンの中古売買アプリ・地元フリマアプリ。エリアや近所ごとに身近な中古品を探し、翻訳付きの多言語チャットでやり取りし、より安全な手渡しの直接取引で売買できます。メルボルン全域に対応し、留学生やお部屋の引っ越しにも最適です。"},
    en: {
      title: "PopOut Market | Melbourne Second-Hand App & Neighbourhood Marketplace",
      description:
        "PopOut Market is a Melbourne second-hand app and neighbourhood marketplace for buying and selling locally, with suburb-first discovery, multilingual communication, and safer meetup workflows.",
      keywords: [
        "Melbourne second hand marketplace",
        "Melbourne second hand app",
        "Melbourne second hand market",
        "buy and sell in Melbourne",
        "student second hand app Melbourne",
        "safe second hand trading",
        "multilingual marketplace app",
      ],
    },
    "zh-Hans": {
      title: "PopOut Market | 墨尔本二手App与同城二手交易市场",
      description:
        "PopOut Market 是面向墨尔本的二手交易App和同城二手市场：按郊区/社区发现身边的二手好物，支持多语言沟通和更安全的当面交易，适合留学生搬家、毕业清仓和公寓生活。",
      keywords: [
        "墨尔本二手",
        "墨尔本二手App",
        "墨尔本二手交易",
        "墨尔本二手市场",
        "同城二手交易",
        "留学生二手",
        "墨尔本闲置物品",
      ],
    },
    ko: {
      title: "PopOut Market | 멜버른 중고거래 앱 & 동네 중고마켓",
      description:
        "PopOut Market는 멜버른 지역 기반 중고거래 앱이자 동네 중고마켓입니다. 동네별로 가까운 중고 물품을 찾고, 다국어 채팅과 더 안전한 직거래로 거래하세요. 유학생 이사, 졸업 정리, 아파트 생활에 딱 맞습니다.",
      keywords: [
        "멜버른 중고",
        "멜버른 중고거래",
        "멜버른 중고거래 앱",
        "멜버른 중고마켓",
        "동네 중고거래",
        "유학생 중고",
        "멜버른 직거래",
      ],
    },
  },
  "/market": {
    en: {
      title: "Melbourne Second-Hand Market | PopOut Market",
      description:
        "Browse Melbourne second-hand listings by suburb, compare nearby items, and use PopOut Market as a local second-hand trading platform for Melbourne city and CBD communities.",
      keywords: [
        "Melbourne second hand market",
        "Melbourne second hand app",
        "Melbourne market listings",
        "second hand market Melbourne",
        "buy and sell nearby Melbourne",
        "Melbourne suburb marketplace",
      ],
    },
    "zh-Hans": {
      title: "墨尔本二手市集 | PopOut Market",
      description:
        "按郊区浏览墨尔本的二手商品，对比附近的闲置好物，用 PopOut Market 在墨尔本市区与 CBD 社区进行同城二手交易。",
      keywords: [
        "墨尔本二手市集",
        "墨尔本二手",
        "墨尔本二手商品",
        "同城二手交易",
        "墨尔本附近二手",
        "墨尔本郊区二手",
      ],
    },
    ko: {
      title: "멜버른 중고마켓 | PopOut Market",
      description:
        "동네별로 멜버른 중고 매물을 둘러보고 주변의 가까운 물건을 비교하세요. PopOut Market로 멜버른 시내와 CBD 지역에서 동네 중고거래를 시작하세요.",
      keywords: [
        "멜버른 중고마켓",
        "멜버른 중고",
        "멜버른 중고 매물",
        "동네 중고거래",
        "멜버른 근처 중고",
        "멜버른 직거래",
      ],
    },
  },
  "/about": {
    "zh-Hant": {"title":"關於 PopOut Market｜墨爾本同城二手交易 App","description":"認識 PopOut Market：免費的墨爾本二手交易平台與二手 App，服務全墨爾本地區。可依郊區（suburb）探索附近的二手好物與中古商品，內建多語言翻譯聊天與 AI 自動回覆，讓當面交易更安全便利。從家具到電器應有盡有，是留學生、租屋族與搬家族尋找二手物品的理想之選。"},
    ja: {"title":"PopOut Market とは | メルボルンの地元中古マーケットアプリ","description":"PopOut Market は、メルボルン全域で使える無料の中古売買アプリです。お住まいの地域から近くの出品を探せて、多言語チャット翻訳と安心の手渡し直接取引に対応。留学生や引越し・お部屋の片付けの不用品売買にも便利です。"},
    en: {
      title: "About PopOut Market | Melbourne Neighbourhood Second-Hand Marketplace",
      description:
        "Learn how PopOut Market helps Melbourne locals and international students buy and sell second-hand items with suburb-first discovery, multilingual communication, and safer meetup workflows.",
      keywords: [
        "Melbourne second hand marketplace",
        "sell second hand in Melbourne",
        "student second hand app Melbourne",
        "safe second hand trading Melbourne",
        "multilingual marketplace app",
      ],
    },
    "zh-Hans": {
      title: "关于 PopOut Market | 墨尔本社区二手交易市场",
      description:
        "了解 PopOut Market 如何帮助墨尔本本地居民和留学生买卖二手物品：按郊区发现、多语言沟通、更安全的当面交易流程。",
      keywords: [
        "墨尔本二手市场",
        "在墨尔本卖二手",
        "留学生二手App",
        "墨尔本安全二手交易",
        "多语言二手平台",
      ],
    },
    ko: {
      title: "PopOut Market 소개 | 멜버른 동네 중고마켓",
      description:
        "PopOut Market가 멜버른 현지인과 유학생이 중고 물품을 사고팔도록 어떻게 돕는지 알아보세요. 동네 중심 탐색, 다국어 소통, 더 안전한 직거래 방식을 제공합니다.",
      keywords: [
        "멜버른 중고마켓",
        "멜버른 중고 판매",
        "유학생 중고 앱",
        "멜버른 안전 직거래",
        "다국어 중고 플랫폼",
      ],
    },
  },
  "/faq": {
    "zh-Hant": {"title":"墨爾本二手常見問題 FAQ | PopOut Market 二手交易平台","description":"PopOut Market 墨爾本二手常見問題：免費二手 App 怎麼用、如何在同城刊登與買賣二手家具及家電、墨爾本中古拍賣與留學生二手交易、多語言聊天自動翻譯、更安全的面交流程，以及作為旋轉拍賣（Carousell）替代方案的二手平台說明。"},
    ja: {"title":"よくある質問 FAQ | PopOut Market メルボルン中古アプリ","description":"メルボルンでの中古売買に関するよくある質問。PopOut Marketは地元の出品を地域・郊外別に探せる無料フリマアプリで、多言語チャット（自動翻訳付き）と安心の対面手渡し取引に対応。出品方法や不用品の売り方、留学生や引っ越し時の使い方をわかりやすく解説します。"},
    en: {
      title: "PopOut Market FAQ",
      description:
        "Frequently asked questions about how PopOut helps Melbourne users post faster, communicate across languages, and trade with clearer safety workflows.",
    },
    "zh-Hans": {
      title: "常见问题 FAQ | PopOut Market 墨尔本二手交易",
      description:
        "关于 PopOut 如何帮助墨尔本用户更快发布、跨语言沟通、并以更清晰的安全流程进行二手交易的常见问题解答。",
    },
    ko: {
      title: "자주 묻는 질문 FAQ | PopOut Market 멜버른 중고거래",
      description:
        "PopOut이 멜버른 사용자의 빠른 등록, 다국어 소통, 더 명확한 안전 거래 방식을 어떻게 돕는지에 대한 자주 묻는 질문입니다.",
    },
  },
};

// og:locale value per locale.
const OG_LOCALE: Record<Locale, string> = {
  en: "en_AU",
  "zh-Hans": "zh_CN",
  "zh-Hant": "zh_TW",
  ko: "ko_KR",
  ja: "ja_JP",
  vi: "vi_VN",
  fr: "fr_FR",
  es: "es_ES",
};

function seoEntry(path: string, locale: Locale): SeoEntry | null {
  const byPath = SEO_COPY[path];
  if (!byPath) return null;
  return byPath[locale] ?? byPath.en ?? null;
}

/**
 * Localized <title> for a logical path, or null when the path has no localized
 * SEO copy. Used client-side to keep the browser tab title in sync when the
 * language is switched without a full reload (server generateMetadata only runs
 * on a fresh request). Returns null for untranslated pages so their own
 * server-rendered title is left untouched.
 */
export function localizedTitle(path: string, locale: Locale): string | null {
  return seoEntry(path, locale)?.title ?? null;
}

/**
 * Build localized Next.js Metadata for a logical path + locale:
 * - localized <title>/<description>/keywords (en fallback)
 * - self-referential canonical for the current locale
 * - full hreflang alternates (8 locales + x-default)
 * - Open Graph with the localized URL and og:locale
 *
 * `title.absolute` is used so the page title is not wrapped again by the root
 * layout's "%s | PopOut Market" template (which would duplicate the brand).
 */
export function localizedMetadata(path: string, locale: Locale): Metadata {
  const entry = seoEntry(path, locale);
  const selfPath = toLocalePath(path, locale);
  const base = siteUrl().replace(/\/$/, "");

  const meta: Metadata = {
    alternates: {
      canonical: selfPath,
      languages: localizedAlternates(path),
    },
  };

  if (entry) {
    meta.title = { absolute: entry.title };
    meta.description = entry.description;
    if (entry.keywords) meta.keywords = entry.keywords;
    meta.openGraph = {
      title: entry.title,
      description: entry.description,
      url: `${base}${selfPath}`,
      type: "website",
      siteName: "PopOut Market",
      locale: OG_LOCALE[locale],
    };
  }

  return meta;
}
