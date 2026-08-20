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
import type { StudyUpdateRequest } from "@core/types/api";
import type { SortingState } from "@tanstack/react-table";
import { handleApiError } from "@core/utils/api-client";
import { Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  createAutonomousStudy,
  deleteStudy,
  fetchStudyDetail,
  updateStudy,
} from "./api";
import { columns } from "./columns";
import { AutonomousStudyCreateDialog } from "./components/AutonomousStudyCreateDialog";
import { StudyDeleteDialog } from "./components/StudyDeleteDialog";
import { StudyEditDialog } from "./components/StudyEditDialog";
import {
  EMPTY_STUDY_EDIT_FORM,
  getStudyTagLabel,
  STUDY_TAG_OPTIONS,
} from "./constants";
import { parseOptionalNumber, toStudyEditForm } from "./form-utils";
import { SemesterLabel, Study, StudyEditForm } from "./types";

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
  } = useListViewFilters({
    route: "/studies",
    currentSemester,
    initialSearch,
    initialSorting,
  });
  const router = useRouter();
  const editRequestSeq = useRef(0);
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

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

  const handleDownloadExcel = () => {
    if (initialData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      initialData.map((study) => ({
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
        모집상태: study.recruit_status === "APPLICABLE" ? "모집중" : "마감",
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Studies");
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `studies_${currentSemester}_${date}.xlsx`);
  };

  const handleEditDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);

    if (!open) {
      editRequestSeq.current += 1;
      setEditingStudy(null);
      setEditForm({ ...EMPTY_STUDY_EDIT_FORM });
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
    setEditForm(toStudyEditForm(study));
    setIsEditDetailLoaded(false);
    setIsEditDialogOpen(true);
    setLoadingStudyId(study.id);

    try {
      const detail = await fetchStudyDetail(study.id);

      if (editRequestSeq.current !== requestSeq) {
        return;
      }

      setEditForm(toStudyEditForm(study, detail));
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
    if (!editingStudy || !isEditDetailLoaded) {
      return;
    }

    const studyName = editForm.study_name.trim();
    const oneLiner = editForm.one_liner.trim();
    const weekDay = parseOptionalNumber(editForm.week_day);
    const difficulty = parseOptionalNumber(editForm.difficulty);
    const capacity = parseOptionalNumber(editForm.capacity);

    if (!studyName || !oneLiner) {
      toast.error("스터디명과 한 줄 소개를 입력해주세요.");
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

    if (editForm.capacity.trim() && capacity === undefined) {
      toast.error("정원은 숫자로 입력해주세요.");
      return;
    }

    if (capacity !== undefined && capacity < 0) {
      toast.error("정원은 0 이상으로 입력해주세요.");
      return;
    }

    const studyTagNames = editForm.tags.flatMap((tagId) => {
      const tag = STUDY_TAG_OPTIONS.find((option) => option.id === tagId);
      return tag ? [tag.name] : [];
    });

    if (studyTagNames.length !== editForm.tags.length) {
      toast.error("선택한 태그 정보를 확인해주세요.");
      return;
    }

    const body: StudyUpdateRequest = {
      study_name: studyName,
      one_liner: oneLiner,
      explanation: editForm.explanation.trim(),
      goal: editForm.goal.trim(),
      start_time: editForm.start_time,
      end_time: editForm.end_time,
      week_day: weekDay,
      location: editForm.location.trim(),
      location_detail: editForm.location_detail.trim(),
      difficulty: difficulty as StudyUpdateRequest["difficulty"],
      capacity,
      study_tag_names: studyTagNames,
    };

    try {
      setSubmittingStudyId(editingStudy.id);
      await updateStudy(editingStudy.id, body);
      toast.success("스터디 정보가 수정되었습니다.");
      handleEditDialogOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSubmittingStudyId(null);
    }
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
      toast.success("현재 학기에 자율스터디가 개설되었습니다.");
      setIsAutonomousStudyDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsCreatingAutonomousStudy(false);
    }
  };

  const handleAddMentee = (study: Study) => {
    console.log("멘티 추가", study);
  };

  const handleRemoveMentee = (study: Study) => {
    console.log("멘티 삭제", study);
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
            자율스터디 개설
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleDownloadExcel}
          >
            <Download className="h-4 w-4" />
            엑셀로 다운로드
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
          sorting={initialSorting}
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAddMentee(study)}>
                멘티 추가
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRemoveMentee(study)}>
                멘티 삭제
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
