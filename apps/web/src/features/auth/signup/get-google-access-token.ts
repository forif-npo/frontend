import { env } from "@/env";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export const getGoogleAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = await getToken({
    req: new Request("http://localhost", {
      headers: {
        cookie: cookieStore.toString(),
      },
    }),
    secret: env.AUTH_SECRET,
    secureCookie: process.env.NEXTAUTH_URL?.startsWith("https://"),
  });

  return typeof token?.googleAccessToken === "string"
    ? token.googleAccessToken
    : null;
};
