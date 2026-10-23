import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "pdvolts_session";
const secretKey = process.env.JWT_SECRET || "pdvolts_ultra_secure_jwt_signing_secret_key_prod_2026";
const encodedKey = new TextEncoder().encode(secretKey);

// Public routes accessible without logging in
const PUBLIC_AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow Next.js static files, images, uploads, and public static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  const isAuthRoute = PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // 2. Verify Session JWT Token
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

  // 3. If NOT logged in: Gate everything and redirect to /login
  if (!sessionUser) {
    // If already requesting login, register, or forgot-password, let them through
    if (isAuthRoute) {
      return NextResponse.next();
    }

    // For any API route (except /api/auth/* which was allowed above), return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Redirect to /login with callbackUrl so they return to their requested page after login
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 4. If logged in and visits /login or /register, redirect to Home or Admin
  if (isAuthRoute) {
    if (sessionUser.role === "ADMIN" || sessionUser.role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5. Protect Admin Control Panel routes (only ADMIN & SUPER_ADMIN)
  if (pathname.startsWith("/admin")) {
    if (sessionUser.role !== "ADMIN" && sessionUser.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard?error=unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
