import { HTTPError } from "ky";

const APPLICATION_ERROR_MESSAGES: Record<string, string> = {
  "FOR017-401": "로그인이 만료되었습니다. 다시 로그인해주세요.",
  "FOR148-404": "공개된 모집 회차를 찾을 수 없습니다.",
  "FOR152-400": "접수가 마감되었거나 현재 지원할 수 없는 모집입니다.",
  "FOR153-403": "이번 학기 활동 정회원만 지원할 수 있습니다.",
  "FOR154-409": "이미 이 회차에 지원서를 제출했습니다.",
  "FOR155-404": "제출한 지원서를 찾을 수 없습니다.",
  "FOR156-400": "지원 부서를 다시 확인해주세요.",
  "FOR157-400": "필수 문항과 글자 수를 다시 확인해주세요.",
};

export interface StaffApplicationErrorInfo {
  code: string | null;
  message: string;
}

export async function getStaffApplicationErrorInfo(
  error: unknown,
): Promise<StaffApplicationErrorInfo> {
  if (error instanceof HTTPError) {
    try {
      const body = await error.response.json<{
        error_code?: string | null;
        message?: string;
      }>();
      const code = body.error_code ?? null;
      return {
        code,
        message:
          (code && APPLICATION_ERROR_MESSAGES[code]) ||
          body.message ||
          "요청을 처리하지 못했습니다.",
      };
    } catch {
      return {
        code: null,
        message: `요청을 처리하지 못했습니다. (${error.response.status})`,
      };
    }
  }

  return {
    code: null,
    message:
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.",
  };
}
