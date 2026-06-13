import { MelbourneSouthbankSuburbContent } from "@/components/melbourne-southbank-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/southbank";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
    "fr": {"title":"Achat et vente d'occasion à Southbank, Melbourne | PopOut Market","description":"Achetez et vendez d'occasion à Southbank, Melbourne sur PopOut Market : appli gratuite de petites annonces, meubles et électroménager de seconde main, messagerie traduite et échanges en toute sécurité."},
    "vi": {"title":"Đồ cũ Southbank | Mua bán đồ cũ Melbourne Southbank - PopOut Market","description":"Mua bán đồ cũ tại Southbank, Melbourne trên PopOut Market: app đồ cũ miễn phí, chợ đồ cũ theo khu vực, nội thất cũ, đồ điện tử cũ, chat đa ngôn ngữ có dịch tự động và giao dịch an toàn."},
    "zh-Hant": {"title":"Southbank 二手交易 | 墨爾本 Southbank 二手家具與公寓好物 App - PopOut Market","description":"在墨爾本 Southbank 二手買賣家具、電器與公寓閒置好物,就用 PopOut Market。免費的墨爾本二手 App 與同城二手平台,可按社區瀏覽 Southbank 附近的中古好物,支援多語言聊天翻譯與更安全的當面交易,是旋轉拍賣(Carousell)的替代選擇,服務全墨爾本,留學生與租屋族都愛用。"},
    ja: {"title":"Southbank 中古取引 | メルボルン Southbank の中古家具・生活用品アプリ - PopOut Market","description":"メルボルン Southbank の中古売買なら PopOut Market。無料の地域密着型フリマアプリで、地元の家具や不用品を近所から探せます。多言語チャットの翻訳機能と、安心して直接会って受け渡しできる仕組みに対応。メルボルン全域で使え、留学生や引っ越し中の方にも人気です。"},
  "zh-Hans": { title: "Southbank 二手交易 | 墨尔本 Southbank 二手家具与生活好物 - PopOut Market", description: "在墨尔本 Southbank 二手买卖家具、生活好物与公寓闲置。PopOut Market 是免费应用,按社区浏览 Southbank 附近的二手好物,支持多语言聊天与更安全的当面交易,服务全墨尔本,留学生与租房族都爱用。" },
  ko: { title: "Southbank 중고거래 | 멜버른 Southbank 중고 가구·생활용품 - PopOut Market", description: "멜버른 Southbank 중고거래는 PopOut Market에서. 무료 앱으로 동네별 Southbank 근처 중고 가구와 생활용품을 사고팔고, 다국어 채팅과 더 안전한 직거래까지 지원합니다. 멜버른 전역에서, 유학생과 자취생에게 딱이에요." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "Southbank Melbourne Second-Hand Market: Furniture, Art Supplies & Studio Essentials",
    description: loc ? loc.description : "Discover second-hand furniture, art supplies & studio essentials in Southbank, Melbourne. Perfect for UniLodge students & compact apartments. Buy, sell, save!",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function SouthbankSuburbPage() {
  return <MelbourneSouthbankSuburbContent />;
}
