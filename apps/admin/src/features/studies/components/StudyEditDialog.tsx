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
import {
  STUDY_LOCATION_OPTIONS,
  STUDY_TAG_OPTIONS_BY_CATEGORY,
} from "@core/study-form";
import { CircleMinus, CirclePlus, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { DIFFICULTY_OPTIONS, WEEK_DAY_OPTIONS } from "../constants";
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
  onSecondaryMentorSearch: (studentId: string) => Promise<void>;
  onSecondaryMentorRemove: () => void;
  isLoadingDetail: boolean;
  isFormDisabled: boolean;
  isSubmitting: boolean;
}

export function StudyEditDialog(props: StudyEditDialogProps) {
  const {
    open,
    onOpenChange,
    editingStudy,
    form,
    onFieldChange,
    onTagChange,
    onSubmit,
    onSecondaryMentorSearch,
    onSecondaryMentorRemove,
    isLoadingDetail,
    isFormDisabled,
    isSubmitting,
  } = props;
  const [mentorStudentId, setMentorStudentId] = useState("");
  const [isSearchingMentor, setIsSearchingMentor] = useState(false);
  const isRoomDisabled =
    form.is_online ||
    form.location === "온라인" ||
    form.location === "장소 미정";

  const updateReferences = (references: StudyEditForm["references"]) =>
    onFieldChange("references", references);

  const searchMentor = async () => {
    const studentId = mentorStudentId.trim();
    if (!studentId) return;
    setIsSearchingMentor(true);
    try {
      await onSecondaryMentorSearch(studentId);
    } finally {
      setIsSearchingMentor(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>스터디 정보 수정</DialogTitle>
          <DialogDescription>
            {editingStudy?.study_name ?? "스터디"} 정보를 수정합니다.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-8"
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

          <section className="space-y-4">
            <h3 className="font-semibold">멘토</h3>
            <Label htmlFor="secondary-mentor">추가 멘토 학번</Label>
            <div className="flex gap-2">
              <Input
                id="secondary-mentor"
                value={mentorStudentId}
                disabled={isFormDisabled}
                placeholder="추가할 멘토의 학번을 입력해주세요"
                onChange={(event) => setMentorStudentId(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void searchMentor();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isFormDisabled || isSearchingMentor}
                onClick={() => void searchMentor()}
              >
                {isSearchingMentor ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                검색
              </Button>
              {form.secondary_mentor_id !== null && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isFormDisabled}
                  onClick={onSecondaryMentorRemove}
                >
                  제거
                </Button>
              )}
            </div>
            {form.secondary_mentor_id !== null && (
              <p className="text-muted-foreground text-sm">
                선택된 추가 멘토: {form.secondary_mentor_name ?? "이름 미확인"}
              </p>
            )}
          </section>

          <section className="space-y-5">
            <h3 className="font-semibold">스터디 개요 및 일정</h3>
            <TextField
              id="study-name"
              label="스터디명"
              value={form.study_name}
              maxLength={50}
              disabled={isFormDisabled}
              onChange={(value) => onFieldChange("study_name", value)}
            />
            <TextField
              id="study-one-liner"
              label="한 줄 소개"
              value={form.one_liner}
              maxLength={100}
              disabled={isFormDisabled}
              onChange={(value) => onFieldChange("one_liner", value)}
            />
            <TagFields
              tags={form.tags}
              disabled={isFormDisabled}
              onTagChange={onTagChange}
            />
            <div className="space-y-2">
              <Label htmlFor="study-thumbnail">썸네일</Label>
              <Input
                id="study-thumbnail"
                type="file"
                accept="image/jpeg,image/png"
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("thumbnail", event.target.files?.[0] ?? null)
                }
              />
              <p className="text-muted-foreground text-xs">
                JPG, JPEG, PNG 형식만 가능하며 최대 5MB입니다.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="study-explanation">스터디 소개</Label>
              <Textarea
                id="study-explanation"
                className="min-h-28"
                maxLength={3000}
                value={form.explanation}
                disabled={isFormDisabled}
                onChange={(event) =>
                  onFieldChange("explanation", event.target.value)
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_online}
                disabled={isFormDisabled}
                onChange={(event) => {
                  const checked = event.target.checked;
                  onFieldChange("is_online", checked);
                  if (checked) {
                    onFieldChange("location", "온라인");
                    onFieldChange("location_detail", "");
                  }
                }}
              />
              온라인으로 진행합니다.
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>장소</Label>
                <Select
                  value={form.location}
                  disabled={isFormDisabled}
                  onValueChange={(value) => {
                    onFieldChange("location", value);
                    onFieldChange("is_online", value === "온라인");
                    if (value === "온라인" || value === "장소 미정") {
                      onFieldChange("location_detail", "");
                    }
                    if (value === "동아리방") {
                      onFieldChange("location_detail", "B214");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="장소를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDY_LOCATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <TextField
                id="study-location-detail"
                label="강의실(호)"
                value={form.location_detail}
                maxLength={50}
                disabled={isFormDisabled || isRoomDisabled}
                onChange={(value) => onFieldChange("location_detail", value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField
                label="요일"
                value={form.week_day}
                options={WEEK_DAY_OPTIONS}
                disabled={isFormDisabled}
                onChange={(value) => onFieldChange("week_day", value)}
              />
              <TextField
                id="study-start-time"
                label="시작 시간"
                type="time"
                value={form.start_time}
                disabled={isFormDisabled}
                onChange={(value) => onFieldChange("start_time", value)}
              />
              <TextField
                id="study-end-time"
                label="종료 시간"
                type="time"
                value={form.end_time}
                disabled={isFormDisabled}
                onChange={(value) => onFieldChange("end_time", value)}
              />
            </div>
          </section>

          <CurriculumFields
            curriculum={form.curriculum}
            disabled={isFormDisabled}
            onChange={(curriculum) => onFieldChange("curriculum", curriculum)}
          />

          <section className="space-y-4">
            <h3 className="font-semibold">난이도 및 운영 방식</h3>
            <SelectField
              label="난이도"
              value={form.difficulty}
              options={DIFFICULTY_OPTIONS}
              disabled={isFormDisabled}
              onChange={(value) => onFieldChange("difficulty", value)}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.requires_interview}
                disabled={isFormDisabled}
                onChange={(event) => {
                  onFieldChange("requires_interview", event.target.checked);
                  if (!event.target.checked)
                    onFieldChange("interview_date", "");
                }}
              />
              면접을 진행합니다.
            </label>
            {form.requires_interview && (
              <TextField
                id="interview-date"
                label="면접 날짜"
                type="date"
                value={form.interview_date}
                disabled={isFormDisabled}
                onChange={(value) => onFieldChange("interview_date", value)}
              />
            )}
          </section>

          <ReferenceFields
            references={form.references}
            disabled={isFormDisabled}
            onChange={updateReferences}
          />

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

function TextField({
  id,
  label,
  value,
  onChange,
  disabled,
  type = "text",
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: "text" | "time" | "date";
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} disabled={disabled} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`${label} 선택`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TagFields({
  tags,
  disabled,
  onTagChange,
}: {
  tags: number[];
  disabled: boolean;
  onTagChange: (tagId: number, checked: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>태그 (1~4개)</Label>
      <div className="grid gap-5 sm:grid-cols-2">
        {STUDY_TAG_OPTIONS_BY_CATEGORY.map(({ category, options }) => (
          <fieldset key={category} className="space-y-2 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">{category}</legend>
            <div className="grid grid-cols-2 gap-2">
              {options.map((tag) => {
                const checked = tags.includes(tag.id);
                return (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled || (!checked && tags.length >= 4)}
                      onChange={(event) =>
                        onTagChange(tag.id, event.target.checked)
                      }
                    />
                    {tag.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function CurriculumFields({
  curriculum,
  disabled,
  onChange,
}: {
  curriculum: StudyEditForm["curriculum"];
  disabled: boolean;
  onChange: (curriculum: StudyEditForm["curriculum"]) => void;
}) {
  const updateWeek = (
    weekIndex: number,
    patch: Partial<StudyEditForm["curriculum"][number]>,
  ) =>
    onChange(
      curriculum.map((week, index) =>
        index === weekIndex ? { ...week, ...patch } : week,
      ),
    );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">커리큘럼</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() =>
            onChange([
              ...curriculum,
              {
                week: curriculum.length + 1,
                date: "",
                topic: "",
                contents: [""],
              },
            ])
          }
        >
          <CirclePlus className="h-4 w-4" /> 주차 추가
        </Button>
      </div>
      {curriculum.map((week, weekIndex) => (
        <div key={week.week} className="space-y-2 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{week.week}주차</span>
            {weekIndex >= 8 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() =>
                  onChange(
                    curriculum
                      .filter((_, index) => index !== weekIndex)
                      .map((item, index) => ({ ...item, week: index + 1 })),
                  )
                }
              >
                <CircleMinus className="h-4 w-4" /> 삭제
              </Button>
            )}
          </div>
          <Input
            type="date"
            value={week.date}
            disabled={disabled}
            onChange={(event) =>
              updateWeek(weekIndex, { date: event.target.value })
            }
          />
          <Textarea
            placeholder="주제"
            value={week.topic}
            disabled={disabled}
            onChange={(event) =>
              updateWeek(weekIndex, { topic: event.target.value })
            }
          />
          {week.contents.map((content, contentIndex) => (
            <div key={contentIndex} className="flex gap-2">
              <Textarea
                placeholder="학습 내용"
                value={content}
                disabled={disabled}
                onChange={(event) =>
                  updateWeek(weekIndex, {
                    contents: week.contents.map((item, index) =>
                      index === contentIndex ? event.target.value : item,
                    ),
                  })
                }
              />
              {week.contents.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  onClick={() =>
                    updateWeek(weekIndex, {
                      contents: week.contents.filter(
                        (_, index) => index !== contentIndex,
                      ),
                    })
                  }
                >
                  <CircleMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() =>
              updateWeek(weekIndex, { contents: [...week.contents, ""] })
            }
          >
            <CirclePlus className="h-4 w-4" /> 내용 추가
          </Button>
        </div>
      ))}
    </section>
  );
}

function ReferenceFields({
  references,
  disabled,
  onChange,
}: {
  references: StudyEditForm["references"];
  disabled: boolean;
  onChange: (references: StudyEditForm["references"]) => void;
}) {
  const updateReference = (
    referenceIndex: number,
    patch: Partial<StudyEditForm["references"][number]>,
  ) =>
    onChange(
      references.map((reference, index) =>
        index === referenceIndex ? { ...reference, ...patch } : reference,
      ),
    );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">참고자료</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onChange([...references, { type: "LINK", value: "" }])}
        >
          <CirclePlus className="h-4 w-4" /> 자료 추가
        </Button>
      </div>
      {references.map((reference, index) => (
        <div
          key={reference.id ?? index}
          className="flex items-start gap-2 rounded-md border p-3"
        >
          <Select
            value={reference.type}
            disabled={disabled}
            onValueChange={(value: "LINK" | "DOWNLOAD") =>
              updateReference(index, {
                type: value,
                value: value === "LINK" ? "" : null,
                file_name: null,
              })
            }
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LINK">링크</SelectItem>
              <SelectItem value="DOWNLOAD">파일</SelectItem>
            </SelectContent>
          </Select>
          {reference.type === "DOWNLOAD" ? (
            <div className="flex-1">
              {typeof reference.value === "string" && reference.value ? (
                <p className="text-muted-foreground truncate py-2 text-sm">
                  {reference.file_name ?? "기존 첨부파일"}
                </p>
              ) : (
                <Input
                  type="file"
                  disabled={disabled}
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    updateReference(index, {
                      value: file,
                      file_name: file?.name ?? null,
                    });
                  }}
                />
              )}
            </div>
          ) : (
            <Input
              className="flex-1"
              placeholder="웹사이트 링크"
              value={typeof reference.value === "string" ? reference.value : ""}
              disabled={disabled}
              onChange={(event) =>
                updateReference(index, { value: event.target.value })
              }
            />
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={() =>
              onChange(references.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            <CircleMinus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </section>
  );
}
