import { Member } from "@core/types/member";
import NextAuth, { type NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { env } from "./env";
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
    maxAge: 60 * 60 * 24 * 30, // 7 days
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (
          !!profile?.email_verified &&
          profile.email!.endsWith("@hanyang.ac.kr")
        ) {
          return true;
        }
        return false;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      const member: Member | null = null; // await getUser(token.accessToken as string);
      let isSignUp = false;
      if (member) {
        isSignUp = true;
      }
      session.isSignUp = isSignUp;
      return session;
    },
  },
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
