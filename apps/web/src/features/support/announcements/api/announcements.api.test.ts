import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import { getAnnouncementById, getAnnouncements } from "./announcements.api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
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

describe("announcements api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("requests and maps the announcement list with an empty image fallback", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            post_id: 1,
            author_id: 2,
            author_name: "운영진",
            type: "NOTICE",
            title: "공지",
            content: "내용",
            tag: "일반",
            created_at: "2026-09-07T00:00:00Z",
          },
        ],
      }),
    );

    await expect(getAnnouncements()).resolves.toEqual([
      {
        postId: 1,
        authorId: 2,
        authorName: "운영진",
        type: "NOTICE",
        title: "공지",
        content: "내용",
        tag: "일반",
        createdAt: "2026-09-07T00:00:00Z",
        imageUrls: [],
      },
    ]);

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/posts/announcements", {
      searchParams: { page: 0, size: 100, search: "" },
    });
  });

  it("returns null for an absent detail and preserves backend error messages", async () => {
    mockedGet.mockReturnValue(response(null));

    await expect(getAnnouncementById(1)).resolves.toBeNull();

    mockedGet.mockReturnValue(
      response(null, "NOT_FOUND", "공지사항이 없습니다."),
    );
    await expect(getAnnouncementById(2)).rejects.toThrow(
      "공지사항이 없습니다.",
    );
  });
});
