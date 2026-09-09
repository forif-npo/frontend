import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), delete: jest.fn(), patch: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import {
  deleteCurrentSemesterMember,
  fetchMemberHistory,
  fetchMembers,
  updateMemberInfo,
} from "./api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => GetMock;
};

type MutationMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;
const mockedDelete = apiClient.delete as unknown as MutationMock;
const mockedPatch = apiClient.patch as unknown as MutationMock;

describe("members api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedDelete.mockReset();
    mockedPatch.mockReset();
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
          departmentId: null,
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

  it("deletes exactly the selected current-semester member", async () => {
    mockedDelete.mockReturnValue({
      json: <T>() => Promise.resolve({ data: null } as T),
    });

    await deleteCurrentSemesterMember(20260001);

    expect(apiClient.delete).toHaveBeenCalledWith(
      "api/v1/admin/users/20260001",
    );
  });

  it("updates only the editable member fields with snake_case wire fields", async () => {
    mockedPatch.mockReturnValue({
      json: <T>() => Promise.resolve({ data: null } as T),
    });

    await updateMemberInfo(20260001, {
      departmentId: 2,
      phoneNum: "010-3333-4444",
    });

    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/admin/users/20260001",
      {
        json: {
          department_id: 2,
          phone_num: "010-3333-4444",
        },
      },
    );
  });

  it("filters and orders a member's mentor and operator histories", async () => {
    mockedGet
      .mockReturnValueOnce({
        json: <T>() =>
          Promise.resolve({
            data: {
              content: [
                {
                  user_id: 20260001,
                  act_year: 2025,
                  act_semester: 2,
                  study_name: "React 기초",
                },
                {
                  user_id: 20260001,
                  act_year: 2026,
                  act_semester: 1,
                  study_name: "React 심화",
                },
                {
                  user_id: 20260002,
                  act_year: 2026,
                  act_semester: 1,
                  study_name: "다른 부원 스터디",
                },
              ],
            },
          } as T),
      })
      .mockReturnValueOnce({
        json: <T>() =>
          Promise.resolve({
            data: [
              {
                student_id: 20260001,
                year: 2025,
                semester: 1,
                club_department: "개발부",
                user_title: "부원",
              },
              {
                student_id: 20260001,
                year: 2026,
                semester: 2,
                club_department: "운영부",
                user_title: "팀장",
              },
              {
                student_id: 20260002,
                year: 2026,
                semester: 2,
                club_department: "운영부",
                user_title: "팀장",
              },
            ],
          } as T),
      });

    const result = await fetchMemberHistory(20260001);

    expect(apiClient.get).toHaveBeenNthCalledWith(1, "api/v1/admin/mentors", {
      searchParams: { page: "0", size: "10000" },
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "api/v1/forif-team");
    expect(result).toEqual({
      mentors: [
        { actYear: 2026, actSemester: 1, studyName: "React 심화" },
        { actYear: 2025, actSemester: 2, studyName: "React 기초" },
      ],
      operators: [
        { actYear: 2026, actSemester: 2, team: "운영부", title: "팀장" },
        { actYear: 2025, actSemester: 1, team: "개발부", title: "부원" },
      ],
    });
  });
});
