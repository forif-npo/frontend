import { describe, expect, it, jest } from "@jest/globals";
import { HTTPError } from "ky";
import { getStaffRecruitmentSaveError } from "./save-error";

jest.mock("ky", () => ({ HTTPError: class HTTPError extends Error {} }));
jest.mock("@core/utils/api-client", () => ({
  handleApiError: async (error: { response: { clone: () => { json: () => Promise<{ message: string }> } } }) =>
    (await error.response.clone().json()).message,
}));

function apiError(body: unknown): HTTPError {
  return Object.assign(Object.create(HTTPError.prototype), {
    response: { clone: () => ({ json: async () => body }) },
  }) as HTTPError;
}

describe("getStaffRecruitmentSaveError", () => {
  it("shows the rejected recruitment fields without exposing their values", async () => {
    const error = apiError({
      error_code: "FOR003-400",
      message: "입력값 검증에 실패했습니다.",
      data: [
        { field: "questions[2].label", message: "100자 이하여야 합니다.", rejected_value: "비공개 답변" },
        { field: "departments[0].name", message: "50자 이하여야 합니다." },
      ],
    });

    expect(await getStaffRecruitmentSaveError(error)).toBe(
      "3번째 문항 제목: 100자 이하여야 합니다.\n1번째 부서명: 50자 이하여야 합니다.",
    );
  });

  it("keeps the usual API message for unrelated errors", async () => {
    expect(await getStaffRecruitmentSaveError(apiError({ message: "잘못된 요청입니다." })))
      .toBe("잘못된 요청입니다.");
  });
});
