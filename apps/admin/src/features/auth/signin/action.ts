"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signInAction(userId: string, password: string) {
  try {
    await signIn("credentials", {
      id: userId,
      password,
      redirect: false, // 클라이언트에서 리다이렉트 처리
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "학번 또는 비밀번호가 올바르지 않습니다." };
    }
    throw error;
  }
}
