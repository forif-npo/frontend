import { i18n } from "@repo/core/i18n.config";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { auth } from "./auth";
import { routing } from "./i18n/routing";

const publicPages = ["/", "/signin"];

const handleI18nRouting = createMiddleware(routing);

const authMiddleware = auth((req) => {
  return handleI18nRouting(req);
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${i18n.locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  console.log(isPublicPage);

  if (isPublicPage) return handleI18nRouting(req);
  else return (authMiddleware as any)(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
