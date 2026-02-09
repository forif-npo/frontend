"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signInAction(userId: string, password: string) {
  try {
    await signIn("credentials", {
      id: userId,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    // signIn throws a NEXT_REDIRECT on success — re-throw it so Next.js handles the redirect
    if (error instanceof AuthError) {
      return { ok: false, error: "학번 또는 비밀번호가 올바르지 않습니다." };
    }
    throw error;
  }
}
