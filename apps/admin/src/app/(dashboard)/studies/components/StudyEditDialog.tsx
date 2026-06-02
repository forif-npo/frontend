"use client";

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
import { Loader2 } from "lucide-react";
import {
  DIFFICULTY_OPTIONS,
  STUDY_TAG_OPTIONS,
  WEEK_DAY_OPTIONS,
} from "../constants";
import type { Study, StudyEditForm } from "../types";

interface StudyEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStudy: Study | null;
  form: StudyEditForm;
  onFieldChange: <K extends keyof StudyEditForm>(
    field: K,
    value: StudyEditForm[K],
  ) => void;
  onTagChange: (tagId: number, checked: boolean) => void;
  onSubmit: () => void;
  isLoadingDetail: boolean;
  isFormDisabled: boolean;
  isSubmitting: boolean;
}

export function StudyEditDialog({
  open,
  onOpenChange,
  editingStudy,
  form,
  onFieldChange,
  onTagChange,
  onSubmit,
  isLoadingDetail,
  isFormDisabled,
  isSubmitting,
}: StudyEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onSubmit();
          }}
        >
          {isLoadingDetail && (
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
                value={form.study_name}
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("study_name", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-sub-title">부제목</Label>
              <Input
                id="study-sub-title"
                value={form.sub_title}
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("sub_title", event.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="study-one-liner">한 줄 소개</Label>
            <Textarea
              id="study-one-liner"
              className="min-h-20"
              value={form.one_liner}
              disabled={isFormDisabled}
              onChange={(event) =>
                onFieldChange("one_liner", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>태그</Label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {STUDY_TAG_OPTIONS.map((tag) => {
                const checked = form.tags.includes(tag.id);
                const disabled =
                  isFormDisabled || (!checked && form.tags.length >= 4);

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
                        onTagChange(tag.id, event.target.checked)
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
              value={form.explanation}
              disabled={isFormDisabled}
              onChange={(event) =>
                onFieldChange("explanation", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="study-goal">목표</Label>
            <Textarea
              id="study-goal"
              className="min-h-24"
              value={form.goal}
              disabled={isFormDisabled}
              onChange={(event) => onFieldChange("goal", event.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="study-location">장소</Label>
              <Input
                id="study-location"
                value={form.location}
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("location", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-location-detail">상세 장소</Label>
              <Input
                id="study-location-detail"
                value={form.location_detail}
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("location_detail", event.target.value)
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
                value={form.start_time}
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("start_time", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-end-time">종료 시간</Label>
              <Input
                id="study-end-time"
                type="time"
                value={form.end_time}
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("end_time", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>요일</Label>
              <Select
                value={form.week_day}
                disabled={isFormDisabled}
                onValueChange={(value) => onFieldChange("week_day", value)}
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
                value={form.recruit_status}
                disabled={isFormDisabled}
                onValueChange={(value) =>
                  onFieldChange(
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
                value={form.difficulty}
                disabled={isFormDisabled}
                onValueChange={(value) => onFieldChange("difficulty", value)}
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
                value={form.capacity}
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("capacity", event.target.value)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isFormDisabled}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
