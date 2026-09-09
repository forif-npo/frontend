import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import { getStaff, refreshTokenWithCookie, staffLogin } from "./api";

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: () => Promise<unknown> }) => void;
};

type PostMock = {
  mockReset: () => void;
  mockReturnValue: (value: Response) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;
const mockedPost = apiClient.post as unknown as PostMock;

function response(data: unknown, setCookie: string | null = null): Response {
  return {
    headers: { get: jest.fn().mockReturnValue(setCookie) },
    json: async () => ({ data }),
  } as unknown as Response;
}

describe("admin auth api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
  });

  it("sends staff credentials and exposes the refresh cookie in the login response", async () => {
    mockedPost.mockReturnValue(
      response(
        { access_token: "access-token", role: "ADMIN" },
        "session=value, refreshToken=refresh%2Dtoken; HttpOnly",
      ),
    );

    await expect(
      staffLogin({ user_id: 20260001, password: "password" }),
    ).resolves.toMatchObject({
      data: { access_token: "access-token", refresh_token: "refresh-token" },
    });
    expect(apiClient.post).toHaveBeenCalledWith("api/v1/staff/signin", {
      json: { user_id: 20260001, password: "password" },
    });
  });

  it("uses the refresh cookie request contract and optional staff authorization", async () => {
    mockedPost.mockReturnValue(response({ access_token: "renewed" }));
    mockedGet.mockReturnValue({ json: () => Promise.resolve({ data: null }) });

    await refreshTokenWithCookie("refresh-token");
    await getStaff("access-token");
    await getStaff();

    expect(apiClient.post).toHaveBeenCalledWith("api/v1/users/refresh", {
      headers: { Cookie: "refreshToken=refresh-token" },
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(1, "api/v1/staff/me", {
      headers: { Authorization: "Bearer access-token" },
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "api/v1/staff/me", {});
  });
});
