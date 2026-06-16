import { MelbourneCarltonSuburbContent } from "@/components/melbourne-carlton-suburb-content";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/carlton";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
  es: {
    title:
      "Segunda mano en Carlton | Comprar y vender artículos usados en Carlton, Melbourne - PopOut Market",
    description:
      "¿Buscas artículos de segunda mano en Carlton? PopOut Market es la app gratuita de compraventa de segunda mano en Melbourne: muebles, electrodomésticos y anuncios usados por barrio. Con chat traducido y compras seguras, ideal para estudiantes.",
  },
  fr: {
    title: "Carlton d'occasion | Acheter et vendre d'occasion à Carlton, Melbourne - PopOut Market",
    description:
      "Vous cherchez de l'occasion à Carlton ? PopOut Market est l'application gratuite de seconde main à Melbourne : meubles, électroménager et petites annonces par quartier. Messagerie traduite en plusieurs langues et rencontres en personne plus sûres, idéal pour les étudiants.",
  },
  vi: {
    title: "Đồ cũ Carlton | Mua bán đồ cũ ở Carlton, Melbourne - PopOut Market",
    description:
      "Tìm đồ cũ ở Carlton? PopOut Market là app mua bán đồ cũ Melbourne miễn phí theo khu vực: nội thất, đồ điện cũ, du học sinh thanh lý. Chat đa ngôn ngữ, gặp mặt an toàn.",
  },
  "zh-Hant": {
    title: "Carlton 二手交易 | 墨爾本 Carlton 二手家具電器交易平台 - PopOut Market",
    description:
      "在 Carlton 找二手？PopOut Market 是覆蓋全墨爾本的免費本地二手 App，可按社區探索 Carlton 的二手家具、電器與學習用品。墨爾本二手買賣、二手交易一站搞定，多語言聊天翻譯讓墨爾本 Carlton 的二手約見面交易更安心，是旋轉拍賣（Carousell）的好替代，深受留學生與租屋族喜愛。",
  },
  ja: {
    title: "Carlton 中古品 | メルボルン Carlton 周辺の中古売買アプリ - PopOut Market",
    description:
      "Carlton で中古品をお探しなら PopOut Market。メルボルン全域で使える無料の地元フリマアプリで、Carlton 周辺の中古家具・自転車・学用品を地域ごとに見つけられます。多言語チャット翻訳付きで、対面の手渡し取引も安心。留学生や引越し中の方にも人気です。",
  },
  "zh-Hans": {
    title: "Carlton 二手交易 | 墨尔本 Carlton 附近二手好物 - PopOut Market",
    description:
      "在 Carlton 找二手好物？PopOut Market 是覆盖全墨尔本的免费同城二手 App，按社区发现 Carlton 二手家具、自行车与学习用品，支持多语言聊天，约见面交易更安心，深受留学生与租房族喜爱。",
  },
  ko: {
    title: "Carlton 중고거래 | 멜버른 Carlton 근처 중고 - PopOut Market",
    description:
      "Carlton 중고 찾으세요? PopOut Market은 멜버른 전역에서 쓰는 무료 동네 중고거래 앱입니다. 동네 기반으로 Carlton 근처 중고 가구와 자전거를 찾고, 다국어 채팅으로 더 안전하게 직거래하세요. 유학생과 자취생에게 인기.",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const loc = LOCALIZED_META[locale];
  return {
    title: loc
      ? { absolute: loc.title }
      : "Carlton Student Second-Hand Melbourne: Furniture, Bikes & Study Essentials",
    description: loc
      ? loc.description
      : "Looking for student-friendly second-hand deals in Carlton? Discover affordable desks, chairs, bikes, and home essentials near UniMelb and central Melbourne campuses.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default async function CarltonSuburbPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Home", path: "/" },
          { name: "Melbourne suburbs", path: "/melbourne-suburbs" },
          { name: "Carlton", path: "/melbourne-suburbs/carlton" },
        ]}
      />
      <MelbourneCarltonSuburbContent />
    </>
  );
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
