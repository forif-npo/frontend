"use client";

import { SearchIcon } from "@repo/assets/icons/krds";
import { useState } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder: string;
};

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
}: SearchBarProps) {
  const [isComposing, setIsComposing] = useState(false);

  return (
    <form
      className="relative w-full"
      onSubmit={(event) => {
        event.preventDefault();
        if (!isComposing) onSearch();
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={placeholder}
        className="border-divider-gray-light focus:border-divider-gray w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && isComposing) {
            e.preventDefault();
          }
        }}
      />

      <button
        type="submit"
        aria-label="검색"
        className="hover:bg-gray-5 active:bg-gray-10 absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2"
      >
        <SearchIcon width={18} height={18} className="fill-text-subtle" />
      </button>
    </form>
  );
}
