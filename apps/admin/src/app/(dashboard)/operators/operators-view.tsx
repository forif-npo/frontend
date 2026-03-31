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
import { Operator, OperatorSemesterLabel } from "./types";

interface OperatorsViewProps {
  initialData: Operator[];
  currentSemester: OperatorSemesterLabel;
  hasNext?: boolean;
  nextCursor?: number | null;
  totalElements?: number;
  initialSearch?: string;
}

export function OperatorsView({
  initialData,
  currentSemester,
  hasNext = false,
  nextCursor = null,
  totalElements = 0,
  initialSearch = "",
}: OperatorsViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const handleSemesterChange = (semester: string) => {
    const params = new URLSearchParams();

    if (semester) {
      params.set("semester", semester);
    }

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    router.push(`/operators?${params.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (currentSemester) {
      params.set("semester", currentSemester);
    }

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    router.push(`/operators?${params.toString()}`);
  };

  const handleDownloadExcel = () => {
    if (initialData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      initialData.map((operator) => ({
        "회원 ID": operator.user_id,
        이름: operator.name,
        소속: operator.affiliation,
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Operators");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `operators_${currentSemester}_${date}.xlsx`);
  };

  const handleEditOperator = (operator: Operator) => {
    console.log("운영진 정보 수정", operator);
  };

  const handleDeleteOperator = (operator: Operator) => {
    console.log("운영진 정보 삭제", operator);
  };

  const handleDelegatePresident = (operator: Operator) => {
    console.log("차기 회장 위임", operator);
  };

  const handleAssignVicePresident = (operator: Operator) => {
    console.log("부회장 임명", operator);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">운영진 목록</h1>
        <p className="text-muted-foreground">
          2018년 1학기부터 2026년 1학기까지의 운영진 목록입니다.
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
          placeholder="운영진 이름을 검색해보세요"
        />

        <DataTable
          columns={columns}
          data={initialData}
          renderRowActions={(operator) => (
            <>
              <DropdownMenuItem onClick={() => handleEditOperator(operator)}>
                운영진 정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeleteOperator(operator)}
              >
                운영진 정보 삭제
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelegatePresident(operator)}
              >
                차기 회장 위임
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAssignVicePresident(operator)}
              >
                부회장 임명
              </DropdownMenuItem>
            </>
          )}
        />

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>총 {totalElements}명</span>
          {hasNext && nextCursor !== null && (
            <span>다음 커서: {nextCursor}</span>
          )}
        </div>
      </div>
    </div>
  );
}
