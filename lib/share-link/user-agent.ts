/**
 * User-Agent classification for the `/l/<token>` listing-share landing route.
 *
 * A share link has to serve three different audiences from one URL:
 *  - link-preview crawlers, which want Open Graph tags and must NOT be redirected
 *    (a redirect means the chat app renders no card at all);
 *  - humans, who should be sent straight to the right app store;
 *  - messenger in-app browsers, which are BOTH — see `in-app-browser` below.
 *
 * Kept UA-only and dependency-free so it stays trivially testable and cheap to run
 * on every request.
 */

export type ShareAudience = "in-app-browser" | "crawler" | "ios" | "android" | "desktop";

/**
 * Messenger / social apps whose in-app browser sends the SAME identifying token
 * as their link-preview fetcher, making the two indistinguishable by User-Agent:
 * a `KakaoTalk` hit may be the scraper building a card, or a Korean user who just
 * tapped the link inside a chat.
 *
 * Resolving that ambiguity by serving ONE html response carrying the Open Graph
 * tags *and* the visible install buttons satisfies both readers: the scraper
 * gets the meta tags it came for, and the human gets a usable page instead of
 * either a blank document or a store redirect their browser refuses to follow.
 * (WeChat actively blocks store navigation out of its in-app browser.)
 *
 * The alternative — treating these as pure crawlers — sends real people a card
 * with no way forward; redirecting them instead kills every preview. The hybrid
 * page is a strict superset of both, so it is the safe answer for all four.
 */
const IN_APP_BROWSER_PATTERNS: readonly RegExp[] = [
  /MicroMessenger/i, // WeChat
  /KakaoTalk/i, // also matches the `kakaotalk-scrap/1.0` fetcher
  /\bLine\//i, // LINE — see the word-boundary note below
  /Pinterest/i, // matches both `Pinterest/0.2` and `[Pinterest/iOS]`
];

/**
 * Pure link-preview fetchers: no human ever looks at what these render, because
 * each of these apps opens real links in a normal browser with a normal UA.
 * A lean Open Graph card is all they need.
 */
const CRAWLER_PATTERNS: readonly RegExp[] = [
  /facebookexternalhit/i,
  /Twitterbot/i,
  /WhatsApp/i,
  /TelegramBot/i,
  /Slackbot/i,
  /Discordbot/i,
  /LinkedInBot/i,
  /Applebot/i,
  /redditbot/i,
];

const IOS_PATTERN = /iPhone|iPad|iPod/i;
const ANDROID_PATTERN = /Android/i;

/**
 * LINE needs the `\bLine\/` word boundary rather than a bare substring: a
 * case-insensitive `line/` also occurs inside ordinary words ("Airline/",
 * "Streamline/"), and matching one of those would push a real visitor into the
 * html branch instead of the store redirect. The boundary makes it match LINE's
 * own `Line/13.5.0` product token only.
 */
export function isShareLinkCrawler(userAgent: string): boolean {
  return (
    IN_APP_BROWSER_PATTERNS.some((pattern) => pattern.test(userAgent)) ||
    CRAWLER_PATTERNS.some((pattern) => pattern.test(userAgent))
  );
}

/**
 * Note on iPadOS 13+: Safari on iPad reports a desktop `Macintosh` UA, so it is
 * classified `desktop` and lands on /download. That page shows both store
 * badges, so the visitor still gets to the App Store in one extra tap — a
 * deliberately safe degradation rather than a guess.
 */
export function classifyShareAudience(userAgent: string | null | undefined): ShareAudience {
  const ua = userAgent ?? "";
  if (IN_APP_BROWSER_PATTERNS.some((pattern) => pattern.test(ua))) return "in-app-browser";
  if (CRAWLER_PATTERNS.some((pattern) => pattern.test(ua))) return "crawler";
  if (IOS_PATTERN.test(ua)) return "ios";
  if (ANDROID_PATTERN.test(ua)) return "android";
  return "desktop";
}
