import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@repo/core/theme-provider";
import { NavBar } from "@repo/ui/features/common/navigation/nav-bar";
import type { Metadata } from "next";

import { NAV_MENUS } from "@/constants/nav-menu.constant";
import LocaleSwitcher from "@/features/locale/locale-switcher";
import ThemedNavLogo from "@/features/theme/themed-nav-logo";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SearchParams } from "nuqs/server";
import "../globals.css";
export const metadata: Metadata = {
  title: "FORIF WEB",
  description: "포리프 웹사이트",
};

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
  return (
    <html lang={locale} suppressHydrationWarning>
      <body style={{ backgroundColor: "var(--background)" }}>
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
              />
              {children}
            </NextIntlClientProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
