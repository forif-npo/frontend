"use client";

import { useId } from "react";
import { Select } from "@ui/components/client";

export type StudySortOrder = "latest" | "oldest";

interface StudySortControlProps {
  value: StudySortOrder;
  onChange: (value: StudySortOrder) => void;
}

export function StudySortControl({ value, onChange }: StudySortControlProps) {
  const selectId = useId();

  return (
    <div className="flex shrink-0 items-center gap-3">
      <p className="text-body-medium whitespace-nowrap font-bold">정렬기준</p>
      <Select
        id={`study-sort-${selectId}`}
        variant="text"
        size="sm"
        noPadding
        value={value}
        onChange={(nextValue) => onChange(nextValue as StudySortOrder)}
        placeholder="정렬기준"
        dropdownAlign="right"
        options={[
          { value: "latest", label: "최신순" },
          { value: "oldest", label: "오래된순" },
        ]}
      />
    </div>
  );
}
