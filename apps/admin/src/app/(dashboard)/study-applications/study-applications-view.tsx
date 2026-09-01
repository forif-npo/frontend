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
import { Download, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  decideAutonomousStudyApplication,
  fetchStudyApplications,
} from "./api";
import { applicationColumns, STUDY_APPLICATION_STATUS_LABELS } from "./columns";
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
  const [selectedApplications, setSelectedApplications] = useState<
    StudyApplication[]
  >([]);
  const [isDownloading, setIsDownloading] = useState(false);
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

  const handleDownloadExcel = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const applications =
        selectedApplications.length > 0
          ? selectedApplications
          : (
              await fetchStudyApplications({
                page: 0,
                size: 10000,
                search: initialSearch || undefined,
                sorting,
              })
            ).content;

      if (applications.length === 0) {
        toast.error("다운로드할 데이터가 없습니다.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(
        applications.map((application) => ({
          학번: application.userId,
          이름: application.userName,
          학과: application.department ?? "-",
          스터디명: application.studyName,
          순위: `${application.priority}순위`,
          "처리 상태": STUDY_APPLICATION_STATUS_LABELS[application.status],
          "자율부원 여부": application.autonomousStudy ? "Y" : "N",
          신청일자: application.appliedAt.replace("T", " ").slice(0, 16),
        })),
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Study Applications");

      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `study_applications_${date}.xlsx`);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="신청자 관리"
        description="현재 학기 스터디 신청 내역을 확인하고 자율부원 신청을 처리합니다."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            disabled={isDownloading}
            onClick={handleDownloadExcel}
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "다운로드 중..." : "엑셀로 다운로드"}
          </Button>
        }
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
        enableRowSelection
        getRowId={(row) => String(row.applicationId)}
        onSelectedRowsChange={setSelectedApplications}
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
