import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import { fetchMembers } from "./api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;

describe("members api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("maps the current-study field from the backend member list", async () => {
    mockedGet.mockReturnValue({
      json: <T>() =>
        Promise.resolve({
          data: {
            content: [
              {
                user_id: 20260001,
                user_name: "홍길동",
                current_study_name: "React 심화",
                department: "컴퓨터소프트웨어학부",
                phone_num: "01012345678",
                is_mentor: true,
                is_admin: false,
              },
            ],
            total_elements: 1,
            current_page: 0,
            total_pages: 1,
          },
        } as T),
    });

    const result = await fetchMembers({
      size: 20,
      search: "홍길동",
      accessToken: "access-token",
    });

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/admin/users", {
      searchParams: expect.any(URLSearchParams),
      headers: { Authorization: "Bearer access-token" },
    });
    expect(result).toEqual({
      content: [
        {
          userId: 20260001,
          userName: "홍길동",
          currentStudyName: "React 심화",
          department: "컴퓨터소프트웨어학부",
          phoneNum: "01012345678",
          isMentor: true,
          isAdmin: false,
        },
      ],
      totalElements: 1,
      currentPage: 0,
      totalPages: 1,
      pageSize: 20,
    });
  });
});
