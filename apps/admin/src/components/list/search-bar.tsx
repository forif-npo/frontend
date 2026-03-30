"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "목록 검색",
  onSearch,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
      <Input
        type="search"
        placeholder={placeholder}
        className="h-10 pl-10 pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch?.();
          }
        }}
      />
      <button
        type="button"
        onClick={onSearch}
        className="text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
}
