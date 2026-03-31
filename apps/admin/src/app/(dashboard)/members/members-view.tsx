"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { SearchBar } from "@/components/list/search-bar";
import { SemesterTabs } from "@/components/list/semester-tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";

import { columns } from "./columns";
import { Member, MemberSemesterLabel } from "./types";

interface MembersViewProps {
  initialData: Member[];
  currentSemester: MemberSemesterLabel;
  hasNext?: boolean;
  nextCursor?: number | null;
  totalElements?: number;
  initialSearch?: string;
}

export function MembersView({
  initialData,
  currentSemester,
  hasNext = false,
  nextCursor = null,
  totalElements = 0,
  initialSearch = "",
}: MembersViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const handleSemesterChange = (semester: string) => {
    const params = new URLSearchParams();

    if (semester) {
      params.set("semester", semester);
    }

    router.push(`/members?${params.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (currentSemester) {
      params.set("semester", currentSemester);
    }

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    router.push(`/members?${params.toString()}`);
  };

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
        스터디명: member.currentStudyName,
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

  const handleDeleteMember = (member: Member) => {
    console.log("부원 삭제", member);
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">부원 목록</h1>
        <p className="text-muted-foreground">
          2018년 1학기부터 2026년 1학기까지의 부원 목록입니다.
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
          placeholder="이름 또는 학과를 검색해보세요"
        />

        <DataTable
          columns={columns}
          data={initialData}
          renderRowActions={(member) => (
            <>
              <DropdownMenuItem onClick={() => handleEditMember(member)}>
                부원 정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeleteMember(member)}
              >
                부원 삭제
              </DropdownMenuItem>
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

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>총 {displayTotalCount}명</span>
          {hasNext && nextCursor !== null && (
            <span>다음 커서: {nextCursor}</span>
          )}
        </div>
      </div>
    </div>
  );
}
