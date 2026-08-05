import {
  fallbackShareImageUrl,
  formatShareDescription,
  shareImageUrl,
  type SharePreview,
} from "@/lib/share-link/preview";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/site-config";
import type { ShareAppLaunch } from "@/lib/share-link/app-link";

/**
 * HTML for the `/l/<token>` share landing route.
 *
 * Hand-rolled rather than rendered through the App Router on purpose. The route
 * is a Route Handler (it needs exact status codes and per-request User-Agent
 * branching), so there is no layout to inherit and no Tailwind bundle to link —
 * every style here is inline and the document is fully self-contained.
 */

/**
 * Shown for an unknown token AND for a listing that was removed, taken down, or
 * whose seller was banned. The two MUST be indistinguishable: never render a
 * title, a price, or any hint that something used to be here.
 */
const GENERIC_TITLE = "PopOut Market";
const GENERIC_DESCRIPTION = "Melbourne's second-hand marketplace — buy and sell locally.";

const LOGO_SRC = "/images/app-icon.png";
const APP_STORE_BADGE_SRC = "/images/app_store_ios_black.svg";
const GOOGLE_PLAY_BADGE_SRC = "/images/Google_Play-black.svg";

/**
 * Listing titles are seller-authored free text going straight into attribute
 * values and markup, so escaping is a hard requirement, not a nicety — an
 * unescaped `"><script>` in a title would be stored XSS on our own domain.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type ShareCardFields = {
  title: string;
  description: string;
  imageUrl: string;
};

function cardFields(preview: SharePreview | null): ShareCardFields {
  if (!preview) {
    return {
      title: GENERIC_TITLE,
      description: GENERIC_DESCRIPTION,
      imageUrl: fallbackShareImageUrl(),
    };
  }
  return {
    title: preview.title,
    // Both halves of the description can be absent (no suburb, unreadable
    // price); an empty og:description renders as a blank line in most cards.
    description: formatShareDescription(preview) || GENERIC_DESCRIPTION,
    imageUrl: shareImageUrl(preview.photoPath),
  };
}

/**
 * No og:image:width / og:image:height. Supabase's transform crops toward the
 * requested 1200x630 but never upscales, so the bytes actually served are
 * whatever the source photo could supply (810x630, 499x630, ...). Declaring
 * dimensions we do not produce is worse than declaring none — crawlers size the
 * card from the image they fetch anyway.
 */
function metaTags(fields: ShareCardFields, canonicalUrl: string): string {
  const title = escapeHtml(fields.title);
  const description = escapeHtml(fields.description);
  const image = escapeHtml(fields.imageUrl);
  const url = escapeHtml(canonicalUrl);

  return [
    `<meta charset="utf-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    // Share links are private-by-nature and must never enter the index; the
    // route also sends an X-Robots-Tag header for the non-HTML responses.
    `<meta name="robots" content="noindex, nofollow" />`,
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="PopOut Market" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${title}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<link rel="canonical" href="${url}" />`,
    // Twitter falls back to og:* for most fields but needs an explicit card type
    // to render the large image rather than a bare summary.
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join("\n    ");
}

/**
 * Crawler response: the Open Graph card, no redirect. The visible body exists
 * only so a human who somehow reaches this response is not staring at a blank
 * page — crawlers ignore it entirely.
 */
export function renderShareCrawlerHtml(preview: SharePreview | null, canonicalUrl: string): string {
  const fields = cardFields(preview);
  return `<!doctype html>
<html lang="en">
  <head>
    ${metaTags(fields, canonicalUrl)}
  </head>
  <body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;color:#111827;">
    <main style="max-width:640px;margin:0 auto;padding:48px 24px;text-align:center;">
      <h1 style="font-size:20px;font-weight:700;margin:0 0 8px;">${escapeHtml(fields.title)}</h1>
      <p style="font-size:15px;color:#4b5563;margin:0 0 24px;">${escapeHtml(fields.description)}</p>
      <p style="font-size:14px;"><a href="/download" style="color:#cc3200;font-weight:600;">Get the PopOut Market app</a></p>
    </main>
  </body>
</html>`;
}

/**
 * The automatic hand-off attempt. iOS only — `ShareAppLaunch.autoUrl` explains
 * why Android must never get one.
 *
 * Deliberately JavaScript, and deliberately NOT a `<meta http-equiv="refresh">`
 * or a server-side redirect: KakaoTalk, LINE, WeChat and Pinterest send the same
 * UA from their scraper as from their browser, so this one document is read by
 * both. Scrapers do not execute JS, so a script cannot cost us a link preview,
 * whereas either redirect form would kill the card outright.
 *
 * `url` is built from a validated 24-hex token and compile-time constants (see
 * `lib/share-link/app-link.ts`), so nothing user- or seller-authored reaches
 * this script; `JSON.stringify` is belt-and-braces on top of that.
 *
 * The delay lets the page paint first, so the store badges are already on screen
 * when — as in Messenger — nothing happens at all.
 */
function autoLaunchScript(url: string): string {
  return `    <script>
      (function () {
        var target = ${JSON.stringify(url)};
        var done = false;
        function stop() { done = true; }
        document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); });
        window.addEventListener("pagehide", stop);
        window.setTimeout(function () {
          if (done || document.hidden) return;
          try { window.location.href = target; } catch (error) { /* webview refused it — the badges are right there */ }
        }, 400);
      })();
    </script>
`;
}

/**
 * Messenger in-app browser response: the same Open Graph card PLUS a visible
 * app hand-off and the install buttons.
 *
 * WeChat, KakaoTalk, LINE and Pinterest all send the same UA token from their
 * in-app browser as from their link-preview fetcher, so this one document has to
 * satisfy both — hence meta tags and a real UI together. WeChat additionally
 * blocks navigation to the App Store / Google Play, so the store redirect every
 * other human gets would simply dead-end there.
 *
 * `launch` is the app hand-off, or null when none can be offered (WeChat, an
 * unidentifiable platform, an unusable token). Without it this page can only
 * send a visitor who ALREADY HAS the app to the store, where "Open" launches the
 * home feed and the listing they were sent is lost — which is the bug this
 * argument exists to fix.
 */
export function renderShareInAppBrowserHtml(
  preview: SharePreview | null,
  canonicalUrl: string,
  launch: ShareAppLaunch | null = null,
): string {
  const fields = cardFields(preview);

  // Only render listing details when there IS a listing; a removed listing must
  // look exactly like a token that never existed.
  //
  // This block is the ONLY part of the page that depends on `preview`, and that
  // is a requirement rather than an accident: the app hand-off below must render
  // identically whether or not the token resolved, or its presence tells the
  // visitor that something used to be here. When `/l/` starts resolving to
  // community posts as well, the second card kind drops in HERE and nowhere
  // else.
  const listingBlock = preview
    ? `      <div style="margin:0 auto 28px;max-width:340px;border:1px solid rgba(0,0,0,0.08);border-radius:16px;overflow:hidden;background:#f9fafb;text-align:left;">
        <img src="${escapeHtml(shareImageUrl(preview.photoPath))}" alt="${escapeHtml(preview.title)}" style="display:block;width:100%;height:180px;object-fit:cover;" />
        <div style="padding:12px 14px;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:600;line-height:1.35;">${escapeHtml(preview.title)}</p>
          <p style="margin:0;font-size:14px;color:#4b5563;">${escapeHtml(formatShareDescription(preview))}</p>
        </div>
      </div>
`
    : "";

  /**
   * With a hand-off available the store badges become the secondary path, so
   * they get a "don't have it yet" heading. Without one the page is left exactly
   * as it was — that is WeChat's page, and nothing here improves it.
   */
  const launchBlock = launch
    ? `      <a href="${escapeHtml(launch.buttonUrl)}" style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 32px;border-radius:14px;background:#cc3200;color:#fff;font-size:16px;font-weight:700;text-decoration:none;">Open in the app</a>
      <p style="margin:20px 0 12px;font-size:13px;color:#6b7280;">Don&#39;t have the app yet?</p>
`
    : `      <p style="margin:0 0 16px;font-size:14px;color:#374151;">Open this listing in the PopOut Market app</p>
`;

  return `<!doctype html>
<html lang="en">
  <head>
    ${metaTags(fields, canonicalUrl)}
  </head>
  <body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;color:#111827;">
    <main style="min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center;">
      <img src="${LOGO_SRC}" alt="PopOut Market" width="72" height="72" style="width:64px;height:64px;border-radius:18px;border:1px solid rgba(0,0,0,0.1);object-fit:cover;" />
      <h1 style="margin:20px 0 8px;font-size:22px;font-weight:800;letter-spacing:-0.01em;">PopOut Market</h1>
      <p style="margin:0 0 28px;font-size:14px;color:#374151;">Melbourne&#39;s second-hand marketplace</p>
${listingBlock}${launchBlock}      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;">
        <a href="${escapeHtml(APP_STORE_URL)}" aria-label="Download on the App Store" style="display:block;">
          <img src="${APP_STORE_BADGE_SRC}" alt="Download on the App Store" style="height:52px;width:auto;" />
        </a>
        <a href="${escapeHtml(GOOGLE_PLAY_URL)}" aria-label="Get it on Google Play" style="display:block;">
          <img src="${GOOGLE_PLAY_BADGE_SRC}" alt="Get it on Google Play" style="height:52px;width:auto;" />
        </a>
      </div>
      <p style="margin:32px 0 0;max-width:320px;font-size:12px;line-height:1.6;color:#9ca3af;">
        ${
          launch
            ? "If the app button doesn&#39;t open the app, or a store button doesn&#39;t open the store, use the menu at the top right to open this page in your browser (such as Safari or Chrome), then tap it again."
            : "If a button doesn&#39;t open the store, use the menu at the top right to open this page in your browser (such as Safari or Chrome), then tap it again."
        }
      </p>
    </main>
${launch?.autoUrl ? autoLaunchScript(launch.autoUrl) : ""}  </body>
</html>`;
}
