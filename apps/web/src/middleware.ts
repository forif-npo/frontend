import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/terms",
  "/privacy-policy",
  "/signup/complete",
  "/support/faqs",
  "/support/announcements",
  "/studies/list",
];
const publicParamsList = [
  "/studies/detail",
  "/studies/apply",
  "/studies/about",
];
const authRoutes = ["/signin", "/signup"];
const apiAuthPrefix = "/api/auth";

const authMiddleware = auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname.replace(
    /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/,
    "",
  );
  const isLoggedIn = !!req.auth && req.auth.isSignUp;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/support/announcements/");
  const isPublicParamsRoute = publicParamsList
    .map((v) => pathname.startsWith(v))
    .some(Boolean);

  if (isApiAuthRoute) return;
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL(`/`, nextUrl));
  }

  if (!isLoggedIn && !isAuthRoute && !isPublicRoute && !isPublicParamsRoute) {
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
