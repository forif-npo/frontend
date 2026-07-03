"use client";

import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { SemesterTabs } from "@/components/list/semester-tabs";
import { Button } from "@/components/ui/button";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

import { columns } from "./columns";
import { Mentor, MentorSemesterLabel } from "./types";

interface MentorsViewProps {
  initialData: Mentor[];
  currentSemester: MentorSemesterLabel;
  totalElements?: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  initialSearch?: string;
}

export function MentorsView({
  initialData,
  currentSemester,
  totalElements = 0,
  currentPage = 0,
  totalPages = 1,
  pageSize = 20,
  initialSearch = "",
}: MentorsViewProps) {
  const {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
  } = useListViewFilters({
    route: "/mentors",
    currentSemester,
    initialSearch,
  });

  const handleDownloadExcel = () => {
    if (initialData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      initialData.map((mentor) => ({
        학번: mentor.userId,
        학과: mentor.department,
        이름: mentor.name,
        전화번호: mentor.phoneNum,
        스터디명: mentor.studyName,
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mentors");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `mentors_${currentSemester}_${date}.xlsx`);
  };

  const handleDeleteMentor = (mentor: Mentor) => {
    console.log("멘토 삭제", mentor);
  };

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">멘토 목록</h1>
        <p className="text-muted-foreground">
          2018년 1학기부터 2026년 1학기까지의 멘토 목록입니다.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
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
          onSearch={handleSearch}
          placeholder="멘토 이름을 검색해보세요"
        />

        <DataTable
          columns={columns}
          data={initialData}
          showPagination={false}
          renderRowActions={(mentor) => (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleDeleteMentor(mentor)}
            >
              멘토 삭제
            </DropdownMenuItem>
          )}
        />

        <OffsetPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={displayTotalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
