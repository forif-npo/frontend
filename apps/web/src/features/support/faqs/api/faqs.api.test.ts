import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import { getFaqs } from "./faqs.api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
  mockImplementation: (implementation: () => never) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;

function response(
  data: unknown,
  errorCode: string | null = null,
  message = "",
) {
  return {
    json: <T>() =>
      Promise.resolve({ data, error_code: errorCode, message } as T),
  };
}

describe("faqs api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("uses the uncached FAQ list request and maps its snake_case fields", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            post_id: 1,
            author_id: 2,
            author_name: "운영진",
            type: "FAQ",
            title: "자주 묻는 질문",
            content: "답변",
            tag: "가입",
            created_at: "2026-09-07T00:00:00Z",
          },
        ],
      }),
    );

    await expect(getFaqs()).resolves.toEqual([
      {
        postId: 1,
        authorId: 2,
        authorName: "운영진",
        type: "FAQ",
        title: "자주 묻는 질문",
        content: "답변",
        tag: "가입",
        createdAt: "2026-09-07T00:00:00Z",
      },
    ]);

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/posts/faqs", {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      searchParams: { page: 0, size: 100, search: "" },
    });
  });

  it("wraps backend errors with the FAQ context", async () => {
    mockedGet.mockReturnValue(
      response(null, "FAILED", "조회 권한이 없습니다."),
    );

    await expect(getFaqs()).rejects.toThrow(
      "Failed to fetch faqs: 조회 권한이 없습니다.",
    );
  });
});
