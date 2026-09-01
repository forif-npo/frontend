"use client";

import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { PageHeader } from "@/components/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/list/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { handleApiError } from "@core/utils/api-client";
import type { SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
import { decideAutonomousStudyApplication } from "./api";
import { applicationColumns } from "./columns";
import type { StudyApplication, StudyApplicationPage } from "./types";

interface StudyApplicationsViewProps {
  initialData: StudyApplicationPage;
  initialSearch: string;
  initialSorting: SortingState;
  canDecideAutonomousStudyApplications: boolean;
}

export function StudyApplicationsView({
  initialData,
  initialSearch,
  initialSorting,
  canDecideAutonomousStudyApplications,
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
        `${application.userName}(${application.userId})님의 자율부원 신청을 ${label} 처리할까요?`,
      )
    ) {
      return;
    }

    setIsDeciding(true);
    try {
      await decideAutonomousStudyApplication(application, decision);
      toast.success(`자율부원 신청을 ${label} 처리했습니다.`);
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
        description="현재 학기 스터디 신청 내역을 확인하고 자율부원 신청을 처리합니다."
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8"
                  disabled={isDeciding || !canDecideAutonomousStudyApplications}
                  aria-label="자율부원 신청 처리 메뉴"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {application.status !== "ACCEPT" && (
                  <DropdownMenuItem
                    onSelect={() => handleDecision(application, "accept")}
                  >
                    합격 처리
                  </DropdownMenuItem>
                )}
                {application.status !== "REJECT" && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => handleDecision(application, "reject")}
                  >
                    불합격 처리
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }}
        actionColumnSize={56}
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
