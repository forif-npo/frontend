"use client";

import { SearchIcon } from "@repo/assets/icons/krds";

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
  return (
    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-divider-gray-light focus:border-divider-gray w-full rounded-lg border px-4 py-3 pr-10 text-sm outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />

      {/* Search Button */}
      <button
        type="button"
        onClick={onSearch}
        aria-label="검색"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-gray-100"
      >
        <SearchIcon width={18} height={18} className="fill-text-subtle" />
      </button>
    </div>
  );
}
