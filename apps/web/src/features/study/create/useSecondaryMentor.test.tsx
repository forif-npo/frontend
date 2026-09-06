/** @jest-environment jsdom */

import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import { useSecondaryMentor } from "./useSecondaryMentor";
import type { UserInfo } from "./types";

const currentUser: UserInfo = {
  studentId: "20260001",
  name: "현재 사용자",
  department: "컴퓨터소프트웨어학부",
  phone: "010-0000-0000",
};

const secondaryMentor: UserInfo = {
  studentId: "20260002",
  name: "추가 멘토",
  department: "정보시스템학과",
  phone: "010-0000-0001",
};

describe("useSecondaryMentor", () => {
  it("loads the saved secondary mentor and keeps its student id in the search field", async () => {
    const fetchUser = jest.fn(async () => secondaryMentor);
    const onMentorIdsChange = jest.fn();
    const { result } = renderHook(() =>
      useSecondaryMentor({
        currentUserInfo: currentUser,
        secondaryMentorId: 20260002,
        onMentorIdsChange,
        fetchUser,
      }),
    );

    await waitFor(() => {
      expect(result.current.secondaryMentor).toEqual(secondaryMentor);
    });

    expect(result.current.mentorSearchValue).toBe("20260002");
    expect(fetchUser).toHaveBeenCalledWith("20260002");
    expect(onMentorIdsChange).not.toHaveBeenCalled();
  });

  it("blocks selecting the current user and clears the secondary mentor id", async () => {
    const fetchUser = jest.fn(async () => currentUser);
    const onMentorIdsChange = jest.fn();
    const { result } = renderHook(() =>
      useSecondaryMentor({
        currentUserInfo: currentUser,
        secondaryMentorId: null,
        onMentorIdsChange,
        fetchUser,
      }),
    );

    act(() => result.current.updateMentorSearchValue("20260001"));
    await act(async () => result.current.handleSecondaryMentorSearch());

    expect(result.current.mentorError).toBe(
      "본인은 추가 멘토로 등록할 수 없습니다.",
    );
    expect(onMentorIdsChange).toHaveBeenCalledWith([]);
  });

  it("selects another user and clears all state when the mentor is removed", async () => {
    const fetchUser = jest.fn(async () => secondaryMentor);
    const onMentorIdsChange = jest.fn();
    const { result } = renderHook(() =>
      useSecondaryMentor({
        currentUserInfo: currentUser,
        secondaryMentorId: null,
        onMentorIdsChange,
        fetchUser,
      }),
    );

    act(() => result.current.updateMentorSearchValue(" 20260002 "));
    await act(async () => result.current.handleSecondaryMentorSearch());

    expect(result.current.secondaryMentor).toEqual(secondaryMentor);
    expect(result.current.mentorSearchValue).toBe("20260002");
    expect(onMentorIdsChange).toHaveBeenCalledWith([20260002]);

    act(() => result.current.handleSecondaryMentorRemove());

    expect(result.current.secondaryMentor).toBeNull();
    expect(result.current.mentorSearchValue).toBe("");
    expect(result.current.mentorError).toBeNull();
    expect(onMentorIdsChange).toHaveBeenLastCalledWith([]);
  });
});
