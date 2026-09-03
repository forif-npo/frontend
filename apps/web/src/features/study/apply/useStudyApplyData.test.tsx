/** @jest-environment jsdom */

import { renderHook, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRouter = { push: mockPush, replace: mockReplace };

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("ky", () => ({
  HTTPError: class HTTPError extends Error {},
}));

jest.mock("@/features/semester/schedule-api", () => ({
  getCurrentSemesterSchedules: jest.fn(),
}));

jest.mock("@core/utils/api-client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import type { SemesterScheduleItem } from "@/features/semester/schedule-api";
import { getCurrentSemesterSchedules } from "@/features/semester/schedule-api";
import { apiClient } from "@core/utils/api-client";
import { useStudyApplyData } from "./useStudyApplyData";

type ScheduleMock = {
  mockReset: () => void;
  mockResolvedValue: (value: SemesterScheduleItem[]) => void;
};

type ApiGetMock = {
  mockReset: () => void;
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGetSchedules =
  getCurrentSemesterSchedules as unknown as ScheduleMock;
const mockedGet = apiClient.get as unknown as ApiGetMock;

function schedule(
  phase: SemesterScheduleItem["phase"],
  open: boolean,
): SemesterScheduleItem {
  return {
    id: 1,
    act_year: 2026,
    act_semester: 2,
    phase,
    phase_label: phase,
    starts_at: "2026-09-01T00:00:00",
    ends_at: "2026-10-01T00:00:00",
    open,
  };
}

function response(data: unknown) {
  return {
    json: <T,>() => Promise.resolve({ data } as T),
  };
}

describe("useStudyApplyData", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockReplace.mockReset();
    mockedGetSchedules.mockReset();
    mockedGet.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("blocks the page without loading studies when mentee recruitment is closed", async () => {
    mockedGetSchedules.mockResolvedValue([schedule("MENTEE_RECRUIT", false)]);
    const { result } = renderHook(() => useStudyApplyData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isMenteeRecruitmentClosed).toBe(true);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("loads the current user and applicable study options while recruitment is open", async () => {
    mockedGetSchedules.mockResolvedValue([schedule("MENTEE_RECRUIT", true)]);
    mockedGet.mockReturnValueOnce(
      response({
        user_id: 20260001,
        user_name: "홍길동",
        email: "user@forif.org",
        phone_num: "010-1234-5678",
        department: "컴퓨터소프트웨어학부",
        img_url: null,
      }),
    );
    mockedGet.mockReturnValueOnce(
      response({
        content: [
          { id: 10, study_name: "React", autonomous_study: false },
          { id: 20, study_name: "자율 스터디", autonomous_study: true },
        ],
      }),
    );
    const { result } = renderHook(() => useStudyApplyData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenNthCalledWith(1, "api/v1/users/me");
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "api/v1/studies", {
      searchParams: {
        page: "0",
        size: "100",
        recruit_status: "APPLICABLE",
      },
    });
    expect(result.current.userInfo).toEqual({
      studentId: "20260001",
      name: "홍길동",
      department: "컴퓨터소프트웨어학부",
      phone: "010-1234-5678",
    });
    expect(result.current.studyOptions).toEqual([
      { value: "10", label: "React", isAutonomousStudy: false },
      { value: "20", label: "자율 스터디", isAutonomousStudy: true },
    ]);
  });

  it("redirects an unauthenticated direct entry to its sign-in callback URL", async () => {
    mockedGetSchedules.mockResolvedValue([schedule("MENTEE_RECRUIT", true)]);
    const { HTTPError } = await import("ky");
    const unauthorizedError = Object.create(HTTPError.prototype) as Error & {
      response: { status: number };
    };
    unauthorizedError.response = { status: 401 };
    mockedGet.mockReturnValueOnce({
      json: <T,>() => Promise.reject(unauthorizedError) as Promise<T>,
    });
    mockedGet.mockReturnValueOnce(response({ content: [] }));
    const { result } = renderHook(() => useStudyApplyData("42"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      "/signin?callbackUrl=/studies/detail/42/apply",
    );
    expect(result.current.error).toBeNull();
  });
});
