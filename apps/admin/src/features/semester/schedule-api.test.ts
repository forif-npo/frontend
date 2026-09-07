import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), put: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import {
  getCurrentSemesterSchedules,
  getSemesterSchedules,
  saveSemesterSchedules,
} from "./schedule-api";

type ApiMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => ApiMock;
  mockImplementationOnce: (implementation: () => never) => ApiMock;
};

const mockedGet = apiClient.get as unknown as ApiMock;
const mockedPut = apiClient.put as unknown as ApiMock;

const schedule = {
  id: 1,
  act_year: 2026,
  act_semester: 2,
  phase: "MENTOR_RECRUIT" as const,
  phase_label: "멘토 모집",
  starts_at: "2026-08-01T00:00:00Z",
  ends_at: "2026-08-10T00:00:00Z",
  open: true,
};

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("semester schedule api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPut.mockReset();
  });

  it("returns the server schedules for the current and selected semesters", async () => {
    mockedGet
      .mockReturnValue(response([schedule]))
      .mockReturnValue(response([schedule]));

    await expect(getCurrentSemesterSchedules()).resolves.toEqual([schedule]);
    await expect(getSemesterSchedules(2026, 2)).resolves.toEqual([schedule]);

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      "api/v1/semester-schedules/current",
    );
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      "api/v1/semester-schedules/2026/2",
    );
  });

  it("keeps a failed schedule lookup closed rather than exposing stale data", async () => {
    mockedGet.mockImplementationOnce(() => {
      throw new Error("network failure");
    });

    await expect(getCurrentSemesterSchedules()).resolves.toEqual([]);
  });

  it("replaces a semester schedule with the complete phase payload", async () => {
    mockedPut.mockReturnValue(response([schedule]));
    const phases = [
      {
        phase: "MENTOR_RECRUIT" as const,
        starts_at: schedule.starts_at,
        ends_at: schedule.ends_at,
      },
    ];

    await expect(saveSemesterSchedules(2026, 2, phases)).resolves.toEqual([
      schedule,
    ]);

    expect(apiClient.put).toHaveBeenCalledWith(
      "api/v1/admin/semester-schedules/2026/2",
      { json: { phases } },
    );
  });
});
