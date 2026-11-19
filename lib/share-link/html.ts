import {
  fallbackShareImageUrl,
  formatShareDescription,
  sharePreviewImageUrl,
  type SharePreview,
} from "@/lib/share-link/preview";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/site-config";
import type { BrowserGuide, ShareLaunchPlatform } from "@/lib/share-link/user-agent";
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
 * Shown for an unknown token AND for anything the database declined to return —
 * a listing removed, taken down or with a banned seller, a community post
 * unpublished or taken down. All of them MUST be indistinguishable from a token
 * that never existed: never render a title, a price, or any hint that something
 * used to be here.
 */
const GENERIC_TITLE = "Shared on PopOut";
const GENERIC_DESCRIPTION = "Open this post in PopOut.";

const LOGO_SRC = "/apple-touch-icon-180.png";
const APP_STORE_BADGE_SRC = "/images/app_store_ios_black.svg";
const GOOGLE_PLAY_BADGE_SRC = "/images/Google_Play-black.svg";

/**
 * Listing and community-post titles alike are user-authored free text going
 * straight into attribute values and markup, so escaping is a hard requirement,
 * not a nicety — an unescaped `"><script>` in a title would be stored XSS on our
 * own domain.
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
    imageUrl: sharePreviewImageUrl(preview),
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
      <p style="font-size:14px;"><a href="/download" style="color:#cc3200;font-weight:600;">Get the PopOut app</a></p>
    </main>
  </body>
</html>`;
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
  launch: ShareAppLaunch | null,
  client: {
    device: ShareLaunchPlatform;
    guide: BrowserGuide;
    attempted: boolean;
    safari: boolean;
    inApp: boolean;
  },
): string {
  const fields = cardFields(preview);

  const photo = preview?.photoPath
    ? `<img class="cover" src="${escapeHtml(fields.imageUrl)}" alt="" />`
    : "";
  const summary = preview && formatShareDescription(preview);
  const label =
    preview?.kind === "community_post"
      ? "View post in PopOut"
      : preview
        ? "View listing in PopOut"
        : "Open in PopOut";
  const install =
    client.device === "ios"
      ? `<a href="${escapeHtml(APP_STORE_URL)}"><img width="156" height="60" src="${APP_STORE_BADGE_SRC}" alt="Download on the App Store" /></a>`
      : client.device === "android"
        ? `<a href="${escapeHtml(GOOGLE_PLAY_URL)}"><img width="175" height="60" src="${GOOGLE_PLAY_BADGE_SRC}" alt="Get it on Google Play" /></a>`
        : '<a href="/download">Get PopOut</a>';
  const banner =
    client.safari && launch
      ? `<meta name="apple-itunes-app" content="app-id=6761421626, app-argument=${escapeHtml(canonicalUrl)}" />`
      : "";
  const action = launch
    ? `<a class="action" href="${escapeHtml(launch.buttonUrl)}">${label}</a>`
    : "";
  const guidance =
    client.guide === "wechat"
      ? "Tap ··· and open in your browser"
      : "Use the menu (···) to open this page in Safari, then tap the PopOut button. You can also copy the link and paste it into Safari.";
  const help =
    client.guide || (client.device === "none" && client.attempted)
      ? launch
        ? `<details><summary>App didn’t open?</summary><p>${guidance}</p></details>`
        : `<p class="action guide">${guidance}</p>`
      : "";

  return `<!doctype html>
<html lang="en">
  <head>
    ${metaTags(fields, canonicalUrl)}
    ${banner}
    <style>
      * {box-sizing:border-box}
      body {margin:0;background:#f3f3f3;color:#222222;font:16px/1.45 system-ui,sans-serif}
      main {width:min(100%,440px);margin:auto;padding:clamp(12px,3vh,28px) 16px 24px}
      header {display:flex;gap:8px;align-items:center;margin-bottom:16px;font-weight:700}
      header img {border-radius:8px}
      article {background:white;border-radius:20px;overflow:hidden}
      .cover {display:block;width:100%;height:min(30vh,224px);height:min(30svh,224px);object-fit:cover}
      .details {padding:14px 16px}
      h1 {margin:0;font-size:clamp(20px,5vw,26px);line-height:1.2;overflow-wrap:anywhere;
          display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
      .summary {margin:6px 0 0;color:#52504d;overflow-wrap:anywhere}
      .action {margin:16px 0 0;text-align:center}
      a.action {display:flex;align-items:center;justify-content:center;width:100%;min-height:48px;
          padding:8px 16px;border-radius:16px;background:#ff8c00;color:white;
          font-weight:700;text-decoration:none}
      a.action:active {transform:scale(.97)}
      p.guide {text-align:center;font-size:14px;color:#52504d}
      footer {margin-top:8px;text-align:center}
      footer a {display:inline-flex;align-items:center;justify-content:center;min-height:48px;color:inherit}
      footer img {display:block}
    </style>
  </head>
  <body>
    <main>
      <header><img src="${LOGO_SRC}" width="30" height="30" alt="" />PopOut</header>
      <article>${photo}<div class="details">
        <h1>${escapeHtml(fields.title)}</h1>
        ${summary ? `<p class="summary">${escapeHtml(summary)}</p>` : ""}
      </div></article>
      ${action}
      ${help}
      ${client.inApp && !client.guide && launch ? '<p class="guide">If the app doesn’t open, use the browser menu to open this page in Safari or Chrome.</p>' : ""}
      ${launch && client.device !== "none" ? "" : `<footer>${install}</footer>`}
    </main>
  </body>
</html>`;
}
