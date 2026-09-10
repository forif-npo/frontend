import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("../utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));
import { apiClient } from "../utils/api-client";
import { fallbackSemester, getCurrentSemester, getSemesters, toSemesterLabel } from "./semester";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("semester API", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("formats labels and uses the documented date-based fallback", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-01T00:00:00Z"));

    expect(toSemesterLabel(2026, 2)).toBe("26-2");
    expect(fallbackSemester()).toEqual({
      act_year: 2026,
      act_semester: 2,
      label: "26-2",
    });
  });

  it("uses the server current semester when it is available", async () => {
    const semester = { act_year: 2026, act_semester: 2, label: "26-2" };
    mockedGet.mockReturnValue(response(semester));

    await expect(getCurrentSemester()).resolves.toEqual(semester);

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/semesters/current");
  });

  it("uses the existing fallbacks when the API omits data", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-03-01T00:00:00Z"));
    mockedGet.mockReturnValue(response(null));

    await expect(getCurrentSemester()).resolves.toEqual({
      act_year: 2026,
      act_semester: 1,
      label: "26-1",
    });
    await expect(getSemesters()).resolves.toEqual([]);

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      "api/v1/semesters/current",
    );
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "api/v1/semesters");
  });
});
