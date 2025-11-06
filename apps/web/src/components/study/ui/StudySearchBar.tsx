"use client";
import React from "react";

interface StudySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
}

export const StudySearchBar: React.FC<StudySearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "스터디 제목이나 멘토명을 검색해보세요",
  className = "",
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-[588px] flex-1 ${className}`}
    >
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-lg border px-4 pr-12 text-[17px] focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 transform"
          aria-label="검색"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
