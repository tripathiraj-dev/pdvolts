import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "pdvolts_session";
const secretKey = process.env.JWT_SECRET || "pdvolts_ultra_secure_jwt_signing_secret_key_prod_2026";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static files & public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Read session JWT token
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

  // NOTE: /login, /register, /forgot-password, /reset-password are fully accessible
  // DO NOT redirect them away so users can always open login and register freely!

  // 3. Protect /admin routes (Only ADMIN & SUPER_ADMIN allowed)
  if (pathname.startsWith("/admin")) {
    if (!sessionUser) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (sessionUser.role !== "ADMIN" && sessionUser.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard?error=unauthorized", request.url));
    }
  }

  // 4. Protect /dashboard routes (Any logged-in user allowed)
  if (pathname.startsWith("/dashboard")) {
    if (!sessionUser) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Everything else is public (Home, Products, Raw Materials, Blog, About, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
