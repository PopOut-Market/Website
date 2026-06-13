import { MelbourneParkvilleSuburbContent } from "@/components/melbourne-parkville-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/parkville";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
  "zh-Hans": { title: "Parkville 二手交易 | 墨尔本 Parkville 二手家具 - PopOut Market", description: "PopOut Market 是墨尔本免费二手交易 App。在 Parkville 二手专区按社区淘墨尔本大学校园好物：二手书桌、自行车、宿舍二手家具，搜 Parkville 附近二手更方便，支持多语言聊天与安全面交，覆盖全墨尔本。" },
  ko: { title: "Parkville 중고거래 | 멜버른 Parkville 중고 - PopOut Market", description: "PopOut Market은 멜버른 무료 중고거래 앱입니다. Parkville 중고로 멜버른대 주변 책상, 자전거, 기숙사 가구를 동네별로 찾고, Parkville 근처 중고를 다국어 채팅과 안전한 직거래로 거래하세요. 멜버른 전역 지원." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const loc = LOCALIZED_META[locale];
  return {
    title: loc ? { absolute: loc.title } : "Parkville Second-Hand: UniMelb Campus Essentials & Dorm Furniture",
    description: loc ? loc.description : "UniMelb Parkville & UniLodge Lincoln House students: Find affordable second-hand study desks, bikes, kitchenware & dorm furniture. Get campus essentials for less!",
    alternates: {
      canonical: toLocalePath(PATH, locale),
      languages: localizedAlternates(PATH),
    },
  };
}

export default function ParkvilleSuburbPage() {
  return <MelbourneParkvilleSuburbContent />;
}
