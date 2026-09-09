import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));
jest.mock("@/lib/semester", () => ({
  loadSemesterOptions: jest.fn(),
}));
import { apiClient } from "@core/utils/api-client";
import { loadSemesterOptions } from "@/lib/semester";
import { fetchMentors } from "./api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;
const mockedLoadSemesterOptions = loadSemesterOptions as jest.MockedFunction<
  typeof loadSemesterOptions
>;

function response(data: unknown) {
  return { json: <T>() => Promise.resolve({ data } as T) };
}

describe("mentors api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedLoadSemesterOptions.mockReset();
  });

  it("uses the selected semester endpoint and normalizes snake_case mentors", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            user_id: 9,
            user_name: "김멘토",
            department: "컴퓨터소프트웨어학부",
            phone_num: "010-1234-5678",
            study_name: "Next.js",
          },
        ],
        total_elements: 8,
        current_page: 1,
        total_pages: 2,
      }),
    );

    const result = await fetchMentors({
      size: 5,
      page: 1,
      search: "김멘토",
      semester: "26-1",
      accessToken: "access-token",
      sorting: [{ id: "name", desc: false }],
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
      "api/v1/admin/mentors/2026/1",
      expect.objectContaining({
        headers: { Authorization: "Bearer access-token" },
      }),
    );
    expect(options.searchParams.toString()).toBe(
      "page=1&size=5&search=%EA%B9%80%EB%A9%98%ED%86%A0&sort=name%3Aasc",
    );
    expect(result).toEqual({
      content: [
        {
          userId: 9,
          name: "김멘토",
          department: "컴퓨터소프트웨어학부",
          phoneNum: "010-1234-5678",
          studyName: "Next.js",
        },
      ],
      totalElements: 8,
      currentPage: 1,
      totalPages: 2,
      pageSize: 5,
    });
  });

  it("rejects malformed list responses before rendering partial data", async () => {
    mockedGet.mockReturnValue(response({ content: null }));

    await expect(fetchMentors({ size: 20 })).rejects.toThrow(
      "Invalid API response structure",
    );
  });

  it("loads all records, excludes main semesters, and pages other semesters locally", async () => {
    mockedLoadSemesterOptions.mockResolvedValue({
      current: { act_year: 2026, act_semester: 1, label: "26-1" },
      recentLabels: ["26-1"],
    });
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            user_id: 1,
            user_name: "정규 멘토",
            act_year: 2026,
            act_semester: 1,
          },
          {
            user_id: 2,
            user_name: "이전 멘토",
            act_year: 2025,
            act_semester: 2,
          },
        ],
      }),
    );

    await expect(fetchMentors({ size: 1, semester: "그 외" })).resolves.toEqual(
      {
        content: [
          {
            userId: 2,
            name: "이전 멘토",
            department: "",
            phoneNum: "",
            studyName: "",
          },
        ],
        totalElements: 1,
        currentPage: 0,
        totalPages: 1,
        pageSize: 1,
      },
    );
    const [, options] = (
      apiClient.get as unknown as {
        mock: { calls: Array<[string, { searchParams: URLSearchParams }]> };
      }
    ).mock.calls[0];
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/mentors",
      expect.any(Object),
    );
    expect(options.searchParams.toString()).toBe("page=0&size=10000");
  });
});
