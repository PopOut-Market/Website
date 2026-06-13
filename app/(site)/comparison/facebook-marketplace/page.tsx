import { ComparisonFacebookMarketplaceContent } from "@/components/comparison-facebook-marketplace-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/comparison/facebook-marketplace";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
    "es": {"title":"PopOut Market vs Facebook Marketplace | App de segunda mano en Melbourne","description":"Alternativa a Facebook Marketplace: PopOut Market es la app gratis para comprar y vender de segunda mano en Melbourne. Muebles, electrodomésticos y artículos usados, chat multilingüe y transacciones seguras. Comparativa pensada para estudiantes."},
    "fr": {"title":"PopOut Market vs Facebook Marketplace | App d'occasion à Melbourne","description":"Alternative à Facebook Marketplace : PopOut Market, l'application d'occasion gratuite à Melbourne. Comparez les annonces : meubles et électroménager, chat multilingue et échanges en toute sécurité."},
    "vi": {"title":"PopOut Market vs Facebook Marketplace | App đồ cũ Melbourne","description":"Đang tìm app thay Facebook Marketplace? PopOut Market là chợ đồ cũ miễn phí tại Melbourne: mua bán đồ cũ, nội thất, đồ điện tử, chat đa ngôn ngữ và giao dịch an toàn. So sánh ngay!"},
    "zh-Hant": {"title":"PopOut Market vs Facebook Marketplace｜墨爾本二手交易 App 比較","description":"正在尋找 Facebook Marketplace 的替代方案？PopOut Market 是墨爾本的免費二手交易 App，支援同城分區尋寶、App 內多語言聊天自動翻譯，以及更安全的當面交易，是旋轉拍賣（Carousell）的理想替代之選。墨爾本二手交易、二手拍賣、二手買賣、二手家具與電器一站搞定，深受留學生與租屋族歡迎。"},
    ja: {"title":"PopOut Market vs Facebook Marketplace | メルボルン 中古アプリ 比較","description":"Facebook Marketplace の代わりをお探しの方へ。PopOut Market はメルボルン全域で使える無料のフリマアプリです。近所のサバーブごとに中古品を探せ、アプリ内の多言語チャット（自動翻訳付き）と安全な対面取引に対応。留学生や引越しの不用品売買にも人気の地域密着型マーケットです。"},
  "zh-Hans": { title: "PopOut Market vs Facebook Marketplace | 墨尔本二手 App 对比", description: "在找 Facebook Marketplace 的替代品？PopOut Market 是墨尔本免费二手 App，支持按社区找货、应用内多语言聊天和更安全的当面交易流程，覆盖全墨尔本，深受留学生、租房族和搬家人群喜爱。" },
  ko: { title: "PopOut Market vs 페이스북 마켓플레이스 | 멜버른 중고 비교", description: "페이스북 마켓플레이스 대안을 찾으세요? PopOut Market은 멜버른 무료 중고 앱으로 동네별 검색, 앱 내 다국어 채팅, 더 안전한 직거래를 지원합니다. 멜버른 전역에서 유학생과 자취생에게 인기 있어요." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "PopOut vs Facebook Marketplace | Feature Comparison",
    description: loc ? loc.description : "A friendly feature comparison focused on faster listing, multilingual communication, safer meetup flow, and student-friendly trust tools in Melbourne.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function ComparisonFacebookMarketplacePage() {
  return <ComparisonFacebookMarketplaceContent />;
}
