import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));
import { apiClient } from "@core/utils/api-client";
import {
  acceptApplications,
  getApplicants,
  getAttendance,
  rejectApplications,
  updateAttendance,
} from "./api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

type RequestMock = {
  mockReset: () => void;
};

const mockedGet = apiClient.get as unknown as GetMock;
const mockedPost = apiClient.post as unknown as RequestMock;
const mockedPut = apiClient.put as unknown as RequestMock;

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("study management api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedPut.mockReset();
  });

  it("keeps applicant pagination, filter, and sort requests explicit", async () => {
    const page = {
      total_pages: 1,
      total_elements: 1,
      content: [
        {
          apply_id: 3,
          applier_name: "홍길동",
          department: "컴퓨터소프트웨어학부",
          study_name: "React 심화",
          study_comment: "지원 사유",
          apply_date: "2026-09-07T00:00:00Z",
          study_status: "대기중",
          priority: 1,
        },
      ],
    };
    mockedGet.mockReturnValue(response(page));

    await expect(
      getApplicants(10, {
        page: 2,
        pageSize: 50,
        statusFilter: "PENDING",
        applyDateDirection: "ASC",
      }),
    ).resolves.toEqual(page);

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/users/apply/10", {
      searchParams: {
        page: 2,
        pageSize: 50,
        statusFilter: "PENDING",
        applyDateDirection: "ASC",
      },
    });
  });

  it("preserves the empty attendance fallback when the server omits data", async () => {
    mockedGet.mockReturnValue(response(null));

    await expect(getAttendance(10)).resolves.toEqual({
      study_id: 10,
      study_name: "",
      mentees: [],
    });

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/studies/10/attendances");
  });

  it("sends batch applicant decisions and attendance updates to their existing endpoints", async () => {
    const attendances = [
      {
        user_id: 20260001,
        week_num: 2,
        status: "present" as const,
        study_date: "2026-09-07",
      },
    ];

    await acceptApplications(10, [3, 4]);
    await rejectApplications(10, [5]);
    await updateAttendance(10, attendances);

    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "api/v1/users/apply/10/accept",
      { json: { apply_ids: [3, 4] } },
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "api/v1/users/apply/10/reject",
      { json: { apply_ids: [5] } },
    );
    expect(apiClient.put).toHaveBeenCalledWith(
      "api/v1/studies/10/attendances",
      {
        json: { attendances },
      },
    );
  });
});
