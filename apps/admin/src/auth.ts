import NextAuth, { type NextAuthResult } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
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
    // 만료된 토큰을 남겨두면 API 클라이언트가 갱신에 성공한 것으로 착각하므로 제거한다
    return {
      ...token,
      backendJwt: undefined,
      error: "RefreshAccessTokenError",
    };
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
    return {
      ...token,
      backendJwt: undefined,
      error: "RefreshAccessTokenError",
    };
  }
}

const result = NextAuth({
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        id: { label: "학번", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.id || !credentials?.password) {
          throw new Error("학번과 비밀번호를 입력해주세요.");
        }

        if (
          typeof credentials.id !== "string" ||
          isNaN(Number(credentials.id))
        ) {
          throw new Error("학번은 숫자여야 합니다.");
        }

        if (typeof credentials.password !== "string") {
          throw new Error("비밀번호는 문자열이어야 합니다.");
        }

        try {
          const { staffLogin, getStaff } = await import("@core/auth/api");

          // admin 앱은 운영진 계정 전용 (멘토 계정은 웹 앱에서 로그인)
          const response = await staffLogin({
            user_id: Number(credentials.id),
            password: credentials.password,
            role: "ADMIN",
          });

          if (!response.data?.access_token) {
            throw new Error("로그인에 실패했습니다.");
          }

          const staffRes = await getStaff(response.data.access_token);

          if (!staffRes.data) {
            throw new Error("스태프 정보를 가져올 수 없습니다.");
          }

          const staff = staffRes.data;

          return {
            id: String(staff.user_id),
            email: staff.email,
            name: staff.user_name,
            phoneNum: staff.phone_num,
            department: staff.department,
            imgUrl: staff.img_url,
            access_token: response.data.access_token,
            backendRefreshToken: response.data.refresh_token,
            role: response.data.role,
            affiliation: staff.affiliation ?? null,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("로그인에 실패했습니다.");
        }
      },
    }),
  ],
  trustHost: true,
  // 웹 앱(3000)과 쿠키 이름을 분리한다.
  // 같은 호스트(localhost)에서 두 앱이 기본 쿠키 이름(authjs.session-token)을 공유하면
  // 웹 앱의 멘토/부원 세션이 admin 앱 세션으로 읽히는 문제가 있다.
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-admin.session-token"
          : "admin.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      const sessionUpdate = updateSession as
        | {
            access_token?: string;
            refreshToken?: string;
            forceRefresh?: boolean;
          }
        | undefined;

      if (trigger === "update" && sessionUpdate?.forceRefresh) {
        token = await refreshBackendJwt(token);
      } else if (
        trigger === "update" &&
        (sessionUpdate?.access_token || sessionUpdate?.refreshToken)
      ) {
        token.backendJwt = sessionUpdate.access_token ?? token.backendJwt;
        token.backendRefreshToken =
          sessionUpdate.refreshToken ?? token.backendRefreshToken;
      }

      if (user) {
        token.backendJwt = user.access_token;
        token.backendRefreshToken = user.backendRefreshToken;
        token.role = user.role;
        token.staffId = user.id;
        token.staffName = user.name ?? "";
        token.staffEmail = user.email ?? "";
        token.staffPhoneNum = user.phoneNum ?? "";
        token.staffDepartment = user.department ?? "";
        token.staffImgUrl = user.imgUrl ?? null;
        token.staffAffiliation = user.affiliation ?? null;
      }

      if (shouldRefreshBackendJwt(token)) {
        token = await refreshBackendJwt(token);
      }

      // 토큰은 있지만 staff 정보가 없는 경우 (기존 세션 복원 시) API로 가져옴
      // affiliation은 나중에 추가된 필드라 기존 세션에는 없을 수 있어 함께 백필한다
      if (
        token.backendJwt &&
        (!token.staffName || token.staffAffiliation === undefined)
      ) {
        try {
          const { getStaff } = await import("@core/auth/api");
          const staffRes = await getStaff(token.backendJwt as string);
          if (staffRes.data) {
            const staff = staffRes.data;
            token.staffId = String(staff.user_id);
            token.staffName = staff.user_name;
            token.staffEmail = staff.email;
            token.staffPhoneNum = staff.phone_num;
            token.staffDepartment = staff.department;
            token.staffImgUrl = staff.img_url;
            token.staffAffiliation = staff.affiliation ?? null;
            token.role = staff.role;
          }
        } catch (error) {
          // 401이면 백엔드 토큰이 만료된 것 → 세션 만료 처리
          const { HTTPError } = await import("ky");
          if (error instanceof HTTPError && error.response.status === 401) {
            token.backendJwt = undefined;
            token.error = "RefreshAccessTokenError";
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.access_token = (token.backendJwt as string) || "";
      session.role = token.role as string | undefined;
      session.error = token.error as string | undefined;
      session.user = {
        ...session.user,
        id: (token.staffId as string) || "",
        name: (token.staffName as string) || "",
        email: (token.staffEmail as string) || "",
        phoneNum: (token.staffPhoneNum as string) || "",
        department: (token.staffDepartment as string) || "",
        imgUrl: (token.staffImgUrl as string | null) ?? null,
        role: (token.role as "MENTOR" | "ADMIN") || "MENTOR",
        affiliation: (token.staffAffiliation as string | null) ?? null,
      };
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
