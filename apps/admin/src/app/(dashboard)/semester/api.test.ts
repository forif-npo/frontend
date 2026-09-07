import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import { getAdminCandidates } from "./api";

const mockedGet = apiClient.get as unknown as {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("semester api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("requests the full administrator candidate list for presidency delegation", async () => {
    const candidates = [
      {
        user_id: 20260001,
        name: "홍길동",
        department: "컴퓨터소프트웨어학부",
        phone_num: "010-1234-5678",
        affiliation: "운영진",
      },
    ];
    mockedGet.mockReturnValue(response({ content: candidates }));

    await expect(getAdminCandidates()).resolves.toEqual(candidates);

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/president/admins", {
      searchParams: { size: 100 },
    });
  });

  it("returns an empty candidate list when the response has no data", async () => {
    mockedGet.mockReturnValue(response(null));

    await expect(getAdminCandidates()).resolves.toEqual([]);
  });
});
