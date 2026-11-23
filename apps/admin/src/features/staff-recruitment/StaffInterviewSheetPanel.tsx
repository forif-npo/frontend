"use client";
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { StaffApplicationDetail, StaffInterviewQuestionAnswer, StaffInterviewSheet, StaffInterviewStatus } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/Toast";
import { addStaffInterviewExtraQuestion, deleteStaffInterviewExtraQuestion, getStaffApplicationDetail, getStaffInterviewSheet, saveStaffInterviewAnswer, updateStaffInterviewExtraQuestion } from "./api";
import { createSerialQueue, formatInterviewSlot, interviewStatusTitle } from "./interview-board";
import { StaffApplicationAnswerList } from "./StaffApplicationAnswerList";
import { StaffApplicantInfoTable } from "./StaffApplicantInfoTable";

/**
 * 면접자 한 명의 기록지. 지원서 내용, 공통·1지망·2지망 질문, 기타 질문 순으로 놓고
 * 질문마다 답변 칸을 둔다. 답변은 칸에서 벗어날 때 저장한다.
 */
export function StaffInterviewSheetPanel({
  recruitmentId,
  applicationId,
  reloadKey,
  requiredQuestionIds,
  onClose,
  onStatusChange,
}: {
  recruitmentId: number;
  /** null이면 닫혀 있다. */
  applicationId: number | null;
  /** 바뀌면 기록지를 다시 읽는다. 면접 질문을 고쳤을 때 쓴다. */
  reloadKey?: number;
  requiredQuestionIds: ReadonlySet<number>;
  onClose: () => void;
  /** 상태 변경은 보드가 맡는다. 성공하면 바뀐 기록지를 돌려준다. */
  onStatusChange: (applicationId: number, status: StaffInterviewStatus) => Promise<StaffInterviewSheet | null>;
}) {
  const [sheet, setSheet] = useState<StaffInterviewSheet | null>(null);
  const [application, setApplication] = useState<StaffApplicationDetail | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (applicationId === null) {
      setSheet(null);
      setApplication(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [nextSheet, nextApplication] = await Promise.all([
          getStaffInterviewSheet(recruitmentId, applicationId),
          getStaffApplicationDetail(recruitmentId, applicationId),
        ]);
        if (cancelled) return;
        setSheet(nextSheet);
        setApplication(nextApplication);
      } catch (error) {
        if (!cancelled) {
          toast.error(await handleApiError(error));
          onClose();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // onClose는 부모가 렌더마다 새로 만들 수 있어 의존성에서 뺀다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId, applicationId, reloadKey]);

  // 기록지를 바꾸는 요청은 하나씩 보낸다. 겹치면 늦게 온 응답이 앞의 변경을 덮는다.
  const enqueueRef = useRef(createSerialQueue());
  // 저장 중에 다른 카드를 열면, 앞 카드의 응답이 새 카드의 기록지를 덮지 않게 한다.
  const openIdRef = useRef(applicationId);
  openIdRef.current = applicationId;

  const applySheet = (next: StaffInterviewSheet) => {
    if (next.application_id === openIdRef.current) setSheet(next);
  };

  const save = async (action: () => Promise<StaffInterviewSheet>, success?: string) => {
    try {
      applySheet(await enqueueRef.current(action));
      if (success) toast.success(success);
      return true;
    } catch (error) {
      toast.error(await handleApiError(error));
      return false;
    }
  };

  const changeStatus = async (status: StaffInterviewStatus) => {
    if (!sheet || busy) return;
    const target = sheet.application_id;
    setBusy(true);
    try {
      const next = await enqueueRef.current(() => onStatusChange(target, status));
      if (next) applySheet(next);
    } finally {
      setBusy(false);
    }
  };

  const saveAnswer = (questionId: number, answer: string) =>
    save(() => saveStaffInterviewAnswer(recruitmentId, sheet!.application_id, questionId, answer));

  return (
    <Sheet open={applicationId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-2xl">
        {sheet && application ? (
          <>
            <SheetHeader className="border-b p-6">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xl">면접 기록지</SheetTitle>
                <Badge variant="outline">{interviewStatusTitle(sheet.status)}</Badge>
              </div>
              <SheetDescription>지원자 정보와 면접 기록을 확인합니다.</SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-10 overflow-y-auto p-6">
              <section className="space-y-4" aria-labelledby="sheet-applicant-info-heading">
                <h3 id="sheet-applicant-info-heading" className="text-lg font-semibold">
                  지원자 정보
                </h3>
                <StaffApplicantInfoTable
                  detail={application}
                  interviewTime={formatInterviewSlot(sheet.assigned_slot, sheet.slot_minutes)}
                />
              </section>

              <section className="space-y-4" aria-labelledby="sheet-application-heading">
                <h3 id="sheet-application-heading" className="text-lg font-semibold">
                  지원서 내용
                </h3>
                <StaffApplicationAnswerList detail={application} requiredQuestionIds={requiredQuestionIds} />
              </section>

              <QuestionAnswerSection
                id="sheet-common"
                title="공통 질문"
                questions={sheet.common_questions}
                onSave={saveAnswer}
              />
              {sheet.first_department && (
                <QuestionAnswerSection
                  id="sheet-first"
                  title={`1지망 · ${formatStaffRecruitmentDepartment(sheet.first_department.department_name)} 질문`}
                  questions={sheet.first_department.questions}
                  onSave={saveAnswer}
                />
              )}
              {sheet.second_department && (
                <QuestionAnswerSection
                  id="sheet-second"
                  title={`2지망 · ${formatStaffRecruitmentDepartment(sheet.second_department.department_name)} 질문`}
                  questions={sheet.second_department.questions}
                  onSave={saveAnswer}
                />
              )}

              <ExtraQuestionSection
                sheet={sheet}
                onAdd={(content) =>
                  save(() => addStaffInterviewExtraQuestion(recruitmentId, sheet.application_id, content))
                }
                onSaveAnswer={(extraId, answer) =>
                  save(() =>
                    updateStaffInterviewExtraQuestion(recruitmentId, sheet.application_id, extraId, { answer }),
                  )
                }
                onDelete={async (extraId) => {
                  const confirmed = await confirmDialog({
                    title: "기타 질문 삭제",
                    description: "이 질문과 적어 둔 답변을 함께 지울까요?",
                    confirmLabel: "삭제",
                  });
                  if (!confirmed) return false;
                  return save(
                    () => deleteStaffInterviewExtraQuestion(recruitmentId, sheet.application_id, extraId),
                    "기타 질문을 지웠습니다.",
                  );
                }}
              />
            </div>

            <SheetFooter className="flex-row justify-end gap-2 border-t p-4">
              {sheet.status === "BEFORE" && (
                <Button disabled={busy} onClick={() => void changeStatus("DONE")}>
                  면접 완료
                </Button>
              )}
              {sheet.status === "DONE" && (
                <>
                  <Button variant="outline" disabled={busy} onClick={() => void changeStatus("FAILED")}>
                    불합격
                  </Button>
                  <Button disabled={busy} onClick={() => void changeStatus("PASSED")}>
                    합격
                  </Button>
                </>
              )}
              {(sheet.status === "PASSED" || sheet.status === "FAILED") && (
                <Button variant="outline" disabled={busy} onClick={() => void changeStatus("DONE")}>
                  면접 완료로 되돌리기
                </Button>
              )}
            </SheetFooter>
          </>
        ) : (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>면접 기록지</SheetTitle>
              <SheetDescription>기록지를 불러오는 중입니다.</SheetDescription>
            </SheetHeader>
            <p className="text-muted-foreground p-6 text-sm">기록지를 불러오는 중입니다.</p>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function QuestionAnswerSection({
  id,
  title,
  questions,
  onSave,
}: {
  id: string;
  title: string;
  questions: StaffInterviewQuestionAnswer[];
  onSave: (questionId: number, answer: string) => Promise<boolean>;
}) {
  return (
    <section className="space-y-4" aria-labelledby={`${id}-heading`}>
      <h3 id={`${id}-heading`} className="text-lg font-semibold">
        {title}
      </h3>
      {questions.length === 0 ? (
        <p className="text-muted-foreground text-sm">등록된 질문이 없습니다. 위의 면접 질문에서 추가할 수 있습니다.</p>
      ) : (
        <ol className="space-y-5">
          {questions.map((question, index) => (
            <li key={question.question_id} className="space-y-2">
              <h4 className="font-semibold">
                {index + 1}. {question.content}
              </h4>
              <AnswerBox
                label={`${title} ${index + 1}번 답변`}
                saved={question.answer}
                onSave={(answer) => onSave(question.question_id, answer)}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function ExtraQuestionSection({
  sheet,
  onAdd,
  onSaveAnswer,
  onDelete,
}: {
  sheet: StaffInterviewSheet;
  onAdd: (content: string) => Promise<boolean>;
  onSaveAnswer: (extraQuestionId: number, answer: string) => Promise<boolean>;
  onDelete: (extraQuestionId: number) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState("");

  const add = async () => {
    if (!draft.trim()) return;
    if (await onAdd(draft.trim())) setDraft("");
  };

  return (
    <section className="space-y-4" aria-labelledby="sheet-extra-heading">
      <div>
        <h3 id="sheet-extra-heading" className="text-lg font-semibold">
          기타 질문
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">이 면접자에게만 따로 물어본 질문을 적어 둡니다.</p>
      </div>
      {sheet.extra_questions.length > 0 && (
        <ol className="space-y-5">
          {sheet.extra_questions.map((extra, index) => (
            <li key={extra.extra_question_id} className="space-y-2">
              <div className="flex items-start gap-2">
                <h4 className="flex-1 pt-2 font-semibold">
                  {index + 1}. {extra.content}
                </h4>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`기타 질문 ${index + 1}번 지우기`}
                  onClick={() => void onDelete(extra.extra_question_id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <AnswerBox
                label={`기타 질문 ${index + 1}번 답변`}
                saved={extra.answer}
                onSave={(answer) => onSaveAnswer(extra.extra_question_id, answer)}
              />
            </li>
          ))}
        </ol>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          maxLength={500}
          placeholder="물어본 질문을 입력하고 추가를 누르세요"
          aria-label="기타 질문 추가"
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
    </section>
  );
}

/** 답변 칸. 내용이 바뀐 채로 칸을 벗어나면 저장하고, 비우면 적어 둔 답변을 지운다. */
function AnswerBox({
  label,
  saved,
  onSave,
}: {
  label: string;
  saved: string | null;
  onSave: (answer: string) => Promise<boolean>;
}) {
  const [value, setValue] = useState(saved ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    setValue(saved ?? "");
  }, [saved]);

  const commit = async () => {
    if (value.trim() === (saved ?? "").trim()) return;
    setState("saving");
    const ok = await onSave(value);
    setState(ok ? "saved" : "idle");
  };

  return (
    <div className="space-y-1">
      <Textarea
        value={value}
        rows={3}
        maxLength={10000}
        aria-label={label}
        placeholder="면접자의 답변을 적어 주세요"
        onChange={(event) => {
          setValue(event.target.value);
          setState("idle");
        }}
        onBlur={() => void commit()}
      />
      <p className="text-muted-foreground h-4 text-right text-xs" aria-live="polite">
        {state === "saving" ? "저장 중…" : state === "saved" ? "저장됨" : ""}
      </p>
    </div>
  );
}
