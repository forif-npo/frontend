"use client";

import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { handleApiError } from "@core/utils/api-client";
import type { SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { decideAutonomousStudyApplication } from "./api";
import { applicationColumns } from "./columns";
import type { StudyApplication, StudyApplicationPage } from "./types";

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
  const router = useRouter();
  const [isDeciding, setIsDeciding] = useState(false);
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

  const handleDecision = async (
    application: StudyApplication,
    decision: "accept" | "reject",
  ) => {
    if (isDeciding) return;

    const label = decision === "accept" ? "합격" : "불합격";
    if (
      !confirm(
        `${application.userName}(${application.userId})님의 자율스터디 신청을 ${label} 처리할까요?`,
      )
    ) {
      return;
    }

    setIsDeciding(true);
    try {
      await decideAutonomousStudyApplication(application, decision);
      toast.success(`자율스터디 신청을 ${label} 처리했습니다.`);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsDeciding(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="신청자 관리"
        description="현재 학기 스터디 신청 내역을 확인하고 자율스터디 신청을 처리합니다."
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
        renderActionCell={(application) => {
          if (!application.autonomousStudy) return null;

          return (
            <>
              {application.status !== "ACCEPT" && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleDecision(application, "accept")}
                  disabled={isDeciding}
                >
                  합격
                </Button>
              )}
              {application.status !== "REJECT" && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDecision(application, "reject")}
                  disabled={isDeciding}
                >
                  불합격
                </Button>
              )}
            </>
          );
        }}
        actionColumnSize={180}
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
