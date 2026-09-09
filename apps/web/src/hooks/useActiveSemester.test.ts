/** @jest-environment jsdom */
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@/features/semester/api", () => ({
  fallbackSemester: jest.fn(),
  getCurrentSemester: jest.fn(),
}));
import { fallbackSemester, getCurrentSemester } from "@/features/semester/api";
import { useActiveSemester } from "./useActiveSemester";

type SemesterMock = {
  mockReset: () => void;
  mockReturnValue: (value: unknown) => void;
  mockResolvedValue: (value: unknown) => void;
};

const mockedFallbackSemester = fallbackSemester as unknown as SemesterMock;
const mockedGetCurrentSemester = getCurrentSemester as unknown as SemesterMock;

const fallback = { act_year: 2026, act_semester: 1, label: "26-1" };
const configured = { act_year: 2026, act_semester: 2, label: "26-2" };

describe("useActiveSemester", () => {
  beforeEach(() => {
    mockedFallbackSemester.mockReset();
    mockedGetCurrentSemester.mockReset();
    mockedFallbackSemester.mockReturnValue(fallback);
    mockedGetCurrentSemester.mockResolvedValue(configured);
  });

  it("uses the fallback until the server-defined active semester arrives", async () => {
    const { result } = renderHook(() => useActiveSemester());

    expect(result.current).toEqual(fallback);

    await waitFor(() => expect(result.current).toEqual(configured));
    expect(getCurrentSemester).toHaveBeenCalledTimes(1);
  });
});
