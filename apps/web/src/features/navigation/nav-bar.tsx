"use client";
import {
  CloseIcon,
  LoginIcon,
  MyIcon,
  SearchIcon,
} from "@repo/assets/icons/krds";
import { Home, Menu } from "@repo/assets/icons/lucide";
import NavLogo from "@repo/assets/images/nav_logo.png";
import { Button } from "@ui/components/client";
import { Link, LinkButton, Title } from "@ui/components/server";
import { cn } from "@ui/utils/cn";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";

export type NavMenu = {
  label: string;
  title?: string;
  navigate?: string;
  href: string;
  subMenus?: NavMenu[];
};

export interface NavigationBarProps {
  items: NavMenu[];
  isLoggedIn: boolean;
  rightSlot?: ReactNode;
}

export function NavBar({ items, rightSlot, isLoggedIn }: NavigationBarProps) {
  const navMenus: NavMenu[] = items;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  if (!navMenus) return null;

  return (
    <div className="relative z-50">
      {/* Desktop overlay */}
      {openMenu && (
        <div
          className="fixed inset-0 z-40 hidden bg-black/50 md:block"
          aria-hidden="true"
        />
      )}

      {/* Mobile NavBar */}
      <nav className="bg-surface-white border-divider-gray-light flex h-[72px] items-center justify-between gap-4 border-b p-4 md:hidden">
        <Link href="/" className="flex items-center">
          <Image src={NavLogo} width={68} height={44} alt="FORIF Logo" />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-1"
        >
          <Menu size={20} className="text-text-basic" />
          <span className="text-text-basic text-[17px] font-bold leading-[1.5]">
            전체메뉴
          </span>
        </button>
      </nav>

      {/* Mobile Full Menu Overlay */}
      {mobileMenuOpen && (
        <div className="bg-surface-white fixed inset-0 z-[100] flex flex-col overflow-y-auto md:hidden">
          {/* Mobile Menu Header */}
          <div className="border-divider-gray-light flex h-[72px] items-center justify-between border-b p-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Home size={20} className="text-text-basic" />
              <span className="text-[17px] font-bold leading-[1.5] text-black">
                FORIF 홈
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 rounded-lg px-3 py-1"
            >
              <CloseIcon width={20} height={20} className="fill-text-basic" />
              <span className="text-text-basic text-[17px] font-bold leading-[1.5]">
                닫기
              </span>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1">
            {navMenus.map((menu, index) => (
              <div key={menu.label}>
                <div className="flex flex-col gap-4 p-4">
                  {/* Menu Category Header */}
                  <Link
                    href={menu.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <span className="text-[17px] font-bold leading-[1.5] text-black">
                      {menu.label}
                    </span>
                  </Link>

                  {/* Divider line */}
                  <div className="border-divider-gray-light h-0 w-full border-t" />

                  {/* Sub Menu Grid */}
                  {menu.subMenus && (
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      {menu.subMenus.map((subMenu) => (
                        <Link
                          key={subMenu.label}
                          href={subMenu.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-[17px] leading-[1.5] text-black"
                        >
                          {subMenu.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Divider */}
                {index < navMenus.length - 1 && (
                  <div className="bg-divider-gray-light h-6 w-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop NavBar */}
      <nav
        ref={navRef}
        className={cn(
          "bg-surface-white border-divider-gray-light relative z-50 hidden h-[80px] items-center gap-16 border-b px-16 md:flex",
        )}
      >
        <Link
          onClick={() => setOpenMenu(null)}
          href="/"
          className="flex items-center gap-8"
        >
          <Image src={NavLogo} width={87} height={56} alt="FORIF Logo" />
        </Link>
        <ul className="flex flex-grow justify-center gap-4">
          {navMenus.map(({ label, href, subMenus, title, navigate }) => (
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
          {isLoggedIn ? (
            <Link href="/my">
              <Button variant="text" size="small">
                <MyIcon width={18} height={18} className="fill-text-subtle" />
              </Button>
            </Link>
          ) : (
            <Link href="/signin">
              <Button variant="text" size="small">
                <LoginIcon
                  width={18}
                  height={18}
                  className="fill-text-subtle"
                />
              </Button>
            </Link>
          )}
          {rightSlot}
        </div>
      </nav>
    </div>
  );
}
