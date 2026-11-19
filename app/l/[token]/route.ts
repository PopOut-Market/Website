import { classifyShareAudience, classifyShareLaunchPlatform } from "@/lib/share-link/user-agent";
import { shareAppLaunch } from "@/lib/share-link/app-link";
import {
  fetchSharePreview,
  isHousingShareToken,
  shareCanonicalUrl,
} from "@/lib/share-link/preview";
import { renderShareCrawlerHtml, renderShareInAppBrowserHtml } from "@/lib/share-link/html";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/site-config";
import { siteUrl } from "@/lib/seo";
import { NextResponse, type NextRequest } from "next/server";

/**
 * `/l/<token>` — listing-share landing route.
 *
 * The mobile app shares listings as https://popoutmarket.com.au/l/<token>. One
 * URL, three audiences (see `lib/share-link/user-agent.ts`):
 *
 *   crawler          -> 200 html, Open Graph card, NO redirect (a redirect kills the preview)
 *   in-app browser   -> 200 html, card + "Open in the app" hand-off + install buttons
 *                       (WeChat/KakaoTalk/LINE/Pinterest, whose scraper and browser
 *                       share one UA)
 *   mobile browser   -> Housing hand-off or existing store redirect
 *   desktop browser  -> 302 to /download
 *
 * Implemented as a Route Handler rather than a page because it needs exact
 * status codes, per-request User-Agent branching, and response headers that the
 * Metadata API cannot express. It also sidesteps the root-layout question: this
 * repo has no shared `app/layout.tsx` (each branch owns its own <html>), and a
 * Route Handler needs none.
 */

export const runtime = "nodejs";
/** The response depends on the request's User-Agent, so it can never be prerendered or revalidated. */
export const dynamic = "force-dynamic";

const SHARED_HEADERS: Record<string, string> = {
  /**
   * `Vary: User-Agent` is load-bearing, not boilerplate. Without it the CDN is
   * free to cache whichever variant it saw first and hand a crawler's html card
   * to a human (or a store redirect to a crawler, killing every preview). The
   * `no-store` belt-and-braces also keeps a redirect from being cached by the
   * browser — this site has been bitten before by cached redirects surviving a
   * server-side fix.
   */
  "Cache-Control": "no-store, max-age=0",
  Vary: "User-Agent",
  /** Share links must stay out of the index whatever the response type. */
  "X-Robots-Tag": "noindex, nofollow",
};

function storeUrlFor(audience: "ios" | "android" | "desktop"): string {
  if (audience === "ios") return APP_STORE_URL;
  if (audience === "android") return GOOGLE_PLAY_URL;
  return `${siteUrl().replace(/\/$/, "")}/download`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  const { token: rawToken } = await context.params;
  const token = (rawToken ?? "").toLowerCase();
  const ua = request.headers.get("user-agent");
  const audience = classifyShareAudience(ua);
  // WeChat users reopening the same URL in an external browser need a tappable
  // hand-off there even when the OS did not intercept the HTTPS navigation.
  const housingBrowser =
    isHousingShareToken(token) && (audience === "ios" || audience === "android");

  // Store redirects do not need a database read.
  if (!housingBrowser && (audience === "ios" || audience === "android" || audience === "desktop")) {
    return NextResponse.redirect(storeUrlFor(audience), {
      status: 302,
      headers: SHARED_HEADERS,
    });
  }

  // `fetchSharePreview` returns null for unknown tokens, removed listings,
  // malformed tokens and database errors alike — all render the generic card.
  const preview = await fetchSharePreview(token);
  const canonicalUrl = shareCanonicalUrl(token);

  const html =
    audience === "in-app-browser" || housingBrowser
      ? renderShareInAppBrowserHtml(
          preview,
          canonicalUrl,
          shareAppLaunch(token, classifyShareLaunchPlatform(ua)),
          isHousingShareToken(token) && /MicroMessenger/i.test(ua ?? ""),
        )
      : renderShareCrawlerHtml(preview, canonicalUrl);

  return new NextResponse(html, {
    status: 200,
    headers: { ...SHARED_HEADERS, "Content-Type": "text/html; charset=utf-8" },
  });
}
