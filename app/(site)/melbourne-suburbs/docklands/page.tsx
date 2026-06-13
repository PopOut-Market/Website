import { MelbourneDocklandsSuburbContent } from "@/components/melbourne-docklands-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/docklands";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
    ja: {"title":"Docklands の中古売買 | メルボルンのフリマアプリ - PopOut Market","description":"PopOut Marketはメルボルン全域で使える無料のフリマアプリ。Docklandsなど地元エリアで中古の家具や家電を手軽に売買でき、多言語チャットの翻訳機能でやり取りも安心です。安全な手渡し取引にも対応し、留学生や引っ越しをする方にぴったり。"},
  "zh-Hans": { title: "Docklands 二手交易 | 墨尔本 Docklands 附近二手家具与电器 - PopOut Market", description: "PopOut Market 是覆盖全墨尔本的免费二手交易 App。在 Docklands 附近按社区轻松买卖二手家具与电器，支持多语言聊天沟通，安排更安心的当面交易。专为留学生、租客与公寓搬家人士打造。" },
  ko: { title: "Docklands 중고거래 | 멜버른 Docklands 근처 중고 가구·가전 - PopOut Market", description: "PopOut Market은 멜버른 전역에서 쓸 수 있는 무료 중고거래 앱입니다. Docklands 근처에서 동네 기반으로 중고 가구와 가전을 사고팔고, 다국어 채팅으로 소통하며 더 안전하게 직거래하세요. 유학생과 세입자, 이사하는 분께 딱 맞습니다." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "Second-Hand Furniture & Appliances for Docklands Apartments",
    description: loc ? loc.description : "Moving to Docklands? Find affordable second-hand furniture & kitchen appliances for your apartment. Perfect for working holiday visa holders & short-term stays in Melbourne. Buy & sell locally!",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function DocklandsSuburbPage() {
  return <MelbourneDocklandsSuburbContent />;
}
