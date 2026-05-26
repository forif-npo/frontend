"use client";
import React from "react";
import clsx from "clsx";

interface StudySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  size?: "default" | "compact";
  className?: string;
}

export const StudySearchBar: React.FC<StudySearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "스터디 제목이나 멘토명을 검색해보세요",
  size = "default",
  className = "",
}) => {
  const [isComposing, setIsComposing] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isComposing) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      onSubmit();
    }
  };

  const isCompact = size === "compact";

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx("flex-1", !isCompact && "md:max-w-[588px]", className)}
    >
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={clsx(
            "w-full rounded-lg border focus:border-blue-500 focus:outline-none",
            isCompact
              ? "h-12 px-4 pr-10 text-[15px]"
              : "h-14 px-4 pr-12 text-[17px]",
          )}
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 transform"
          aria-label="검색"
        >
          <svg
            width={isCompact ? 20 : 24}
            height={isCompact ? 20 : 24}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#8A949E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};
