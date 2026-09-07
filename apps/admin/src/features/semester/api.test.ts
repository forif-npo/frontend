import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), patch: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import {
  changeCurrentSemester,
  getCurrentSemester,
  getSemesterChangePreview,
  getSemesters,
  toSemesterLabel,
} from "./api";

type ApiMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => ApiMock;
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => ApiMock;
};

const mockedGet = apiClient.get as unknown as ApiMock;
const mockedPatch = apiClient.patch as unknown as ApiMock;

const semester = {
  act_year: 2026,
  act_semester: 2,
  label: "26-2",
};

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("semester feature api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPatch.mockReset();
  });

  it("returns current and selectable semesters from their existing endpoints", async () => {
    mockedGet
      .mockReturnValueOnce(response(semester))
      .mockReturnValue(response([semester]));

    await expect(getCurrentSemester()).resolves.toEqual(semester);
    await expect(getSemesters()).resolves.toEqual([semester]);

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      "api/v1/semesters/current",
    );
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "api/v1/semesters");
    expect(toSemesterLabel(2026, 2)).toBe("26-2");
  });

  it("uses snake_case query fields for the semester change preview", async () => {
    const preview = {
      current: semester,
      target: { ...semester, act_semester: 1, label: "27-1" },
      target_team_member_count: 10,
      needs_team_setup: true,
      target_hackathon_exists: false,
      current_member_count: 20,
      current_certificate_issued_count: 15,
      has_pending_certificates: false,
    };
    mockedGet.mockReturnValue(response(preview));

    await expect(getSemesterChangePreview(2027, 1)).resolves.toEqual(preview);

    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/semesters/preview",
      { searchParams: { act_year: 2027, act_semester: 1 } },
    );
  });

  it("keeps the existing semester change body intact", async () => {
    const body = {
      act_year: 2027,
      act_semester: 1,
      next_president_user_id: 20260001,
    };
    mockedPatch.mockReturnValue(response(semester));

    await expect(changeCurrentSemester(body)).resolves.toEqual(semester);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/admin/semesters/current",
      { json: body },
    );
  });
});
