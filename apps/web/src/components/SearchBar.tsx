"use client";

import { SearchIcon } from "@repo/assets/icons/krds";
import clsx from "clsx";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  size?: "default" | "compact";
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "검색어를 입력해주세요",
  size = "default",
  className,
}: SearchBarProps) {
  const [isComposing, setIsComposing] = React.useState(false);
  const isCompact = size === "compact";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isComposing) onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx("flex-1", !isCompact && "md:max-w-[588px]", className)}
    >
      <div className="relative">
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !isComposing) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder={placeholder}
          className={clsx(
            "border-input-border bg-input-surface text-text-basic placeholder:text-text-subtle focus:border-input-border-active focus:ring-border-input-border-active w-full rounded-lg border focus:outline-none focus:ring-1",
            isCompact
              ? "h-12 px-4 pr-10 text-[15px]"
              : "h-14 px-4 pr-12 text-[17px]",
          )}
        />
        <button
          type="submit"
          className="text-text-subtle hover:text-text-basic focus-visible:ring-border-gray-dark absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors focus:outline-none focus-visible:ring-2"
          aria-label="검색"
        >
          <SearchIcon
            width={isCompact ? 20 : 24}
            height={isCompact ? 20 : 24}
          />
        </button>
      </div>
    </form>
  );
}
