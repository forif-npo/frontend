"use client";
import { LoginIcon, SearchIcon } from "@repo/assets/icons/krds";
import { Button } from "@ui/components/client";
import { Link, LinkButton, Title } from "@ui/components/server";
import { ThemeToggles } from "@ui/features/common/theme";
import { cn } from "@ui/utils/cn";
import { useEffect, useRef, useState } from "react";
import { NavigationBarProps } from "./types";

export function NavBar({ logo, items, rightSlot }: NavigationBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (label: string, hasSubMenus?: boolean) => {
    if (!hasSubMenus) return;
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="relative z-50">
      {openMenu && (
        <div className="fixed inset-0 z-40 bg-black/50" aria-hidden="true" />
      )}
      <nav
        ref={navRef}
        className={cn(
          "bg-surface-white border-b-divider-gray-light relative z-50 flex h-[80px] items-center gap-16 border-b px-16",
        )}
      >
        <Link
          onClick={() => setOpenMenu(null)}
          href="/"
          className="flex items-center gap-8"
        >
          {logo}
        </Link>
        <ul className="flex flex-grow justify-center gap-4">
          {items.map(({ label, href, subMenus, title, navigate }) => (
            <li key={label}>
              <Button
                size="medium"
                onClick={() => handleMenuClick(label, !!subMenus)}
                variant="text"
              >
                {label}
              </Button>

              {subMenus && openMenu === label && (
                <div
                  className="bg-surface-white border-divider-gray-light shadow-divider-primary-light absolute left-0 top-full z-50 w-full border-t px-16 py-4 shadow"
                  role="menubar"
                >
                  <div className="mb-4 flex flex-row items-center gap-4">
                    <Title className="py-2.5">{title || label}</Title>
                    <LinkButton
                      onClick={() => setOpenMenu(null)}
                      href={href}
                      size="small"
                      className="hidden sm:block"
                    >
                      {navigate}
                    </LinkButton>
                  </div>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {subMenus.map(({ label: subLabel, href: subHref }) => (
                      <li key={subLabel} className="py-2.5" role="menuitem">
                        <Link
                          size="m"
                          href={subHref}
                          onClick={() => setOpenMenu(null)}
                          className="text-text-basic"
                        >
                          {subLabel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <Button variant="text" size="small">
            <SearchIcon width={18} height={18} className="fill-text-subtle" />
          </Button>
          <Link href="/signin">
            <Button variant="text" size="small">
              <LoginIcon width={18} height={18} className="fill-text-subtle" />
            </Button>
          </Link>
          <ThemeToggles />
          {rightSlot}
        </div>
      </nav>
    </div>
  );
}
