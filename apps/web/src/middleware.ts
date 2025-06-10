import { i18n } from "@repo/core/i18n.config";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { auth } from "./auth";
import { routing } from "./i18n/routing";

const publicRoutes = ["/", "/studies"];
const authRoutes = ["/signin"];
const apiAuthPrefix = "/api/auth";

const handleI18nRouting = createMiddleware(routing);

const authMiddleware = auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname.replace(
    /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/,
    "",
  );
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isApiAuthRoute) return;
  if (isLoggedIn && isAuthRoute) {
    console.log("already logged in");
    return Response.redirect(new URL(`/`, nextUrl));
  }

  if (!isLoggedIn && !isAuthRoute) {
    return Response.redirect(new URL(`/signin`, nextUrl));
  }
  return handleI18nRouting(req);
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${i18n.locales.join("|")}))?(${publicRoutes
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) return handleI18nRouting(req);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else return (authMiddleware as any)(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
