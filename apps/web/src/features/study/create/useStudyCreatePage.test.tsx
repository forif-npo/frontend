/** @jest-environment jsdom */

import { act, renderHook, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("./useStudyCreateData", () => ({
  useStudyCreateData: jest.fn(),
}));

jest.mock("./actions", () => ({
  submitStudyCreate: jest.fn(),
}));

jest.mock("./draft-storage", () => ({
  clearStudyCreateDraft: jest.fn(),
  loadStudyCreateDraft: jest.fn(),
  saveStudyCreateDraft: jest.fn(),
}));

jest.mock("@core/utils/api-client", () => ({
  handleApiError: jest.fn(),
}));

jest.mock("ky", () => ({
  HTTPError: class HTTPError extends Error {},
}));

import type { StudyOpenValues } from "@core/schemas";
import { handleApiError } from "@core/utils/api-client";
import { submitStudyCreate } from "./actions";
import {
  clearStudyCreateDraft,
  loadStudyCreateDraft,
  saveStudyCreateDraft,
} from "./draft-storage";
import { useStudyCreateData } from "./useStudyCreateData";
import { useStudyCreatePage } from "./useStudyCreatePage";

const mockPush = jest.fn();
const mockedUseStudyCreateData = useStudyCreateData as unknown as {
  mockReturnValue: (value: ReturnType<typeof useStudyCreateData>) => void;
};
const mockedSubmitStudyCreate = submitStudyCreate as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: unknown) => void;
  mockRejectedValue: (value: unknown) => void;
};
const mockedHandleApiError = handleApiError as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: string) => void;
};
const mockedClearStudyCreateDraft = clearStudyCreateDraft as unknown as {
  mockReset: () => void;
};
const mockedLoadStudyCreateDraft = loadStudyCreateDraft as unknown as {
  mockReset: () => void;
  mockReturnValue: (value: Partial<StudyOpenValues> | null) => void;
};
const mockedSaveStudyCreateDraft = saveStudyCreateDraft as unknown as {
  mockReset: () => void;
  mockReturnValue: (value: boolean) => void;
};

const validValues: StudyOpenValues = {
  mentorIds: [],
  studyName: "React 심화",
  oneLiner: "렌더링 원리를 이해합니다.",
  tags: ["프론트엔드"],
  thumbnail: null,
  introduction:
    "React의 렌더링 과정을 학습하고 실제 프로젝트에 적용합니다.".repeat(2),
  isOnline: false,
  location: "장소 미정",
  room: "",
  weekDay: "3",
  startTime: "19:00",
  endTime: "21:00",
  curriculum: Array.from({ length: 8 }, (_, index) => ({
    week: index + 1,
    date: `2609${String(index + 1).padStart(2, "0")}`,
    topic: `${index + 1}주차`,
    contents: ["학습 내용"],
  })),
  difficulty: "NORMAL",
  hasInterview: false,
  interviewDate: null,
  references: [],
};

describe("useStudyCreatePage", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockPush.mockReset();
    mockedSubmitStudyCreate.mockReset();
    mockedHandleApiError.mockReset();
    mockedClearStudyCreateDraft.mockReset();
    mockedLoadStudyCreateDraft.mockReset();
    mockedSaveStudyCreateDraft.mockReset();
    mockedLoadStudyCreateDraft.mockReturnValue(null);
    mockedSaveStudyCreateDraft.mockReturnValue(true);
    mockedHandleApiError.mockResolvedValue("제출에 실패했습니다.");
    mockedUseStudyCreateData.mockReturnValue({
      userInfo: null,
      isLoading: false,
      error: null,
      isMentorRecruitmentClosed: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("allows step 1 to proceed but blocks step 2 until its required fields are valid", async () => {
    const { result } = renderHook(() => useStudyCreatePage());

    await act(async () => result.current.goToNext());
    expect(result.current.step).toBe(2);

    await act(async () => result.current.goToNext());
    expect(result.current.step).toBe(2);
  });

  it("offers to restore a draft without restoring its thumbnail", async () => {
    mockedLoadStudyCreateDraft.mockReturnValue({
      ...validValues,
      studyName: "임시저장한 스터디",
      thumbnail: undefined,
    });
    const { result } = renderHook(() => useStudyCreatePage());

    await waitFor(() => {
      expect(result.current.studyCreateAlert?.description).toContain(
        "불러오시겠습니까",
      );
    });

    act(() => result.current.studyCreateAlert?.onConfirm?.());

    expect(result.current.form.getValues("studyName")).toBe(
      "임시저장한 스터디",
    );
    expect(result.current.form.getValues("thumbnail")).toBeNull();
  });

  it("does not auto-save solely because a draft is restored", () => {
    jest.useFakeTimers();
    mockedLoadStudyCreateDraft.mockReturnValue({
      ...validValues,
      studyName: "불러온 임시저장",
    });
    renderHook(() => useStudyCreatePage());

    act(() => jest.advanceTimersByTime(1000));

    expect(saveStudyCreateDraft).not.toHaveBeenCalled();
  });

  it("submits valid values, clears the draft, and moves to the completion step", async () => {
    mockedSubmitStudyCreate.mockResolvedValue({ data: { study_id: 12 } });
    const { result } = renderHook(() => useStudyCreatePage());

    act(() => result.current.form.reset(validValues));
    await act(async () => result.current.handleSubmit());

    expect(submitStudyCreate).toHaveBeenCalledWith(validValues);
    expect(clearStudyCreateDraft).toHaveBeenCalledTimes(1);
    expect(result.current.step).toBe(6);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("preserves valid values as a draft and informs the user when submission fails", async () => {
    mockedSubmitStudyCreate.mockRejectedValue(new Error("network failure"));
    const { result } = renderHook(() => useStudyCreatePage());

    act(() => result.current.form.reset(validValues));
    await act(async () => result.current.handleSubmit());

    expect(saveStudyCreateDraft).toHaveBeenCalledWith(validValues);
    expect(handleApiError).toHaveBeenCalled();
    expect(result.current.studyCreateAlert?.description).toBe(
      "제출에 실패했습니다. 작성 내용은 임시저장되었습니다.",
    );
    expect(result.current.step).toBe(1);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("preserves the draft and shows the session-expiration message for a 401 response", async () => {
    const { HTTPError } = await import("ky");
    const unauthorizedError = Object.create(HTTPError.prototype) as Error & {
      response: { status: number };
    };
    unauthorizedError.response = { status: 401 };
    mockedSubmitStudyCreate.mockRejectedValue(unauthorizedError);
    const { result } = renderHook(() => useStudyCreatePage());

    act(() => result.current.form.reset(validValues));
    await act(async () => result.current.handleSubmit());

    expect(saveStudyCreateDraft).toHaveBeenCalledWith(validValues);
    expect(handleApiError).not.toHaveBeenCalled();
    expect(result.current.studyCreateAlert?.description).toBe(
      "세션이 만료되어 제출하지 못했습니다. 작성 내용은 임시저장되었으니 다시 로그인한 뒤 이어서 작성해주세요.",
    );
  });

  it("auto-saves the first dirty change after one second and cancels a pending save on unmount", () => {
    jest.useFakeTimers();
    const { result, unmount } = renderHook(() => useStudyCreatePage());

    act(() => {
      result.current.form.setValue("studyName", "자동 저장", {
        shouldDirty: true,
      });
      jest.advanceTimersByTime(999);
    });
    expect(saveStudyCreateDraft).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(saveStudyCreateDraft).toHaveBeenCalledWith(
      expect.objectContaining({ studyName: "자동 저장" }),
    );

    mockedSaveStudyCreateDraft.mockReset();
    act(() => {
      result.current.form.setValue("studyName", "저장되면 안 되는 값", {
        shouldDirty: true,
      });
    });
    unmount();
    act(() => jest.advanceTimersByTime(1000));

    expect(saveStudyCreateDraft).not.toHaveBeenCalled();
  });

  it("shows the correct manual-save alert for available and unavailable storage", () => {
    const { result } = renderHook(() => useStudyCreatePage());

    act(() => result.current.handleSaveDraft());
    expect(result.current.studyCreateAlert?.description).toBe(
      "임시저장되었습니다.",
    );

    mockedSaveStudyCreateDraft.mockReturnValue(false);
    act(() => result.current.handleSaveDraft());
    expect(result.current.studyCreateAlert?.description).toBe(
      "임시저장을 사용할 수 없는 환경입니다.",
    );
  });
});
