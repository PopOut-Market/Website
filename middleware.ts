import {
  DEFAULT_LOCALE,
  LOCALE_SEGMENT_TO_CODE,
  localeFromSegment,
  localeSegment,
  stripLocalePrefix,
} from "@/lib/site-locale-routing";
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep API, Next internals, admin routes, and static assets untouched.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin-super") ||
    pathname.startsWith("/favicon") ||
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
    localeFromSegment(cookieLocale) ?? refererLocale ?? DEFAULT_LOCALE;

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

  // Serve existing routes while keeping locale in browser URL.
  const rewritten = request.nextUrl.clone();
  rewritten.pathname = basePath;
  const response = NextResponse.rewrite(rewritten);
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
