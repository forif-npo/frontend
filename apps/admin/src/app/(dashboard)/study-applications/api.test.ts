import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import {
  decideAutonomousStudyApplication,
  fetchStudyApplications,
} from "./api";

type RequestMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as RequestMock;
const mockedPost = apiClient.post as unknown as RequestMock;

function response(data: unknown, message?: string) {
  return { json: <T>() => Promise.resolve({ data, message } as T) };
}

describe("study applications api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
  });

  it("sends filters and maps the snake_case page response for the list view", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            application_id: 21,
            user_id: 7,
            user_name: "홍길동",
            department: "컴퓨터소프트웨어학부",
            study_id: 3,
            study_name: "React",
            priority: 2,
            status: "ACCEPT",
            autonomous_study: true,
            applied_at: "2026-09-07T09:00:00Z",
          },
        ],
        total_elements: 12,
        current_page: 1,
        total_pages: 3,
      }),
    );

    const result = await fetchStudyApplications({
      accessToken: "access-token",
      page: 1,
      size: 5,
      search: "홍길동",
      sorting: [{ id: "appliedAt", desc: true }],
    });

    const [, options] = (
      apiClient.get as unknown as {
        mock: {
          calls: Array<
            [
              string,
              {
                headers: Record<string, string>;
                searchParams: URLSearchParams;
              },
            ]
          >;
        };
      }
    ).mock.calls[0];
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/study-applications",
      expect.objectContaining({
        headers: { Authorization: "Bearer access-token" },
      }),
    );
    expect(options.searchParams.toString()).toBe(
      "page=1&size=5&search=%ED%99%8D%EA%B8%B8%EB%8F%99&sort=appliedAt%3Adesc",
    );
    expect(result).toEqual({
      content: [
        {
          applicationId: 21,
          userId: 7,
          userName: "홍길동",
          department: "컴퓨터소프트웨어학부",
          studyId: 3,
          studyName: "React",
          priority: 2,
          status: "ACCEPT",
          autonomousStudy: true,
          appliedAt: "2026-09-07T09:00:00Z",
        },
      ],
      totalElements: 12,
      currentPage: 1,
      totalPages: 3,
      pageSize: 5,
    });
  });

  it("preserves the backend error message and autonomous-study decision payload", async () => {
    mockedGet.mockReturnValue(response(null, "권한이 없습니다."));
    mockedPost.mockReturnValue(response(null));

    await expect(fetchStudyApplications({ size: 20 })).rejects.toThrow(
      "권한이 없습니다.",
    );
    await decideAutonomousStudyApplication(
      { applicationId: 21, studyId: 3 },
      "reject",
    );

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/study-applications/3/reject",
      { json: { apply_ids: [21] } },
    );
  });
});
