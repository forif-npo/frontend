"use client";

import { LoginIcon, SearchIcon } from "@repo/assets/icons";
import { Link } from "@ui/components";
import { cn } from "@ui/utils/cn";
import { NavigationBarProps } from "./types";

export function NavBar({ logo, items }: NavigationBarProps) {
  return (
    <nav className="bg-surface-white border-divider-gray-light flex h-[80px] items-center gap-16 border-b p-16">
      <div className="flex items-center gap-8">{logo}</div>
      <ul className="flex flex-grow gap-4">
        {items.map(({ label, href, active }) => (
          <li key={label}>
            <Link
              href={href}
              className={cn(
                "text-text-subtle hover:text-text-primary",
                active && "text-text-basic font-semibold",
                "flex items-center gap-1 px-2 py-1",
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <button className="flex h-14 cursor-pointer items-center justify-center px-3">
          <SearchIcon width={20} height={20} />
        </button>
        <button className="flex h-14 cursor-pointer items-center justify-center px-3">
          <LoginIcon width={20} height={20} />
        </button>
      </div>
    </nav>
  );
}
