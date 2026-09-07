import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import {
  fallbackSemester,
  getCurrentSemester,
  getSemesters,
  toSemesterLabel,
} from "./api";

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

describe("semester api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("formats semester labels and keeps the documented date-based fallback", () => {
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

  it("falls back to the local semester and an empty list when the API omits data", async () => {
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
