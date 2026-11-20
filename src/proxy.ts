import { NextResponse, type NextRequest } from "next/server";

const sessionCookieNames = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session_data",
  "__Secure-better-auth.session_data",
];

export function proxy(request: NextRequest) {
  const hasSessionCookie = sessionCookieNames.some((name) =>
    request.cookies.has(name),
  );

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
