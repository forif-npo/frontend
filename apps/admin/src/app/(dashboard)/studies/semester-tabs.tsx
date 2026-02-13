"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SemesterLabel } from "./types";

interface SemesterTabsProps {
  currentSemester: SemesterLabel;
  onSemesterChange: (semester: SemesterLabel) => void;
}

export const SEMESTER_OPTIONS: SemesterLabel[] = [
  "전체",
  "25-2",
  "25-1",
  "24-2",
  "24-1",
  "23-2",
  "23-1",
  "그 외",
];

export function SemesterTabs({
  currentSemester,
  onSemesterChange,
}: SemesterTabsProps) {
  return (
    <Tabs
      value={currentSemester}
      onValueChange={(val) => onSemesterChange(val as SemesterLabel)}
      className="w-full"
    >
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        {SEMESTER_OPTIONS.map((semester) => (
          <TabsTrigger
            key={semester}
            value={semester}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-muted text-muted-foreground rounded-full px-4"
          >
            {semester === "25-2" ? `현재학기 (${semester})` : semester}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
