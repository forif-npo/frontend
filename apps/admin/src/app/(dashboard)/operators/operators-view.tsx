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
import { Textarea } from "@/components/ui/textarea";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import { handleApiError } from "@core/utils/api-client";
import { formatPhoneNumber } from "@core/utils/phone-number";
import type { SortingState } from "@tanstack/react-table";
import { Download, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { AddOperatorDialog } from "./add-operator-dialog";
import {
  deleteOperator,
  fetchOperators,
  updateOperator,
  updateOperatorProfileImage,
} from "./api";
import { columns } from "./columns";
import { Operator, OperatorSemesterLabel } from "./types";

interface OperatorEditForm {
  title: string;
  department: string;
  introTag: string;
  selfIntro: string;
  graduateYear: string;
  profileImage: File | null;
}

interface OperatorsViewProps {
  initialData: Operator[];
  currentSemester: OperatorSemesterLabel;
  totalElements?: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  initialSearch?: string;
  initialSorting?: SortingState;
  canManageOperators: boolean;
  currentUserId: number;
}

export function OperatorsView({
  initialData,
  currentSemester,
  totalElements = 0,
  currentPage = 0,
  totalPages = 1,
  pageSize = 20,
  initialSearch = "",
  initialSorting = [],
  canManageOperators,
  currentUserId,
}: OperatorsViewProps) {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
    handleSortingChange,
    sorting,
  } = useListViewFilters({
    route: "/operators",
    currentSemester,
    initialSearch,
    initialSorting,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Operator | null>(null);
  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editForm, setEditForm] = useState<OperatorEditForm>({
    title: "",
    department: "",
    introTag: "",
    selfIntro: "",
    graduateYear: "",
    profileImage: null,
  });

  const handleDownloadExcel = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const operators =
        selectedOperators.length > 0
          ? selectedOperators
          : (
              await fetchOperators({
                semester: currentSemester,
                page: 0,
                size: 10000,
                search: initialSearch || undefined,
                sorting,
              })
            ).content;

      if (operators.length === 0) {
        toast.error("다운로드할 데이터가 없습니다.");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(
        operators.map((operator) => ({
          학번: operator.userId,
          부서: operator.department,
          직급: operator.title,
          이름: operator.name,
          전화번호: formatPhoneNumber(operator.phoneNum),
        })),
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Operators");

      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `operators_${currentSemester}_${date}.xlsx`);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsDownloading(false);
    }
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
      profileImage: null,
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
    if (Object.keys(body).length === 0 && !editForm.profileImage) {
      toast.error("변경된 내용이 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (Object.keys(body).length > 0) {
        await updateOperator(editTarget.id, body);
      }
      if (editForm.profileImage) {
        await updateOperatorProfileImage(editTarget.id, editForm.profileImage);
      }
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
  const canEditOperator = (operator: Operator) =>
    canManageOperators || operator.userId === currentUserId;
  const canManageEditTarget = canManageOperators;

  return (
    <div className="space-y-6 p-8">
      <PageHeader title="운영진 목록" description="학기별 운영진 명단입니다." />

      <div className="flex items-center justify-between gap-4">
        <SemesterTabs
          currentSemester={currentSemester}
          onSemesterChange={handleSemesterChange}
        />
        <div className="flex items-center gap-2">
          {canManageOperators && (
            <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
              <UserPlus className="h-4 w-4" />
              운영진 추가
            </Button>
          )}
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
      </div>

      {canManageOperators && (
        <AddOperatorDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onAdded={() => router.refresh()}
        />
      )}

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
          enableRowSelection
          getRowId={(operator) => String(operator.id)}
          onSelectedRowsChange={setSelectedOperators}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          renderRowActions={
            canManageOperators || currentUserId > 0
              ? (operator) =>
                  canEditOperator(operator) ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleEditOperator(operator)}
                      >
                        운영진 정보 수정
                      </DropdownMenuItem>
                      {canManageOperators && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteOperator(operator)}
                        >
                          운영진 정보 삭제
                        </DropdownMenuItem>
                      )}
                    </>
                  ) : null
              : undefined
          }
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
      {canManageOperators && (
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
                정보입니다.{" "}
                {!canManageEditTarget &&
                  "소개, 사진, 졸업년도만 수정할 수 있습니다."}
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
                    disabled={!canManageEditTarget}
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
                    disabled={!canManageEditTarget}
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
                  placeholder="백엔드, 커피러버 (쉼표로 구분)"
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="op-profile-image">프로필 사진 (선택)</Label>
                <Input
                  id="op-profile-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (
                      file &&
                      (!["image/jpeg", "image/jpg", "image/png"].includes(
                        file.type,
                      ) ||
                        file.size > 5 * 1024 * 1024)
                    ) {
                      toast.error(
                        "프로필 사진은 5MB 이하의 JPG 또는 PNG 파일만 가능합니다.",
                      );
                      e.target.value = "";
                      return;
                    }
                    setEditForm((form) => ({ ...form, profileImage: file }));
                  }}
                />
                <p className="text-muted-foreground text-xs">
                  부원 마이페이지와 운영진 소개 페이지에 같은 사진으로
                  표시됩니다. JPG 또는 PNG, 최대 5MB까지 업로드할 수 있습니다.
                </p>
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
      )}
    </div>
  );
}
