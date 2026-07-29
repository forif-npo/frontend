"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadSemesterOptions, toTabOptions } from "@/lib/semester";

interface SemesterTabsProps {
  currentSemester: string;
  onSemesterChange: (semester: string) => void;
  /** "그 외" 탭 노출 여부 */
  includeEtc?: boolean;
  /** 옵션을 직접 지정할 때 (지정하면 서버 목록 대신 사용) */
  options?: string[];
}

export function SemesterTabs({
  currentSemester,
  onSemesterChange,
  includeEtc = true,
  options,
}: SemesterTabsProps) {
  // 학기 목록과 "현재학기" 표시는 운영진이 지정한 활동 학기를 따른다
  const [serverOptions, setServerOptions] = useState<string[] | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    loadSemesterOptions()
      .then(({ current, recentLabels }) => {
        if (canceled) return;
        setCurrentLabel(current.label);
        setServerOptions(toTabOptions(recentLabels, includeEtc));
      })
      .catch(() => {
        // 조회 실패 시 잘못된 학기를 보여주지 않도록 "전체"만 남긴다
      });
    return () => {
      canceled = true;
    };
  }, [includeEtc]);

  const tabOptions = options ?? serverOptions ?? ["전체"];

  return (
    <Tabs
      value={currentSemester}
      onValueChange={onSemesterChange}
      className="w-full"
    >
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        {tabOptions.map((semester) => (
          <TabsTrigger
            key={semester}
            value={semester}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-muted text-muted-foreground rounded-full px-4"
          >
            {semester === currentLabel ? `현재학기 (${semester})` : semester}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
