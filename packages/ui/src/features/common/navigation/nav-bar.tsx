"use client";
import { LoginIcon, SearchIcon } from "@repo/assets/icons/krds";
import { Button } from "@ui/components/client";
import { LinkButton } from "@ui/components/server";
import { ThemeToggles } from "@ui/features/common/theme";
import { cn } from "@ui/utils/cn";
import { NavigationBarProps } from "./types";

export function NavBar({ logo, items, rightSlot }: NavigationBarProps) {
  return (
    <nav className="bg-surface-white-subtle border-divider-gray-light flex h-[80px] items-center gap-16 border-b px-16">
      <div className="flex items-center gap-8">{logo}</div>
      <ul className="flex flex-grow gap-4">
        {items.map(({ label, href, active }) => (
          <li key={label}>
            <LinkButton
              link={href}
              className={cn(
                "text-text-subtle hover:text-text-primary",
                active && "text-text-basic font-semibold",
                "flex items-center gap-1 px-2 py-1",
              )}
            >
              {label}
            </LinkButton>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-1">
        <Button variant="text" size="small">
          <SearchIcon width={18} height={18} className="fill-text-subtle" />
        </Button>
        <Button variant="text" size="small">
          <LoginIcon width={18} height={18} className="fill-text-subtle" />
        </Button>
        <ThemeToggles />
        {rightSlot}
      </div>
    </nav>
  );
}
