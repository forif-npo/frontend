"use client";
import type { StaffApplicationDetail } from "@core/types/staff-recruitment";
import { handleApiError } from "@core/utils/api-client";
import { downloadPrivateFile } from "@core/utils/private-file-download";
import { toast } from "@/components/ui/Toast";

/**
 * 지원서 문항별 답변 목록. 지원서 보기와 면접 기록지가 같은 모양으로 보여 준다.
 * 파일 문항은 내려받기 버튼, 링크 문항은 새 창 링크로 나온다.
 */
export function StaffApplicationAnswerList({
  detail,
  requiredQuestionIds,
}: {
  detail: Pick<StaffApplicationDetail, "recruitment_id" | "application_id" | "answers">;
  requiredQuestionIds?: ReadonlySet<number>;
}) {
  return (
    <ol className="space-y-6">
      {detail.answers.map((answer, index) => (
        <li key={answer.question_id} className="space-y-3">
          <h4 className="font-semibold">
            {index + 1}. {answer.question_label}
            {requiredQuestionIds?.has(answer.question_id) && (
              <>
                <span className="text-destructive ml-0.5" aria-hidden="true">*</span>
                <span className="sr-only">(필수 문항)</span>
              </>
            )}
          </h4>
          <div className="bg-surface-gray-subtler rounded-lg p-4 text-sm leading-6">
            {answer.question_type === "FILE" && answer.answer ? (
              <button
                type="button"
                className="text-primary break-all text-left underline underline-offset-2"
                onClick={() =>
                  void downloadPrivateFile(
                    `api/v1/admin/staff-recruitments/${detail.recruitment_id}/applications/${detail.application_id}/files/${answer.question_id}`,
                    answer.answer,
                  ).catch(async (error) => toast.error(await handleApiError(error)))
                }
              >
                {answer.answer} 다운로드
              </button>
            ) : answer.question_type === "LINK" && answer.answer ? (
              <a
                className="text-primary break-all underline underline-offset-2"
                href={answer.answer}
                target="_blank"
                rel="noopener noreferrer"
              >
                {answer.answer}
              </a>
            ) : (
              <p className="whitespace-pre-wrap break-words">{answer.answer || "답변 없음"}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
