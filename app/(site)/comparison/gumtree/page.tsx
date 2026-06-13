import { ComparisonGumtreeContent } from "@/components/comparison-gumtree-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/comparison/gumtree";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
    ja: {"title":"PopOut Market vs Gumtree｜メルボルンの中古フリマ Gumtree 代替アプリ","description":"Gumtree からの乗り換えをお探しの方へ。PopOut Market はメルボルン全域で使える無料の中古フリマアプリです。近くのエリア別に商品を探せて、翻訳付きの多言語チャットや手渡しで安全に直接取引が可能。Gumtree との比較や、留学生にも選ばれる理由がわかります。"},
  "zh-Hans": { title: "PopOut Market vs Gumtree｜墨尔本二手 Gumtree 替代之选", description: "在找 Gumtree 替代？PopOut Market 是免费的墨尔本本地二手交易 app，覆盖全墨尔本，支持按社区发现好物、应用内多语言聊天和更安全的当面交易。看 PopOut Market 与 Gumtree 的对比，了解为何它更适合留学生与租房族。" },
  ko: { title: "PopOut Market vs Gumtree｜멜버른 검트리 대안 앱", description: "검트리 대안을 찾으세요? PopOut Market은 멜버른 전역에서 쓰는 무료 중고거래 앱으로, 동네별 매물 검색과 앱 내 다국어 채팅, 더 안전한 직거래를 지원합니다. PopOut Market과 검트리를 비교하고 유학생·자취족에게 왜 좋은지 확인하세요." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "PopOut vs Gumtree | Feature Comparison",
    description: loc ? loc.description : "Explore key workflow differences in listing setup, multilingual chat, AI auto-reply, and student verification support.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function ComparisonGumtreePage() {
  return <ComparisonGumtreeContent />;
}
