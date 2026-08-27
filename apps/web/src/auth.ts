import type { ExtendedAccount } from "next-auth";
import NextAuth, { type NextAuthResult } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { env } from "./env";

const BACKEND_TOKEN_REFRESH_BUFFER_MS = 60_000;

function getJwtExpiresAt(token?: string): number | null {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const decoded = JSON.parse(
      Buffer.from(
        payload.replace(/-/g, "+").replace(/_/g, "/"),
        "base64",
      ).toString("utf8"),
    ) as { exp?: number };

    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

function shouldRefreshBackendJwt(token: JWT): boolean {
  const expiresAt = getJwtExpiresAt(token.backendJwt);
  return (
    expiresAt !== null &&
    Date.now() >= expiresAt - BACKEND_TOKEN_REFRESH_BUFFER_MS
  );
}

async function refreshBackendJwt(token: JWT): Promise<JWT> {
  if (!token.backendRefreshToken) {
    return { ...token, error: "RefreshAccessTokenError" };
  }

  try {
    const { refreshTokenWithCookie } = await import("@/features/auth/api");
    const response = await refreshTokenWithCookie(token.backendRefreshToken);
    const accessToken = response.data?.access_token;

    if (!accessToken) {
      throw new Error("Access token refresh failed");
    }

    return {
      ...token,
      backendJwt: accessToken,
      backendRefreshToken:
        response.data?.refresh_token ?? token.backendRefreshToken,
      error: undefined,
    };
  } catch (error) {
    const { HTTPError } = await import("ky");
    if (error instanceof HTTPError && error.response.status === 401) {
      // refresh token 만료/무효 → 정상적인 세션 만료 흐름이므로 조용히 처리
      console.warn(
        "Backend refresh token expired (401) — 세션을 만료 처리합니다.",
      );
    } else {
      console.error("Backend token refresh failed:", error);
    }
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const result = NextAuth({
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  trustHost: true, // Trust the host to avoid issues with custom domains
  session: {
    strategy: "jwt",
    // 개설 신청 등 긴 폼 작성 중 세션 쿠키가 만료되면 요청이 무토큰으로 나가
    // unauthorized가 발생하므로 세션은 길게 유지하고, 백엔드 access token(1시간)은
    // jwt 콜백의 refresh 로테이션으로 갱신한다.
    maxAge: 60 * 60 * 24, // 24 hours
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return (
          profile?.email?.toLowerCase().endsWith("@hanyang.ac.kr") ?? false
        );
      }
      return true;
    },
    async jwt({ token, account, user, trigger, session: updateSession }) {
      const sessionUpdate = updateSession as
        | {
            accessToken?: string;
            refreshToken?: string;
            forceRefresh?: boolean;
            role?: string;
            provider?: string;
          }
        | undefined;

      // 세션 업데이트 트리거 (토큰 갱신 시)
      if (trigger === "update" && sessionUpdate?.forceRefresh) {
        return await refreshBackendJwt(token);
      }

      if (
        trigger === "update" &&
        (sessionUpdate?.accessToken || sessionUpdate?.refreshToken)
      ) {
        return {
          ...token,
          backendJwt: sessionUpdate.accessToken ?? token.backendJwt,
          backendRefreshToken:
            sessionUpdate.refreshToken ?? token.backendRefreshToken,
          role: sessionUpdate.role ?? token.role,
          provider: sessionUpdate.provider ?? token.provider,
        };
      }

      // 초기 로그인 시
      if (account && user) {
        // Google OAuth 로그인인 경우
        if (account.provider === "google") {
          const googleAccount = account as typeof account & ExtendedAccount;
          return {
            ...token,
            backendJwt: googleAccount.backendJwt, // 백엔드 JWT
            backendRefreshToken: googleAccount.backendRefreshToken,
            googleAccessToken: account.access_token, // Google Access Token (참고용)
            role: googleAccount.role,
            provider: "google",
          };
        }
      }

      if (shouldRefreshBackendJwt(token)) {
        return await refreshBackendJwt(token);
      }

      return token;
    },
    async session({ session, token }) {
      // 백엔드 JWT를 accessToken으로 전달
      session.accessToken = (token.backendJwt as string) || "";
      session.error = token.error as string | undefined;
      session.role = token.role as string | undefined;
      session.provider = token.provider as string | undefined;

      // 백엔드 JWT가 있으면 회원가입 완료된 사용자
      session.isSignUp = !!token.backendJwt;

      return session;
    },
  },
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
export const unstable_update: NextAuthResult["unstable_update"] =
  result.unstable_update;
