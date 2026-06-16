import { ComparisonGumtreeContent } from "@/components/comparison-gumtree-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/comparison/gumtree";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
  es: {
    title: "PopOut Market vs Gumtree | App de segunda mano en Melbourne, alternativa a Gumtree",
    description:
      "¿Buscas una alternativa a Gumtree en Melbourne? PopOut Market es la app gratuita de segunda mano: compra y vende muebles, electrodomésticos y artículos usados por barrios, con chat multilingüe traducido y operaciones más seguras. La comparativa ideal para estudiantes.",
  },
  fr: {
    title: "PopOut Market vs Gumtree | Alternative à Gumtree d'occasion à Melbourne",
    description:
      "Vous cherchez une alternative à Gumtree à Melbourne ? PopOut Market est l'application d'occasion gratuite : meubles et électroménager de seconde main, petites annonces par quartier, messagerie multilingue traduite et transactions plus sûres. Le comparatif occasion idéal à Melbourne, parfait pour les étudiants.",
  },
  vi: {
    title: "PopOut Market vs Gumtree｜App mua bán đồ cũ Melbourne thay thế Gumtree",
    description:
      "Tìm app thay thế Gumtree ở Melbourne? PopOut Market là app mua bán đồ cũ miễn phí: thanh lý nội thất cũ, đồ điện cũ theo khu vực, chat đa ngôn ngữ có dịch tự động và giao dịch an toàn. So sánh chợ đồ cũ Melbourne, phù hợp cho du học sinh thanh lý đồ.",
  },
  "zh-Hant": {
    title: "PopOut Market vs Gumtree｜墨爾本二手交易的 Gumtree 替代之選",
    description:
      "在找 Gumtree 的替代選擇嗎？PopOut Market 是免費的墨爾本二手交易 App，覆蓋全墨爾本同城買賣，支援依社區探索二手好物、App 內多語言翻譯聊天，以及更安全的當面交易。比較 PopOut Market 與 Gumtree，也是二手家具電器與旋轉拍賣的替代方案，更適合墨爾本的留學生。",
  },
  ja: {
    title: "PopOut Market vs Gumtree｜メルボルンの中古フリマ Gumtree 代替アプリ",
    description:
      "Gumtree からの乗り換えをお探しの方へ。PopOut Market はメルボルン全域で使える無料の中古フリマアプリです。近くのエリア別に商品を探せて、翻訳付きの多言語チャットや手渡しで安全に直接取引が可能。Gumtree との比較や、留学生にも選ばれる理由がわかります。",
  },
  "zh-Hans": {
    title: "PopOut Market vs Gumtree｜墨尔本二手 Gumtree 替代之选",
    description:
      "在找 Gumtree 替代？PopOut Market 是免费的墨尔本本地二手交易 app，覆盖全墨尔本，支持按社区发现好物、应用内多语言聊天和更安全的当面交易。看 PopOut Market 与 Gumtree 的对比，了解为何它更适合留学生与租房族。",
  },
  ko: {
    title: "PopOut Market vs Gumtree｜멜버른 검트리 대안 앱",
    description:
      "검트리 대안을 찾으세요? PopOut Market은 멜버른 전역에서 쓰는 무료 중고거래 앱으로, 동네별 매물 검색과 앱 내 다국어 채팅, 더 안전한 직거래를 지원합니다. PopOut Market과 검트리를 비교하고 유학생·자취족에게 왜 좋은지 확인하세요.",
  },
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "PopOut vs Gumtree | Feature Comparison",
    description: loc
      ? loc.description
      : "Explore key workflow differences in listing setup, multilingual chat, AI auto-reply, and student verification support.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function ComparisonGumtreePage() {
  return <ComparisonGumtreeContent />;
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
