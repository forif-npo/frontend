import type { Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
        <NuqsAdapter>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">{children}</main>
          </SidebarProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
