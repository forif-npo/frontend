"use client";
import { CloseIcon } from "@repo/assets/icons/krds";
import { Home, Menu } from "@repo/assets/icons/lucide";
import { getStudyApplicationStatus } from "@/features/study/apply/api";
import { AlertModal, Button } from "@ui/components/client";
import { Link } from "@ui/components/server";
import { cn } from "@core/utils/cn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { getStudyApplicationBlockMessage } from "@/features/study/apply/application-availability";
import styles from "./nav-bar.module.css";

const NAV_LOGO_SRC = "/black_title.svg";

export type NavMenu = {
  label: string;
  title?: string;
  navigate?: string;
  href: string;
  external?: boolean;
  subMenus?: NavMenu[];
};

export interface NavigationBarProps {
  items: NavMenu[];
  isLoggedIn: boolean;
  rightSlot?: ReactNode;
}

export function NavBar({ items, rightSlot, isLoggedIn }: NavigationBarProps) {
  const router = useRouter();
  const navMenus: NavMenu[] = items;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [closingMenu, setClosingMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studyApplicationBlockedMessage, setStudyApplicationBlockedMessage] =
    useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null);

  const closeDesktopMenu = useCallback(() => {
    if (!openMenu) return;
    setClosingMenu(openMenu);
    setOpenMenu(null);
  }, [openMenu]);

  const handleMenuClick = (label: string, hasSubMenus?: boolean) => {
    if (!hasSubMenus) return;
    if (openMenu === label) {
      closeDesktopMenu();
      return;
    }
    setClosingMenu(null);
    setOpenMenu(label);
  };

  const handleStudyApplicationClick = async (
    event: ReactMouseEvent<HTMLAnchorElement>,
  ) => {
    if (!isLoggedIn) return;

    event.preventDefault();

    try {
      const status = await getStudyApplicationStatus();
      const blockMessage = getStudyApplicationBlockMessage(status);
      if (blockMessage) {
        setStudyApplicationBlockedMessage(blockMessage);
        return;
      }
    } catch {
      // 상태 조회에 실패하면 신청 페이지에서 다시 확인한다.
    }

    router.push("/studies/apply");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeDesktopMenu();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDesktopMenu();
        setMobileMenuOpen(false);
        window.requestAnimationFrame(() =>
          mobileMenuTriggerRef.current?.focus(),
        );
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [closeDesktopMenu]);

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

  useEffect(() => {
    const appContent = document.getElementById("app-content");
    if (!appContent) return;

    appContent.inert = mobileMenuOpen;

    return () => {
      appContent.inert = false;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const focusCloseButton = window.requestAnimationFrame(() => {
      mobileMenuCloseRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(focusCloseButton);
  }, [mobileMenuOpen]);

  const closeMobileMenu = (restoreFocus = true) => {
    setMobileMenuOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => mobileMenuTriggerRef.current?.focus());
    }
  };

  const handleMobileMenuKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key !== "Tab") return;

    const focusableElements =
      mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!navMenus) return null;

  return (
    <div className="relative z-50">
      {/* Desktop overlay */}
      {(openMenu || closingMenu) && (
        <div
          className="fixed inset-0 z-40 hidden bg-black/50 xl:block"
          aria-hidden="true"
        />
      )}

      {/* Mobile NavBar */}
      <nav
        aria-hidden={mobileMenuOpen}
        className="bg-surface-white/95 border-divider-gray-light fixed left-0 right-0 top-0 z-50 flex h-[64px] shrink-0 items-center justify-between gap-4 border-b px-4 backdrop-blur xl:hidden"
      >
        <Link href="/" className="flex items-center">
          <Image src={NAV_LOGO_SRC} width={62} height={40} alt="FORIF Logo" />
        </Link>
        <button
          ref={mobileMenuTriggerRef}
          onClick={() => setMobileMenuOpen(true)}
          className="border-border-gray-light bg-surface-white flex h-10 w-10 items-center justify-center rounded-full border shadow-sm"
          aria-label="전체 메뉴 열기"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={20} className="text-text-basic" />
        </button>
      </nav>

      {/* Mobile Full Menu Overlay */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          className="bg-surface-gray-subtler fixed inset-0 z-[100] flex flex-col overflow-y-auto xl:hidden"
          onKeyDown={handleMobileMenuKeyDown}
        >
          <h2 id="mobile-menu-title" className="sr-only">
            전체 메뉴
          </h2>
          {/* Mobile Menu Header */}
          <div className="bg-surface-white/95 border-divider-gray-light sticky top-0 z-10 flex h-[64px] shrink-0 items-center justify-between gap-4 border-b px-4 backdrop-blur">
            <Link
              href="/"
              onClick={() => closeMobileMenu(false)}
              className="flex items-center gap-2"
            >
              <Image
                src={NAV_LOGO_SRC}
                width={62}
                height={40}
                alt="FORIF Logo"
              />
            </Link>
            <button
              ref={mobileMenuCloseRef}
              onClick={() => closeMobileMenu()}
              className="flex h-10 w-10 items-center justify-center"
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
                onClick={() => closeMobileMenu(false)}
                className="bg-primary-50 rounded-2 flex h-12 items-center justify-center gap-2 text-[17px] font-bold leading-[1.5] text-white hover:font-bold"
              >
                {isLoggedIn ? "마이페이지" : "로그인"}
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/signup"
                  onClick={() => closeMobileMenu(false)}
                  className="border-border-gray-light text-text-basic rounded-2 flex h-12 items-center justify-center border text-[16px] font-semibold leading-[1.5]"
                >
                  회원가입
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {navMenus.map((menu) => (
                <section key={menu.label} className="flex flex-col gap-2">
                  <h2 className="text-text-basic px-1 text-[17px] font-bold leading-[1.5]">
                    {menu.label}
                  </h2>
                  <div className="rounded-3 bg-surface-white border-border-gray-light overflow-hidden border">
                    {menu.subMenus ? (
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 p-3">
                        {menu.subMenus.map((subMenu) => (
                          <Link
                            key={subMenu.label}
                            href={subMenu.href}
                            onClick={(event) => {
                              closeMobileMenu(false);
                              if (subMenu.href === "/studies/apply") {
                                void handleStudyApplicationClick(event);
                              }
                            }}
                            className="text-text-basic hover:bg-action-primary-hover rounded-2 px-3 py-3 text-[16px] leading-[1.5] hover:font-semibold"
                          >
                            {subMenu.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3">
                        <Link
                          href={menu.href}
                          target={menu.external ? "_blank" : undefined}
                          rel={
                            menu.external ? "noopener noreferrer" : undefined
                          }
                          onClick={() => closeMobileMenu(false)}
                          className="text-text-basic hover:bg-action-primary-hover rounded-2 block px-3 py-3 text-[16px] leading-[1.5] hover:font-semibold"
                        >
                          {menu.label} 바로가기
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <Link
              href="/"
              onClick={() => closeMobileMenu(false)}
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
          "bg-surface-white border-divider-gray-light fixed left-0 right-0 top-0 z-50 hidden h-[80px] items-center gap-16 border-b px-16 xl:flex",
        )}
      >
        <Link
          onClick={closeDesktopMenu}
          href="/"
          className="flex items-center gap-8"
        >
          <Image src={NAV_LOGO_SRC} width={87} height={56} alt="FORIF Logo" />
        </Link>
        <ul className="flex flex-grow justify-center gap-4">
          {navMenus.map(({ label, href, external, subMenus }) => (
            <li key={label}>
              {subMenus ? (
                <Button
                  aria-controls={`desktop-menu-${label}`}
                  aria-expanded={openMenu === label}
                  size="medium"
                  onClick={() => handleMenuClick(label, true)}
                  variant="text"
                >
                  {label}
                </Button>
              ) : (
                <Link
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  <Button size="medium" variant="text">
                    {label}
                  </Button>
                </Link>
              )}

              {subMenus && (openMenu === label || closingMenu === label) && (
                <div
                  id={`desktop-menu-${label}`}
                  className={`bg-surface-white border-divider-gray-light shadow-divider-primary-light absolute left-0 top-full z-50 w-full border-t px-16 py-4 shadow ${openMenu === label ? styles.menuOpen : styles.menuClose}`}
                  onAnimationEnd={() => {
                    if (closingMenu === label) setClosingMenu(null);
                  }}
                >
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {subMenus.map(({ label: subLabel, href: subHref }) => (
                      <li key={subLabel} className="py-2.5">
                        <Link
                          size="m"
                          href={subHref}
                          onClick={(event) => {
                            closeDesktopMenu();
                            if (subHref === "/studies/apply") {
                              void handleStudyApplicationClick(event);
                            }
                          }}
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
        <div className="flex shrink-0 items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link href="/my">
                <Button variant="text" size="medium">
                  마이페이지
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup">
                <Button
                  variant="text"
                  size="medium"
                  className="whitespace-nowrap"
                >
                  회원가입
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  variant="secondary"
                  size="medium"
                  className="whitespace-nowrap"
                >
                  로그인
                </Button>
              </Link>
            </>
          )}
          {rightSlot}
        </div>
      </nav>
      <AlertModal
        isOpen={studyApplicationBlockedMessage !== null}
        description={studyApplicationBlockedMessage ?? ""}
        descriptionClassName="w-full text-center"
        onClose={() => setStudyApplicationBlockedMessage(null)}
        onConfirm={() => setStudyApplicationBlockedMessage(null)}
        showCancelButton={false}
      />
    </div>
  );
}
