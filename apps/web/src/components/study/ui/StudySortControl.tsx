"use client";

export type StudySortOrder = "latest" | "oldest";

interface StudySortControlProps {
  value: StudySortOrder;
  onChange: (value: StudySortOrder) => void;
}

export function StudySortControl({ value, onChange }: StudySortControlProps) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <p className="text-body-medium whitespace-nowrap font-bold">정렬기준</p>
      <button
        type="button"
        onClick={() => onChange(value === "latest" ? "oldest" : "latest")}
        className="bg-action-secondary border-border-transparency rounded-small2 text-label-medium text-text-basic cursor-pointer border px-2 py-0"
      >
        {value === "latest" ? "최신순" : "오래된순"}
      </button>
    </div>
  );
}
