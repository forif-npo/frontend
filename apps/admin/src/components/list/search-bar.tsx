"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  autoFocus?: boolean;
  selectOnFocus?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "목록 검색",
  onSearch,
  autoFocus = false,
  selectOnFocus = false,
  inputRef,
}: SearchBarProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.();
  };

  return (
    <form className="relative w-full max-w-sm" onSubmit={handleSubmit}>
      <Input
        type="search"
        placeholder={placeholder}
        className="h-10 pr-10"
        autoFocus={autoFocus}
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(event) => selectOnFocus && event.currentTarget.select()}
      />
      {onSearch && (
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="text-muted-foreground absolute right-0.5 top-1/2 size-9 -translate-y-1/2"
          aria-label="검색"
        >
          <Search />
        </Button>
      )}
    </form>
  );
}
