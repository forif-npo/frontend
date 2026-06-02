"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { StudyUpdateRequest } from "@core/types/api";
import { handleApiError } from "@core/utils/api-client";
import { Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  deleteStudy,
  fetchStudyDetail,
  updateStudy,
  type AdminStudyDetail,
} from "./api";
import { columns } from "./columns";
import { SemesterLabel, Study } from "./types";

const STUDY_SEMESTER_OPTIONS = DEFAULT_SEMESTER_OPTIONS.filter(
  (option) => option !== "그 외",
);

type StudyEditForm = {
  study_name: string;
  sub_title: string;
  one_liner: string;
  explanation: string;
  goal: string;
  start_time: string;
  end_time: string;
  week_day: string;
  location: string;
  location_detail: string;
  recruit_status: "APPLICABLE" | "CLOSED";
  difficulty: string;
  capacity: string;
  tags: number[];
};

const EMPTY_STUDY_EDIT_FORM: StudyEditForm = {
  study_name: "",
  sub_title: "",
  one_liner: "",
  explanation: "",
  goal: "",
  start_time: "",
  end_time: "",
  week_day: "",
  location: "",
  location_detail: "",
  recruit_status: "APPLICABLE",
  difficulty: "",
  capacity: "",
  tags: [],
};

const WEEK_DAY_OPTIONS = [
  { value: "0", label: "일요일" },
  { value: "1", label: "월요일" },
  { value: "2", label: "화요일" },
  { value: "3", label: "수요일" },
  { value: "4", label: "목요일" },
  { value: "5", label: "금요일" },
  { value: "6", label: "토요일" },
];

const DIFFICULTY_OPTIONS = [
  { value: "1", label: "쉬움" },
  { value: "2", label: "조금 쉬움" },
  { value: "3", label: "보통" },
  { value: "4", label: "조금 어려움" },
  { value: "5", label: "어려움" },
];

const DIFFICULTY_TO_LEVEL: Record<string, string> = {
  EASY: "1",
  SEMI_EASY: "2",
  NORMAL: "3",
  SEMI_HARD: "4",
  HARD: "5",
};

const STUDY_TAG_OPTIONS = [
  { id: 1, name: "database", label: "데이터베이스" },
  { id: 2, name: "basic", label: "프로그래밍 기초" },
  { id: 3, name: "frontend", label: "프론트엔드" },
  { id: 4, name: "backend", label: "백엔드" },
  { id: 5, name: "fullstack", label: "풀스택" },
  { id: 6, name: "app", label: "앱" },
  { id: 7, name: "ai", label: "인공지능" },
  { id: 8, name: "data", label: "데이터" },
  { id: 9, name: "security", label: "보안" },
  { id: 10, name: "game", label: "게임" },
  { id: 11, name: "design", label: "디자인" },
  { id: 12, name: "algorithm", label: "알고리즘" },
  { id: 13, name: "blockchain", label: "블록체인" },
] as const;

const LEGACY_STUDY_TAG_IDS: Record<string, number> = {
  개인개발: 5,
  모바일: 6,
  "프로그래밍 언어 기초": 2,
};

const normalizeTimeValue = (value?: string | null) =>
  value ? value.slice(0, 5) : "";

const parseOptionalNumber = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const parsedValue = Number(trimmedValue);

  return Number.isNaN(parsedValue) ? undefined : parsedValue;
};

const getStudyTagId = (tagValue: string) => {
  const option = STUDY_TAG_OPTIONS.find(
    (tag) => tag.name === tagValue || tag.label === tagValue,
  );

  return option?.id ?? LEGACY_STUDY_TAG_IDS[tagValue] ?? null;
};

const getStudyTagIds = (tags?: string[] | null) => {
  const tagIds = (tags ?? [])
    .map(getStudyTagId)
    .filter((tagId): tagId is number => tagId !== null);

  return Array.from(new Set(tagIds));
};

const toStudyEditForm = (
  study: Study,
  detail?: AdminStudyDetail,
): StudyEditForm => ({
  study_name: detail?.study_name ?? study.study_name ?? "",
  sub_title: detail?.sub_title ?? "",
  one_liner: detail?.one_liner ?? study.one_liner ?? "",
  explanation: detail?.explanation ?? "",
  goal: detail?.goal ?? "",
  start_time: normalizeTimeValue(detail?.start_time),
  end_time: normalizeTimeValue(detail?.end_time),
  week_day:
    detail?.week_day === null || detail?.week_day === undefined
      ? ""
      : String(detail.week_day),
  location: detail?.location ?? "",
  location_detail: detail?.location_detail ?? "",
  recruit_status: detail?.recruit_status ?? study.recruit_status,
  difficulty: detail?.difficulty
    ? (DIFFICULTY_TO_LEVEL[detail.difficulty] ?? detail.difficulty)
    : "",
  capacity:
    detail?.capacity === null || detail?.capacity === undefined
      ? ""
      : String(detail.capacity),
  tags: getStudyTagIds(detail?.tags ?? study.tags),
});

interface StudiesViewProps {
  initialData: Study[];
  currentSemester: SemesterLabel;
  hasNext?: boolean;
  nextCursor?: number | null;
  totalElements?: number;
}

export function StudiesView({
  initialData,
  currentSemester,
  hasNext = false,
  nextCursor = null,
  totalElements = 0,
}: StudiesViewProps) {
  const router = useRouter();
  const editRequestSeq = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [editForm, setEditForm] = useState<StudyEditForm>({
    ...EMPTY_STUDY_EDIT_FORM,
  });
  const [deleteTarget, setDeleteTarget] = useState<Study | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditDetailLoaded, setIsEditDetailLoaded] = useState(false);
  const [loadingStudyId, setLoadingStudyId] = useState<number | null>(null);
  const [submittingStudyId, setSubmittingStudyId] = useState<number | null>(
    null,
  );

  const handleSemesterChange = (semester: string) => {
    router.push(`/studies?semester=${semester}`);
  };

  const filteredData = initialData.filter((study) => {
    const query = searchQuery.toLowerCase();
    return (
      study.study_name.toLowerCase().includes(query) ||
      study.primary_mentor_name.toLowerCase().includes(query) ||
      (study.secondary_mentor_name &&
        study.secondary_mentor_name.toLowerCase().includes(query)) ||
      study.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : filteredData.length;

  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((study) => ({
        ID: study.id,
        스터디명: study.study_name,
        멘토:
          study.primary_mentor_name +
          (study.secondary_mentor_name
            ? ` (${study.secondary_mentor_name})`
            : ""),
        태그: study.tags.join(", "),
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

    const body: StudyUpdateRequest = {
      study_name: studyName,
      sub_title: editForm.sub_title.trim(),
      one_liner: oneLiner,
      explanation: editForm.explanation.trim(),
      goal: editForm.goal.trim(),
      start_time: editForm.start_time,
      end_time: editForm.end_time,
      week_day: weekDay,
      location: editForm.location.trim(),
      location_detail: editForm.location_detail.trim(),
      recruit_status: editForm.recruit_status,
      difficulty: difficulty as StudyUpdateRequest["difficulty"],
      capacity,
      study_tag_ids: editForm.tags,
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">스터디 목록</h1>
        <p className="text-muted-foreground">
          FORIF 스터디 강좌 목록을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <SemesterTabs
          currentSemester={currentSemester}
          onSemesterChange={handleSemesterChange}
          options={STUDY_SEMESTER_OPTIONS}
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
          placeholder="스터디 목록 검색"
        />

        <DataTable
          columns={columns}
          data={filteredData}
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

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>총 {displayTotalCount}건</span>
          {hasNext && nextCursor !== null && (
            <span>다음 커서: {nextCursor}</span>
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>스터디 정보 수정</DialogTitle>
            <DialogDescription>
              {editingStudy?.study_name ?? "스터디"} 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmitEditStudy();
            }}
          >
            {isLoadingEditDetail && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                스터디 상세 정보를 불러오는 중입니다.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="study-name">스터디명</Label>
                <Input
                  id="study-name"
                  value={editForm.study_name}
                  disabled={isEditFormDisabled}
                  onChange={(event) =>
                    handleEditFormChange("study_name", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-sub-title">부제목</Label>
                <Input
                  id="study-sub-title"
                  value={editForm.sub_title}
                  disabled={isEditFormDisabled}
                  onChange={(event) =>
                    handleEditFormChange("sub_title", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-one-liner">한 줄 소개</Label>
              <Textarea
                id="study-one-liner"
                className="min-h-20"
                value={editForm.one_liner}
                disabled={isEditFormDisabled}
                onChange={(event) =>
                  handleEditFormChange("one_liner", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>태그</Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {STUDY_TAG_OPTIONS.map((tag) => {
                  const checked = editForm.tags.includes(tag.id);
                  const disabled =
                    isEditFormDisabled ||
                    (!checked && editForm.tags.length >= 4);

                  return (
                    <label
                      key={tag.id}
                      className="border-input flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="size-4"
                        checked={checked}
                        disabled={disabled}
                        onChange={(event) =>
                          handleEditTagChange(tag.id, event.target.checked)
                        }
                      />
                      <span>{tag.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-explanation">스터디 설명</Label>
              <Textarea
                id="study-explanation"
                className="min-h-28"
                value={editForm.explanation}
                disabled={isEditFormDisabled}
                onChange={(event) =>
                  handleEditFormChange("explanation", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-goal">목표</Label>
              <Textarea
                id="study-goal"
                className="min-h-24"
                value={editForm.goal}
                disabled={isEditFormDisabled}
                onChange={(event) =>
                  handleEditFormChange("goal", event.target.value)
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="study-location">장소</Label>
                <Input
                  id="study-location"
                  value={editForm.location}
                  disabled={isEditFormDisabled}
                  onChange={(event) =>
                    handleEditFormChange("location", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-location-detail">상세 장소</Label>
                <Input
                  id="study-location-detail"
                  value={editForm.location_detail}
                  disabled={isEditFormDisabled}
                  onChange={(event) =>
                    handleEditFormChange("location_detail", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="study-start-time">시작 시간</Label>
                <Input
                  id="study-start-time"
                  type="time"
                  value={editForm.start_time}
                  disabled={isEditFormDisabled}
                  onChange={(event) =>
                    handleEditFormChange("start_time", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-end-time">종료 시간</Label>
                <Input
                  id="study-end-time"
                  type="time"
                  value={editForm.end_time}
                  disabled={isEditFormDisabled}
                  onChange={(event) =>
                    handleEditFormChange("end_time", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>요일</Label>
                <Select
                  value={editForm.week_day}
                  disabled={isEditFormDisabled}
                  onValueChange={(value) =>
                    handleEditFormChange("week_day", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="요일 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEK_DAY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>모집 상태</Label>
                <Select
                  value={editForm.recruit_status}
                  disabled={isEditFormDisabled}
                  onValueChange={(value) =>
                    handleEditFormChange(
                      "recruit_status",
                      value as StudyEditForm["recruit_status"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPLICABLE">모집중</SelectItem>
                    <SelectItem value="CLOSED">마감</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>난이도</Label>
                <Select
                  value={editForm.difficulty}
                  disabled={isEditFormDisabled}
                  onValueChange={(value) =>
                    handleEditFormChange("difficulty", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="난이도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-capacity">정원</Label>
                <Input
                  id="study-capacity"
                  type="number"
                  min={0}
                  value={editForm.capacity}
                  disabled={isEditFormDisabled}
                  onChange={(event) =>
                    handleEditFormChange("capacity", event.target.value)
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isEditingStudy}
                onClick={() => handleEditDialogOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isEditFormDisabled}>
                {isEditingStudy && <Loader2 className="h-4 w-4 animate-spin" />}
                저장
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스터디 정보 삭제</DialogTitle>
            <DialogDescription>
              {deleteTarget?.study_name ?? "선택한 스터디"}를 삭제합니다. 삭제
              후에는 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeletingStudy}
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeletingStudy}
              onClick={() => void handleConfirmDeleteStudy()}
            >
              {isDeletingStudy && <Loader2 className="h-4 w-4 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
