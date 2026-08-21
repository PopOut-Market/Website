export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  sheet: 20,
  full: 9999,
} as const;

/** 与 top bar 白卡片内边距一致 */
export const SHELL_X = "px-4 sm:px-6";
export const INNER_MAX = "mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-6";

/**
 * Floor matches the flat sticky header height (`h-16` = 4rem). Main content uses this as a floor so a
 * taller footer does not shrink the hero / page body — the page scrolls instead.
 */
export const SITE_MAIN_SLOT_CLASS =
  "flex w-full min-h-[calc(100dvh-4rem)] flex-grow basis-auto shrink-0 flex-col";

/** Brand wordmark / accent text — flat brand orange-dark (#CC3200, passes WCAG AA on light; gradient killed). */
export const POPOUT_BRAND_GRADIENT_TEXT_CLASS = "text-brand-700";

/**
 * App-exact shared class tokens. Flat surfaces, neutral shadows, single orange anchor.
 * Buttons are soft rounded-rect (`rounded-xl` = 12) — never full pills.
 */
/** Flat card surface (one step lighter than its section). */
export const CARD_CLASS = "rounded-2xl border border-black/5 bg-gray-50 shadow-card";
/** Solid brand-orange primary button/CTA — flat, pressed = brand-700 (#CC3200). */
export const PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-xl bg-brand-500 font-semibold text-white transition-colors hover:bg-brand-600 active:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";
/** Secondary button: flat, neutral; hover shifts border to brand only. */
export const SECONDARY_PILL_CLASS =
  "inline-flex items-center justify-center rounded-xl border border-gray-400 bg-gray-50 font-semibold text-gray-900 transition-colors hover:border-brand-500 active:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

export const LOGO_TEXT_SRC = "/images/Logo_text.png";
export const LOGO_MARK_SRC = "/images/app-icon.png";
export const APP_STORE_BADGE_SRC = "/images/app_store_ios_black.svg";
export const GOOGLE_PLAY_BADGE_SRC = "/images/Google_Play-black.svg";

// Canonical Apple URL, confirmed against the iTunes Lookup API on 2026-08-21.
// The old slug `popout-market-buy-sell` still 301s here, but it hard-codes the
// retired "buy & sell" positioning into every link, share card and sameAs entry
// the site emits. Apple now serves this listing as `popout-market`.
export const APP_STORE_URL = "https://apps.apple.com/au/app/popout-market/id6761421626";
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=au.com.popoutmarket";

export const FOOTER_CONTACT_EMAIL = "contact@popoutmarket.com.au";

/**
 * Store ratings, for prose use on /about only — never as a star display and never
 * as schema.org `aggregateRating`.
 *
 * The footer used to render "★★★★★ 5.0 App Store" site-wide. That is the Apple
 * figure from 18 ratings, while Google Play sits at 4.6 from 10 reviews: showing
 * only the higher one over a combined base of 28 is selective disclosure. Quote
 * both, with the as-of date, or quote neither. First-party `aggregateRating`
 * markup on your own product is a known manual-action trigger — do not add it.
 */
export const STORE_RATINGS = {
  appleRating: "5.0",
  appleRatingCount: 18,
  playRating: "4.6",
  playReviewCount: 10,
  asOf: "2026-08-21",
} as const;

/** Registered office / postal address shown in the site footer. */
export const FOOTER_ADDRESS_LINE = "1003/151 City Rd, Southbank VIC 3006, Australia";

export const FOOTER_SOCIAL_IMG_REDNOTE = "/images/REDNOTE_ICON.svg";
export const FOOTER_SOCIAL_IMG_INSTAGRAM = "/images/Instagram_logo.svg";
export const FOOTER_SOCIAL_IMG_LINKEDIN = "/images/LinkedIn-Icon.svg";

/** Xiaohongshu (RED) short link — override with `NEXT_PUBLIC_FOOTER_SOCIAL_REDNOTE_URL` if needed. */
export const FOOTER_SOCIAL_REDNOTE_DEFAULT = "https://xhslink.com/m/7eKhz2OkgbC";

/** Instagram — override with `NEXT_PUBLIC_FOOTER_SOCIAL_INSTAGRAM_URL` (e.g. `/popoutmarket/`). */
export const FOOTER_SOCIAL_INSTAGRAM_DEFAULT = "https://www.instagram.com/?hl=en";

/** LinkedIn footer link — public company page. Override with `NEXT_PUBLIC_FOOTER_SOCIAL_LINKEDIN_URL` if needed. */
export const FOOTER_SOCIAL_LINKEDIN_DEFAULT = "https://www.linkedin.com/company/popout-market/";

function footerSocialUrlFromEnv(value: string | undefined): string | null {
  const v = value?.trim() ?? "";
  if (!v) {
    return null;
  }
  if (v.startsWith("http://") || v.startsWith("https://")) {
    return v;
  }
  return null;
}

/** Set `NEXT_PUBLIC_FOOTER_SOCIAL_*_URL` in `.env` to override built-in defaults. */
export function footerSocialUrlRednote(): string {
  return (
    footerSocialUrlFromEnv(process.env.NEXT_PUBLIC_FOOTER_SOCIAL_REDNOTE_URL) ??
    FOOTER_SOCIAL_REDNOTE_DEFAULT
  );
}

export function footerSocialUrlInstagram(): string {
  return (
    footerSocialUrlFromEnv(process.env.NEXT_PUBLIC_FOOTER_SOCIAL_INSTAGRAM_URL) ??
    FOOTER_SOCIAL_INSTAGRAM_DEFAULT
  );
}

export function footerSocialUrlLinkedIn(): string {
  return (
    footerSocialUrlFromEnv(process.env.NEXT_PUBLIC_FOOTER_SOCIAL_LINKEDIN_URL) ??
    FOOTER_SOCIAL_LINKEDIN_DEFAULT
  );
}
