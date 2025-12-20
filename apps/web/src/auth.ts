import { Member } from "@core/types/member";
import NextAuth, { type NextAuthResult } from "next-auth";
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
