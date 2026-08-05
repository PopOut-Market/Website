/**
 * User-Agent classification for the `/l/<token>` listing-share landing route.
 *
 * A share link has to serve three different audiences from one URL:
 *  - link-preview crawlers, which want Open Graph tags and must NOT be redirected
 *    (a redirect means the chat app renders no card at all);
 *  - humans in a real browser, who should be sent straight to the right app store;
 *  - humans inside an app's embedded webview, who must NOT be redirected — see below.
 *
 * Kept UA-only and dependency-free so it stays trivially testable and cheap to run
 * on every request.
 */

export type ShareAudience = "in-app-browser" | "crawler" | "ios" | "android" | "desktop";

/**
 * Named in-app browsers.
 *
 * Two different reasons a UA has to be listed here explicitly rather than left to
 * the structural check below:
 *
 *  1. Its scraper and its embedded browser send the SAME token, so a hit cannot be
 *     attributed to one or the other (WeChat, KakaoTalk, LINE, Pinterest). Serving
 *     one hybrid document — Open Graph tags AND visible install buttons — is the
 *     only response that satisfies both readers.
 *  2. It appends its token to a COMPLETE Safari user-agent string, so it still
 *     carries `Safari/` and the structural check cannot see it as a webview.
 *     LINE and KakaoTalk both do this, which is why the structural rule alone is
 *     not enough.
 */
const KNOWN_IN_APP_BROWSER_PATTERNS: readonly RegExp[] = [
  /MicroMessenger/i, // WeChat
  /KakaoTalk/i, // also matches the `kakaotalk-scrap/1.0` fetcher
  /\bLine\//i, // LINE — see the word-boundary note below
  /Pinterest/i, // matches both `Pinterest/0.2` and `[Pinterest/iOS]`
  /FBAN|FBAV|FB_IAB/i, // Facebook / Messenger / Instagram in-app browsers
  /Messenger/i,
  /Instagram/i,
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

/** Android's WebView announces itself with a `wv` product token: `...; wv) AppleWebKit...`. */
const ANDROID_WEBVIEW_PATTERN = /;\s*wv[);]/i;

/** Every real iOS browser — Safari, Chrome (CriOS), Firefox (FxiOS), Edge (EdgiOS),
 *  DuckDuckGo — carries a `Safari/` token. WKWebView-hosted browsers usually omit it. */
const SAFARI_TOKEN_PATTERN = /Safari\//i;

/**
 * Structural in-app-webview detection, so the rule does not depend on an
 * ever-growing list of app names.
 *
 * An embedded webview cannot follow a redirect to apps.apple.com or
 * play.google.com — the navigation simply hangs and the user watches a spinner
 * forever. That is a whole CLASS of client (Snapchat, TikTok, Threads, Reddit,
 * every "open link in app" surface), not a handful of apps, so it is detected by
 * shape rather than by name.
 *
 * The failure modes are deliberately asymmetric. A false positive costs a real
 * browser user one extra tap on a page that already shows both store buttons; a
 * false negative is the infinite spinner. So this errs toward the hybrid page.
 */
function isInAppWebView(ua: string): boolean {
  if (ANDROID_PATTERN.test(ua) && ANDROID_WEBVIEW_PATTERN.test(ua)) return true;
  if (IOS_PATTERN.test(ua) && !SAFARI_TOKEN_PATTERN.test(ua)) return true;
  return false;
}

/**
 * LINE needs the `\bLine\/` word boundary rather than a bare substring: a
 * case-insensitive `line/` also occurs inside ordinary words ("Airline/",
 * "Streamline/"), and matching one of those would push a real visitor into the
 * html branch instead of the store redirect. The boundary makes it match LINE's
 * own `Line/13.5.0` product token only.
 */
function isKnownInAppBrowser(ua: string): boolean {
  return KNOWN_IN_APP_BROWSER_PATTERNS.some((pattern) => pattern.test(ua));
}

/**
 * Order matters. Named in-app browsers win first because several of them double
 * as their own scraper. Pure crawlers are checked before the structural webview
 * rule so a fetcher can never be mistaken for a human. Only then do real
 * browsers fall through to a store redirect.
 *
 * Note on iPadOS 13+: Safari on iPad reports a desktop `Macintosh` UA, so it is
 * classified `desktop` and lands on /download. That page shows both store
 * badges, so the visitor still gets to the App Store in one extra tap — a
 * deliberately safe degradation rather than a guess.
 */
export function classifyShareAudience(userAgent: string | null | undefined): ShareAudience {
  const ua = userAgent ?? "";
  if (isKnownInAppBrowser(ua)) return "in-app-browser";
  if (CRAWLER_PATTERNS.some((pattern) => pattern.test(ua))) return "crawler";
  if (isInAppWebView(ua)) return "in-app-browser";
  if (IOS_PATTERN.test(ua)) return "ios";
  if (ANDROID_PATTERN.test(ua)) return "android";
  return "desktop";
}

/**
 * WeChat blocks custom-scheme navigation outright and answers it with an error
 * dialog, so its page must offer no app hand-off at all — not a button, not an
 * automatic attempt. It already blocks the App Store and Google Play, which is
 * why the in-app-browser page exists in the first place; there is nothing left
 * to try, so leave that page exactly as it was.
 */
const SCHEME_BLOCKING_PATTERN = /MicroMessenger/i;

/**
 * Which custom-scheme URL form to offer an in-app-browser visitor, `"none"`
 * when none should be offered.
 *
 * Only meaningful for the `in-app-browser` audience — every other audience is
 * either a crawler (no UI) or gets a store redirect before this is consulted.
 * `"none"` also covers a platform we cannot identify: the two URL forms are
 * platform-specific and there is no third one worth guessing at, and the store
 * badges already cover that visitor.
 */
export type ShareLaunchPlatform = "ios" | "android" | "none";

export function classifyShareLaunchPlatform(
  userAgent: string | null | undefined,
): ShareLaunchPlatform {
  const ua = userAgent ?? "";
  if (SCHEME_BLOCKING_PATTERN.test(ua)) return "none";
  // iOS first: an iPad-on-Android UA does not exist, but LINE and KakaoTalk
  // append their token to a full Safari UA, so check the device before anything
  // structural.
  if (IOS_PATTERN.test(ua)) return "ios";
  if (ANDROID_PATTERN.test(ua)) return "android";
  return "none";
}
