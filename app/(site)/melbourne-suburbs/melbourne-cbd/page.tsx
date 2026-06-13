import { MelbourneCbdSuburbContent } from "@/components/melbourne-cbd-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/melbourne-cbd";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
    "es": {"title":"Segunda mano en Melbourne CBD | PopOut Market","description":"Compra y vende artículos de segunda mano en Melbourne CBD con PopOut Market, la app gratuita. Muebles, electrodomésticos y otros productos usados cerca de ti."},
    "fr": {"title":"Corrected French SEO object for Melbourne CBD second-hand","description":"{\"title\":\"Occasion à Melbourne CBD | PopOut Market, l'appli de seconde main\",\"description\":\"Achetez et vendez d'occasion à Melbourne CBD sur PopOut Market, l'appli gratuite. Meubles, électroménager et petites annonces de seconde main près de chez vous.\"}\n\nNotes: In the original title, \"PopOut Market appli d'occasion Melbourne\" was clumsy stuffing (juxtaposed nouns with no link word, plus \"Melbourne\" repeated). Replaced with the natural appositive \"PopOut Market, l'appli de seconde main\", which keeps the brand in the title, reads idiomatically, and removes the redundant second \"Melbourne\". The description was already natural and accurate; only fixed \"seconde main\" to the correct form \"de seconde main\" (an adjectival phrase requires the preposition in French)."},
    "vi": {"title":"Mua bán đồ cũ Melbourne CBD | PopOut Market app đồ cũ Melbourne","description":"Mua bán đồ cũ Melbourne CBD trên PopOut Market, app đồ cũ Melbourne miễn phí. Thanh lý nội thất, đồ điện cũ, đồ second-hand quanh khu, dịch chat đa ngôn ngữ, giao dịch an toàn cho du học sinh."},
    "zh-Hant": {"title":"Melbourne CBD 二手交易 | PopOut Market 墨爾本二手平台","description":"在墨爾本 Melbourne CBD 買賣二手家具與電器，輕鬆找到同城二手好物。PopOut Market 是墨爾本免費二手 App，可依社區探索中古商品，並支援多語言翻譯聊天，是旋轉拍賣（Carousell）的替代選擇，特別適合留學生與搬家族安全地當面完成二手交易。"},
    ja: {"title":"Melbourne CBDの中古売買 | PopOut Market メルボルン中古アプリ","description":"Melbourne CBDで家具やキッチン用品、引っ越し用品を中古で売買。PopOut Marketはメルボルン全域で使える無料のフリマアプリで、地元の中古品をご近所から探せます。翻訳機能付きの多言語チャットを備え、留学生や引っ越し中の方も安心して手渡しの直接取引ができます。"},
  "zh-Hans": { title: "Melbourne CBD 二手交易 | PopOut Market 墨尔本二手平台", description: "在 Melbourne CBD 买卖二手家具、厨具与公寓用品。PopOut Market 是面向墨尔本的免费二手 app，按社区发现身边好物，支持多语言聊天，帮你轻松找到附近二手并安全当面交易。" },
  ko: { title: "Melbourne CBD 중고거래 | PopOut Market 멜버른 중고마켓", description: "Melbourne CBD에서 중고 가구와 주방용품, 아파트 생활용품을 사고파세요. PopOut Market은 멜버른 전역에서 쓰는 무료 중고 앱으로, 동네 기반 탐색과 다국어 채팅, 안전한 직거래를 지원합니다." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "Melbourne CBD Second-Hand Market: City Living Furniture & Essentials",
    description: loc ? loc.description : "Set up city life in Melbourne CBD with affordable second-hand furniture, kitchen gear, and apartment essentials. Great for students, WHV workers, and short-term renters.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function MelbourneCbdSuburbPage() {
  return <MelbourneCbdSuburbContent />;
}
