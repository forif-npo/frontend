"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActivitySemesterToggleProps {
  currentSemester: string;
  previousSemester?: string;
  selectedSemester: string;
  onSemesterChange: (semester: string) => void;
}

/** 발급 업무에서 현재·직전 학기만 전환하는 고정 세그먼트 탭 */
export function ActivitySemesterToggle({
  currentSemester,
  previousSemester,
  selectedSemester,
  onSemesterChange,
}: ActivitySemesterToggleProps) {
  return (
    <Tabs
      value={selectedSemester}
      onValueChange={onSemesterChange}
      className="w-fit"
    >
      <TabsList aria-label="발급 대상 학기" className="h-11 gap-1 rounded-lg">
        <TabsTrigger
          value={currentSemester}
          className="h-9 gap-2 rounded-md px-4"
        >
          <span>현재 학기</span>
          <span className="text-muted-foreground text-xs">
            {currentSemester}
          </span>
        </TabsTrigger>
        {previousSemester && previousSemester !== currentSemester && (
          <TabsTrigger
            value={previousSemester}
            className="h-9 gap-2 rounded-md px-4"
          >
            <span>직전 학기</span>
            <span className="text-muted-foreground text-xs">
              {previousSemester}
            </span>
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
}
