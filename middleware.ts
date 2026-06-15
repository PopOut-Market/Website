import {
  DEFAULT_LOCALE,
  LOCALE_HEADER,
  LOCALE_SEGMENT_TO_CODE,
  localeFromSegment,
  localeSegment,
  stripLocalePrefix,
} from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LEGACY_SUBURB_REDIRECTS: Record<string, string> = {
  "/parkville-secondhand-uni-melb-essentials": "/melbourne-suburbs/parkville",
  "/second-hand-docklands-melbourne": "/melbourne-suburbs/docklands",
  "/southbank-melbourne-second-hand-market": "/melbourne-suburbs/southbank",
  "/melbourne-cbd-second-hand-city-living": "/melbourne-suburbs/melbourne-cbd",
  "/carlton-student-second-hand-melbourne": "/melbourne-suburbs/carlton",
  "/fitzroy-second-hand-creative-living": "/melbourne-suburbs/fitzroy",
  "/north-melbourne-second-hand-student-living": "/melbourne-suburbs/north-melbourne",
  "/south-wharf-second-hand-apartment-essentials": "/melbourne-suburbs/south-wharf",
};

function isStaticAsset(pathname: string): boolean {
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

function localeFromAcceptLanguageHeader(headerValue: string | null): Locale | null {
  if (!headerValue) return null;
  const ranked = headerValue
    .split(",")
    .map((entry, index) => {
      const [rawTag, ...params] = entry.trim().split(";");
      let q = 1;
      for (const p of params) {
        const [k, v] = p.trim().split("=");
        if (k === "q") {
          const parsed = Number(v);
          if (!Number.isNaN(parsed)) q = parsed;
        }
      }
      return { tag: (rawTag ?? "").toLowerCase().replaceAll("_", "-"), q, index };
    })
    .filter((x) => x.tag.length > 0)
    .sort((a, b) => (b.q === a.q ? a.index - b.index : b.q - a.q));

  for (const { tag } of ranked) {
    // Exact locale segment match: en, zh-cn, zh-tw, ko, ja, vi, fr, es
    const exact = localeFromSegment(tag);
    if (exact) return exact;

    // Handle script/region variants like zh-Hans, zh-Hant, zh-HK, en-US, etc.
    if (tag.startsWith("zh-")) {
      if (tag.includes("hant") || tag.endsWith("-tw") || tag.endsWith("-hk")) return "zh-Hant";
      if (tag.includes("hans") || tag.endsWith("-cn") || tag.endsWith("-sg")) return "zh-Hans";
      // Generic Chinese defaults to Simplified Chinese for first-visit routing.
      return "zh-Hans";
    }

    const base = tag.split("-")[0];
    const baseLocale = localeFromSegment(base);
    if (baseLocale) return baseLocale;
  }
  return null;
}

// NOTE: apex(non-www)->www canonicalization is intentionally NOT done here.
// Netlify already redirects between apex and www based on the primary-domain
// setting; adding the opposite redirect in middleware creates an infinite loop
// (apex->www via middleware, www->apex via Netlify). The single canonical host
// must be enforced in ONE place only — the Netlify domain settings. Set the
// primary domain to www there to match the canonical/metadataBase in lib/seo.ts.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep API, Next internals, admin routes, static assets, and the device-
  // detecting /app smart link untouched (the latter must stay un-prefixed so the
  // clean /app URL serves directly instead of 308-ing to /en/app).
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin-super") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname === "/app" ||
    pathname === "/app/" ||
    isStaticAsset(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale = localeFromSegment(firstSegment);

  const cookieLocale = request.cookies.get("popout_locale")?.value;
  const referer = request.headers.get("referer");
  const refererLocale = referer
    ? localeFromSegment(new URL(referer).pathname.split("/").filter(Boolean)[0])
    : null;
  const fallbackLocale =
    localeFromSegment(cookieLocale) ??
    refererLocale ??
    localeFromAcceptLanguageHeader(request.headers.get("accept-language")) ??
    DEFAULT_LOCALE;

  if (!locale) {
    const url = request.nextUrl.clone();
    const seg = localeSegment(fallbackLocale);
    const legacyTarget = LEGACY_SUBURB_REDIRECTS[pathname];
    const nextBase = legacyTarget ?? pathname;
    url.pathname = nextBase === "/" ? `/${seg}` : `/${seg}${nextBase}`;
    const response = NextResponse.redirect(url, 308);
    response.cookies.set("popout_locale", seg, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  const basePath = stripLocalePrefix(pathname);
  const legacyTarget = LEGACY_SUBURB_REDIRECTS[basePath];
  if (legacyTarget) {
    const url = request.nextUrl.clone();
    const seg = pathname.split("/").filter(Boolean)[0] ?? localeSegment(locale);
    url.pathname = `/${seg}${legacyTarget}`;
    const response = NextResponse.redirect(url, 308);
    response.cookies.set("popout_locale", seg, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  // Serve existing routes while keeping locale in browser URL. Forward the
  // resolved locale to server components via a request header so the initial
  // SSR output (html lang, <title>, body copy) is localized for crawlers.
  const rewritten = request.nextUrl.clone();
  rewritten.pathname = basePath;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  const response = NextResponse.rewrite(rewritten, {
    request: { headers: requestHeaders },
  });
  if (Object.hasOwn(LOCALE_SEGMENT_TO_CODE, firstSegment.toLowerCase())) {
    response.cookies.set("popout_locale", firstSegment.toLowerCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

export const config = {
  matcher: "/:path*",
};
