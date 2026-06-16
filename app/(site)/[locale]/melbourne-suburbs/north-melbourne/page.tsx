import { MelbourneNorthMelbourneSuburbContent } from "@/components/melbourne-north-melbourne-suburb-content";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/north-melbourne";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
  es: {
    title: "PopOut Market | Segunda mano en North Melbourne",
    description:
      "PopOut Market, la app de segunda mano en North Melbourne: compra y vende muebles, electrodomésticos y otros artículos usados. Gratis para estudiantes en Melbourne.",
  },
  fr: {
    title: "Corrected French SEO title and description for North Melbourne second-hand",
    description:
      '{"title":"Occasion à North Melbourne | Acheter et vendre d\'occasion à Melbourne - PopOut Market","description":"PopOut Market, l\'appli d\'occasion à North Melbourne : meubles, électroménager et petites annonces de seconde main. Plateforme gratuite pour les étudiants de Melbourne."}\n\nCHANGES AND RATIONALE:\n\nTitle:\n- "Occasion North Melbourne" -> "Occasion à North Melbourne": added the preposition "à" so the phrase reads as natural French ("occasion North Melbourne" is ungrammatical run-on).\n- "vendre d\'occasion Melbourne" -> "vendre d\'occasion à Melbourne": added "à" before the city; without it the phrase is broken French.\n- Brand "PopOut Market" kept in title. Length ~62 chars, within typical SERP limits.\n\nDescription:\n- "petites annonces seconde main" -> "petites annonces de seconde main": "de seconde main" is the correct French collocation; the bare "seconde main" as a modifier is incorrect.\n- "Marché gratuit pour étudiants à Melbourne" -> "Plateforme gratuite pour les étudiants de Melbourne": "Marché" duplicated the "Market" brand idea and read oddly; "plateforme" is more natural for an app. Added the article "les" and used "de Melbourne" (students of/from Melbourne) which is more idiomatic than "à Melbourne" here. Length ~150 chars, within SERP limits.\n- No keyword stuffing; "occasion" and "seconde main" appear naturally and are accurate synonyms. Accent on "l\'appli" and "électroménager" correct.',
  },
  vi: {
    title: "Đồ cũ North Melbourne | Mua bán đồ second-hand Melbourne - PopOut Market",
    description:
      "PopOut Market - ứng dụng mua bán đồ cũ tại North Melbourne, Melbourne: thanh lý nội thất, đồ điện tử, đồ du học sinh. Chợ đồ second-hand miễn phí, hỗ trợ chat dịch đa ngôn ngữ.",
  },
  "zh-Hant": {
    title: "North Melbourne 二手交易 | 墨爾本 North Melbourne 二手買賣 - PopOut Market",
    description:
      "在 PopOut Market 輕鬆買賣 North Melbourne 的二手家具與電器。這款免費的墨爾本二手 App 可依在地社區瀏覽身邊的中古好物，覆蓋全墨爾本，支援多語言聊天翻譯與更安心的當面交易，是旋轉拍賣（Carousell）的替代平台，深受留學生、租屋族與搬家族喜愛。",
  },
  ja: {
    title: "North Melbourne 中古取引 | メルボルンの中古売買アプリ - PopOut Market",
    description:
      "PopOut MarketならNorth Melbourneの中古家具や不用品を手軽に売買。地域ごとに地元の中古が探せる無料のフリマアプリで、メルボルン全域に対応。多言語チャットの翻訳機能と安心の手渡し取引で、留学生や引っ越しの方にもぴったりです。",
  },
  "zh-Hans": {
    title: "North Melbourne 二手交易 | 墨尔本 North Melbourne 二手买卖 - PopOut Market",
    description:
      "在 PopOut Market 轻松买卖 North Melbourne 的二手家具与生活用品。这款免费 App 按社区浏览身边的二手好物，覆盖全墨尔本，支持多语言聊天，并提供更安心的当面交易流程，深受留学生、租房族与搬家人群喜爱。",
  },
  ko: {
    title: "North Melbourne 중고거래 | 멜버른 North Melbourne 중고 매물 - PopOut Market",
    description:
      "PopOut Market에서 North Melbourne의 중고 가구와 생활용품을 사고팔아 보세요. 동네별로 주변 중고 매물을 찾는 무료 앱으로, 멜버른 전역을 지원하며 다국어 채팅과 안전한 대면 거래 방식까지 갖춰 유학생과 자취생, 이사하는 분들에게 딱이에요.",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const loc = LOCALIZED_META[locale];
  return {
    title: loc
      ? { absolute: loc.title }
      : "North Melbourne Second-Hand: Student Living & Apartment Essentials",
    description: loc
      ? loc.description
      : "Find affordable second-hand furniture, appliances, and daily essentials in North Melbourne. Ideal for students, shared housing, and budget-conscious living.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default async function NorthMelbourneSuburbPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Home", path: "/" },
          { name: "Melbourne suburbs", path: "/melbourne-suburbs" },
          { name: "North Melbourne", path: "/melbourne-suburbs/north-melbourne" },
        ]}
      />
      <MelbourneNorthMelbourneSuburbContent />
    </>
  );
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
