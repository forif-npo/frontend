"use client";

import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { SemesterTabs } from "@/components/list/semester-tabs";
import { PageHeader } from "@/components/page-header";
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
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { approveStudy, fetchStudyDetail, rejectStudy } from "../api";
import type { AdminStudyDetail } from "../api";
import { SemesterLabel, Study } from "../types";
import { approvalColumns } from "./approval-columns";
import { StudyApprovalDetailDialog } from "./study-approval-detail-dialog";

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
  const [reviewingStudy, setReviewingStudy] = useState<Study | null>(null);
  const [reviewDetail, setReviewDetail] = useState<AdminStudyDetail | null>(
    null,
  );
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [rejectingStudy, setRejectingStudy] = useState<Study | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submittingStudyId, setSubmittingStudyId] = useState<number | null>(
    null,
  );

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

  const closeReviewDialog = () => {
    setReviewingStudy(null);
    setReviewDetail(null);
    setIsReviewLoading(false);
  };

  const handleOpenReview = async (study: Study) => {
    setReviewingStudy(study);
    setReviewDetail(null);
    setIsReviewLoading(true);

    try {
      const detail = await fetchStudyDetail(study.id);
      setReviewDetail(detail);
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleApproveStudy = async (study: Study) => {
    try {
      setSubmittingStudyId(study.id);
      await approveStudy(study.id);
      closeReviewDialog();
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

  const handleOpenRejectDialog = (study: Study) => {
    closeReviewDialog();
    setRejectingStudy(study);
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
      closeReviewDialog();
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmittingStudyId(null);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="스터디 승인"
        description="승인 대기 또는 재신청된 스터디 개설 요청을 검토할 수 있습니다."
      />

      <SemesterTabs
        currentSemester={currentSemester}
        onSemesterChange={handleSemesterChange}
        includeEtc={false}
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
            <DropdownMenuItem
              disabled={submittingStudyId === study.id}
              onClick={() => handleOpenReview(study)}
            >
              <Eye className="mr-2 h-4 w-4" />
              상세 검토
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

      <StudyApprovalDetailDialog
        study={reviewingStudy}
        detail={reviewDetail}
        isLoading={isReviewLoading}
        isSubmitting={submittingStudyId === reviewingStudy?.id}
        onClose={closeReviewDialog}
        onApprove={handleApproveStudy}
        onReject={handleOpenRejectDialog}
      />

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
