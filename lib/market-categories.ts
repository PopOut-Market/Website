import type { Locale } from "@/lib/site-i18n";

/**
 * The second-hand category landing pages.
 *
 * Why these exist: the app has a 13 + 34 category taxonomy and the website had
 * zero category pages, while "second-hand furniture Melbourne"-shaped queries
 * are the demand this brand already ranks near. These pages multiply the head
 * term the site is verified to rank for rather than diluting it — they are the
 * lowest-risk growth surface available.
 *
 * Three constraints shaped the design:
 *
 *  1. **Top-level only.** `get_home_feed` accepts `p_category_v2_finer_id` and
 *     then *silently ignores it* — two different finer ids return byte-identical
 *     feeds. Twelve leaf pages across eight locales would therefore have shipped
 *     96 URLs of identical content. They are deliberately not built; revisit
 *     only once that parameter actually filters.
 *  2. **Names come from the database.** `categories.name` is a JSONB column
 *     already carrying all eight locales, mirrored below. Localised headings
 *     cost nothing to author, which is why every one of these pages ships in all
 *     eight locales while authored-prose pages do not.
 *  3. **No baked counts.** Live totals move weekly and would need re-translating
 *     eight ways every time. Counts render as data from the feed or not at all.
 *
 * Three top-level categories are intentionally absent: `mobility` (6 live items,
 * ~$700 median — revisit at 25), `food-drink` (a page titled "second-hand food
 * in Melbourne" invites a safety question the product should not be answering),
 * and `other` (its own name is "Other"; there is no query behind it).
 */

export type MarketCategory = {
  /** Path, without locale prefix. Also the route directory name. */
  path: string;
  /** `categories.id` of a top-level row with `in_v2 = true`. */
  topId: number;
  /** `categories.slug` — the app's own identifier, kept for traceability. */
  slug: string;
  /** Mirrored verbatim from `categories.name` (JSONB, seeded by migration only). */
  name: Record<Locale, string>;
};

/** Ordered by live inventory, biggest first — this is also the sitemap order. */
export const MARKET_CATEGORIES: MarketCategory[] = [
  {
    path: "/second-hand-womens-clothing-melbourne",
    topId: 20,
    slug: "womens-fashion",
    name: {
      en: "Women's Fashion",
      "zh-Hans": "女士服饰",
      "zh-Hant": "女性服飾",
      ko: "여성패션",
      ja: "レディース",
      vi: "Thời trang nữ",
      fr: "Mode femme",
      es: "Moda mujer",
    },
  },
  {
    path: "/second-hand-homeware-melbourne",
    topId: 2,
    slug: "home-kitchen",
    name: {
      en: "Home & Kitchen",
      "zh-Hans": "家居与厨房",
      "zh-Hant": "居家與廚房",
      ko: "생활/주방",
      ja: "ホーム＆キッチン",
      vi: "Nhà cửa & Bếp",
      fr: "Maison et cuisine",
      es: "Hogar y cocina",
    },
  },
  {
    path: "/second-hand-beauty-melbourne",
    topId: 5,
    slug: "beauty",
    name: {
      en: "Beauty",
      "zh-Hans": "美妆",
      "zh-Hant": "美妝",
      ko: "뷰티",
      ja: "ビューティー",
      vi: "Làm đẹp",
      fr: "Beauté",
      es: "Belleza",
    },
  },
  {
    path: "/second-hand-electronics-melbourne",
    topId: 1,
    slug: "electronics",
    name: {
      en: "Electronics",
      "zh-Hans": "电子产品",
      "zh-Hant": "電子產品",
      ko: "전자제품",
      ja: "電子機器",
      vi: "Điện tử",
      fr: "Électronique",
      es: "Electrónica",
    },
  },
  {
    path: "/second-hand-hobbies-collectibles-melbourne",
    topId: 9,
    slug: "hobbies-collectibles",
    name: {
      en: "Hobbies & Collectibles",
      "zh-Hans": "爱好与收藏",
      "zh-Hant": "愛好與收藏",
      ko: "취미/수집",
      ja: "趣味・コレクション",
      vi: "Sở thích & Sưu tầm",
      fr: "Loisirs et collections",
      es: "Aficiones y coleccionables",
    },
  },
  {
    path: "/second-hand-mens-clothing-melbourne",
    topId: 21,
    slug: "mens-fashion",
    name: {
      en: "Men's Fashion",
      "zh-Hans": "男士服饰",
      "zh-Hant": "男性服飾",
      ko: "남성패션",
      ja: "メンズ",
      vi: "Thời trang nam",
      fr: "Mode homme",
      es: "Moda hombre",
    },
  },
  {
    path: "/second-hand-furniture-melbourne",
    topId: 3,
    slug: "furniture",
    name: {
      en: "Furniture",
      "zh-Hans": "家具",
      "zh-Hant": "家具",
      ko: "가구",
      ja: "家具",
      vi: "Nội thất",
      fr: "Meubles",
      es: "Muebles",
    },
  },
  {
    path: "/second-hand-sports-outdoors-melbourne",
    topId: 7,
    slug: "sports-outdoors",
    name: {
      en: "Sports & Outdoors",
      "zh-Hans": "运动与户外",
      "zh-Hant": "運動與戶外",
      ko: "스포츠/아웃도어",
      ja: "スポーツ＆アウトドア",
      vi: "Thể thao & Dã ngoại",
      fr: "Sports et plein air",
      es: "Deportes y aire libre",
    },
  },
  {
    path: "/second-hand-baby-kids-melbourne",
    topId: 11,
    slug: "kids-baby",
    name: {
      en: "Kids & Baby",
      "zh-Hans": "母婴/儿童",
      "zh-Hant": "母嬰/兒童",
      ko: "키즈/베이비",
      ja: "キッズ・ベビー",
      vi: "Trẻ em & Em bé",
      fr: "Enfants et bébés",
      es: "Niños y bebés",
    },
  },
  {
    path: "/second-hand-books-melbourne",
    topId: 6,
    slug: "books-education",
    name: {
      en: "Books & Education",
      "zh-Hans": "图书与学习",
      "zh-Hant": "圖書與學習",
      ko: "도서/교육",
      ja: "本・学習",
      vi: "Sách & Học tập",
      fr: "Livres et éducation",
      es: "Libros y educación",
    },
  },
];

export function categoryByPath(path: string): MarketCategory | undefined {
  return MARKET_CATEGORIES.find((c) => c.path === path);
}

/**
 * Per-locale sentence frames. `{cat}` is the database's own translation of the
 * category name, so the only thing authored here is the sentence around it —
 * which is why ten categories cost eight strings each rather than eighty.
 *
 * Every frame keeps the "second-hand / used" vocabulary the existing pages rank
 * on (二手 / 중고 / 中古 / cũ / d'occasion / de segunda mano). That wording was
 * removed from the homepage H1 during the repositioning; it is preserved here,
 * where it is the head term.
 */
type CategoryFrame = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  browseAll: string;
  otherCategories: string;
};

export const CATEGORY_COPY: Record<Locale, CategoryFrame> = {
  en: {
    title: "Second-hand {cat} in Melbourne | Buy & Sell Nearby · PopOut Market",
    description:
      "Find used {cat} near you in Melbourne on PopOut Market. Every listing comes from a verified neighbour in a Melbourne suburb and is handed over in person. Free app, eight languages, live in Melbourne.",
    h1: "Second-hand {cat} in Melbourne",
    intro:
      "These are {cat} listings live on PopOut Market right now, ranked by how close they are to central Melbourne. Every seller is a verified neighbour — an Australian mobile number plus a one-time location check — and every item is handed over in person at a public meetup spot. There is no postage and no courier step.",
    browseAll: "Browse everything for sale near you",
    otherCategories: "Other categories in Melbourne",
  },
  "zh-Hans": {
    title: "墨尔本二手{cat} | 和附近邻居买卖 · PopOut Market",
    description:
      "在 PopOut Market 找墨尔本附近的二手{cat}。每一件商品都来自通过验证的邻居，按所在城区就近展示，全部当面交易。免费 App，支持 8 种语言，已在墨尔本上线。",
    h1: "墨尔本二手{cat}",
    intro:
      "以下是 PopOut Market 上正在出售的二手{cat}，按距离墨尔本市中心的远近排序。每位卖家都通过澳洲手机号验证并完成了一次性定位核验，所有商品都在公共地点当面交付，没有邮寄，也没有快递环节。",
    browseAll: "浏览附近所有在售商品",
    otherCategories: "墨尔本其他二手分类",
  },
  "zh-Hant": {
    title: "墨爾本二手{cat} | 和附近鄰居買賣 · PopOut Market",
    description:
      "在 PopOut Market 找墨爾本附近的二手{cat}。每一件商品都來自通過驗證的鄰居，依所在城區就近顯示，全部當面交易。免費 App，支援 8 種語言，已在墨爾本上線。",
    h1: "墨爾本二手{cat}",
    intro:
      "以下是 PopOut Market 上正在販售的二手{cat}，依距離墨爾本市中心的遠近排序。每位賣家都通過澳洲手機號碼驗證並完成一次性位置驗證，所有商品都在公共地點當面交付，沒有郵寄，也沒有快遞環節。",
    browseAll: "瀏覽附近所有在售商品",
    otherCategories: "墨爾本其他二手分類",
  },
  ko: {
    title: "멜버른 중고 {cat} | 동네 이웃과 직거래 · PopOut Market",
    description:
      "PopOut Market에서 멜버른 우리 동네의 중고 {cat}를 찾아보세요. 모든 매물은 인증된 이웃이 올린 것이고, 직접 만나서 거래합니다. 무료 앱, 8개 언어, 멜버른에서 이용 가능합니다.",
    h1: "멜버른 중고 {cat}",
    intro:
      "PopOut Market에 지금 올라와 있는 중고 {cat} 매물입니다. 멜버른 도심에서 가까운 순으로 정렬됩니다. 판매자는 모두 호주 휴대폰 번호와 일회성 위치 확인을 거친 이웃이며, 거래는 공공장소에서 직접 만나 진행합니다. 택배나 배송 절차는 없습니다.",
    browseAll: "근처의 모든 매물 보기",
    otherCategories: "멜버른의 다른 중고 카테고리",
  },
  ja: {
    title: "メルボルンの中古{cat} | ご近所で売買 · PopOut Market",
    description:
      "PopOut Market でメルボルンの近所にある中古{cat}を探せます。出品はすべて認証済みのご近所さんによるもので、取引は対面の手渡しです。無料アプリ、8言語対応、メルボルンで提供中。",
    h1: "メルボルンの中古{cat}",
    intro:
      "PopOut Market にいま出品されている中古{cat}です。メルボルン中心部からの近さ順に並んでいます。出品者はオーストラリアの携帯番号と一度きりの位置確認を済ませたご近所さんで、取引は公共の場所での手渡しのみ。郵送や宅配の手順はありません。",
    browseAll: "近くの出品をすべて見る",
    otherCategories: "メルボルンの他のカテゴリー",
  },
  vi: {
    title: "{cat} cũ ở Melbourne | Mua bán với hàng xóm gần bạn · PopOut Market",
    description:
      "Tìm {cat} cũ gần bạn ở Melbourne trên PopOut Market. Mọi tin đăng đều từ hàng xóm đã xác minh trong khu vực Melbourne và được trao tay trực tiếp. Ứng dụng miễn phí, 8 ngôn ngữ.",
    h1: "{cat} cũ ở Melbourne",
    intro:
      "Đây là các tin đăng {cat} cũ đang có trên PopOut Market, xếp theo khoảng cách tới trung tâm Melbourne. Mọi người bán đều là hàng xóm đã xác minh bằng số di động Úc và một lần kiểm tra vị trí, và mọi món đồ đều được trao tay trực tiếp tại một địa điểm công cộng. Không gửi bưu điện, không chuyển phát.",
    browseAll: "Xem tất cả tin đăng gần bạn",
    otherCategories: "Danh mục đồ cũ khác ở Melbourne",
  },
  fr: {
    title: "{cat} d'occasion à Melbourne | Acheter et vendre près de chez vous · PopOut Market",
    description:
      "Trouvez {cat} d'occasion près de chez vous à Melbourne sur PopOut Market. Chaque annonce vient d'un voisin vérifié d'un quartier de Melbourne, et la remise se fait en main propre. Appli gratuite, huit langues.",
    h1: "{cat} d'occasion à Melbourne",
    intro:
      "Voici les annonces {cat} d'occasion actuellement en ligne sur PopOut Market, classées selon leur proximité avec le centre de Melbourne. Chaque vendeur est un voisin vérifié — numéro de mobile australien et vérification de position unique — et chaque objet est remis en main propre dans un lieu public. Ni envoi postal, ni livraison.",
    browseAll: "Voir toutes les annonces près de chez vous",
    otherCategories: "Autres catégories à Melbourne",
  },
  es: {
    title: "{cat} de segunda mano en Melbourne | Compra y vende cerca · PopOut Market",
    description:
      "Encuentra {cat} de segunda mano cerca de ti en Melbourne con PopOut Market. Cada anuncio es de un vecino verificado de un barrio de Melbourne y la entrega es en persona. App gratuita, ocho idiomas.",
    h1: "{cat} de segunda mano en Melbourne",
    intro:
      "Estos son los anuncios de {cat} de segunda mano activos ahora mismo en PopOut Market, ordenados por cercanía al centro de Melbourne. Cada vendedor es un vecino verificado — número de móvil australiano y una comprobación de ubicación única — y cada artículo se entrega en persona en un lugar público. Sin envíos ni mensajería.",
    browseAll: "Ver todo lo que se vende cerca de ti",
    otherCategories: "Otras categorías en Melbourne",
  },
};

export function categoryCopy(
  category: MarketCategory,
  locale: Locale,
): { title: string; description: string; h1: string; intro: string; name: string } {
  const frame = CATEGORY_COPY[locale];
  const name = category.name[locale];
  const fill = (s: string) => s.replaceAll("{cat}", name);
  return {
    title: fill(frame.title),
    description: fill(frame.description),
    h1: fill(frame.h1),
    intro: fill(frame.intro),
    name,
  };
}
