"use client";
import { CloseIcon, LoginIcon } from "@repo/assets/icons/krds";
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
      <nav className="bg-surface-white/95 border-divider-gray-light sticky top-0 z-50 flex h-[64px] items-center justify-between gap-4 border-b px-4 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center">
          <Image src={NavLogo} width={62} height={40} alt="FORIF Logo" />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="border-border-gray-light bg-surface-white flex h-10 w-10 items-center justify-center rounded-full border shadow-sm"
          aria-label="전체 메뉴 열기"
          aria-expanded={mobileMenuOpen}
        >
          <Menu size={20} className="text-text-basic" />
        </button>
      </nav>

      {/* Mobile Full Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#f6f8fb] md:hidden">
          {/* Mobile Menu Header */}
          <div className="bg-surface-white/95 border-divider-gray-light sticky top-0 z-10 flex h-[64px] items-center justify-between border-b px-4 backdrop-blur">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Image src={NavLogo} width={62} height={40} alt="FORIF Logo" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="border-border-gray-light bg-surface-white flex h-10 w-10 items-center justify-center rounded-full border"
              aria-label="전체 메뉴 닫기"
            >
              <CloseIcon width={20} height={20} className="fill-text-basic" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex flex-1 flex-col gap-4 px-4 py-5">
            <div className="rounded-3 bg-surface-white border-border-gray-light flex flex-col gap-4 border p-5 shadow-[0_12px_32px_rgba(30,33,36,0.08)]">
              <div>
                <p className="text-text-basic text-[19px] font-bold leading-[1.5]">
                  FORIF에서 함께 성장해요
                </p>
                <p className="text-text-subtle mt-1 text-[15px] leading-[1.5]">
                  스터디, 해커톤, 공지사항을 빠르게 확인할 수 있어요.
                </p>
              </div>
              <Link
                href={isLoggedIn ? "/my" : "/signin"}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-primary-50 rounded-2 flex h-12 items-center justify-center gap-2 text-[17px] font-bold leading-[1.5] text-white hover:font-bold"
              >
                {!isLoggedIn && (
                  <LoginIcon width={18} height={18} className="fill-white" />
                )}
                {isLoggedIn ? "마이 페이지" : "로그인하기"}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {navMenus.map((menu) => (
                <section
                  key={menu.label}
                  className="rounded-3 bg-surface-white border-border-gray-light overflow-hidden border"
                >
                  <Link
                    href={menu.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="border-divider-gray-light flex items-center justify-between border-b px-5 py-4"
                  >
                    <span className="text-text-basic text-[17px] font-bold leading-[1.5]">
                      {menu.label}
                    </span>
                    <span
                      className="text-text-subtle text-[15px] leading-[1.5]"
                      aria-hidden="true"
                    >
                      바로가기
                    </span>
                  </Link>

                  {/* Sub Menu Grid */}
                  {menu.subMenus && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 p-3">
                      {menu.subMenus.map((subMenu) => (
                        <Link
                          key={subMenu.label}
                          href={subMenu.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-text-basic rounded-2 px-3 py-3 text-[16px] leading-[1.5] hover:bg-[#eef4ff] hover:font-semibold"
                        >
                          {subMenu.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-text-subtle rounded-2 mb-2 flex items-center justify-center gap-2 py-3 text-[15px] leading-[1.5]"
            >
              <Home size={18} />
              FORIF 홈으로
            </Link>
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
          {isLoggedIn ? (
            <Link href="/my">
              <Button variant="text" size="medium">
                마이 페이지
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
