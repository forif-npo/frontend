import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import { getCurrentStaffRecruitment } from "./api";

type ApiMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as ApiMock;

describe("staff recruitment public api", () => {
  beforeEach(() => mockedGet.mockReset());

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
});
