/** @jest-environment jsdom */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import { addOperator, deleteOperator, updateOperator, updateOperatorProfileImage } from "./api";

type JsonMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedPost = apiClient.post as unknown as JsonMock;
const mockedPatch = apiClient.patch as unknown as JsonMock;
const mockedDelete = apiClient.delete as unknown as JsonMock;

function response(data: unknown = null) {
  return {
    json: <T>() => Promise.resolve({ data } as T),
  };
}

describe("operators api", () => {
  beforeEach(() => {
    mockedPost.mockReset();
    mockedPatch.mockReset();
    mockedDelete.mockReset();
  });

  it("preserves the operator add and update request bodies", async () => {
    mockedPost.mockReturnValue(response());
    mockedPatch.mockReturnValue(response());
    const addRequest = {
      user_id: 20260001,
      act_year: 2026,
      act_semester: 2,
      club_department: "개발부",
      user_title: "팀장",
    };

    await addOperator(addRequest);
    await updateOperator(12, {
      club_department: "운영부",
      user_title: "부팀장",
      graduate_year: 2027,
    });

    expect(apiClient.post).toHaveBeenCalledWith("api/v1/admin/forif-team", {
      json: addRequest,
    });
    expect(apiClient.patch).toHaveBeenCalledWith("api/v1/admin/forif-team/12", {
      json: {
        club_department: "운영부",
        user_title: "부팀장",
        graduate_year: 2027,
      },
    });
  });

  it("uploads one profile image and deletes only the selected operator history", async () => {
    mockedPatch.mockReturnValue(response());
    mockedDelete.mockReturnValue(response());
    const image = new File(["image"], "profile.png", { type: "image/png" });

    await updateOperatorProfileImage(12, image);
    await deleteOperator(12);

    const [, options] = (
      apiClient.patch as unknown as {
        mock: { calls: Array<[string, { body: FormData }]> };
      }
    ).mock.calls[0];
    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/admin/forif-team/12/profile-image",
      { body: expect.any(FormData) },
    );
    expect((options.body.get("file") as File).name).toBe("profile.png");
    expect(apiClient.delete).toHaveBeenCalledWith("api/v1/admin/forif-team/12");
  });
});
