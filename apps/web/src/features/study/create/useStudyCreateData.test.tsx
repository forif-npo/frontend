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
import { useStudyCreateData } from "./useStudyCreateData";

type ScheduleMock = {
  mockReset: () => void;
  mockResolvedValue: (value: SemesterScheduleItem[]) => void;
  mockRejectedValue: (value: unknown) => void;
};

type ApiGetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGetSchedules =
  getCurrentSemesterSchedules as unknown as ScheduleMock;
const mockedGetCurrentUser = apiClient.get as unknown as ApiGetMock;

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

function currentUserResponse() {
  return {
    json: <T,>() =>
      Promise.resolve({
        data: {
          user_id: 20260001,
          user_name: "홍길동",
          email: "user@forif.org",
          phone_num: "010-1234-5678",
          department: "컴퓨터소프트웨어학부",
          img_url: null,
        },
      } as T),
  };
}

describe("useStudyCreateData", () => {
  beforeEach(() => {
    mockedGetSchedules.mockReset();
    mockedGetCurrentUser.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("blocks the page without requesting user data when mentor recruitment is closed", async () => {
    mockedGetSchedules.mockResolvedValue([schedule("MENTOR_RECRUIT", false)]);
    const { result } = renderHook(() => useStudyCreateData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isMentorRecruitmentClosed).toBe(true);
    expect(result.current.userInfo).toBeNull();
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("loads and maps the current user only while mentor recruitment is open", async () => {
    mockedGetSchedules.mockResolvedValue([
      schedule("MENTOR_REVIEW", true),
      schedule("MENTOR_RECRUIT", true),
    ]);
    mockedGetCurrentUser.mockReturnValue(currentUserResponse());
    const { result } = renderHook(() => useStudyCreateData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/users/me");
    expect(result.current.isMentorRecruitmentClosed).toBe(false);
    expect(result.current.userInfo).toEqual({
      studentId: "20260001",
      name: "홍길동",
      department: "컴퓨터소프트웨어학부",
      phone: "010-1234-5678",
    });
  });

  it("ends loading and exposes an error when schedule lookup fails", async () => {
    const error = new Error("schedule lookup failed");
    mockedGetSchedules.mockRejectedValue(error);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const { result } = renderHook(() => useStudyCreateData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.userInfo).toBeNull();
    expect(result.current.isMentorRecruitmentClosed).toBe(false);
  });
});
