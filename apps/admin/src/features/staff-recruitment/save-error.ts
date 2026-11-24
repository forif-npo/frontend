import { HTTPError } from "ky";
import { handleApiError } from "@core/utils/api-client";

function fieldLabel(field: string): string {
  const indexed = /^(departments|questions)\[(\d+)\]\.(\w+)$/.exec(field);
  if (indexed) {
    const number = Number(indexed[2]) + 1;
    const label = indexed[1] === "departments"
      ? { name: "부서명", description: "부서 설명" }[indexed[3] as "name" | "description"]
      : { label: "문항 제목", description: "문항 설명", maxLength: "최대 글자 수" }[indexed[3] as "label" | "description" | "maxLength"];
    if (label) return `${number}번째 ${label}`;
  }
  return { summary: "한 줄 소개", title: "활동 학기" }[field as "summary" | "title"] ?? field;
}

export async function getStaffRecruitmentSaveError(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body = await error.response.clone().json() as {
        error_code?: string;
        errorCode?: string;
        data?: unknown;
      };
      if ((body.error_code ?? body.errorCode) === "FOR003-400" && Array.isArray(body.data)) {
        const details = body.data
          .filter((item): item is { field: string; message: string } =>
            item !== null && typeof item === "object" &&
            typeof item.field === "string" && typeof item.message === "string")
          .map((item) => `${fieldLabel(item.field)}: ${item.message}`);
        if (details.length > 0) return details.join("\n");
      }
    } catch {
      // 상세 정보가 없으면 공통 API 오류 메시지를 사용한다.
    }
  }
  return handleApiError(error);
}
