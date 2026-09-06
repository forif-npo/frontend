/** @jest-environment jsdom */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { patch: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import { updateUserPhoneNumber, updateUserProfile } from "./api";

type PatchMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedPatch = apiClient.patch as unknown as PatchMock;

function response() {
  return {
    json: <T>() =>
      Promise.resolve({
        data: {
          user_id: 20260001,
          user_name: "홍길동",
          email: "user@forif.org",
          phone_num: "010-1234-5678",
          department: "컴퓨터소프트웨어학부",
        },
      } as T),
  };
}

async function readBlob(blob: Blob) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

describe("my page profile api", () => {
  beforeEach(() => {
    mockedPatch.mockReset();
  });

  it("sends profile metadata and image through the existing multipart contract", async () => {
    mockedPatch.mockReturnValue(response());
    const image = new File(["image"], "profile.png", { type: "image/png" });

    await updateUserProfile(
      {
        department: "컴퓨터소프트웨어학부",
        profile_image: image,
      },
      "access-token",
    );

    const [, options] = (
      apiClient.patch as unknown as {
        mock: { calls: Array<[string, { body: FormData; headers: object }]> };
      }
    ).mock.calls[0];
    expect(apiClient.patch).toHaveBeenCalledWith("api/v1/users/me/profile", {
      body: expect.any(FormData),
      headers: { Authorization: "Bearer access-token" },
    });
    expect(
      JSON.parse(await readBlob(options.body.get("request") as Blob)),
    ).toEqual({
      department: "컴퓨터소프트웨어학부",
    });
    expect((options.body.get("profileImage") as File).name).toBe("profile.png");
  });

  it("preserves the phone-number endpoint, snake_case body, and token header", async () => {
    mockedPatch.mockReturnValue(response());

    await updateUserPhoneNumber({ phone_num: "010-9876-5432" }, "access-token");

    expect(apiClient.patch).toHaveBeenCalledWith(
      "api/v1/users/me/phone-number",
      {
        json: { phone_num: "010-9876-5432" },
        headers: { Authorization: "Bearer access-token" },
      },
    );
  });
});
