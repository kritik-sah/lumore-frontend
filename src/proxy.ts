import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value; // Get token from cookies
  const { pathname } = req.nextUrl;

  // Allow access to login page without authentication
  if (pathname.startsWith("/app/login")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/app/referral")) {
    return NextResponse.next();
  }

  // If no token and not on a public page, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/app/login", req.url));
  }

  return NextResponse.next(); // Allow request to proceed
}

// Apply middleware only to protected routes, excluding `/app/login`
export const config = {
  matcher: ["/app/:path*"],
};
