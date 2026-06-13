import { MelbourneCarltonSuburbContent } from "@/components/melbourne-carlton-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/carlton";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
  "zh-Hans": { title: "Carlton 二手交易 | 墨尔本 Carlton 附近二手好物 - PopOut Market", description: "在 Carlton 找二手好物？PopOut Market 是覆盖全墨尔本的免费同城二手 App，按社区发现 Carlton 二手家具、自行车与学习用品，支持多语言聊天，约见面交易更安心，深受留学生与租房族喜爱。" },
  ko: { title: "Carlton 중고거래 | 멜버른 Carlton 근처 중고 - PopOut Market", description: "Carlton 중고 찾으세요? PopOut Market은 멜버른 전역에서 쓰는 무료 동네 중고거래 앱입니다. 동네 기반으로 Carlton 근처 중고 가구와 자전거를 찾고, 다국어 채팅으로 더 안전하게 직거래하세요. 유학생과 자취생에게 인기." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "Carlton Student Second-Hand Melbourne: Furniture, Bikes & Study Essentials",
    description: loc ? loc.description : "Looking for student-friendly second-hand deals in Carlton? Discover affordable desks, chairs, bikes, and home essentials near UniMelb and central Melbourne campuses.",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function CarltonSuburbPage() {
  return <MelbourneCarltonSuburbContent />;
}
