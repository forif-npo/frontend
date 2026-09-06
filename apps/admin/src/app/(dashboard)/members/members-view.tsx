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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { handleApiError } from "@core/utils/api-client";
import { formatPhoneNumber } from "@core/utils/phone-number";
import type { SortingState } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import {
  deleteCurrentSemesterMember,
  fetchMemberHistory,
  fetchMembers,
  updateMemberInfo,
} from "./api";
import { columns } from "./columns";
import { MemberHistoryDialog } from "./member-history-dialog";
import { Member, MemberSemesterLabel } from "./types";

interface MembersViewProps {
  initialData: Member[];
  currentSemester: MemberSemesterLabel;
  totalElements?: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  initialSearch?: string;
  activeSemesterLabel: string;
  initialSorting?: SortingState;
}

export function MembersView({
  initialData,
  currentSemester,
  totalElements = 0,
  currentPage = 0,
  totalPages = 1,
  pageSize = 20,
  initialSearch = "",
  activeSemesterLabel,
  initialSorting = [],
}: MembersViewProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editTarget, setEditTarget] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState({ department: "", phoneNum: "" });
  const [historyTarget, setHistoryTarget] = useState<Member | null>(null);
  const [memberHistory, setMemberHistory] = useState<Awaited<
    ReturnType<typeof fetchMemberHistory>
  > | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyErrorMessage, setHistoryErrorMessage] = useState<string | null>(
    null,
  );
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
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
    route: "/members",
    currentSemester,
    initialSearch,
    initialSorting,
  });

  const handleDownloadExcel = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const members =
        selectedMembers.length > 0
          ? selectedMembers
          : (
              await fetchMembers({
                size: 10000,
                page: 0,
                semester: currentSemester,
                search: initialSearch || undefined,
                sorting,
              })
            ).content;

      if (members.length === 0) {
        toast.error("다운로드할 데이터가 없습니다.");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(
        members.map((member) => ({
          학번: member.userId,
          학과: member.department,
          이름: member.userName,
          전화번호: formatPhoneNumber(member.phoneNum),
          "멘토 이력 있음": member.isMentor ? "Y" : "N",
          "운영진 이력 있음": member.isAdmin ? "Y" : "N",
        })),
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Members");

      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `members_${currentSemester}_${date}.xlsx`);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEditMember = (member: Member) => {
    setEditTarget(member);
    setEditForm({
      department: member.department ?? "",
      phoneNum: member.phoneNum ?? "",
    });
  };

  const handleOpenMemberHistory = async (member: Member) => {
    setHistoryTarget(member);
    setMemberHistory(null);
    setHistoryErrorMessage(null);
    setIsHistoryLoading(true);

    try {
      setMemberHistory(await fetchMemberHistory(member.userId));
    } catch (error) {
      setHistoryErrorMessage(await handleApiError(error));
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleCloseMemberHistory = () => {
    setHistoryTarget(null);
    setMemberHistory(null);
    setHistoryErrorMessage(null);
  };

  const handleUpdateMember = async () => {
    if (!editTarget || isUpdating) return;

    const department = editForm.department.trim();
    const phoneNum = editForm.phoneNum.trim();
    if (!department || !phoneNum) {
      toast.error("학과와 전화번호를 모두 입력해주세요.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateMemberInfo(editTarget.userId, { department, phoneNum });
      toast.success("부원 정보가 수정되었습니다.");
      setEditTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsUpdating(false);
    }
  };

  const canDeleteCurrentSemesterMember =
    currentSemester === activeSemesterLabel;

  const handleDeleteMember = async (member: Member) => {
    if (isDeleting || !canDeleteCurrentSemesterMember) return;

    if (
      !confirm(
        `${member.userName}(${member.userId})님의 현재 학기 등록을 철회할까요?\n합격 및 신청 이력은 유지되며, 회비 관리 대상에서는 제외됩니다.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCurrentSemesterMember(member.userId);
      toast.success("현재 학기 등록이 철회되었습니다.");
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

  return (
    <div className="space-y-6 p-8">
      <PageHeader title="부원 목록" description="학기별 부원 목록입니다." />

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
          placeholder="이름 또는 학과를 검색해보세요"
        />

        <DataTable
          columns={columns}
          data={initialData}
          showPagination={false}
          enableRowSelection
          getRowId={(member) => String(member.userId)}
          onSelectedRowsChange={setSelectedMembers}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          renderRowActions={(member) => (
            <>
              {(member.isMentor || member.isAdmin) && (
                <DropdownMenuItem
                  onClick={() => void handleOpenMemberHistory(member)}
                >
                  부원 이력 상세
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleEditMember(member)}>
                부원 정보 수정
              </DropdownMenuItem>
              {canDeleteCurrentSemesterMember && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  disabled={isDeleting}
                  onClick={() => handleDeleteMember(member)}
                >
                  현재 학기 등록 철회
                </DropdownMenuItem>
              )}
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

      <MemberHistoryDialog
        member={historyTarget}
        history={memberHistory}
        isLoading={isHistoryLoading}
        errorMessage={historyErrorMessage}
        onClose={handleCloseMemberHistory}
      />

      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isUpdating) setEditTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>부원 정보 수정</DialogTitle>
            <DialogDescription>
              {editTarget && `${editTarget.userName} (${editTarget.userId})`}
              님의 학과와 전화번호를 수정합니다. 학번은 수정할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-department">학과</Label>
              <Input
                id="member-department"
                maxLength={50}
                value={editForm.department}
                onChange={(event) =>
                  setEditForm((form) => ({
                    ...form,
                    department: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-phone-num">전화번호</Label>
              <Input
                id="member-phone-num"
                type="tel"
                maxLength={20}
                value={editForm.phoneNum}
                onChange={(event) =>
                  setEditForm((form) => ({
                    ...form,
                    phoneNum: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isUpdating}
              onClick={() => setEditTarget(null)}
            >
              취소
            </Button>
            <Button disabled={isUpdating} onClick={handleUpdateMember}>
              {isUpdating ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
