import type { Metadata } from "next";

import { auth } from "@/auth";
import { NAV_MENUS } from "@/constants/nav-menu.constant";
import { Footer } from "@/features/navigation/footer";
import { NavBar } from "@/features/navigation/nav-bar";
import { MSWProvider } from "@/mocks/MSWProvider";
import { ApiClientProvider } from "@/providers/ApiClientProvider";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
export const metadata: Metadata = {
  title: "FORIF WEB",
  description: "포리프 웹사이트",
};

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
      className={`${pretendard.variable} overflow-x-hidden`}
    >
      <body
        style={{ backgroundColor: "var(--background)" }}
        className="scrollbar-hidden overflow-x-hidden"
      >
        <SessionProvider session={session}>
          <ApiClientProvider>
            <MSWProvider>
              <NuqsAdapter>
                <NavBar items={NAV_MENUS} isLoggedIn={isLoggedIn} />
                {children}
                <Footer />
              </NuqsAdapter>
            </MSWProvider>
          </ApiClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
