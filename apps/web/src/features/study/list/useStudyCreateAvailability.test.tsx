/** @jest-environment jsdom */
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@/features/semester/schedule-api", () => ({
  getCurrentSemesterSchedules: jest.fn(),
}));

import type { SemesterScheduleItem } from "@/features/semester/schedule-api";
import { getCurrentSemesterSchedules } from "@/features/semester/schedule-api";
import { useStudyCreateAvailability } from "./useStudyCreateAvailability";

type ScheduleMock = {
  mockReset: () => void;
  mockResolvedValue: (value: SemesterScheduleItem[]) => void;
  mockRejectedValue: (value: unknown) => void;
};

const mockedGetSchedules =
  getCurrentSemesterSchedules as unknown as ScheduleMock;

function schedule(
  phase: SemesterScheduleItem["phase"],
  open: boolean,
): SemesterScheduleItem {
  return {
    id: 1,
    act_year: 2099,
    act_semester: 1,
    phase,
    phase_label: phase,
    starts_at: "2099-01-01T00:00:00",
    ends_at: "2099-02-01T00:00:00",
    open,
  };
}

describe("useStudyCreateAvailability", () => {
  beforeEach(() => {
    mockedGetSchedules.mockReset();
  });

  it("enables study creation only while mentor recruitment is open", async () => {
    mockedGetSchedules.mockResolvedValue([
      schedule("MENTEE_RECRUIT", true),
      schedule("MENTOR_RECRUIT", true),
    ]);
    const { result } = renderHook(() => useStudyCreateAvailability());

    await waitFor(() => {
      expect(result.current.isStudyCreateOpen).toBe(true);
    });
  });

  it("keeps study creation disabled when recruitment is closed", async () => {
    mockedGetSchedules.mockResolvedValue([schedule("MENTOR_RECRUIT", false)]);
    const { result } = renderHook(() => useStudyCreateAvailability());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isStudyCreateOpen).toBe(false);
  });

  it("keeps study creation disabled when schedule lookup fails", async () => {
    mockedGetSchedules.mockRejectedValue(new Error("schedule unavailable"));
    const { result } = renderHook(() => useStudyCreateAvailability());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isStudyCreateOpen).toBe(false);
  });
});
