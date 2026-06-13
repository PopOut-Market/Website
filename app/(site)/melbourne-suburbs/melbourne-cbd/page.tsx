import { MelbourneCbdSuburbContent } from "@/components/melbourne-cbd-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";

const PATH = "/melbourne-suburbs/melbourne-cbd";

const LOCALIZED_META: Partial<Record<Locale, { title: string; description: string }>> = {
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
