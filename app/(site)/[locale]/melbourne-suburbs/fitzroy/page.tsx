import { MelbourneFitzroySuburbContent } from "@/components/melbourne-fitzroy-suburb-content";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/fitzroy";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
  es: {
    title: "Segunda mano en Fitzroy, Melbourne | PopOut Market",
    description:
      "App gratis para comprar y vender artículos de segunda mano en Fitzroy. Encuentra muebles, electrodomésticos y productos usados cerca de ti en Melbourne.",
  },
  fr: {
    title: "Corrected French SEO metadata for Fitzroy second-hand page",
    description:
      '{"title":"Achat et vente d\'occasion à Fitzroy, Melbourne | PopOut Market","description":"PopOut Market : l\'appli gratuite pour acheter et vendre d\'occasion à Fitzroy. Meubles, électroménager et petites annonces de seconde main à Melbourne."}\n\nNotes on the changes:\n- Title: replaced the keyword-stuffed "Occasion Fitzroy Melbourne | Acheter Vendre d\'Occasion Fitzroy" (which repeated "Fitzroy" and "occasion" and read as a fragmented list) with the natural French phrase "Achat et vente d\'occasion à Fitzroy, Melbourne". Kept the brand "PopOut Market" in the title as required.\n- "Acheter Vendre" was ungrammatical without a conjunction; "Achat et vente" is the idiomatic noun phrase for a title, and the description retains the verb form "acheter et vendre" correctly.\n- Description: changed "appli d\'occasion gratuite" to "l\'appli gratuite pour acheter et vendre d\'occasion" — "appli d\'occasion" wrongly implies a second-hand app rather than an app for second-hand goods. Added the article "l\'" for natural phrasing.\n- "seconde main" kept as is (correct and common French term); "petites annonces" and "électroménager" are accurate, natural terms. No keyword stuffing remains; all claims are accurate.',
  },
  vi: {
    title: "Đồ Cũ Fitzroy | Mua Bán Đồ Cũ Melbourne Fitzroy - PopOut Market",
    description:
      "PopOut Market giúp bạn thanh lý đồ cũ ở Fitzroy: nội thất, đồ điện tử cũ. Chợ mua bán đồ second-hand Melbourne, du học sinh thanh lý dễ dàng.",
  },
  "zh-Hant": {
    title: "Fitzroy 二手交易 | 墨爾本 Fitzroy 二手家具家電買賣 App - PopOut Market",
    description:
      "在免費 App PopOut Market 發掘 Fitzroy 二手好物。按社區瀏覽墨爾本 Fitzroy 的二手家具、二手電器與中古家居用品，用多語言即時翻譯聊天輕鬆溝通，安心約見面交。墨爾本在地二手平台，是留學生、租屋族與搬家人士的首選，更是旋轉拍賣（Carousell）的好替代，讓你在墨爾本 Fitzroy 放心二手買賣。",
  },
  ja: {
    title: "Fitzroy 中古取引 | メルボルン Fitzroy 中古売買アプリ - PopOut Market",
    description:
      "無料アプリPopOut MarketでFitzroyの中古をチェック。メルボルンのフリマアプリとして地元の中古家具や不用品を地域ごとに探せて、多言語チャットと安心の手渡し直接取引に対応。留学生にも人気のメルボルン中古売買アプリです。",
  },
  "zh-Hans": {
    title: "Fitzroy 二手交易 | 墨尔本 Fitzroy 二手家具买卖 - PopOut Market",
    description:
      "在免费 App PopOut Market 上发现 Fitzroy 二手好物。按社区浏览墨尔本 Fitzroy 的二手家具与家居用品，用多语言聊天轻松沟通，安心约见面交，让你在 Fitzroy 附近放心买卖二手物品。",
  },
  ko: {
    title: "Fitzroy 중고거래 | 멜버른 Fitzroy 중고 가구·생활용품 - PopOut Market",
    description:
      "무료 앱 PopOut Market에서 Fitzroy 중고 가구와 생활용품을 찾아보세요. 동네별로 멜버른 Fitzroy 중고 매물을 둘러보고, 다국어 채팅과 안전한 직거래 만남으로 Fitzroy 근처에서 편하게 사고팔 수 있어요.",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const loc = LOCALIZED_META[locale];
  return {
    title: loc
      ? { absolute: loc.title }
      : "Fitzroy Second-Hand: Creative Living, Decor & Apartment Essentials",
    description: loc
      ? loc.description
      : "Discover second-hand home decor, furniture, and practical apartment essentials around Fitzroy. Ideal for creative living, students, and budget-friendly Melbourne lifestyles.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default async function FitzroySuburbPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Home", path: "/" },
          { name: "Melbourne suburbs", path: "/melbourne-suburbs" },
          { name: "Fitzroy", path: "/melbourne-suburbs/fitzroy" },
        ]}
      />
      <MelbourneFitzroySuburbContent />
    </>
  );
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
