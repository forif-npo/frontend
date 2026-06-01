import type { ExtendedAccount, StaffUser } from "next-auth";
import NextAuth, { type NextAuthResult } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
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
    const { refreshTokenWithCookie } = await import("@core/auth/api");
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
    console.error("Backend token refresh failed:", error);
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
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      id: "staff-credentials",
      name: "Staff Credentials",
      credentials: {
        userId: { label: "학번", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.userId || !credentials?.password) {
            throw new Error("학번과 비밀번호를 입력해주세요.");
          }

          if (
            typeof credentials.userId !== "string" ||
            isNaN(Number(credentials.userId))
          ) {
            throw new Error("학번은 숫자여야 합니다.");
          }
          if (typeof credentials.password !== "string") {
            throw new Error("비밀번호는 문자열이어야 합니다.");
          }

          // 동적 import로 Edge Runtime 호환성 해결
          const { staffLogin } = await import("@core/auth/api");

          const response = await staffLogin({
            user_id: Number(credentials.userId),
            password: credentials.password,
          });

          if (!response.data?.access_token) {
            throw new Error("로그인에 실패했습니다.");
          }

          // NextAuth에서 사용할 사용자 정보 반환
          return {
            id: credentials.userId,
            email: `${credentials.userId}@staff.forif.org`,
            name: "Staff User",
            accessToken: response.data.access_token,
            backendRefreshToken: response.data.refresh_token,
            role: response.data.role,
          };
        } catch (error) {
          console.error("Staff login error:", error);
          throw new Error(
            error instanceof Error ? error.message : "로그인에 실패했습니다.",
          );
        }
      },
    }),
  ],
  trustHost: true, // Trust the host to avoid issues with custom domains
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        // 한양대 이메일 검증
        if (
          !profile?.email_verified ||
          !profile.email!.endsWith("@hanyang.ac.kr")
        ) {
          return false;
        }

        try {
          // 동적 import로 Edge Runtime 호환성 해결
          const { userLogin } = await import("@core/auth/api");

          // 서버에서 백엔드 API 호출 (Google Access Token → 백엔드 JWT)
          const response = await userLogin({
            access_token: account.access_token!,
          });

          console.log(response.data);

          if (response.data?.access_token) {
            // 백엔드 JWT를 account에 저장 (jwt 콜백에서 사용)
            Object.assign(account, {
              backendJwt: response.data.access_token,
              backendRefreshToken: response.data.refresh_token,
              role: response.data.role,
            });
            return true;
          }

          return false;
        } catch (error) {
          // 404 에러 = 등록되지 않은 사용자 → 회원가입 페이지로
          const { HTTPError } = await import("ky");
          if (error instanceof HTTPError && error.response.status === 404) {
            // 회원가입 페이지로 리디렉션 (Google 정보 유지)
            return "/signup";
          }
          console.error("Google OAuth backend login failed:", error);
          return false;
        }
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
        // Staff Credentials 로그인인 경우
        if (account.provider === "staff-credentials") {
          const staffUser = user as StaffUser;
          return {
            ...token,
            backendJwt: staffUser.accessToken,
            backendRefreshToken: staffUser.backendRefreshToken,
            role: staffUser.role,
            provider: "staff-credentials",
          };
        }

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
