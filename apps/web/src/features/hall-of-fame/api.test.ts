import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import { getHallOfFameEntries, getHallOfFameEntry } from "./api";

type ApiMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as ApiMock;

describe("hall of fame public api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("loads published entries through the public list endpoint", async () => {
    mockedGet.mockReturnValue({
      json: <T>() =>
        Promise.resolve({ data: { content: [{ entry_id: 1 }] } } as T),
    });

    await expect(getHallOfFameEntries()).resolves.toEqual([{ entry_id: 1 }]);
    expect(apiClient.get).toHaveBeenCalledWith("api/v1/hall-of-fame", {
      searchParams: { page: 0, size: 100 },
      cache: "no-cache",
    });
  });

  it("encodes the slug and returns the published detail", async () => {
    mockedGet.mockReturnValue({
      json: <T>() =>
        Promise.resolve({ data: { entry_id: 1, slug: "한 지석" } } as T),
    });

    await expect(getHallOfFameEntry("한 지석")).resolves.toMatchObject({
      entry_id: 1,
    });
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/hall-of-fame/%ED%95%9C%20%EC%A7%80%EC%84%9D",
      { cache: "no-cache" },
    );
  });

  it("treats unavailable or unpublished details as missing", async () => {
    mockedGet.mockReturnValue({
      json: <T>() => Promise.reject(new Error("not found")) as Promise<T>,
    });

    await expect(getHallOfFameEntry("hidden-entry")).resolves.toBeNull();
  });
});
