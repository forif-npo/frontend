import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const publicRoutes = ["/signin"];
const authRoutes = ["/signin"];
const apiAuthPrefix = "/api/auth";

const authMiddleware = auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname.replace(
    /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/,
    "",
  );
  // admin 앱은 운영진(ADMIN) 세션만 로그인으로 인정한다.
  // 멘토/부원 세션(role: MENTOR/USER)은 로그인 안 된 것으로 취급해 /signin으로 보낸다.
  const isLoggedIn = !!req.auth && req.auth.role === "ADMIN";
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isApiAuthRoute) return;
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL(`/`, nextUrl));
  }

  if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
    return Response.redirect(new URL(`/signin`, nextUrl));
  }
  return NextResponse.next();
});

export default function middleware(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (authMiddleware as any)(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
