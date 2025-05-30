import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@repo/core/theme-provider";
import type { Metadata } from "next";

import { NAV_MENUS } from "@/constants/nav-menu.constant";
import LocaleSwitcher from "@/features/locale/locale-switcher";
import ThemedNavLogo from "@/features/theme/themed-nav-logo";
import { NavBar, NavMenu } from "@ui/features/common/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SearchParams } from "nuqs/server";
import "../globals.css";
export const metadata: Metadata = {
  title: "FORIF WEB",
  description: "포리프 웹사이트",
};
const pretendard = localFont({
  src: "../../../../../packages/assets/fonts/PretendardGOVVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<SearchParams>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations("Nav");
  const navMenus: NavMenu[] = NAV_MENUS.map((menu) => {
    return {
      title: t(menu.title!),
      label: t(menu.label!),
      href: menu.href,
      navigate: t("club.navigate"),
      subMenus: menu.subMenus?.map((subMenu) => ({
        ...subMenu,
        label: t(subMenu.label!), // subMenu의 label만 번역
      })),
    };
  });
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${pretendard.variable}`}
    >
      <body
        style={{ backgroundColor: "var(--background)" }}
        className="scrollbar-hidden"
      >
        <ThemeProvider
          defaultTheme="light"
          enableColorScheme
          themes={["light", "high-contrast"]}
        >
          <NuqsAdapter>
            <NextIntlClientProvider>
              <NavBar
                logo={<ThemedNavLogo />}
                rightSlot={<LocaleSwitcher />}
                items={navMenus}
              />
              {children}
            </NextIntlClientProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
