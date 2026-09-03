import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { post: jest.fn() },
}));

import { apiClient } from "@core/utils/api-client";
import { logout, memberSignUp, refreshTokenWithCookie, userLogin } from "./api";

type PostMock = {
  mockReset: () => void;
  mockResolvedValue: (value: Response) => void;
};

const mockedPost = apiClient.post as unknown as PostMock;

function response(data: Record<string, unknown>, setCookie?: string) {
  return new Response(
    JSON.stringify({
      timestamp: 0,
      data,
      error_code: null,
      message: "",
    }),
    { headers: setCookie ? { "set-cookie": setCookie } : undefined },
  );
}

describe("auth api", () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it("forwards the existing signup payload and merges the refresh cookie", async () => {
    mockedPost.mockResolvedValue(
      response(
        { access_token: "access", role: "USER" },
        "session=value; Path=/, refreshToken=refresh%20token; HttpOnly",
      ),
    );
    const request = {
      student_id: 20260001,
      user_name: "홍길동",
      access_token: "oauth-token",
      phone_num: "010-1234-5678",
      department: "컴퓨터소프트웨어학부",
    };

    const result = await memberSignUp(request);

    expect(apiClient.post).toHaveBeenCalledWith("api/v1/users/signup", {
      json: request,
    });
    expect(result.data).toEqual({
      access_token: "access",
      role: "USER",
      refresh_token: "refresh token",
    });
  });

  it("keeps login responses unchanged when no refresh cookie is sent", async () => {
    mockedPost.mockResolvedValue(
      response({ access_token: "access", role: "USER" }),
    );

    const result = await userLogin({ access_token: "oauth-token" });

    expect(apiClient.post).toHaveBeenCalledWith("api/v1/users/signin", {
      json: { access_token: "oauth-token" },
    });
    expect(result.data).toEqual({ access_token: "access", role: "USER" });
  });

  it("sends the existing refresh cookie header and leaves logout bodyless", async () => {
    mockedPost.mockResolvedValue(response({ access_token: "new-access" }));

    await expect(
      refreshTokenWithCookie("saved-refresh"),
    ).resolves.toMatchObject({
      data: { access_token: "new-access" },
    });
    await logout();

    expect(apiClient.post).toHaveBeenNthCalledWith(1, "api/v1/users/refresh", {
      headers: { Cookie: "refreshToken=saved-refresh" },
    });
    expect(apiClient.post).toHaveBeenNthCalledWith(2, "api/v1/users/logout");
  });
});
