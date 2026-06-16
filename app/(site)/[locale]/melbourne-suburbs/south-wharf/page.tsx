import { MelbourneSouthWharfSuburbContent } from "@/components/melbourne-south-wharf-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/south-wharf";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
  es: {
    title: "South Wharf de segunda mano | PopOut Market - compra y vende en Melbourne",
    description:
      "Compra y vende artículos de segunda mano en South Wharf con PopOut Market: muebles, electrodomésticos y objetos usados. App de segunda mano en Melbourne con chat traducido.",
  },
  fr: {
    title: "South Wharf occasion | PopOut Market - acheter et vendre à Melbourne",
    description:
      "Achetez et vendez d'occasion à South Wharf sur PopOut Market : meubles, électroménager et petites annonces à Melbourne. Appli de seconde main avec chat traduit.",
  },
  vi: {
    title: "Đồ cũ South Wharf | PopOut Market - mua bán đồ second-hand Melbourne",
    description:
      "Mua bán đồ cũ tại South Wharf trên PopOut Market: nội thất, đồ điện tử, đồ du học sinh thanh lý. Chợ second-hand Melbourne theo khu vực, có chat tích hợp dịch đa ngôn ngữ.",
  },
  "zh-Hant": {
    title: "South Wharf 二手交易 | PopOut Market 墨爾本免費二手 App",
    description:
      "PopOut Market 是墨爾本免費二手平台，在 South Wharf 買賣二手家具、電器與公寓家居都輕鬆方便。可按社區瀏覽整個墨爾本的同城二手與中古好物，內建多語言翻譯聊天，支援安全的當面交易，是旋轉拍賣（Carousell）的理想替代，深受留學生與搬家族喜愛。",
  },
  ja: {
    title: "South Wharf 中古売買 | PopOut Market メルボルンの無料フリマアプリ",
    description:
      "PopOut Marketなら、メルボルンのSouth Wharf周辺で中古の家具や不用品を地域ごとに探して売買できます。多言語チャットの翻訳機能と安心の対面受け渡しで、留学生や引っ越し中の方にも使いやすい無料フリマアプリです。",
  },
  "zh-Hans": {
    title: "South Wharf 二手交易 | PopOut Market 墨尔本本地二手",
    description:
      "在 PopOut Market 选购 South Wharf 二手好物：附近的二手家具、家电与公寓家居都能轻松买卖。免费 App 按社区浏览整个墨尔本的二手物品，支持多语言聊天，让当面交易更安全省心。",
  },
  ko: {
    title: "South Wharf 중고거래 | PopOut Market 멜버른 중고",
    description:
      "PopOut Market에서 South Wharf 중고 매물을 만나보세요. 멜버른 전역의 중고 가구와 생활용품을 동네별로 둘러보고, 무료 앱으로 가까운 매물을 거래할 수 있습니다. 다국어 채팅과 안전한 직거래를 지원합니다.",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const loc = LOCALIZED_META[locale];
  return {
    title: loc
      ? { absolute: loc.title }
      : "South Wharf Second-Hand: Apartment Furniture & Home Essentials",
    description: loc
      ? loc.description
      : "Shop affordable second-hand furniture, appliances, and compact home essentials in South Wharf. Great for apartment setups and short-term stays in Melbourne.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function SouthWharfSuburbPage() {
  return <MelbourneSouthWharfSuburbContent />;
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
