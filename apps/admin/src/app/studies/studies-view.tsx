"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SearchBar } from "./search-bar";
import { SemesterTabs } from "./semester-tabs";
import { SemesterLabel, Study } from "./types";

interface StudiesViewProps {
  initialData: Study[];
  currentSemester: SemesterLabel;
}

export function StudiesView({
  initialData,
  currentSemester,
}: StudiesViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle semester change by updating URL
  const handleSemesterChange = (semester: SemesterLabel) => {
    // Determine the query parameter value
    // If it's the default current semester (e.g. 25-2), we could clear the param,
    // but explicit is better for now given the requirements.
    // Wait, 25-2 is the calculated "current", so let's just push whatever is selected.
    router.push(`/studies?semester=${semester}`);
  };

  // Filter data based on search query (Client-side filtering of the server-fetched list)
  const filteredData = initialData.filter((study) => {
    const query = searchQuery.toLowerCase();
    return (
      study.studyName.toLowerCase().includes(query) ||
      study.primaryMentorName.toLowerCase().includes(query) ||
      (study.secondaryMentorName &&
        study.secondaryMentorName.toLowerCase().includes(query))
    );
  });

  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((study) => ({
        스터디명: study.studyName,
        멘토:
          study.primaryMentorName +
          (study.secondaryMentorName ? ` (${study.secondaryMentorName})` : ""),
        태그: study.tag,
        난이도: study.difficulty,
        요일:
          ["", "월", "화", "수", "목", "금", "토", "일"][study.weekDay] ||
          study.weekDay,
        시간: `${study.startTime} ~ ${study.endTime}`,
        장소: study.location,
        "한 줄 소개": study.oneLiner,
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Studies");
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `studies_${currentSemester}_${date}.xlsx`);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">스터디 목록</h1>
        <p className="text-muted-foreground">
          FORIF 스터디 강좌 목록을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <SemesterTabs
          currentSemester={currentSemester}
          onSemesterChange={handleSemesterChange}
        />
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleDownloadExcel}
        >
          <Download className="h-4 w-4" />
          엑셀로 다운로드
        </Button>
      </div>

      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* We don't need isLoading state here because the page transition handles it (Server Component) 
            or we could wrap in Suspense boundary in parent. 
            For client navigation, Next.js handles the loading state (or we can use useTransition).
            For now, instant transition or Next.js built-in loading is fine.
        */}
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
