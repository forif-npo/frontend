"use client";

import { DataTable } from "@/components/list/data-table";
import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { PageHeader } from "@/components/page-header";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import type { SortingState } from "@tanstack/react-table";
import { applicationColumns } from "./columns";
import type { StudyApplicationPage } from "./types";

interface StudyApplicationsViewProps {
  initialData: StudyApplicationPage;
  initialSearch: string;
  initialSorting: SortingState;
}

export function StudyApplicationsView({
  initialData,
  initialSearch,
  initialSorting,
}: StudyApplicationsViewProps) {
  const {
    searchQuery,
    setSearchQuery,
    handleSearch,
    handlePageChange,
    handleSortingChange,
    sorting,
  } = useListViewFilters({
    route: "/study-applications",
    currentSemester: "",
    initialSearch,
    initialSorting,
  });

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="신청자 관리"
        description="현재 학기 스터디 신청 내역을 확인합니다."
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder="이름, 학번, 학과 또는 스터디 검색"
      />

      <DataTable
        columns={applicationColumns}
        data={initialData.content}
        showPagination={false}
        getRowId={(row) => `${row.userId}-${row.priority}`}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        renderRowActions={() => (
          <DropdownMenuItem disabled>
            신청 스터디 수정 (준비 중)
          </DropdownMenuItem>
        )}
      />

      <OffsetPagination
        currentPage={initialData.currentPage}
        totalPages={initialData.totalPages}
        totalElements={initialData.totalElements}
        pageSize={initialData.pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
