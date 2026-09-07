/** @jest-environment jsdom */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), patch: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import {
  getStudyApplications,
  getUserProfile,
  updateUserPhoneNumber,
  updateUserProfile,
} from "./api";

type PatchMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedPatch = apiClient.patch as unknown as PatchMock;
const mockedGet = apiClient.get as unknown as PatchMock & {
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => PatchMock;
};

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
    mockedGet.mockReset();
    mockedPatch.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("keeps private profile and application responses out of the browser console", async () => {
    const profile = {
      user_id: 20260001,
      user_name: "홍길동",
      email: "user@forif.org",
      phone_num: "010-1234-5678",
      department: "컴퓨터소프트웨어학부",
    };
    const applications = { applications: [] };
    mockedGet
      .mockReturnValueOnce({
        json: <T>() => Promise.resolve({ data: profile } as T),
      })
      .mockReturnValue({
        json: <T>() => Promise.resolve({ data: applications } as T),
      });
    const logSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);

    await expect(getUserProfile("access-token")).resolves.toEqual(profile);
    await expect(getStudyApplications("access-token")).resolves.toEqual(
      applications,
    );

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      "api/v1/users/me/profile",
      { headers: { Authorization: "Bearer access-token" } },
    );
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      "api/v1/users/me/study-applications",
      { headers: { Authorization: "Bearer access-token" } },
    );
    expect(logSpy).not.toHaveBeenCalled();
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
