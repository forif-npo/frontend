/** @jest-environment jsdom */

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPush = jest.fn();
const mockRouter = { push: mockPush };

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("./useStudyApplyData", () => ({
  useStudyApplyData: jest.fn(),
}));

jest.mock("./api", () => ({
  getStudyApplicationStatus: jest.fn(),
}));

jest.mock("./utils", () => ({
  getStudyBadgeTags: jest.fn(() => []),
}));

jest.mock("@core/utils/api-client", () => ({
  apiClient: { post: jest.fn() },
  handleApiError: jest.fn(),
}));

import { apiClient } from "@core/utils/api-client";
import { getStudyApplicationStatus } from "./api";
import type { StudyApplicationStatusResponse } from "./api";
import { useStudyApplyData } from "./useStudyApplyData";
import { useStudyApplyPage } from "./useStudyApplyPage";

const currentStudy = {
  id: 42,
  study_name: "React 심화",
  autonomous_study: false,
};

const availableStatus = {
  can_apply_primary: true,
  can_apply_secondary: true,
  can_apply_autonomous_study: true,
  has_autonomous_study_application: false,
  primary_study: null,
  secondary_study: null,
};

type StatusMock = {
  mockReset: () => void;
  mockResolvedValue: (value: StudyApplicationStatusResponse) => void;
};

type PostMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: () => Promise<unknown> }) => void;
};

const mockedUseStudyApplyData = useStudyApplyData as unknown as {
  mockReturnValue: (value: {
    currentStudy: {
      id: number;
      study_name: string;
      autonomous_study: boolean;
    } | null;
    userInfo: null;
    studyOptions: [];
    isLoading: boolean;
    error: null;
    isMenteeRecruitmentClosed: boolean;
  }) => void;
};
const mockedGetStatus = getStudyApplicationStatus as unknown as StatusMock;
const mockedPost = apiClient.post as unknown as PostMock;

function mockAvailableData(study = currentStudy) {
  mockedUseStudyApplyData.mockReturnValue({
    currentStudy: study,
    userInfo: null,
    studyOptions: [],
    isLoading: false,
    error: null,
    isMenteeRecruitmentClosed: false,
  });
}

describe("useStudyApplyPage", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockedGetStatus.mockReset();
    mockedPost.mockReset();
    mockAvailableData();
  });

  it("does not advance or submit when the current study is blocked", async () => {
    mockedGetStatus.mockResolvedValue({
      ...availableStatus,
      primary_study: { id: currentStudy.id },
    });
    const { result } = renderHook(() => useStudyApplyPage("42", true));

    await waitFor(() => {
      expect(result.current.applicationAvailability).toBe("blocked");
    });

    act(() => result.current.goToNext());

    expect(result.current.step).toBe(1);
    expect(result.current.applicationAlert).toContain("이미 1순위");
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("submits a valid regular-study application with the existing snake_case payload", async () => {
    mockedGetStatus.mockResolvedValue({
      ...availableStatus,
      can_apply_secondary: false,
    });
    mockedPost.mockReturnValue({ json: () => Promise.resolve({}) });
    const { result } = renderHook(() => useStudyApplyPage("42", true));

    await waitFor(() => {
      expect(result.current.applicationAvailability).toBe("available");
    });

    const formData = new FormData();
    const reason = "지원 사유입니다. ".repeat(10);
    formData.set("primaryStudyApplyReason", reason);
    formData.set("priority", "1");
    let response:
      | Awaited<ReturnType<typeof result.current.handleSubmit>>
      | undefined;
    await act(async () => {
      response = await result.current.handleSubmit(
        { errors: {}, values: { primaryStudyId: 0, isAutonomousStudy: false } },
        formData,
      );
    });

    expect(apiClient.post).toHaveBeenCalledWith("api/v1/users/apply", {
      json: {
        study_id: 42,
        apply_reason: reason,
        priority: 1,
      },
    });
    expect(response).toEqual({
      values: {
        primaryStudyId: 42,
        isAutonomousStudy: false,
        priority: 1,
        primaryStudyApplyReason: reason,
      },
      errors: {},
    });
    expect(result.current.step).toBe(3);
    expect(result.current.submittedIntro).toBe(reason);
    expect(result.current.submittedPriority).toBe(1);
  });

  it("submits an autonomous-study application without a reason or priority", async () => {
    mockAvailableData({ ...currentStudy, autonomous_study: true });
    mockedGetStatus.mockResolvedValue(availableStatus);
    mockedPost.mockReturnValue({ json: () => Promise.resolve({}) });
    const { result } = renderHook(() => useStudyApplyPage("42", true));

    await waitFor(() => {
      expect(result.current.applicationAvailability).toBe("available");
    });

    let response:
      | Awaited<ReturnType<typeof result.current.handleSubmit>>
      | undefined;
    await act(async () => {
      response = await result.current.handleSubmit(
        { errors: {}, values: { primaryStudyId: 0, isAutonomousStudy: false } },
        new FormData(),
      );
    });

    expect(apiClient.post).toHaveBeenCalledWith("api/v1/users/apply", {
      json: { study_id: 42 },
    });
    expect(response).toEqual({
      values: { primaryStudyId: 42, isAutonomousStudy: true },
      errors: {},
    });
    expect(result.current.step).toBe(3);
    expect(result.current.submittedIsAutonomousStudy).toBe(true);
    expect(result.current.submittedIntro).toBe("");
  });
});
