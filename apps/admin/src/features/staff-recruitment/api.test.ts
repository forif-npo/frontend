import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import { changeStaffRecruitmentStatus, getStaffRecruitments } from "./api";

type ApiMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as ApiMock;
const mockedPost = apiClient.post as unknown as ApiMock;
const mockedPatch = apiClient.patch as unknown as ApiMock;

function response(data: unknown) {
  return { json: <T>() => Promise.resolve({ data } as T) };
}

describe("staff recruitment admin api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedPatch.mockReset();
  });

  it("requests a stable admin list page", async () => {
    mockedGet.mockReturnValue(response({ content: [] }));

    await expect(getStaffRecruitments()).resolves.toEqual([]);
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments",
      {
        searchParams: {
          page: 0,
          size: 100,
          sort: "recruitmentId:DESC",
        },
      },
    );
  });

  it("keeps publish as an explicit action with the optimistic version", async () => {
    mockedPost.mockReturnValue(response({ recruitment_id: 12 }));

    await changeStaffRecruitmentStatus(12, "publish", 3);

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/staff-recruitments/12/publish",
      { json: { version: 3, reason: undefined } },
    );
  });
});
