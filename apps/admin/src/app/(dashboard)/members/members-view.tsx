"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { SemesterTabs } from "@/components/list/semester-tabs";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { handleApiError } from "@core/utils/api-client";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { deleteCurrentSemesterMember } from "./api";
import { columns } from "./columns";
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
}: MembersViewProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
  } = useListViewFilters({
    route: "/members",
    currentSemester,
    initialSearch,
  });

  const handleDownloadExcel = () => {
    if (initialData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      initialData.map((member) => ({
        학번: member.userId,
        학과: member.department,
        이름: member.userName,
        전화번호: member.phoneNum,
        "멘토 여부": member.isMentor ? "Y" : "N",
        "운영진 여부": member.isAdmin ? "Y" : "N",
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `members_${currentSemester}_${date}.xlsx`);
  };

  const handleEditMember = (member: Member) => {
    console.log("부원 정보 수정", member);
  };

  const canDeleteCurrentSemesterMember =
    currentSemester === activeSemesterLabel;

  const handleDeleteMember = async (member: Member) => {
    if (isDeleting || !canDeleteCurrentSemesterMember) return;

    if (
      !confirm(
        `${member.userName}(${member.userId})님을 현재 학기 부원 명단에서 삭제할까요?\n사용자 계정과 이전 학기 이력은 유지됩니다.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCurrentSemesterMember(member.userId);
      toast.success("현재 학기 부원 명단에서 삭제되었습니다.");
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGrantMentorRole = (member: Member) => {
    console.log("멘토 권한 부여", member);
  };

  const handleGrantAdminRole = (member: Member) => {
    console.log("운영진 권한 부여", member);
  };

  const handleManageAdmin = (member: Member) => {
    console.log("운영진 관리", member);
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
          placeholder="이름 또는 학과를 검색해보세요"
        />

        <DataTable
          columns={columns}
          data={initialData}
          showPagination={false}
          renderRowActions={(member) => (
            <>
              <DropdownMenuItem onClick={() => handleEditMember(member)}>
                부원 정보 수정
              </DropdownMenuItem>
              {canDeleteCurrentSemesterMember && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  disabled={isDeleting}
                  onClick={() => handleDeleteMember(member)}
                >
                  현재 학기 부원 삭제
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleGrantMentorRole(member)}>
                멘토 권한 부여
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleGrantAdminRole(member)}>
                운영진 권한 부여
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleManageAdmin(member)}>
                운영진 관리
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
    </div>
  );
}
