import { ThemeProvider } from "@repo/core/theme-provider";
import type { Metadata } from "next";

import localFont from "next/font/local";
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
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
