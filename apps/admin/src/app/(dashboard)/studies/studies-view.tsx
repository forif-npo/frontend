"use client";

import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { SemesterTabs } from "@/components/list/semester-tabs";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useListViewFilters } from "@/hooks/use-list-view-filters";
import type { SortingState } from "@tanstack/react-table";
import { apiClient, handleApiError } from "@core/utils/api-client";
import { STUDY_RECRUIT_STATUS_LABELS } from "@core/study-status";
import type { ApiResponse } from "@core/types/api";
import { Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  createAutonomousStudy,
  deleteStudy,
  fetchStudyDetail,
  fetchStudiesWithFallback,
  updateStudy,
} from "./api";
import { columns } from "./columns";
import { AutonomousStudyCreateDialog } from "./components/AutonomousStudyCreateDialog";
import { StudyDeleteDialog } from "./components/StudyDeleteDialog";
import { StudyEditDialog } from "./components/StudyEditDialog";
import { EMPTY_STUDY_EDIT_FORM, getStudyTagLabel } from "./constants";
import { buildStudyUpdateFormData, toStudyEditForm } from "./form-utils";
import { SemesterLabel, Study, StudyEditForm } from "./types";

const SEMESTER_LABEL_PATTERN = /^(\d{2})-([12])$/;

function parseSemesterFilter(semester: SemesterLabel) {
  const match = semester.match(SEMESTER_LABEL_PATTERN);

  return match
    ? { year: Number(`20${match[1]}`), semester: Number(match[2]) }
    : {};
}

interface StudiesViewProps {
  initialData: Study[];
  currentSemester: SemesterLabel;
  totalElements?: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  initialSearch?: string;
  initialSorting?: SortingState;
}

export function StudiesView({
  initialData,
  currentSemester,
  totalElements = 0,
  currentPage = 0,
  totalPages = 1,
  pageSize = 20,
  initialSearch = "",
  initialSorting = [],
}: StudiesViewProps) {
  const {
    searchQuery,
    setSearchQuery,
    handleSemesterChange,
    handleSearch,
    handlePageChange,
    handleSortingChange,
    sorting,
  } = useListViewFilters({
    route: "/studies",
    currentSemester,
    initialSearch,
    initialSorting,
  });
  const router = useRouter();
  const editRequestSeq = useRef(0);
  const initialEditForm = useRef<StudyEditForm | null>(null);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [editForm, setEditForm] = useState<StudyEditForm>({
    ...EMPTY_STUDY_EDIT_FORM,
  });
  const [deleteTarget, setDeleteTarget] = useState<Study | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditDetailLoaded, setIsEditDetailLoaded] = useState(false);
  const [isAutonomousStudyDialogOpen, setIsAutonomousStudyDialogOpen] =
    useState(false);
  const [isCreatingAutonomousStudy, setIsCreatingAutonomousStudy] =
    useState(false);
  const [loadingStudyId, setLoadingStudyId] = useState<number | null>(null);
  const [submittingStudyId, setSubmittingStudyId] = useState<number | null>(
    null,
  );
  const [selectedStudies, setSelectedStudies] = useState<Study[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

  const handleDownloadExcel = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const studies =
        selectedStudies.length > 0
          ? selectedStudies
          : (
              await fetchStudiesWithFallback(
                {
                  size: 10000,
                  page: 0,
                  ...parseSemesterFilter(currentSemester),
                  search: initialSearch || undefined,
                  studyStatuses: ["APPROVED", "STARTED"],
                  sorting,
                },
                undefined,
              )
            ).content;

      if (studies.length === 0) {
        toast.error("다운로드할 데이터가 없습니다.");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(
        studies.map((study) => ({
          ID: study.id,
          스터디명: study.study_name,
          멘토:
            study.primary_mentor_name +
            (study.secondary_mentor_name
              ? ` (${study.secondary_mentor_name})`
              : ""),
          태그: study.tags.map(getStudyTagLabel).join(", "),
          "한 줄 소개": study.one_liner,
          멘티수: study.mentee_count,
          모집상태: STUDY_RECRUIT_STATUS_LABELS[study.recruit_status],
        })),
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Studies");
      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `studies_${currentSemester}_${date}.xlsx`);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEditDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);

    if (!open) {
      editRequestSeq.current += 1;
      setEditingStudy(null);
      setEditForm({ ...EMPTY_STUDY_EDIT_FORM });
      initialEditForm.current = null;
      setIsEditDetailLoaded(false);
      setLoadingStudyId(null);
    }
  };

  const handleEditFormChange = <K extends keyof StudyEditForm>(
    field: K,
    value: StudyEditForm[K],
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditTagChange = (tagId: number, checked: boolean) => {
    setEditForm((prev) => {
      const tags = checked
        ? Array.from(new Set([...prev.tags, tagId]))
        : prev.tags.filter((id) => id !== tagId);

      return {
        ...prev,
        tags,
      };
    });
  };

  const handleEditStudy = async (study: Study) => {
    const requestSeq = editRequestSeq.current + 1;
    editRequestSeq.current = requestSeq;

    setEditingStudy(study);
    initialEditForm.current = null;
    setEditForm(toStudyEditForm(study));
    setIsEditDetailLoaded(false);
    setIsEditDialogOpen(true);
    setLoadingStudyId(study.id);

    try {
      const detail = await fetchStudyDetail(study.id);

      if (editRequestSeq.current !== requestSeq) {
        return;
      }

      const form = toStudyEditForm(study, detail);
      setEditForm(form);
      initialEditForm.current = form;
      setIsEditDetailLoaded(true);
    } catch (error) {
      if (editRequestSeq.current === requestSeq) {
        toast.error(await handleApiError(error));
      }
    } finally {
      if (editRequestSeq.current === requestSeq) {
        setLoadingStudyId(null);
      }
    }
  };

  const handleDeleteStudy = (study: Study) => {
    setDeleteTarget(study);
  };

  const handleSubmitEditStudy = async () => {
    if (!editingStudy || !isEditDetailLoaded || !initialEditForm.current) {
      return;
    }

    if (!editForm.study_name.trim() || !editForm.one_liner.trim()) {
      toast.error("스터디명과 한 줄 소개를 입력해주세요.");
      return;
    }

    if (editForm.explanation.trim().length < 50) {
      toast.error("스터디 소개는 최소 50자 이상 작성해주세요.");
      return;
    }

    if (editForm.tags.length === 0) {
      toast.error("태그를 최소 1개 이상 선택해주세요.");
      return;
    }

    if (editForm.tags.length > 4) {
      toast.error("태그는 최대 4개까지 선택할 수 있습니다.");
      return;
    }

    if (
      !editForm.location ||
      !editForm.week_day ||
      !editForm.start_time ||
      !editForm.end_time
    ) {
      toast.error("진행 장소, 요일, 시간을 모두 입력해주세요.");
      return;
    }

    if (
      !editForm.is_online &&
      editForm.location !== "장소 미정" &&
      !editForm.location_detail.trim()
    ) {
      toast.error("강의실(호)을 입력해주세요.");
      return;
    }

    if (!editForm.difficulty) {
      toast.error("난이도를 선택해주세요.");
      return;
    }

    const invalidWeek = editForm.curriculum.find(
      (week) =>
        !week.date ||
        !week.topic.trim() ||
        week.contents.some((content) => !content.trim()) ||
        week.contents.join("; ").length > 500,
    );
    if (editForm.curriculum.length < 8 || invalidWeek) {
      toast.error(
        "8주차 이상의 커리큘럼을 날짜·주제·내용까지 모두 작성해주세요.",
      );
      return;
    }

    if (
      editForm.thumbnail &&
      (!["image/jpeg", "image/png"].includes(editForm.thumbnail.type) ||
        editForm.thumbnail.size > 5 * 1024 * 1024)
    ) {
      toast.error(
        "썸네일은 5MB 이하의 JPG 또는 PNG 파일만 업로드할 수 있습니다.",
      );
      return;
    }

    const invalidReference = editForm.references.some(
      (reference) =>
        (reference.type === "LINK" &&
          (typeof reference.value !== "string" || !reference.value.trim())) ||
        (reference.type === "DOWNLOAD" &&
          !(reference.value instanceof File) &&
          !(
            reference.id &&
            reference.original_type === "DOWNLOAD" &&
            typeof reference.value === "string" &&
            reference.value
          )),
    );
    if (invalidReference) {
      toast.error("참고자료의 링크 또는 파일을 확인해주세요.");
      return;
    }

    if (
      editForm.references.some(
        (reference) =>
          reference.value instanceof File &&
          reference.value.size > 5 * 1024 * 1024,
      )
    ) {
      toast.error("참고자료 파일은 최대 5MB까지 업로드할 수 있습니다.");
      return;
    }

    try {
      setSubmittingStudyId(editingStudy.id);
      await updateStudy(
        editingStudy.id,
        buildStudyUpdateFormData(editForm, initialEditForm.current),
      );
      toast.success("스터디 정보가 수정되었습니다.");
      handleEditDialogOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSubmittingStudyId(null);
    }
  };

  const handleSecondaryMentorSearch = async (studentId: string) => {
    try {
      const response = await apiClient
        .get(`api/v1/users/${studentId}`)
        .json<ApiResponse<{ user_id: number; user_name: string }>>();
      if (!response.data) {
        toast.error("해당 학번의 부원을 찾을 수 없습니다.");
        return;
      }
      setEditForm((previous) => ({
        ...previous,
        secondary_mentor_id: response.data!.user_id,
        secondary_mentor_name: response.data!.user_name,
      }));
      toast.success(
        `${response.data.user_name} 님을 추가 멘토로 선택했습니다.`,
      );
    } catch (error) {
      toast.error(await handleApiError(error));
    }
  };

  const handleSecondaryMentorRemove = () => {
    setEditForm((previous) => ({
      ...previous,
      secondary_mentor_id: null,
      secondary_mentor_name: null,
    }));
  };

  const handleConfirmDeleteStudy = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setSubmittingStudyId(deleteTarget.id);
      await deleteStudy(deleteTarget.id);
      toast.success("스터디가 삭제되었습니다.");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSubmittingStudyId(null);
    }
  };

  const handleCreateAutonomousStudy = async () => {
    if (isCreatingAutonomousStudy) return;

    try {
      setIsCreatingAutonomousStudy(true);
      await createAutonomousStudy();
      toast.success("현재 학기에 자율부원 스터디가 생성되었습니다.");
      setIsAutonomousStudyDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsCreatingAutonomousStudy(false);
    }
  };

  const isEditingStudy =
    editingStudy !== null && submittingStudyId === editingStudy.id;
  const isLoadingEditDetail =
    editingStudy !== null && loadingStudyId === editingStudy.id;
  const isEditFormDisabled =
    isEditingStudy || isLoadingEditDetail || !isEditDetailLoaded;
  const isDeletingStudy =
    deleteTarget !== null && submittingStudyId === deleteTarget.id;

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="스터디 목록"
        description="FORIF 스터디 강좌 목록을 확인하고 관리할 수 있습니다."
      />

      <div className="flex items-center justify-between">
        <SemesterTabs
          currentSemester={currentSemester}
          onSemesterChange={handleSemesterChange}
          includeEtc={false}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsAutonomousStudyDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            자율부원 스터디 생성
          </Button>
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

      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="스터디 목록 검색"
        />

        <DataTable
          columns={columns}
          data={initialData}
          showPagination={false}
          enableRowSelection
          getRowId={(study) => String(study.id)}
          onSelectedRowsChange={setSelectedStudies}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          renderRowActions={(study) => (
            <>
              <DropdownMenuItem
                disabled={
                  loadingStudyId === study.id || submittingStudyId === study.id
                }
                onClick={() => void handleEditStudy(study)}
              >
                스터디 정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                disabled={submittingStudyId === study.id}
                onClick={() => handleDeleteStudy(study)}
              >
                스터디 정보 삭제
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

      <StudyEditDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogOpenChange}
        editingStudy={editingStudy}
        form={editForm}
        onFieldChange={handleEditFormChange}
        onTagChange={handleEditTagChange}
        onSubmit={() => void handleSubmitEditStudy()}
        onSecondaryMentorSearch={handleSecondaryMentorSearch}
        onSecondaryMentorRemove={handleSecondaryMentorRemove}
        isLoadingDetail={isLoadingEditDetail}
        isFormDisabled={isEditFormDisabled}
        isSubmitting={isEditingStudy}
      />

      <StudyDeleteDialog
        target={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => void handleConfirmDeleteStudy()}
        isDeleting={isDeletingStudy}
      />

      <AutonomousStudyCreateDialog
        open={isAutonomousStudyDialogOpen}
        onOpenChange={setIsAutonomousStudyDialogOpen}
        onConfirm={() => void handleCreateAutonomousStudy()}
        isCreating={isCreatingAutonomousStudy}
      />
    </div>
  );
}
