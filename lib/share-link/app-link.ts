import { isValidShareToken } from "@/lib/share-link/preview";
import { GOOGLE_PLAY_URL } from "@/lib/site-config";
import type { ShareLaunchPlatform } from "@/lib/share-link/user-agent";

/**
 * Custom-scheme deep links for the `/l/<token>` share landing route.
 *
 * Why this exists at all: iOS Universal Links and Android App Links are NOT
 * handed to a native app when the link is tapped inside another app's embedded
 * webview. That is OS behaviour — Messenger, Instagram, LINE, KakaoTalk and
 * WhatsApp-on-iOS all suppress it — not a misconfiguration of our association
 * files (both were verified live: 200, application/json, no redirect, correct
 * team id / signing fingerprint). So a visitor who ALREADY HAS the app taps a
 * shared listing, the OS declines the hand-off, and they land on `/l/<token>`
 * with nothing but two store badges. The custom scheme is the one hand-off an
 * in-app browser will still perform.
 *
 * The scheme is registered by the shipped binary (`popout-market`, live since
 * 2.0.2 on both stores) and the app already parses this exact path form, so
 * nothing changes app-side.
 *
 * Pure string builders — no I/O, no environment, no request state.
 */

/** Matches `scheme` in the mobile app's `app.config.ts`. Changing it requires an app release. */
const APP_SCHEME = "popout-market";

/** Android applicationId. Pins the intent to our app so a rogue handler cannot claim it. */
const ANDROID_PACKAGE = "au.com.popoutmarket";

/**
 * Every builder returns null unless the token is a real 24-hex share token.
 *
 * This is a security boundary, not tidiness: the path segment is attacker
 * controlled, and these URLs are interpolated into markup AND into an inline
 * script. Validating here means nothing but `[0-9a-f]{24}` can ever reach
 * either, so no amount of escaping downstream is load-bearing.
 */
function normalizeToken(token: string): string | null {
  const normalized = (token ?? "").toLowerCase();
  return isValidShareToken(normalized) ? normalized : null;
}

/**
 * `popout-market://l/<token>` — the iOS form, and the universal fallback.
 *
 * iOS has no equivalent of Android's intent syntax: if the app is missing the
 * navigation simply does nothing, which is exactly the degradation we want
 * (the store badges are still on the page underneath).
 */
export function appSchemeUrl(token: string): string | null {
  const normalized = normalizeToken(token);
  return normalized ? `${APP_SCHEME}://l/${normalized}` : null;
}

/**
 * `intent://l/<token>#Intent;scheme=popout-market;package=au.com.popoutmarket;S.browser_fallback_url=...;end`
 *
 * Android's intent syntax is more reliable than a bare custom scheme inside a
 * webview: most embedded browsers explicitly handle `intent://` while quietly
 * dropping unknown schemes. `S.browser_fallback_url` sends a visitor who does
 * not have the app to the Play listing, which the OS applies for us.
 *
 * BUTTON ONLY — never navigate to this automatically. See `ShareAppLaunch`.
 */
export function androidIntentUrl(token: string): string | null {
  const normalized = normalizeToken(token);
  if (!normalized) return null;

  const parts = [
    `scheme=${APP_SCHEME}`,
    `package=${ANDROID_PACKAGE}`,
    `S.browser_fallback_url=${encodeURIComponent(GOOGLE_PLAY_URL)}`,
  ];

  return `intent://l/${normalized}#Intent;${parts.join(";")};end`;
}

export type ShareAppLaunch = {
  /** href of the visible "Open in the app" button — a user gesture, the reliable path. */
  buttonUrl: string;
  /**
   * URL for the automatic on-load attempt, or null when there must not be one.
   *
   * **null on Android, always.** A top-level navigation to `intent://` in a
   * webview that does not implement intent handling fails with
   * `ERR_UNKNOWN_URL_SCHEME`, and the webview paints its own error page over
   * ours — the visitor loses the store badges and the listing card both. That
   * destroys the property this whole feature rests on: a hand-off that does not
   * work must leave exactly the page that shipped before it. A user-tapped
   * button carries the same risk in principle, but there the visitor asked for
   * it, can see what happened and can go back; an automatic navigation gives
   * them no such chance. So Android gets the button only.
   *
   * iOS has no such failure mode: an unhandled custom scheme in a WKWebView is
   * dropped silently, which is exactly the no-op we want.
   */
  autoUrl: string | null;
};

/**
 * The URLs the in-app-browser page needs, or null when no app hand-off should be
 * offered at all — an unusable token, an unknown platform, or WeChat (see
 * `classifyShareLaunchPlatform`).
 */
export function shareAppLaunch(
  token: string,
  platform: ShareLaunchPlatform,
): ShareAppLaunch | null {
  if (platform === "none") return null;

  if (platform === "android") {
    const buttonUrl = androidIntentUrl(token);
    return buttonUrl ? { buttonUrl, autoUrl: null } : null;
  }

  const schemeUrl = appSchemeUrl(token);
  return schemeUrl ? { buttonUrl: schemeUrl, autoUrl: schemeUrl } : null;
}
