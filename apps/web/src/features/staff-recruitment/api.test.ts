import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import {
  getCurrentStaffRecruitment,
  getMyStaffApplication,
  submitStaffApplication,
} from "./api";

type ApiMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as ApiMock;
const mockedPost = apiClient.post as unknown as ApiMock;

describe("staff recruitment public api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
  });

  it("uses the public current endpoint without stale cache", async () => {
    mockedGet.mockReturnValue({
      json: <T>() => Promise.resolve({ data: null } as T),
    });

    await expect(getCurrentStaffRecruitment()).resolves.toBeNull();
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/current",
      { cache: "no-cache" },
    );
  });

  it("submits only department choices and question answers", async () => {
    const body = {
      department_choices: [{ department_id: 31, priority: 1 as const }],
      answers: [{ question_id: 41, answer: "테스트 지원 동기" }],
    };
    mockedPost.mockReturnValue({
      json: <T>() =>
        Promise.resolve({
          data: { application_id: 7, recruitment_id: 3 },
        } as T),
    });

    await submitStaffApplication(3, body);

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/3/applications",
      { json: body },
    );
  });

  it("loads only the authenticated user's application without caching", async () => {
    mockedGet.mockReturnValue({
      json: <T>() => Promise.resolve({ data: { application_id: 7 } } as T),
    });

    await getMyStaffApplication(3);

    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/staff-recruitments/3/applications/me",
      { cache: "no-store" },
    );
  });
});
