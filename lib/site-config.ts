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
export const SHELL_X = "px-[1.05rem] sm:px-6";
export const INNER_MAX = "mx-auto w-full max-w-5xl px-[0.525rem] sm:px-4 md:px-5";

/**
 * Spacer under the fixed header matches `h-24` (6rem). Main content uses this as a floor so a taller
 * footer does not shrink the hero / page body — the page scrolls instead.
 */
export const SITE_MAIN_SLOT_CLASS =
  "flex w-full min-h-[calc(100dvh-6rem)] flex-grow basis-auto shrink-0 flex-col";

/** Hero “PopOut Market” and matching accent text (use with `bg-clip-text text-transparent`). */
export const POPOUT_BRAND_GRADIENT_TEXT_CLASS =
  "bg-[linear-gradient(to_bottom,#FF0048_0%,#FF154A_24%,#FF314A_45%,#FF4B45_63%,#FF5A33_80%,#FF6600_100%)] bg-clip-text text-transparent";

export const LOGO_TEXT_SRC = "/images/Logo_text.png";
export const LOGO_MARK_SRC = "/images/LOGO.png";
export const APP_STORE_BADGE_SRC = "/images/app_store_ios_black.svg";
export const GOOGLE_PLAY_BADGE_SRC = "/images/Google_Play-black.svg";

export const APP_STORE_URL = "https://apps.apple.com/app/id0000000000";
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.example.popout";

export const FOOTER_CONTACT_EMAIL = "contact@popoutmarket.com.au";

/** Registered office / postal address shown in the site footer. */
export const FOOTER_ADDRESS_LINE =
  "1003/151 City Rd, Southbank VIC 3006, Australia";

export const FOOTER_SOCIAL_IMG_REDNOTE = "/images/REDNOTE_ICON.svg";
export const FOOTER_SOCIAL_IMG_INSTAGRAM = "/images/Instagram_logo.svg";
export const FOOTER_SOCIAL_IMG_LINKEDIN = "/images/LinkedIn-Icon.svg";

/** Xiaohongshu (RED) short link — override with `NEXT_PUBLIC_FOOTER_SOCIAL_REDNOTE_URL` if needed. */
export const FOOTER_SOCIAL_REDNOTE_DEFAULT = "https://xhslink.com/m/7eKhz2OkgbC";

/** Instagram — override with `NEXT_PUBLIC_FOOTER_SOCIAL_INSTAGRAM_URL` (e.g. `/popoutmarket/`). */
export const FOOTER_SOCIAL_INSTAGRAM_DEFAULT = "https://www.instagram.com/?hl=en";

/** LinkedIn footer link — public company page. Override with `NEXT_PUBLIC_FOOTER_SOCIAL_LINKEDIN_URL` if needed. */
export const FOOTER_SOCIAL_LINKEDIN_DEFAULT =
  "https://www.linkedin.com/company/popout-market/";

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
