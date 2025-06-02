import NextAuth, { type NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google";

const result = NextAuth({
  pages: {
    signIn: "/signin",
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return (
          !!profile?.email_verified && profile.email!.endsWith("@hanyang.ac.kr")
        );
      }
      return true;
    },

    jwt: async ({ token, user, trigger, session }) => {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }
      return token;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnProtected = !nextUrl.pathname.startsWith("/signIn");

      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
