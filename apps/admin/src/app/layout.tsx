import type { Metadata } from "next";

import { auth } from "@/auth";
import { ApiClientProvider } from "@/providers/ApiClientProvider";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "FORIF Operator",
  description: "FORIF 운영진을 위한 관리자 페이지",
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
        <SessionProvider session={session}>
          <ApiClientProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </ApiClientProvider>
        </SessionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
