"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import type { AdminStaffRecruitmentRound } from "@core/types/staff-recruitment";
import {
  emptyRecruitmentForm,
  recruitmentToForm,
  type StaffRecruitmentFormState,
  validateRecruitmentForm,
} from "./form";

interface Props {
  open: boolean;
  recruitment: AdminStaffRecruitmentRound | null;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: StaffRecruitmentFormState) => void;
}

export function StaffRecruitmentFormDialog({
  open,
  recruitment,
  submitting,
  onOpenChange,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<StaffRecruitmentFormState>(emptyRecruitmentForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(
      recruitment ? recruitmentToForm(recruitment) : emptyRecruitmentForm(),
    );
    setError(null);
  }, [open, recruitment]);

  const submit = () => {
    const message = validateRecruitmentForm(form);
    setError(message);
    if (!message) onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>
            {recruitment ? "운영진 모집 수정" : "운영진 모집 만들기"}
          </DialogTitle>
          <DialogDescription>
            저장하면 초안으로 유지됩니다. 공개는 목록에서 별도로 진행합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="모집 제목" id="recruitment-title">
              <Input
                id="recruitment-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="한 줄 소개" id="recruitment-summary">
              <Input
                id="recruitment-summary"
                value={form.summary}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    summary: event.target.value,
                  }))
                }
              />
            </Field>
          </div>

          <Field label="안내문" id="recruitment-description">
            <Textarea
              id="recruitment-description"
              rows={6}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="활동 연도" id="recruitment-year">
              <Input
                id="recruitment-year"
                type="number"
                min={2018}
                value={form.actYear}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    actYear: event.target.value,
                  }))
                }
              />
            </Field>
            <div className="grid gap-2">
              <Label htmlFor="recruitment-semester">학기</Label>
              <Select
                value={form.actSemester}
                onValueChange={(value: "1" | "2") =>
                  setForm((current) => ({
                    ...current,
                    actSemester: value,
                  }))
                }
              >
                <SelectTrigger id="recruitment-semester">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학기</SelectItem>
                  <SelectItem value="2">2학기</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Field label="접수 시작" id="recruitment-start">
              <Input
                id="recruitment-start"
                type="datetime-local"
                value={form.startsAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startsAt: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="접수 종료" id="recruitment-end">
              <Input
                id="recruitment-end"
                type="datetime-local"
                value={form.endsAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    endsAt: event.target.value,
                  }))
                }
              />
            </Field>
          </div>

          <EditorSection
            title="모집 부서"
            addLabel="부서 추가"
            onAdd={() =>
              setForm((current) => ({
                ...current,
                departments: [
                  ...current.departments,
                  { name: "", description: "" },
                ],
              }))
            }
          >
            {form.departments.map((department, index) => (
              <div
                key={`department-${index}`}
                className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_2fr_auto]"
              >
                <Input
                  aria-label={`${index + 1}번째 부서명`}
                  placeholder="기획팀"
                  value={department.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      departments: current.departments.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, name: event.target.value }
                          : item,
                      ),
                    }))
                  }
                />
                <Input
                  aria-label={`${index + 1}번째 부서 설명`}
                  placeholder="부서 역할을 간단히 적어주세요"
                  value={department.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      departments: current.departments.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, description: event.target.value }
                          : item,
                      ),
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`${index + 1}번째 부서 삭제`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      departments: current.departments.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </EditorSection>

          <EditorSection
            title="지원 문항"
            addLabel="문항 추가"
            onAdd={() =>
              setForm((current) => ({
                ...current,
                questions: [
                  ...current.questions,
                  {
                    label: "",
                    description: "",
                    type: "LONG_TEXT",
                    required: true,
                    maxLength: "1000",
                  },
                ],
              }))
            }
          >
            {form.questions.map((question, index) => (
              <div
                key={`question-${index}`}
                className="grid gap-3 rounded-md border p-3"
              >
                <div className="grid gap-2 sm:grid-cols-[2fr_1fr_110px_auto]">
                  <Input
                    aria-label={`${index + 1}번째 문항`}
                    placeholder="지원 동기를 작성해주세요"
                    value={question.label}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        questions: current.questions.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, label: event.target.value }
                            : item,
                        ),
                      }))
                    }
                  />
                  <Select
                    value={question.type}
                    onValueChange={(value: "SHORT_TEXT" | "LONG_TEXT") =>
                      setForm((current) => ({
                        ...current,
                        questions: current.questions.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, type: value } : item,
                        ),
                      }))
                    }
                  >
                    <SelectTrigger aria-label={`${index + 1}번째 문항 유형`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT_TEXT">짧은 답변</SelectItem>
                      <SelectItem value="LONG_TEXT">긴 답변</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    aria-label={`${index + 1}번째 최대 글자 수`}
                    type="number"
                    min={1}
                    value={question.maxLength}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        questions: current.questions.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, maxLength: event.target.value }
                            : item,
                        ),
                      }))
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`${index + 1}번째 문항 삭제`}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        questions: current.questions.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        questions: current.questions.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, required: event.target.checked }
                            : item,
                        ),
                      }))
                    }
                  />
                  필수 문항
                </label>
              </div>
            ))}
          </EditorSection>

          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            취소
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "저장 중..." : "초안 저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function EditorSection({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          {addLabel}
        </Button>
      </div>
      {children}
    </section>
  );
}
