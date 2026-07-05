"use client";

import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { SemesterTabs } from "@/components/list/semester-tabs";
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
import { Textarea } from "@/components/ui/textarea";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { handleApiError } from "@core/utils/api-client";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { deleteOperator, updateOperator } from "./api";
import { columns } from "./columns";
import { Operator, OperatorSemesterLabel } from "./types";

interface OperatorEditForm {
  title: string;
  department: string;
  introTag: string;
  selfIntro: string;
  graduateYear: string;
}

interface OperatorsViewProps {
  initialData: Operator[];
  currentSemester: OperatorSemesterLabel;
  totalElements?: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  initialSearch?: string;
}

export function OperatorsView({
  initialData,
  currentSemester,
  totalElements = 0,
  currentPage = 0,
  totalPages = 1,
  pageSize = 20,
  initialSearch = "",
}: OperatorsViewProps) {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
  } = useListViewFilters({
    route: "/operators",
    currentSemester,
    initialSearch,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editTarget, setEditTarget] = useState<Operator | null>(null);
  const [editForm, setEditForm] = useState<OperatorEditForm>({
    title: "",
    department: "",
    introTag: "",
    selfIntro: "",
    graduateYear: "",
  });

  const handleDownloadExcel = () => {
    if (initialData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      initialData.map((operator) => ({
        학번: operator.userId,
        부서: operator.department,
        직급: operator.title,
        이름: operator.name,
        전화번호: operator.phoneNum,
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Operators");

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `operators_${currentSemester}_${date}.xlsx`);
  };

  const handleEditOperator = (operator: Operator) => {
    setEditTarget(operator);
    setEditForm({
      title: operator.title,
      department: operator.department,
      introTag: operator.introTag,
      selfIntro: operator.selfIntro,
      graduateYear:
        operator.graduateYear != null ? String(operator.graduateYear) : "",
    });
  };

  const handleUpdateSubmit = async () => {
    if (!editTarget || isSubmitting) return;

    const body: Parameters<typeof updateOperator>[1] = {};
    if (editForm.title.trim() && editForm.title.trim() !== editTarget.title) {
      body.user_title = editForm.title.trim();
    }
    if (
      editForm.department.trim() &&
      editForm.department.trim() !== editTarget.department
    ) {
      body.club_department = editForm.department.trim();
    }
    if (editForm.introTag.trim() !== editTarget.introTag) {
      body.intro_tag = editForm.introTag.trim();
    }
    if (editForm.selfIntro.trim() !== editTarget.selfIntro) {
      body.self_intro = editForm.selfIntro.trim();
    }
    if (editForm.graduateYear.trim()) {
      const year = Number(editForm.graduateYear.trim());
      if (Number.isNaN(year)) {
        toast.error("졸업년도는 숫자로 입력해주세요.");
        return;
      }
      if (year !== editTarget.graduateYear) {
        body.graduate_year = year;
      }
    }
    if (Object.keys(body).length === 0) {
      toast.error("변경된 내용이 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateOperator(editTarget.id, body);
      toast.success("운영진 정보가 수정되었습니다.");
      setEditTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOperator = async (operator: Operator) => {
    if (isSubmitting) return;
    if (
      !confirm(
        `${operator.name}(${operator.actYear}-${operator.actSemester} ${operator.title || "운영진"}) 이력을 삭제할까요?\n운영진 소개 페이지에서도 사라집니다.`,
      )
    ) {
      return;
    }
    setIsSubmitting(true);
    try {
      await deleteOperator(operator.id);
      toast.success("운영진 이력이 삭제되었습니다.");
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

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
          showPagination={false}
          renderRowActions={(operator) => (
            <>
              {/* 회장 위임/부회장 임명은 회장단 > 운영진 계정 관리 페이지로 이동 */}
              <DropdownMenuItem onClick={() => handleEditOperator(operator)}>
                운영진 정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeleteOperator(operator)}
              >
                운영진 정보 삭제
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

      {/* 운영진 정보 수정 다이얼로그 */}
      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>운영진 정보 수정</DialogTitle>
            <DialogDescription>
              {editTarget?.name} ({editTarget?.actYear}-
              {editTarget?.actSemester}) — 운영진 소개 페이지에 표시되는
              정보입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="op-title">직급</Label>
                <Input
                  id="op-title"
                  placeholder="회장 / 부장 / 팀원"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="op-department">부서</Label>
                <Input
                  id="op-department"
                  placeholder="기획팀"
                  value={editForm.department}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, department: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="op-intro-tag">소개 태그</Label>
              <Input
                id="op-intro-tag"
                placeholder="#백엔드 #커피러버"
                value={editForm.introTag}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, introTag: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="op-self-intro">자기소개</Label>
              <Textarea
                id="op-self-intro"
                rows={3}
                value={editForm.selfIntro}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, selfIntro: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="op-graduate-year">졸업년도 (선택)</Label>
              <Input
                id="op-graduate-year"
                placeholder="2027"
                value={editForm.graduateYear}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, graduateYear: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              취소
            </Button>
            <Button onClick={handleUpdateSubmit} disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
