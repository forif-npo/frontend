"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { SearchBar } from "@/components/list/search-bar";
import { SemesterTabs } from "@/components/list/semester-tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";
import { columns } from "./columns";
import { SemesterLabel, Study } from "./types";

interface StudiesViewProps {
  initialData: Study[];
  currentSemester: SemesterLabel;
  hasNext?: boolean;
  nextCursor?: number | null;
  totalElements?: number;
}

export function StudiesView({
  initialData,
  currentSemester,
  hasNext = false,
  nextCursor = null,
  totalElements = 0,
}: StudiesViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSemesterChange = (semester: string) => {
    router.push(`/studies?semester=${semester}`);
  };

  const filteredData = initialData.filter((study) => {
    const query = searchQuery.toLowerCase();
    return (
      study.study_name.toLowerCase().includes(query) ||
      study.primary_mentor_name.toLowerCase().includes(query) ||
      (study.secondary_mentor_name &&
        study.secondary_mentor_name.toLowerCase().includes(query)) ||
      study.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : filteredData.length;

  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((study) => ({
        ID: study.id,
        스터디명: study.study_name,
        멘토:
          study.primary_mentor_name +
          (study.secondary_mentor_name
            ? ` (${study.secondary_mentor_name})`
            : ""),
        태그: study.tags.join(", "),
        "한 줄 소개": study.one_liner,
        멘티수: study.mentee_count,
        모집상태: study.recruit_status === "APPLICABLE" ? "모집중" : "마감",
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Studies");
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `studies_${currentSemester}_${date}.xlsx`);
  };

  const handleEditStudy = (study: Study) => {
    console.log("스터디 정보 수정", study);
  };

  const handleDeleteStudy = (study: Study) => {
    console.log("스터디 정보 삭제", study);
  };

  const handleAddMentee = (study: Study) => {
    console.log("멘티 추가", study);
  };

  const handleRemoveMentee = (study: Study) => {
    console.log("멘티 삭제", study);
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
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="스터디 목록 검색"
        />

        <DataTable
          columns={columns}
          data={filteredData}
          renderRowActions={(study) => (
            <>
              <DropdownMenuItem onClick={() => handleEditStudy(study)}>
                스터디 정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeleteStudy(study)}
              >
                스터디 정보 삭제
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAddMentee(study)}>
                멘티 추가
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRemoveMentee(study)}>
                멘티 삭제
              </DropdownMenuItem>
            </>
          )}
        />

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>총 {displayTotalCount}건</span>
          {hasNext && nextCursor !== null && (
            <span>다음 커서: {nextCursor}</span>
          )}
        </div>
      </div>
    </div>
  );
}
