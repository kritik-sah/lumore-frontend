import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const user = req.cookies.get("user")?.value;
  const { pathname } = req.nextUrl;

  // Allow access to login page without authentication
  if (pathname.startsWith("/app/login")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/app/referral")) {
    return NextResponse.next();
  }

  const hasRecoverableSession = Boolean(user && (accessToken || refreshToken));

  // If no recoverable session and not on a public page, redirect to login
  if (!hasRecoverableSession) {
    return NextResponse.redirect(new URL("/app/login", req.url));
  }

  return NextResponse.next(); // Allow request to proceed
}

// Apply middleware only to protected routes, excluding `/app/login`
export const config = {
  matcher: ["/app/:path*"],
};
