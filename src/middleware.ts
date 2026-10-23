import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "pdvolts_session";
const secretKey = process.env.JWT_SECRET || "pdvolts_ultra_secure_jwt_signing_secret_key_prod_2026";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;

  let sessionUser: { role?: string; id?: string; email?: string } | null = null;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, encodedKey, {
        algorithms: ["HS256"],
      });
      sessionUser = payload as { role?: string; id?: string; email?: string };
    } catch {
      sessionUser = null;
    }
  }

  // Protect Admin Routes
  if (isAdminRoute) {
    if (!sessionUser) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      url.searchParams.set("error", "unauthenticated");
      return NextResponse.redirect(url);
    }

    if (sessionUser.role !== "ADMIN" && sessionUser.role !== "SUPER_ADMIN") {
      const url = new URL("/dashboard", request.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  // Protect User Dashboard Routes
  if (isDashboardRoute) {
    if (!sessionUser) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect away from login/register if already logged in
  if (isAuthRoute && sessionUser) {
    if (sessionUser.role === "ADMIN" || sessionUser.role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
