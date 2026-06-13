import { MelbourneParkvilleSuburbContent } from "@/components/melbourne-parkville-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/parkville";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
    "zh-Hant": {"title":"Parkville 二手交易 | 墨爾本 Parkville 二手家具家電 - PopOut Market","description":"PopOut Market 是墨爾本免費的二手交易 App，在 Parkville 二手專區依在地社群尋寶，輕鬆挑選墨爾本大學周邊好物：二手書桌、單車與宿舍家具家電。墨爾本 Parkville 二手買賣一站搞定，支援多語言聊天翻譯與安全面交，是留學生愛用的 Carousell 替代平台，服務範圍覆蓋全墨爾本。"},
    ja: {"title":"Parkville 中古売買 | メルボルン大学周辺で中古品を地元取引 - PopOut Market","description":"PopOut Marketはメルボルンの無料中古フリマアプリ。Parkvilleやメルボルン大学キャンパス周辺で、中古家具・自転車・引っ越しの不用品を地元で売買できます。多言語チャットの翻訳機能と安全な手渡し取引に対応し、留学生にも人気。メルボルン全域で使えます。"},
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
