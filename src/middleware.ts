import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Public routes
  const publicPaths = [
    "/login",
    "/signup",
    "/signup/admin",
    "/signup/client",
    "/signup/admin-psj",
    "/verifyemail",
  ];

  // ✅ Allow API & Next internals always
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(pathname);

  const token = request.cookies.get("token")?.value;

  // 🔒 If NOT public & no token → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 If public & already logged in → redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/singup',
        '/verifyemail',
        '/psj',
        '/dashboard',
        '/psj/dashboard',
        "/signup/admin",
        '/signup/client',
        '/signup/admin-psj'
    ]
}