import { Member } from "@core/types/member";
import NextAuth, { type NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "./env";
const result = NextAuth({
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        // const pwHash = saltAndHashPassword(credentials.password)
        // user = await getUserFromDb(credentials.email, pwHash)
        user = {
          email: credentials.email,
          id: "admin-id",
          name: "Admin User",
          department: "Administration",
          phoneNumber: "010-1234-5678",
        } as Member;

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
  trustHost: true, // Trust the host to avoid issues with custom domains
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 7 days
  },
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
