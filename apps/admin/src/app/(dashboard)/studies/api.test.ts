import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: {
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/features/semester/api", () => ({
  getCurrentSemester: jest.fn(),
}));

import { apiClient } from "@core/utils/api-client";
import {
  approveStudy,
  createAutonomousStudy,
  deleteStudy,
  rejectStudy,
  updateStudy,
} from "./api";

type MutationMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedPost = apiClient.post as unknown as MutationMock;
const mockedPatch = apiClient.patch as unknown as MutationMock;
const mockedDelete = apiClient.delete as unknown as MutationMock;

function successResponse() {
  return {
    json: <T>() => Promise.resolve({ data: null } as T),
  };
}

describe("admin studies api mutations", () => {
  beforeEach(() => {
    mockedPost.mockReset();
    mockedPatch.mockReset();
    mockedDelete.mockReset();
  });

  it("uses the existing approval and autonomous-study endpoints", async () => {
    mockedPatch.mockReturnValue(successResponse());
    mockedPost.mockReturnValue(successResponse());

    await approveStudy(42);
    await createAutonomousStudy();

    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/admin/studies/42/approve",
    );
    expect(apiClient.post).toHaveBeenCalledWith(
      "api/v1/admin/studies/autonomous",
    );
  });

  it("preserves update, rejection, and deletion request contracts", async () => {
    mockedPatch.mockReturnValue(successResponse());
    mockedDelete.mockReturnValue(successResponse());
    const formData = new FormData();
    formData.append("studyRequest", "payload");

    await updateStudy(42, formData);
    await rejectStudy(42, "모집 요건을 보완해주세요.");
    await deleteStudy(42);

    expect(apiClient.patch).toHaveBeenNthCalledWith(
      1,
      "api/v1/admin/studies/42",
      { body: formData },
    );
    expect(apiClient.patch).toHaveBeenNthCalledWith(
      2,
      "api/v1/admin/studies/42/reject",
      { json: { reason: "모집 요건을 보완해주세요." } },
    );
    expect(apiClient.delete).toHaveBeenCalledWith("api/v1/admin/studies/42");
  });
});
