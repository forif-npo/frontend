"use client";

import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import {
  DEFAULT_SEMESTER_OPTIONS,
  SemesterTabs,
} from "@/components/list/semester-tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { handleApiError } from "@core/utils/api-client";
import { Check, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { approveStudy, rejectStudy } from "../api";
import { SemesterLabel, Study } from "../types";
import { approvalColumns } from "./approval-columns";

const APPROVAL_SEMESTER_OPTIONS = DEFAULT_SEMESTER_OPTIONS.filter(
  (option) => option !== "그 외",
);

interface ApprovalViewProps {
  initialData: Study[];
  currentSemester: SemesterLabel;
  totalElements?: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  initialSearch?: string;
}

export function ApprovalView({
  initialData,
  currentSemester,
  totalElements = 0,
  currentPage = 0,
  totalPages = 1,
  pageSize = 20,
  initialSearch = "",
}: ApprovalViewProps) {
  const {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
  } = useListViewFilters({
    route: "/studies/approval",
    currentSemester,
    initialSearch,
  });
  const router = useRouter();
  const [rejectingStudy, setRejectingStudy] = useState<Study | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submittingStudyId, setSubmittingStudyId] = useState<number | null>(
    null,
  );

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

  const handleApproveStudy = async (study: Study) => {
    try {
      setSubmittingStudyId(study.id);
      await approveStudy(study.id);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmittingStudyId(null);
    }
  };

  const closeRejectDialog = () => {
    setRejectingStudy(null);
    setRejectReason("");
  };

  const handleRejectStudy = async () => {
    const reason = rejectReason.trim();

    if (!rejectingStudy || !reason) {
      alert("반려 사유를 입력해주세요.");
      return;
    }

    try {
      setSubmittingStudyId(rejectingStudy.id);
      await rejectStudy(rejectingStudy.id, reason);
      closeRejectDialog();
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmittingStudyId(null);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">스터디 승인</h1>
        <p className="text-muted-foreground">
          승인 대기 또는 재신청된 스터디 개설 요청을 검토할 수 있습니다.
        </p>
      </div>

      <SemesterTabs
        currentSemester={currentSemester}
        onSemesterChange={handleSemesterChange}
        options={APPROVAL_SEMESTER_OPTIONS}
      />

      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="승인 대기 스터디 검색"
        />

        <DataTable
          columns={approvalColumns}
          data={initialData}
          showPagination={false}
          renderRowActions={(study) => (
            <>
              <DropdownMenuItem
                disabled={submittingStudyId === study.id}
                onClick={() => handleApproveStudy(study)}
              >
                <Check className="mr-2 h-4 w-4" />
                승인
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                disabled={submittingStudyId === study.id}
                onClick={() => setRejectingStudy(study)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                반려
              </DropdownMenuItem>
            </>
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

      <Dialog
        open={Boolean(rejectingStudy)}
        onOpenChange={(open) => {
          if (!open) closeRejectDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스터디 개설 요청 반려</DialogTitle>
            <DialogDescription>
              {rejectingStudy?.study_name} 요청을 반려할 사유를 입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="반려 사유"
            rows={5}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeRejectDialog}
              disabled={submittingStudyId === rejectingStudy?.id}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRejectStudy}
              disabled={submittingStudyId === rejectingStudy?.id}
            >
              반려
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
