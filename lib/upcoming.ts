import { formatMonth } from "@/lib/locale-format";
import { FOOTER_CONTACT_EMAIL } from "@/lib/site-config";
import type { Locale } from "@/lib/site-i18n";

/**
 * Every sentence on the site about a feature the app does not ship yet.
 *
 * CLAUDE.md rule 1 says never describe a feature the app does not ship. On
 * 2026-10-24 Eric allowed one narrow exception, and this file is it: a feature
 * that exists in a staging build, or that the production app already shows as
 * coming, may get one dated sentence saying it is not in the app yet. The
 * conditions are in CLAUDE.md; the short version is no launch date, no named
 * shop, partner or building, no price, no pre-launch count, never "free
 * forever", and never in a title, meta description, H1, JSON-LD, the sitemap or
 * a comparison page.
 *
 * `npm run check:claims` enforces the shape: announcement phrases ("coming
 * soon", "即将推出", "곧 출시"…) appear in no other file; this module is imported
 * only by the page bodies listed in scripts/check-claims.mjs; and no entry is
 * past its `reviewBy`. On launch day, rewrite the line as a description of the
 * shipped feature (and move it out of here) or delete it.
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
  /** Written by hand. ja, vi, fr and es show nothing. */
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
      en: "As of {asOf}, the map in the app says “Offers from local shops are on the way”. Shops can’t post offers there yet.",
      "zh-Hans":
        "截至{asOf}，App 地图上写着「附近店铺的各种优惠正在准备中」，店铺现在还不能在地图上发优惠。",
      "zh-Hant":
        "截至{asOf}，App 地圖上寫著「附近店家的各種優惠準備中」，店家目前還不能在地圖上發布優惠。",
      ko: "{asOf} 기준, 앱 지도에는 '동네 가게의 다양한 혜택을 준비하고 있어요'라고 나옵니다. 가게가 지도에 혜택을 올리는 기능은 아직 없습니다.",
    },
  },
  merchants: {
    evidence:
      "Shop registration runs in staging only; walked through on a test iPhone on 2026-10-23, intro screen “Shop registration is free!” (app-v2 docs/features/shop-ownership.md on origin/main). Not in production 3.0.1.",
    owner: "Claude, approved by Eric 2026-10-24",
    asOf: { year: 2026, month: 10 },
    reviewBy: "2026-12-31",
    copy: {
      en: "Run a shop in Melbourne? As of {asOf} we’re testing a way for owners to put their shop on the map, or claim it if it’s already there, and keep its hours, phone number and photo up to date, free while we launch. It isn’t in the app yet; email {email} if you’d like to hear when it opens.",
      "zh-Hans":
        "在墨尔本开店？截至{asOf}，我们正在测试让店主把自己的店放上地图（已经在地图上的可以直接认领），自己更新营业时间、电话和照片，上线期间免费。这个功能还没进 App；想在开放时收到通知，请发邮件到 {email}。",
      "zh-Hant":
        "在墨爾本開店嗎？截至{asOf}，我們正在測試讓店主把自己的店放上地圖（已經在地圖上的可以直接認領），自行更新營業時間、電話和照片，推出期間免費。這項功能還沒放進 App；想在開放時收到通知，請寄信到 {email}。",
      ko: "멜버른에서 가게를 하시나요? {asOf} 기준으로, 가게 주인이 지도에 자기 가게를 올리거나 이미 있는 가게를 등록하고 영업시간·전화번호·사진을 직접 고칠 수 있는 기능을 시험하고 있습니다. 출시 기간에는 무료이며, 아직 앱에는 없습니다. 열리면 알림을 받고 싶으시면 {email}로 메일을 보내 주세요.",
    },
  },
  housing: {
    evidence:
      "Production Discover shows Housing as an English “Coming soon!” page (app-v2 docs/features/discover-map-migration.md, 2026-09-23). Listings exist only in staging builds (docs/features/rental-room-plans.md on feat/rental-preview; docs/features/housing.md on origin/main). The full Housing page waits on its own branch until launch.",
    owner: "Claude, approved by Eric 2026-10-24",
    asOf: { year: 2026, month: 10 },
    reviewBy: "2026-12-31",
    copy: {
      en: "As of {asOf}, the Housing section in the app shows a “Coming soon!” page. We’re building it so that renters can find a room or a whole place nearby, and people with a room to spare can list it themselves. It isn’t open yet, and the details may change.",
      "zh-Hans":
        "截至{asOf}，App 里的「找房」还是一个写着「Coming soon!」的页面。我们正在开发：想租房的人能找到附近的单间或整套房子，有空房的人能自己发布。现在还没开放，细节也可能会变。",
      "zh-Hant":
        "截至{asOf}，App 裡的「找房」還是一個寫著「Coming soon!」的頁面。我們正在開發：想租屋的人能找到附近的雅房或整層住家，有空房的人能自己刊登。目前還沒開放，細節也可能調整。",
      ko: "{asOf} 기준으로 앱의 '집 구하기'는 아직 'Coming soon!' 페이지입니다. 집을 구하는 사람은 근처의 방이나 집 전체를 찾고, 빈방이 있는 사람은 직접 올릴 수 있도록 만들고 있습니다. 아직 열리지 않았고, 세부 내용은 바뀔 수 있습니다.",
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
  return entry.copy[locale]
    .replaceAll("{asOf}", formatMonth(entry.asOf.year, entry.asOf.month, locale))
    .replaceAll("{email}", FOOTER_CONTACT_EMAIL);
}

/** Heading for a block of upcoming lines, or null where none are shown. */
export function upcomingHeading(locale: Locale): string | null {
  return isUpcomingLocale(locale) ? HEADING[locale] : null;
}
