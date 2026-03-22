import { NextRequest, NextResponse } from "next/server";

function isAllowedPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/post/")) return true;
  if (pathname === "/api/suburbs") return true;
  if (pathname === "/api/posts") return true;
  if (pathname.startsWith("/api/posts/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname === "/favicon.ico") return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isAllowedPath(pathname)) {
    return NextResponse.next();
  }

  return new NextResponse("Not Found", { status: 404 });
}

export const config = {
  matcher: ["/:path*"],
};
