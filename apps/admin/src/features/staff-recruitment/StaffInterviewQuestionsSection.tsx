"use client";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { StaffInterviewQuestion } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/Toast";
import { createStaffInterviewQuestion, deleteStaffInterviewQuestion, getStaffInterviewQuestions, updateStaffInterviewQuestion } from "./api";

interface Department {
  department_id: number;
  name: string;
}

/**
 * 면접 질문 관리. 공통 질문과 부서별 질문을 회장단이 써 두면
 * 모든 면접자 기록지에 똑같이 나온다. 부서 질문은 그 부서에 지원한 사람에게만 보인다.
 */
export function StaffInterviewQuestionsSection({
  recruitmentId,
  departments,
  onChanged,
}: {
  recruitmentId: number;
  departments: Department[];
  /** 질문이 바뀌면 열려 있는 기록지를 다시 불러오도록 알린다. */
  onChanged?: () => void;
}) {
  const [questions, setQuestions] = useState<StaffInterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setQuestions(await getStaffInterviewQuestions(recruitmentId));
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [recruitmentId]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action();
      toast.success(success);
      await load();
      onChanged?.();
      return true;
    } catch (error) {
      toast.error(await handleApiError(error));
      return false;
    }
  };

  const groups: Array<{ key: string; title: string; departmentId: number | null }> = [
    { key: "common", title: "공통 질문", departmentId: null },
    ...departments.map((department) => ({
      key: `department-${department.department_id}`,
      title: `${formatStaffRecruitmentDepartment(department.name)} 질문`,
      departmentId: department.department_id,
    })),
  ];

  return (
    <section className="space-y-4" aria-labelledby="interview-questions-heading">
      <div>
        <h2 id="interview-questions-heading" className="text-lg font-bold">
          면접 질문
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          공통 질문은 모든 면접자에게, 부서별 질문은 그 부서를 1지망/2지망으로 고른 면접자에게 나옵니다.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">질문을 불러오는 중입니다.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((group) => (
            <QuestionGroup
              key={group.key}
              title={group.title}
              questions={questions.filter((question) => question.department_id === group.departmentId)}
              onAdd={(content) =>
                run(
                  () => createStaffInterviewQuestion(recruitmentId, group.departmentId, content),
                  "질문을 추가했습니다.",
                )
              }
              onUpdate={(question, content) =>
                run(
                  () => updateStaffInterviewQuestion(recruitmentId, question.question_id, content),
                  "질문을 고쳤습니다.",
                )
              }
              onDelete={async (question) => {
                const confirmed = await confirmDialog({
                  title: "면접 질문 삭제",
                  description: `“${question.content}” 질문을 지울까요? 답변이 적힌 질문은 지울 수 없습니다.`,
                  confirmLabel: "삭제",
                });
                if (!confirmed) return false;
                return run(
                  () => deleteStaffInterviewQuestion(recruitmentId, question.question_id),
                  "질문을 지웠습니다.",
                );
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function QuestionGroup({
  title,
  questions,
  onAdd,
  onUpdate,
  onDelete,
}: {
  title: string;
  questions: StaffInterviewQuestion[];
  onAdd: (content: string) => Promise<boolean>;
  onUpdate: (question: StaffInterviewQuestion, content: string) => Promise<boolean>;
  onDelete: (question: StaffInterviewQuestion) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const add = async () => {
    if (!draft.trim()) return;
    if (await onAdd(draft.trim())) setDraft("");
  };

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {questions.length === 0 ? (
        <p className="text-muted-foreground text-sm">아직 질문이 없습니다.</p>
      ) : (
        <ol className="space-y-2">
          {questions.map((question, index) => (
            <li key={question.question_id} className="flex items-start gap-2 text-sm">
              <span className="text-muted-foreground w-5 shrink-0 pt-2 text-right">{index + 1}.</span>
              {editingId === question.question_id ? (
                <div className="flex flex-1 gap-2">
                  <Input
                    value={editText}
                    maxLength={500}
                    aria-label={`${title} ${index + 1}번 고치기`}
                    onChange={(event) => setEditText(event.target.value)}
                  />
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    취소
                  </Button>
                  <Button
                    size="sm"
                    disabled={!editText.trim()}
                    onClick={async () => {
                      if (await onUpdate(question, editText.trim())) setEditingId(null);
                    }}
                  >
                    저장
                  </Button>
                </div>
              ) : (
                <>
                  <span className="flex-1 whitespace-pre-wrap pt-2">{question.content}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`${title} ${index + 1}번 고치기`}
                    onClick={() => {
                      setEditingId(question.question_id);
                      setEditText(question.content);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`${title} ${index + 1}번 지우기`}
                    onClick={() => void onDelete(question)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ol>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          maxLength={500}
          placeholder="질문을 입력하고 추가를 누르세요"
          aria-label={`${title} 추가`}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void add();
            }
          }}
        />
        <Button variant="outline" disabled={!draft.trim()} onClick={() => void add()}>
          <Plus className="mr-1 size-4" />
          추가
        </Button>
      </div>
    </div>
  );
}
