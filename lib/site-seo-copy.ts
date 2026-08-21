import type { Metadata } from "next";
import type { Locale } from "@/lib/site-i18n";
import { localizedAlternates, siteUrl, OG_IMAGE } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";

type SeoEntry = {
  title: string;
  description: string;
  keywords?: string[];
};

// Localized SEO copy per logical path. `en` is the fallback for any locale that
// is not translated yet, so partial language coverage is always safe.
//
// GEO note: the product is launching in Melbourne, Australia first and will roll
// out to more Australian cities later. Copy therefore anchors on "Melbourne,
// Australia" (so it ranks for both the city and the country) while making the
// "starting in Melbourne, more cities coming soon" framing explicit. Keep this
// framing when editing — do NOT imply nationwide coverage already exists.
// NOTE: the homepage descriptions state "336 Melbourne suburbs". Every rendered
// page reads that figure live (see `fetchActiveSuburbCount`), but metadata is
// authored copy in 8 locales, so it is written out here. Suburbs are activated by
// hand outside the migration pipeline, so re-check with
//   GET /rest/v1/suburbs?select=id&is_active=eq.true   (Prefer: count=exact)
// and update all 8 strings together if it has moved materially.
const SEO_COPY: Record<string, Partial<Record<Locale, SeoEntry>>> = {
  "/": {
    es: {
      title: "PopOut Market | App de segunda mano en Melbourne, Australia y mercado local",
      description:
        "PopOut Market es la app de segunda mano y el mercado local de Melbourne, Australia, para comprar y vender cerca de ti: descubre artículos por zona, chatea en varios idiomas y queda de forma más segura. Además, ofertas de tiendas locales y consejos del barrio, en 8 idiomas. Disponible en 336 barrios de Melbourne.",
    },
    fr: {
      title: "PopOut Market | Appli d'occasion à Melbourne, Australie & marché de quartier",
      description:
        "PopOut Market est l'appli d'occasion et le marché de quartier de Melbourne, en Australie, pour acheter et vendre près de chez vous : annonces par quartier, messagerie multilingue et rencontres plus sûres. En plus : les promos des commerces du quartier et les conseils des voisins, en 8 langues. Disponible dans 336 quartiers de Melbourne.",
    },
    vi: {
      title: "PopOut Market | App đồ cũ tại Melbourne, Úc & chợ đồ cũ khu vực",
      description:
        "PopOut Market là app đồ cũ và chợ mua bán đồ cũ theo khu vực tại Melbourne, Úc: tìm nội thất, đồ điện cũ gần bạn, chat đa ngôn ngữ và giao dịch trực tiếp an toàn hơn. Ngoài ra còn có khuyến mãi từ cửa hàng địa phương và mẹo sống trong khu vực, bằng 8 ngôn ngữ. Đã có mặt tại 336 khu vực ở Melbourne.",
    },
    "zh-Hant": {
      title: "PopOut Market | 澳洲墨爾本二手 App 與同城二手交易平台",
      description:
        "PopOut Market 是澳洲（Australia）墨爾本的二手 App 與同城二手交易平台：依郊區／社區發現身邊的二手好物，支援多語言聊天翻譯與更安全的當面交易，適合留學生搬家與畢業清倉。還能看到附近商店的優惠與鄰里生活情報，支援 8 種語言。已覆蓋墨爾本 336 個城區。",
    },
    ja: {
      title: "PopOut Market | オーストラリア・メルボルンの中古売買アプリ・地元フリマ",
      description:
        "PopOut Marketはオーストラリア（Australia）メルボルンの中古売買アプリ・地元フリマアプリ。エリアや近所ごとに身近な中古品を探し、翻訳付きの多言語チャットでやり取りし、より安全な手渡しの直接取引で売買できます。近所のお店のセール情報やご近所の生活情報も、8言語で。メルボルンの336サバーブで利用できます。",
    },
    en: {
      title: "PopOut Market | Melbourne, Australia Second-Hand Marketplace & Neighbourhood App",
      description:
        "PopOut Market is a second-hand app and neighbourhood marketplace in Melbourne, Australia, for buying and selling locally, with suburb-first discovery, multilingual communication, and safer meetup workflows. Plus local shop finds and neighbourhood tips, in 8 languages. Live in 336 Melbourne suburbs.",
      keywords: [
        "Australia second hand app",
        "Australia second hand marketplace",
        "second hand app Australia",
        "Melbourne Australia second hand",
        "Melbourne second hand marketplace",
        "Melbourne second hand app",
        "buy and sell in Australia",
        "student second hand app Melbourne",
        "safe second hand trading",
        "multilingual marketplace app",
        "Melbourne neighbourhood app",
        "neighbourhood app Australia",
        "local deals Melbourne",
        "Melbourne community app",
      ],
    },
    "zh-Hans": {
      title: "PopOut Market | 澳洲墨尔本二手App与同城二手交易平台",
      description:
        "PopOut Market 是澳大利亚（Australia）墨尔本的二手交易App和同城二手市场：按郊区/社区发现身边的二手好物，支持多语言沟通和更安全的当面交易，适合留学生搬家和毕业清仓。还能看到附近商店的优惠和邻里生活情报，支持 8 种语言。已覆盖墨尔本 336 个城区。",
      keywords: [
        "澳洲二手",
        "澳大利亚二手",
        "澳洲二手App",
        "澳洲墨尔本二手",
        "墨尔本二手",
        "墨尔本二手App",
        "同城二手交易",
        "留学生二手",
        "墨尔本闲置物品",
      ],
    },
    ko: {
      title: "PopOut Market | 호주 멜버른 중고거래 앱 & 동네 중고마켓",
      description:
        "PopOut Market는 호주(Australia) 멜버른의 중고거래 앱이자 동네 중고마켓입니다. 동네별로 가까운 중고 물품을 찾고, 다국어 채팅과 더 안전한 직거래로 거래하세요. 동네 가게 할인 정보와 이웃들의 생활 정보까지, 8개 언어로 제공합니다. 멜버른 336개 서버브에서 이용할 수 있습니다.",
      keywords: [
        "호주 중고거래",
        "호주 중고거래 앱",
        "호주 멜버른 중고",
        "멜버른 중고",
        "멜버른 중고거래",
        "멜버른 중고거래 앱",
        "동네 중고거래",
        "유학생 중고",
      ],
    },
  },
  "/market": {
    en: {
      title: "Melbourne, Australia Second-Hand Market | PopOut Market",
      description:
        "Browse Melbourne second-hand listings by suburb and trade locally with PopOut Market — a second-hand market for Melbourne, Australia, covering the city and CBD now, with more Australian cities coming soon.",
      keywords: [
        "Australia second hand market",
        "second hand market Australia",
        "Melbourne second hand market",
        "Melbourne second hand app",
        "Melbourne market listings",
        "buy and sell nearby Melbourne",
        "Melbourne suburb marketplace",
      ],
    },
    "zh-Hans": {
      title: "澳洲墨尔本二手市集 | PopOut Market",
      description:
        "按郊区浏览澳大利亚墨尔本的二手商品，对比附近的闲置好物，用 PopOut Market 在墨尔本市区与 CBD 社区进行同城二手交易。现已上线墨尔本，更多澳洲城市陆续开放，敬请期待。",
      keywords: [
        "澳洲二手市集",
        "澳大利亚二手",
        "墨尔本二手市集",
        "墨尔本二手",
        "墨尔本二手商品",
        "同城二手交易",
        "墨尔本附近二手",
      ],
    },
    ko: {
      title: "호주 멜버른 중고마켓 | PopOut Market",
      description:
        "동네별로 호주 멜버른 중고 매물을 둘러보고 주변의 가까운 물건을 비교하세요. PopOut Market로 멜버른 시내와 CBD에서 동네 중고거래를 시작하고, 호주 내 더 많은 도시로 확대될 예정입니다.",
      keywords: [
        "호주 중고마켓",
        "호주 멜버른 중고",
        "멜버른 중고마켓",
        "멜버른 중고",
        "멜버른 중고 매물",
        "동네 중고거래",
        "멜버른 직거래",
      ],
    },
  },
  "/about": {
    es: {
      title: "Sobre PopOut Market | Segunda mano en Melbourne, Australia",
      description:
        "Conoce PopOut Market, la app gratuita para comprar y vender de segunda mano por barrio en Melbourne, Australia: muebles, electrodomésticos, chat con traducción e ideal para estudiantes. Pronto en más ciudades australianas.",
    },
    fr: {
      title: "À propos de PopOut Market | Occasion à Melbourne, Australie",
      description:
        "Découvrez comment PopOut Market aide les habitants et les étudiants internationaux à acheter et vendre d'occasion à Melbourne, en Australie : recherche par quartier, messagerie multilingue et rencontres plus sûres. Bientôt dans d'autres villes australiennes.",
    },
    vi: {
      title: "Giới thiệu PopOut Market | Mua bán đồ cũ tại Melbourne, Úc",
      description:
        "Tìm hiểu về PopOut Market: nền tảng và ứng dụng mua bán đồ cũ miễn phí tại Melbourne, Úc. Tìm đồ theo khu vực, nhắn tin đa ngôn ngữ, từ nội thất đến đồ thanh lý của du học sinh, sắp mở rộng tới nhiều thành phố khác ở Úc.",
    },
    "zh-Hant": {
      title: "關於 PopOut Market｜澳洲墨爾本同城二手交易 App",
      description:
        "認識 PopOut Market：免費的澳洲（Australia）墨爾本二手交易平台與二手 App。可依郊區（suburb）探索附近的二手好物與中古商品，內建多語言翻譯聊天與 AI 自動回覆，讓當面交易更安全便利。現已在墨爾本上線，更多澳洲城市陸續開放，敬請期待。",
    },
    ja: {
      title: "PopOut Market とは | オーストラリア・メルボルンの中古マーケットアプリ",
      description:
        "PopOut Market は、オーストラリア（Australia）メルボルンで使える無料の中古売買アプリです。お住まいの地域から近くの出品を探せて、多言語チャット翻訳と安心の手渡し直接取引に対応。留学生や引越しの不用品売買にも便利で、今後オーストラリアの他都市にも順次拡大予定です。",
    },
    en: {
      title: "About PopOut Market | Melbourne, Australia Second-Hand Marketplace",
      description:
        "Learn how PopOut Market helps people in Melbourne, Australia and international students buy and sell second-hand items with suburb-first discovery, multilingual communication, and safer meetup workflows — starting in Melbourne, with more Australian cities coming soon.",
      keywords: [
        "Australia second hand marketplace",
        "Melbourne second hand marketplace",
        "sell second hand in Melbourne",
        "student second hand app Melbourne",
        "safe second hand trading Melbourne",
        "multilingual marketplace app",
      ],
    },
    "zh-Hans": {
      title: "关于 PopOut Market | 澳洲墨尔本社区二手交易市场",
      description:
        "了解 PopOut Market 如何帮助澳大利亚（Australia）墨尔本本地居民和留学生买卖二手物品：按郊区发现、多语言沟通、更安全的当面交易流程。现已上线墨尔本，更多澳洲城市陆续开放，敬请期待。",
      keywords: [
        "澳洲二手市场",
        "澳大利亚二手",
        "墨尔本二手市场",
        "在墨尔本卖二手",
        "留学生二手App",
        "墨尔本安全二手交易",
        "多语言二手平台",
      ],
    },
    ko: {
      title: "PopOut Market 소개 | 호주 멜버른 동네 중고마켓",
      description:
        "PopOut Market가 호주(Australia) 멜버른의 현지인과 유학생이 중고 물품을 사고팔도록 어떻게 돕는지 알아보세요. 동네 중심 탐색, 다국어 소통, 더 안전한 직거래 방식을 제공합니다. 현재 멜버른에서 운영 중이며, 호주 내 더 많은 도시로 확대될 예정입니다.",
      keywords: [
        "호주 중고마켓",
        "호주 멜버른 중고",
        "멜버른 중고마켓",
        "멜버른 중고 판매",
        "유학생 중고 앱",
        "멜버른 안전 직거래",
        "다국어 중고 플랫폼",
      ],
    },
  },
  "/faq": {
    es: {
      title: "FAQ segunda mano Melbourne, Australia | PopOut Market",
      description:
        "Preguntas frecuentes de PopOut Market, la app de segunda mano en Melbourne, Australia: comprar y vender artículos usados, muebles y electrodomésticos, publicar anuncios y chat con traducción.",
    },
    fr: {
      title: "FAQ occasion à Melbourne, Australie | PopOut Market",
      description:
        "Questions fréquentes sur PopOut Market, l'application d'occasion à Melbourne, en Australie : acheter et vendre meubles et électroménager, petites annonces et chat traduit.",
    },
    vi: {
      title: "Câu hỏi thường gặp | PopOut Market đồ cũ tại Melbourne, Úc",
      description:
        "Giải đáp các câu hỏi thường gặp về PopOut Market tại Melbourne, Úc: đăng tin nhanh với AI, hỗ trợ đa ngôn ngữ, giao dịch gặp mặt an toàn ngay trong khu phố và bán đồ cũ mùa tốt nghiệp.",
    },
    "zh-Hant": {
      title: "墨爾本二手常見問題 FAQ | 澳洲 PopOut Market 二手交易平台",
      description:
        "PopOut Market 澳洲（Australia）墨爾本二手常見問題：免費二手 App 怎麼用、如何在同城刊登與買賣二手家具及家電、多語言聊天自動翻譯、更安全的面交流程，以及作為旋轉拍賣（Carousell）替代方案的說明。現已上線墨爾本，更多澳洲城市陸續開放。",
    },
    ja: {
      title: "よくある質問 FAQ | PopOut Market オーストラリア・メルボルン中古アプリ",
      description:
        "オーストラリア（Australia）メルボルンでの中古売買に関するよくある質問。PopOut Marketは地元の出品を地域・郊外別に探せる無料フリマアプリで、多言語チャット（自動翻訳付き）と安心の対面手渡し取引に対応。出品方法や使い方をわかりやすく解説します。",
    },
    en: {
      title: "PopOut Market FAQ | Melbourne, Australia Second-Hand",
      description:
        "Frequently asked questions about how PopOut helps people in Melbourne, Australia post faster, communicate across languages, and trade second-hand with clearer safety workflows.",
    },
    "zh-Hans": {
      title: "常见问题 FAQ | 澳洲墨尔本二手交易 PopOut Market",
      description:
        "关于 PopOut 如何帮助澳大利亚（Australia）墨尔本用户更快发布、跨语言沟通、并以更清晰的安全流程进行二手交易的常见问题解答。",
    },
    ko: {
      title: "자주 묻는 질문 FAQ | 호주 멜버른 중고거래 PopOut Market",
      description:
        "PopOut이 호주(Australia) 멜버른 사용자의 빠른 등록, 다국어 소통, 더 명확한 안전 거래 방식을 어떻게 돕는지에 대한 자주 묻는 질문입니다.",
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
 * Localized meta description for a logical path, or null when there is none.
 *
 * Used by pages that render their own server-side intro paragraph and want it to
 * say the same thing the description says — the alternative is a second, drifting
 * copy of the same sentence in `lib/site-i18n.ts`.
 */
export function localizedDescription(path: string, locale: Locale): string | null {
  return seoEntry(path, locale)?.description ?? null;
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
      images: [OG_IMAGE],
    };
  }

  return meta;
}
