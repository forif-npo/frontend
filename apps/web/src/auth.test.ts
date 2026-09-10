import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@/env", () => ({
  env: {
    AUTH_SECRET: "test-secret",
    GOOGLE_CLIENT_ID: "client-id",
    GOOGLE_CLIENT_SECRET: "client-secret",
  },
}));
jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    auth: jest.fn(),
    handlers: {},
    signIn: jest.fn(),
    signOut: jest.fn(),
    unstable_update: jest.fn(),
  })),
}));
jest.mock("@/features/auth/api", () => ({
  refreshTokenWithCookie: jest.fn(),
}));
jest.mock("ky", () => ({
  HTTPError: class HTTPError extends Error {},
}));
import NextAuth from "next-auth";
import { refreshTokenWithCookie } from "@/features/auth/api";
import "./auth";

type JwtCallback = (params: {
  token: Record<string, unknown>;
  trigger?: "update";
  session?: { forceRefresh?: boolean };
}) => Promise<Record<string, unknown>>;

type NextAuthOptions = { callbacks: { jwt: JwtCallback } };

const mockedNextAuth = NextAuth as jest.MockedFunction<typeof NextAuth>;
const mockedRefreshTokenWithCookie =
  refreshTokenWithCookie as jest.MockedFunction<typeof refreshTokenWithCookie>;

function getJwtCallback(): JwtCallback {
  const [options] = mockedNextAuth.mock.calls[0] as unknown as [
    NextAuthOptions,
  ];
  return options.callbacks.jwt;
}

describe("web auth token refresh", () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    mockedRefreshTokenWithCookie.mockReset();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("removes an access token when no refresh token exists", async () => {
    const jwt = getJwtCallback();

    await expect(
      jwt({
        token: { backendJwt: "expired-access-token" },
        trigger: "update",
        session: { forceRefresh: true },
      }),
    ).resolves.toMatchObject({
      backendJwt: undefined,
      error: "RefreshAccessTokenError",
    });
  });

  it("removes an access token when refresh fails", async () => {
    const jwt = getJwtCallback();
    mockedRefreshTokenWithCookie.mockRejectedValue(new Error("network error"));

    await expect(
      jwt({
        token: {
          backendJwt: "expired-access-token",
          backendRefreshToken: "refresh-token",
        },
        trigger: "update",
        session: { forceRefresh: true },
      }),
    ).resolves.toMatchObject({
      backendJwt: undefined,
      error: "RefreshAccessTokenError",
    });
  });
});
