import { formatMonth } from "@/lib/locale-format";
import type { Locale } from "@/lib/site-i18n";

/**
 * Every sentence on the site about a feature the app does not ship yet.
 *
 * CLAUDE.md rule 1 says never describe a feature the app does not ship. On
 * 2026-10-24 Eric allowed one narrow exception, and this file is it: a feature
 * that exists in a staging build, or that the production app already shows as
 * coming, may get ONE dated sentence saying it is not in the app yet. No
 * recruitment pitch, no sign-up invitation, no second sentence. The conditions
 * are in CLAUDE.md; the short version is no launch date, no named shop, partner
 * or building, no price, no pre-launch count, never "free forever", and never in
 * a title, meta description, H1, JSON-LD, the sitemap or a comparison page.
 *
 * Enforced in two places. `npm run check:claims`: announcement phrases ("coming
 * soon", "即将推出", "곧 출시"…) appear in no other file; this module is imported
 * (or re-exported) only by the page bodies listed in scripts/check-claims.mjs;
 * each copy string is one sentence; no entry is past its `reviewBy`.
 * `npm run build` then runs scripts/check-upcoming-output.mjs, which fails if
 * any of these sentences reached a page's <head>, an H1 or JSON-LD.
 *
 * On launch day, rewrite the line as a description of the shipped feature (and
 * move it out of here) or delete it.
 */

type UpcomingLocale = "en" | "zh-Hans" | "zh-Hant" | "ko";

export type UpcomingId = "shop-offers" | "merchants" | "housing";

type Upcoming = {
  /** What shows the feature exists: a staging build, a spec, or the app's own words. */
  evidence: string;
  /** Who wrote the sentence, and who approved it. */
  owner: string;
  /** The month the sentence is true as of, rendered into {asOf}. */
  asOf: { year: number; month: number };
  /** check:claims fails after this date until someone re-checks the line. */
  reviewBy: string;
  /** One sentence, written by hand. ja, vi, fr and es show nothing. */
  copy: Record<UpcomingLocale, string>;
};

export const UPCOMING: Record<UpcomingId, Upcoming> = {
  "shop-offers": {
    evidence:
      "The production map panel shows `map_empty_coupons` (app-v2 src/i18n/locales/*.ts). Shop posts left the map on 2026-10-03 (app-v2 docs/features/shop-guide.md).",
    owner: "Claude, approved by Eric 2026-10-24",
    asOf: { year: 2026, month: 10 },
    reviewBy: "2026-12-31",
    copy: {
      en: "As of {asOf}, shops can’t post offers on the map in the app yet, and the map says “Offers from local shops are on the way”.",
      "zh-Hans":
        "截至{asOf}，店铺还不能在 App 地图上发优惠，地图上写的是「附近店铺的各种优惠正在准备中」。",
      "zh-Hant":
        "截至{asOf}，店家還不能在 App 地圖上發布優惠，地圖上寫的是「附近店家的各種優惠準備中」。",
      ko: "{asOf} 기준, 가게는 아직 앱 지도에 혜택을 올릴 수 없고, 지도에는 '동네 가게의 다양한 혜택을 준비하고 있어요'라고 나옵니다.",
    },
  },
  merchants: {
    evidence:
      "Shop registration runs in staging only; walked through on a test iPhone on 2026-10-23, intro screen “Shop registration is free!” (app-v2 docs/features/shop-ownership.md on origin/main). Not in production 3.0.1. The founder's plan proposes per-redemption fees later, hence “free while we launch”.",
    owner: "Claude, approved by Eric 2026-10-24",
    asOf: { year: 2026, month: 10 },
    reviewBy: "2026-12-31",
    copy: {
      en: "As of {asOf}, Melbourne shop owners can’t yet claim their shop on the map in the app and keep its details up to date, but we’re testing a way to do that, free while we launch.",
      "zh-Hans":
        "截至{asOf}，墨尔本的店主还不能在 App 地图上认领自己的店、自己更新店铺信息，我们正在测试这个功能，上线期间免费。",
      "zh-Hant":
        "截至{asOf}，墨爾本的店主還不能在 App 地圖上認領自己的店、自行更新店家資訊，我們正在測試這項功能，推出期間免費。",
      ko: "{asOf} 기준, 멜버른의 가게 주인은 아직 앱 지도에서 자기 가게를 등록하고 정보를 고칠 수 없으며, 출시 기간에는 무료로 쓸 수 있도록 이 기능을 시험하고 있습니다.",
    },
  },
  housing: {
    evidence:
      "Production Discover shows Housing as an English “Coming soon!” page (app-v2 docs/features/discover-map-migration.md, 2026-09-23). Listings exist only in staging builds (docs/features/rental-room-plans.md on feat/rental-preview; docs/features/housing.md on origin/main). The full Housing page waits on its own branch until launch.",
    owner: "Claude, approved by Eric 2026-10-24",
    asOf: { year: 2026, month: 10 },
    reviewBy: "2026-12-31",
    copy: {
      en: "As of {asOf}, the Housing section in the app still shows a “Coming soon!” page while we build a way to find a room or a whole place nearby and to list your own, and the details may change.",
      "zh-Hans":
        "截至{asOf}，App 里的「找房」还是「Coming soon!」页面，我们正在开发找附近单间或整套房子、自己发布房源的功能，细节可能会变。",
      "zh-Hant":
        "截至{asOf}，App 裡的「找房」還是「Coming soon!」頁面，我們正在開發找附近雅房或整層住家、自己刊登房源的功能，細節可能調整。",
      ko: "{asOf} 기준, 앱의 '집 구하기'는 아직 'Coming soon!' 페이지이며, 근처의 방이나 집 전체를 찾고 직접 올리는 기능을 만들고 있고 세부 내용은 바뀔 수 있습니다.",
    },
  },
};

const HEADING: Record<UpcomingLocale, string> = {
  en: "What we’re building",
  "zh-Hans": "我们正在做的",
  "zh-Hant": "我們正在做的",
  ko: "지금 만들고 있는 것",
};

function isUpcomingLocale(locale: Locale): locale is UpcomingLocale {
  return locale === "en" || locale === "zh-Hans" || locale === "zh-Hant" || locale === "ko";
}

/** The sentence for this locale, or null where it is not shown. */
export function upcomingLine(id: UpcomingId, locale: Locale): string | null {
  if (!isUpcomingLocale(locale)) return null;
  const entry = UPCOMING[id];
  return entry.copy[locale].replaceAll(
    "{asOf}",
    formatMonth(entry.asOf.year, entry.asOf.month, locale),
  );
}

/** Heading for a block of upcoming lines, or null where none are shown. */
export function upcomingHeading(locale: Locale): string | null {
  return isUpcomingLocale(locale) ? HEADING[locale] : null;
}
