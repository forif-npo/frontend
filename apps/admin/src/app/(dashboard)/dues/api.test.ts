import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import { fetchDues, updateDues, withdrawRegistrations } from "./api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

type PostMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;
const mockedPost = apiClient.post as unknown as PostMock;

function response(data: unknown) {
  return { json: <T>() => Promise.resolve({ data } as T) };
}

describe("dues api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
  });

  it("sends existing filters and sorting, then maps snake_case data for the view", async () => {
    mockedGet.mockReturnValue(
      response({
        semester: { act_year: 2026, act_semester: 2, label: "2026-2학기" },
        summary: {
          total_count: 10,
          dues_paid_count: 7,
          google_form_submitted_count: 8,
          completed_count: 6,
        },
        content: [
          {
            user_id: 20260001,
            user_name: "홍길동",
            department: "컴퓨터소프트웨어학부",
            dues_paid: true,
            google_form_submitted: false,
          },
        ],
        total_elements: 10,
        current_page: 1,
        total_pages: 2,
        page_size: 5,
      }),
    );

    const result = await fetchDues({
      page: 1,
      size: 5,
      search: "홍길동",
      duesPaid: false,
      googleFormSubmitted: false,
      sorting: [{ id: "userName", desc: false }],
      accessToken: "access-token",
    });

    const [, options] = (
      apiClient.get as unknown as {
        mock: {
          calls: Array<
            [
              string,
              {
                searchParams: URLSearchParams;
                headers: Record<string, string>;
              },
            ]
          >;
        };
      }
    ).mock.calls[0];
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/dues",
      expect.objectContaining({
        headers: { Authorization: "Bearer access-token" },
      }),
    );
    expect(options.searchParams.toString()).toBe(
      "page=1&size=5&search=%ED%99%8D%EA%B8%B8%EB%8F%99&dues_paid=false&google_form_submitted=false&sort=userName%3Aasc",
    );
    expect(result).toEqual({
      semester: { actYear: 2026, actSemester: 2, label: "2026-2학기" },
      summary: {
        totalCount: 10,
        duesPaidCount: 7,
        googleFormSubmittedCount: 8,
        completedCount: 6,
      },
      content: [
        {
          userId: 20260001,
          userName: "홍길동",
          department: "컴퓨터소프트웨어학부",
          duesPaid: true,
          googleFormSubmitted: false,
        },
      ],
      totalElements: 10,
      currentPage: 1,
      totalPages: 2,
      pageSize: 5,
    });
  });

  it("preserves batch status updates and registration-withdrawal payloads", async () => {
    mockedPost.mockReturnValue(response(null));
    const updates = [
      { userId: 20260001, duesPaid: true },
      { userId: 20260002, googleFormSubmitted: true },
    ];

    await updateDues(updates);
    await withdrawRegistrations([20260001, 20260002]);

    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "api/v1/admin/dues/batch",
      { json: { updates } },
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "api/v1/admin/dues/registration-withdrawals",
      { json: { user_ids: [20260001, 20260002] } },
    );
  });
});
