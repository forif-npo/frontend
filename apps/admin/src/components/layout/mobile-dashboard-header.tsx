"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

/** Mobile-only global navigation for authenticated admin pages. */
export function MobileDashboardHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center bg-neutral-950 px-2 text-white md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 text-white hover:bg-white/10 hover:text-white"
        onClick={toggleSidebar}
        aria-label="메뉴 열기"
      >
        <Menu className="size-5" />
      </Button>

      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-wide"
      >
        FORIF Admin
      </Link>
    </header>
  );
}
