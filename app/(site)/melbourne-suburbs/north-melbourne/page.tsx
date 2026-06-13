import { MelbourneNorthMelbourneSuburbContent } from "@/components/melbourne-north-melbourne-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/north-melbourne";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
    ja: {"title":"North Melbourne 中古取引 | メルボルンの中古売買アプリ - PopOut Market","description":"PopOut MarketならNorth Melbourneの中古家具や不用品を手軽に売買。地域ごとに地元の中古が探せる無料のフリマアプリで、メルボルン全域に対応。多言語チャットの翻訳機能と安心の手渡し取引で、留学生や引っ越しの方にもぴったりです。"},
  "zh-Hans": { title: "North Melbourne 二手交易 | 墨尔本 North Melbourne 二手买卖 - PopOut Market", description: "在 PopOut Market 轻松买卖 North Melbourne 的二手家具与生活用品。这款免费 App 按社区浏览身边的二手好物，覆盖全墨尔本，支持多语言聊天，并提供更安心的当面交易流程，深受留学生、租房族与搬家人群喜爱。" },
  ko: { title: "North Melbourne 중고거래 | 멜버른 North Melbourne 중고 매물 - PopOut Market", description: "PopOut Market에서 North Melbourne의 중고 가구와 생활용품을 사고팔아 보세요. 동네별로 주변 중고 매물을 찾는 무료 앱으로, 멜버른 전역을 지원하며 다국어 채팅과 안전한 대면 거래 방식까지 갖춰 유학생과 자취생, 이사하는 분들에게 딱이에요." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "North Melbourne Second-Hand: Student Living & Apartment Essentials",
    description: loc ? loc.description : "Find affordable second-hand furniture, appliances, and daily essentials in North Melbourne. Ideal for students, shared housing, and budget-conscious living.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function NorthMelbourneSuburbPage() {
  return <MelbourneNorthMelbourneSuburbContent />;
}
