"use client";

import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { SemesterTabs } from "@/components/list/semester-tabs";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { formatPhoneNumber } from "@core/utils/phone-number";
import { Download } from "lucide-react";
import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { fetchMentors } from "./api";
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
  initialSorting?: SortingState;
}

export function MentorsView({
  initialData,
  currentSemester,
  totalElements = 0,
  currentPage = 0,
  totalPages = 1,
  pageSize = 20,
  initialSearch = "",
  initialSorting = [],
}: MentorsViewProps) {
  const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
    handleSortingChange,
    sorting,
  } = useListViewFilters({
    route: "/mentors",
    currentSemester,
    initialSearch,
    initialSorting,
  });

  const handleDownloadExcel = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const mentors =
        selectedMentors.length > 0
          ? selectedMentors
          : (
              await fetchMentors({
                size: 10000,
                page: 0,
                semester: currentSemester,
                search: initialSearch || undefined,
                sorting,
              })
            ).content;

      if (mentors.length === 0) {
        toast.error("다운로드할 데이터가 없습니다.");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(
        mentors.map((mentor) => ({
          학번: mentor.userId,
          학과: mentor.department,
          이름: mentor.name,
          전화번호: formatPhoneNumber(mentor.phoneNum),
          스터디명: mentor.studyName,
        })),
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Mentors");

      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `mentors_${currentSemester}_${date}.xlsx`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "다운로드에 실패했습니다.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

  return (
    <div className="space-y-6 p-8">
      <PageHeader title="멘토 목록" description="학기별 멘토 목록입니다." />

      <div className="flex items-center justify-between gap-4">
        <SemesterTabs
          currentSemester={currentSemester}
          onSemesterChange={handleSemesterChange}
        />
        <Button
          variant="outline"
          className="gap-2"
          disabled={isDownloading}
          onClick={handleDownloadExcel}
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "다운로드 중..." : "엑셀로 다운로드"}
        </Button>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="멘토 이름 또는 스터디 이름을 검색해보세요"
        />

        <DataTable
          columns={columns}
          data={initialData}
          showPagination={false}
          enableRowSelection
          getRowId={(mentor) => String(mentor.userId)}
          onSelectedRowsChange={setSelectedMentors}
          sorting={sorting}
          onSortingChange={handleSortingChange}
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
