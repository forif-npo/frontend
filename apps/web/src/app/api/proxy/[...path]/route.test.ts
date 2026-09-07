import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { NextRequest } from "next/server";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("next/headers", () => ({ cookies: jest.fn() }));
jest.mock("ky", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

import { auth } from "@/auth";
import { cookies } from "next/headers";
import ky from "ky";
import { POST } from "./route";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedKyPost = ky.post as jest.MockedFunction<typeof ky.post>;

describe("api proxy POST", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedCookies.mockReset();
    mockedKyPost.mockReset();
  });

  it("replays a request body after refreshing an expired access token", async () => {
    mockedAuth.mockResolvedValue({ accessToken: "expired-token" } as never);
    mockedCookies.mockResolvedValue({
      get: () => ({ value: "refresh-token" }),
    } as never);
    mockedKyPost.mockReturnValue({
      json: async () => ({ data: { access_token: "renewed-token" } }),
    } as never);

    const fetchMock = jest
      .fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
      .mockImplementationOnce(async (_url, init) => {
        await new Response(init?.body).text();
        return new Response(null, { status: 401 });
      })
      .mockImplementationOnce(async (_url, init) => {
        expect(await new Response(init?.body).text()).toBe('{"name":"FORIF"}');
        return new Response("ok", { status: 200 });
      });
    Object.defineProperty(global, "fetch", {
      value: fetchMock,
      writable: true,
    });

    const request = new NextRequest(
      "https://frontend.forif.org/api/proxy/users",
      {
        method: "POST",
        body: JSON.stringify({ name: "FORIF" }),
        headers: { "content-type": "application/json" },
      },
    );

    const response = await POST(request, {
      params: Promise.resolve({ path: ["api", "v1", "users"] }),
    });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(mockedKyPost).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/users/refresh"),
      expect.objectContaining({
        headers: { Cookie: "refreshToken=refresh-token" },
      }),
    );
  });
});
