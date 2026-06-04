"use client";

import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { SearchBar } from "@/components/list/search-bar";
import { Badge } from "@/components/ui/badge";
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
import { handleApiError } from "@core/utils/api-client";
import type {
  CreateHackathonRequest,
  HackathonStatus,
  UpdateHackathonRequest,
} from "@core/types/hackathon";
import { ClipboardList, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createHackathon,
  deleteHackathon,
  fetchSubmissionStatuses,
  updateHackathon,
  updateHackathonStatus,
} from "./api";
import { columns } from "./columns";
import {
  HACKATHON_STATUS_FLOW,
  HACKATHON_STATUS_LABELS,
  type Hackathon,
  type HackathonFormState,
  type SubmissionStatus,
} from "./types";

interface HackathonViewProps {
  initialData: Hackathon[];
}

const EMPTY_FORM: HackathonFormState = {
  held_year: String(new Date().getFullYear()),
  held_semester: "1",
  event_round: "1",
  title: "",
  description: "",
  location: "",
  recruit_starts_at: "",
  recruit_ends_at: "",
  team_building_starts_at: "",
  team_building_ends_at: "",
  starts_at: "",
  ends_at: "",
};

// 상태별 행 액션 노출 규칙
type RowAction = "manage" | "edit" | "status" | "submissions" | "delete";

const ACTION_VISIBILITY: Record<HackathonStatus, Record<RowAction, boolean>> = {
  RECRUITING: {
    manage: true,
    edit: true,
    status: true,
    submissions: false,
    delete: true,
  },
  TEAM_BUILDING: {
    manage: true,
    edit: true,
    status: true,
    submissions: false,
    delete: true,
  },
  IN_PROGRESS: {
    manage: true,
    edit: true,
    status: true,
    submissions: true,
    delete: false,
  },
  JUDGING: {
    manage: true,
    edit: true,
    status: true,
    submissions: true,
    delete: false,
  },
  ENDED: {
    manage: true,
    edit: true,
    status: true,
    submissions: true,
    delete: true,
  },
};

// ISO 8601 → datetime-local input value (로컬 시간)
function toInputDateTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

// datetime-local input value → 백엔드 LocalDateTime 문자열 (없으면 undefined)
// 백엔드가 타임존 없는 LocalDateTime을 받으므로 datetime-local 값을 그대로 전달한다.
function toLocalDateTime(value: string) {
  if (!value) return undefined;
  return value;
}

function getNextStatus(status: HackathonStatus) {
  const index = HACKATHON_STATUS_FLOW.indexOf(status);
  return index >= 0 ? HACKATHON_STATUS_FLOW[index + 1] : undefined;
}

function isActiveHackathon(status: HackathonStatus) {
  return status !== "ENDED";
}

function toFormState(hackathon: Hackathon): HackathonFormState {
  return {
    held_year: String(hackathon.held_year),
    held_semester: String(hackathon.held_semester),
    event_round: String(hackathon.event_round),
    title: hackathon.title ?? "",
    description: hackathon.description ?? "",
    location: hackathon.location ?? "",
    recruit_starts_at: toInputDateTime(hackathon.recruit_starts_at),
    recruit_ends_at: toInputDateTime(hackathon.recruit_ends_at),
    team_building_starts_at: toInputDateTime(hackathon.team_building_starts_at),
    team_building_ends_at: toInputDateTime(hackathon.team_building_ends_at),
    starts_at: toInputDateTime(hackathon.starts_at),
    ends_at: toInputDateTime(hackathon.ends_at),
  };
}

export function HackathonView({ initialData }: HackathonViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // 생성/수정 다이얼로그
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(
    null,
  );
  const [form, setForm] = useState<HackathonFormState>({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);

  // 상태 변경 다이얼로그
  const [statusTarget, setStatusTarget] = useState<Hackathon | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<HackathonStatus>("RECRUITING");
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // 삭제 다이얼로그
  const [deleteTarget, setDeleteTarget] = useState<Hackathon | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 제출물 현황 다이얼로그
  const [submissionTarget, setSubmissionTarget] = useState<Hackathon | null>(
    null,
  );
  const [submissionStatuses, setSubmissionStatuses] = useState<
    SubmissionStatus[]
  >([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const filteredData = initialData.filter((hackathon) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (hackathon.title ?? "").toLowerCase().includes(query) ||
      (hackathon.location ?? "").toLowerCase().includes(query) ||
      `${hackathon.held_year}-${hackathon.held_semester}`.includes(query)
    );
  });
  const activeHackathon = initialData.find((hackathon) =>
    isActiveHackathon(hackathon.status),
  );

  const updateForm = <K extends keyof HackathonFormState>(
    field: K,
    value: HackathonFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenCreate = () => {
    if (activeHackathon) {
      alert(
        `${activeHackathon.title ?? "진행 중인 해커톤"}이 종료된 뒤 새 해커톤을 생성할 수 있습니다.`,
      );
      return;
    }

    setEditingHackathon(null);
    setForm({ ...EMPTY_FORM });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (hackathon: Hackathon) => {
    setEditingHackathon(hackathon);
    setForm(toFormState(hackathon));
    setIsFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingHackathon(null);
      setForm({ ...EMPTY_FORM });
    }
  };

  const handleSubmitForm = async () => {
    const startsAt = toLocalDateTime(form.starts_at);
    const endsAt = toLocalDateTime(form.ends_at);

    if (!startsAt || !endsAt) {
      alert("시작/종료 일시를 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      if (editingHackathon) {
        const body: UpdateHackathonRequest = {
          title: form.title.trim() || undefined,
          description: form.description.trim() || undefined,
          location: form.location.trim() || undefined,
          recruit_starts_at: toLocalDateTime(form.recruit_starts_at),
          recruit_ends_at: toLocalDateTime(form.recruit_ends_at),
          team_building_starts_at: toLocalDateTime(
            form.team_building_starts_at,
          ),
          team_building_ends_at: toLocalDateTime(form.team_building_ends_at),
          starts_at: startsAt,
          ends_at: endsAt,
        };
        await updateHackathon(editingHackathon.hackathon_id, body);
      } else {
        if (activeHackathon) {
          alert("진행 중인 해커톤이 있어 새 해커톤을 생성할 수 없습니다.");
          setSubmitting(false);
          return;
        }

        const heldYear = Number(form.held_year);
        const heldSemester = Number(form.held_semester);
        const eventRound = Number(form.event_round);
        const title = form.title.trim();

        if (!heldYear || !heldSemester || !eventRound) {
          alert("연도/학기/회차를 올바르게 입력해주세요.");
          setSubmitting(false);
          return;
        }
        if (!title) {
          alert("해커톤명을 입력해주세요.");
          setSubmitting(false);
          return;
        }

        const body: CreateHackathonRequest = {
          held_year: heldYear,
          held_semester: heldSemester,
          event_round: eventRound,
          title,
          description: form.description.trim() || undefined,
          location: form.location.trim() || undefined,
          recruit_starts_at: toLocalDateTime(form.recruit_starts_at),
          recruit_ends_at: toLocalDateTime(form.recruit_ends_at),
          team_building_starts_at: toLocalDateTime(
            form.team_building_starts_at,
          ),
          team_building_ends_at: toLocalDateTime(form.team_building_ends_at),
          starts_at: startsAt,
          ends_at: endsAt,
        };
        await createHackathon(body);
      }

      handleFormOpenChange(false);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenStatus = (hackathon: Hackathon) => {
    const nextStatus = getNextStatus(hackathon.status);
    if (!nextStatus) {
      alert("더 이상 변경할 수 있는 다음 상태가 없습니다.");
      return;
    }
    setStatusTarget(hackathon);
    setSelectedStatus(nextStatus);
  };

  const handleSubmitStatus = async () => {
    if (!statusTarget) return;
    try {
      setSubmittingStatus(true);
      await updateHackathonStatus(statusTarget.hackathon_id, selectedStatus);
      setStatusTarget(null);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteHackathon(deleteTarget.hackathon_id);
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenSubmissions = async (hackathon: Hackathon) => {
    setSubmissionTarget(hackathon);
    setSubmissionStatuses([]);
    setLoadingSubmissions(true);
    try {
      const data = await fetchSubmissionStatuses(hackathon.hackathon_id);
      setSubmissionStatuses(data);
    } catch (error) {
      alert(await handleApiError(error));
      setSubmissionTarget(null);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const submittedCount = submissionStatuses.filter((s) => s.submitted).length;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">해커톤 관리</h1>
          <p className="text-muted-foreground">
            해커톤을 생성하고 상태와 제출 현황을 관리할 수 있습니다.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          disabled={activeHackathon !== undefined}
          title={
            activeHackathon
              ? `${activeHackathon.title ?? "진행 중인 해커톤"} 종료 후 추가할 수 있습니다.`
              : undefined
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          해커톤 추가
        </Button>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="해커톤 제목/장소/기수 검색"
        />

        <DataTable
          columns={columns}
          data={filteredData}
          renderRowActions={(hackathon) => {
            const actions = ACTION_VISIBILITY[hackathon.status];
            return (
              <>
                {actions.manage && (
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/hackathon/${hackathon.hackathon_id}`)
                    }
                  >
                    상세 관리
                  </DropdownMenuItem>
                )}
                {actions.edit && (
                  <DropdownMenuItem onClick={() => handleOpenEdit(hackathon)}>
                    정보 수정
                  </DropdownMenuItem>
                )}
                {actions.status && (
                  <DropdownMenuItem onClick={() => handleOpenStatus(hackathon)}>
                    상태 변경
                  </DropdownMenuItem>
                )}
                {actions.submissions && (
                  <DropdownMenuItem
                    onClick={() => void handleOpenSubmissions(hackathon)}
                  >
                    제출물 현황
                  </DropdownMenuItem>
                )}
                {actions.delete && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteTarget(hackathon)}
                  >
                    삭제
                  </DropdownMenuItem>
                )}
              </>
            );
          }}
        />

        <div className="text-muted-foreground text-sm">
          총 {filteredData.length}건
        </div>
      </div>

      {/* 생성/수정 다이얼로그 */}
      <Dialog open={isFormOpen} onOpenChange={handleFormOpenChange}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHackathon ? "해커톤 정보 수정" : "해커톤 추가"}
            </DialogTitle>
            <DialogDescription>
              {editingHackathon
                ? "해커톤 정보를 수정합니다. (기수 정보는 변경할 수 없습니다)"
                : "새 해커톤을 생성합니다."}
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmitForm();
            }}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="held-year">연도</Label>
                <Input
                  id="held-year"
                  type="number"
                  value={form.held_year}
                  disabled={submitting || editingHackathon !== null}
                  onChange={(e) => updateForm("held_year", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>학기</Label>
                <Select
                  value={form.held_semester}
                  disabled={submitting || editingHackathon !== null}
                  onValueChange={(value) => updateForm("held_semester", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1학기</SelectItem>
                    <SelectItem value="2">2학기</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-round">회차</Label>
                <Input
                  id="event-round"
                  type="number"
                  min={1}
                  value={form.event_round}
                  disabled={submitting || editingHackathon !== null}
                  onChange={(e) => updateForm("event_round", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={form.title}
                disabled={submitting}
                onChange={(e) => updateForm("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                className="min-h-24"
                value={form.description}
                disabled={submitting}
                onChange={(e) => updateForm("description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">장소</Label>
              <Input
                id="location"
                value={form.location}
                disabled={submitting}
                onChange={(e) => updateForm("location", e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recruit-start">모집 시작</Label>
                <Input
                  id="recruit-start"
                  type="datetime-local"
                  value={form.recruit_starts_at}
                  disabled={submitting}
                  onChange={(e) =>
                    updateForm("recruit_starts_at", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruit-end">모집 종료</Label>
                <Input
                  id="recruit-end"
                  type="datetime-local"
                  value={form.recruit_ends_at}
                  disabled={submitting}
                  onChange={(e) =>
                    updateForm("recruit_ends_at", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-start">팀 빌딩 시작</Label>
                <Input
                  id="team-start"
                  type="datetime-local"
                  value={form.team_building_starts_at}
                  disabled={submitting}
                  onChange={(e) =>
                    updateForm("team_building_starts_at", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-end">팀 빌딩 종료</Label>
                <Input
                  id="team-end"
                  type="datetime-local"
                  value={form.team_building_ends_at}
                  disabled={submitting}
                  onChange={(e) =>
                    updateForm("team_building_ends_at", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="starts-at">시작 일시 *</Label>
                <Input
                  id="starts-at"
                  type="datetime-local"
                  value={form.starts_at}
                  disabled={submitting}
                  onChange={(e) => updateForm("starts_at", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ends-at">종료 일시 *</Label>
                <Input
                  id="ends-at"
                  type="datetime-local"
                  value={form.ends_at}
                  disabled={submitting}
                  onChange={(e) => updateForm("ends_at", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => handleFormOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingHackathon ? "저장" : "생성"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 상태 변경 다이얼로그 */}
      <Dialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>해커톤 상태 변경</DialogTitle>
            <DialogDescription>
              {statusTarget?.title ?? "해커톤"}의 진행 상태를 변경합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>상태</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as HackathonStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusTarget && getNextStatus(statusTarget.status) && (
                  <SelectItem value={getNextStatus(statusTarget.status)!}>
                    {
                      HACKATHON_STATUS_LABELS[
                        getNextStatus(statusTarget.status)!
                      ]
                    }
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={submittingStatus}
              onClick={() => setStatusTarget(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              disabled={submittingStatus}
              onClick={() => void handleSubmitStatus()}
            >
              {submittingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
              변경
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 다이얼로그 */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>해커톤 삭제</DialogTitle>
            <DialogDescription>
              {deleteTarget?.title ?? "선택한 해커톤"}을(를) 삭제합니다. 삭제
              후에는 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void handleConfirmDelete()}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 제출물 현황 다이얼로그 */}
      <Dialog
        open={submissionTarget !== null}
        onOpenChange={(open) => {
          if (!open) setSubmissionTarget(null);
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              제출물 현황
            </DialogTitle>
            <DialogDescription>
              {submissionTarget?.title ?? "해커톤"}의 팀별 제출 현황입니다.
            </DialogDescription>
          </DialogHeader>

          {loadingSubmissions ? (
            <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              제출 현황을 불러오는 중입니다.
            </div>
          ) : submissionStatuses.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              제출 현황이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-muted-foreground text-sm">
                총 {submissionStatuses.length}팀 중 {submittedCount}팀 제출 완료
              </div>
              <div className="divide-border divide-y rounded-md border">
                {submissionStatuses.map((status) => (
                  <div
                    key={status.hackathon_team_id}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{status.team_name}</p>
                      <p className="text-muted-foreground text-sm">
                        {status.leader_name} · {status.member_count}명
                        {status.submission
                          ? ` · ${status.submission.project_name}`
                          : ""}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        status.submitted
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-400 bg-gray-50 text-gray-600"
                      }
                    >
                      {status.submitted ? "제출 완료" : "미제출"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubmissionTarget(null)}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
