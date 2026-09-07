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
import { GET, POST } from "./route";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedKyPost = ky.post as jest.MockedFunction<typeof ky.post>;

describe("api proxy", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedCookies.mockReset();
    mockedKyPost.mockReset();
  });

  it("forwards authentication and query parameters while sanitizing response headers", async () => {
    mockedAuth.mockResolvedValue({ accessToken: "access-token" } as never);
    mockedCookies.mockResolvedValue({ get: () => undefined } as never);

    const fetchMock = jest
      .fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
      .mockImplementation(
        async () =>
          new Response("backend response", {
            status: 201,
            headers: {
              "content-encoding": "gzip",
              "content-length": "16",
              "transfer-encoding": "chunked",
              "x-backend": "preserved",
            },
          }),
      );
    Object.defineProperty(global, "fetch", {
      value: fetchMock,
      writable: true,
    });

    const response = await GET(
      new NextRequest(
        "https://frontend.forif.org/api/proxy/studies?status=open",
        { headers: { "x-request-id": "request-id" } },
      ),
      { params: Promise.resolve({ path: ["api", "v1", "studies"] }) },
    );

    const [targetUrl, requestInit] = fetchMock.mock.calls[0] ?? [];
    const forwardedHeaders = requestInit?.headers as Headers;

    expect(targetUrl).toEqual(
      expect.stringContaining("/api/v1/studies?status=open"),
    );
    expect(forwardedHeaders.get("authorization")).toBe("Bearer access-token");
    expect(forwardedHeaders.get("x-request-id")).toBe("request-id");
    expect(forwardedHeaders.get("host")).toBeNull();
    expect(mockedKyPost).not.toHaveBeenCalled();
    expect(response.status).toBe(201);
    await expect(response.text()).resolves.toBe("backend response");
    expect(response.headers.get("x-backend")).toBe("preserved");
    expect(response.headers.get("content-encoding")).toBeNull();
    expect(response.headers.get("content-length")).toBeNull();
    expect(response.headers.get("transfer-encoding")).toBeNull();
  });

  it("returns the backend 401 unchanged when no refresh token is available", async () => {
    mockedAuth.mockResolvedValue({ accessToken: "expired-token" } as never);
    mockedCookies.mockResolvedValue({ get: () => undefined } as never);

    const fetchMock = jest
      .fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
      .mockImplementation(
        async () => new Response("unauthorized", { status: 401 }),
      );
    Object.defineProperty(global, "fetch", {
      value: fetchMock,
      writable: true,
    });

    const response = await GET(
      new NextRequest("https://frontend.forif.org/api/proxy/studies"),
      { params: Promise.resolve({ path: ["api", "v1", "studies"] }) },
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(mockedKyPost).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    await expect(response.text()).resolves.toBe("unauthorized");
    expect(response.headers.get("x-new-access-token")).toBeNull();
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
    await expect(response.text()).resolves.toBe("ok");
    expect(response.headers.get("x-new-access-token")).toBe("renewed-token");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(mockedKyPost).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/users/refresh"),
      expect.objectContaining({
        headers: { Cookie: "refreshToken=refresh-token" },
      }),
    );
  });
});
