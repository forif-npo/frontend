import { ThemeProvider } from "@repo/core/theme-provider";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { NAV_MENUS } from "@/constants/nav-menu.constant";
import { NavBar } from "@/features/navigation/nav-bar";
import ThemedNavLogo from "@/features/theme/themed-nav-logo";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
export const metadata: Metadata = {
  title: "FORIF WEB",
  description: "포리프 웹사이트",
};
// Use module resolution for shared font asset instead of deep relative path to avoid crossing repo root during Next resolution.
const pretendard = localFont({
  src: "../../../../packages/assets/fonts/PretendardGOVVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isLoggedIn = !!session && session.isSignUp;

  return (
    <html
      lang={"ko"}
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
            <NavBar
              logo={<ThemedNavLogo />}
              items={NAV_MENUS}
              isLoggedIn={isLoggedIn}
            />
            {children}
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
