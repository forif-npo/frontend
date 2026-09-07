import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), delete: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import {
  cancelStudyCreationApplication,
  getMyStudyApplication,
  getMyStudyApplications,
} from "./api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

type DeleteMock = {
  mockReset: () => void;
};

const mockedGet = apiClient.get as unknown as GetMock;
const mockedDelete = apiClient.delete as unknown as DeleteMock;

function response(data: unknown) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("study application api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedDelete.mockReset();
  });

  it("requests the signed-in member's applications with the existing token header", async () => {
    const applications = [
      {
        id: 10,
        study_name: "React 심화",
        one_liner: "React를 깊게 학습합니다.",
        tags: ["React"],
        study_status: "PENDING" as const,
        reject_reason: null,
        created_at: "2026-09-07T00:00:00Z",
        can_modify: true,
        can_cancel: true,
      },
    ];
    mockedGet.mockReturnValue(response(applications));

    await expect(getMyStudyApplications("access-token")).resolves.toEqual(
      applications,
    );

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/study-apply/me", {
      headers: { Authorization: "Bearer access-token" },
    });
  });

  it("fails explicitly when a requested application detail is missing", async () => {
    mockedGet.mockReturnValue(response(null));

    await expect(getMyStudyApplication(10)).rejects.toThrow(
      "스터디 개설 신청서를 불러오지 못했습니다.",
    );

    expect(apiClient.get).toHaveBeenCalledWith("api/v1/study-apply/10", {
      headers: undefined,
    });
  });

  it("cancels only the selected study-creation application", async () => {
    await cancelStudyCreationApplication(10);

    expect(apiClient.delete).toHaveBeenCalledWith("api/v1/study-apply/10");
  });
});
