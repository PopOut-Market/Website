import {
  fallbackShareImageUrl,
  formatShareDescription,
  shareImageUrl,
  type SharePreview,
} from "@/lib/share-link/preview";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/site-config";

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
 * Messenger in-app browser response: the same Open Graph card PLUS the visible
 * install buttons.
 *
 * WeChat, KakaoTalk, LINE and Pinterest all send the same UA token from their
 * in-app browser as from their link-preview fetcher, so this one document has to
 * satisfy both — hence meta tags and a real UI together. WeChat additionally
 * blocks navigation to the App Store / Google Play, so the store redirect every
 * other human gets would simply dead-end there.
 */
export function renderShareInAppBrowserHtml(
  preview: SharePreview | null,
  canonicalUrl: string,
): string {
  const fields = cardFields(preview);

  // Only render listing details when there IS a listing; a removed listing must
  // look exactly like a token that never existed.
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
${listingBlock}      <p style="margin:0 0 16px;font-size:14px;color:#374151;">Open this listing in the PopOut Market app</p>
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;">
        <a href="${escapeHtml(APP_STORE_URL)}" aria-label="Download on the App Store" style="display:block;">
          <img src="${APP_STORE_BADGE_SRC}" alt="Download on the App Store" style="height:52px;width:auto;" />
        </a>
        <a href="${escapeHtml(GOOGLE_PLAY_URL)}" aria-label="Get it on Google Play" style="display:block;">
          <img src="${GOOGLE_PLAY_BADGE_SRC}" alt="Get it on Google Play" style="height:52px;width:auto;" />
        </a>
      </div>
      <p style="margin:32px 0 0;max-width:320px;font-size:12px;line-height:1.6;color:#9ca3af;">
        If a button doesn&#39;t open the store, use the menu at the top right to open this page in your browser (such as Safari or Chrome), then tap it again.
      </p>
    </main>
  </body>
</html>`;
}
