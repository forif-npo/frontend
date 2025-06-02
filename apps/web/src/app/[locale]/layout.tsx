import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@repo/core/theme-provider";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { NAV_MENUS } from "@/constants/nav-menu.constant";
import LocaleSwitcher from "@/features/locale/locale-switcher";
import { NavBar } from "@/features/navigation/nav-bar";
import ThemedNavLogo from "@/features/theme/themed-nav-logo";
import { hasLocale, NextIntlClientProvider } from "next-intl";
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
  const session = await auth();
  const isLoggedIn = !!session?.user;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

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
                items={NAV_MENUS}
                isLoggedIn={isLoggedIn}
              />
              {children}
            </NextIntlClientProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
