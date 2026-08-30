"use server";

import { auth, signIn, signOut, unstable_update } from "@/auth";
import { getGoogleAccessToken } from "@/features/auth/signup/get-google-access-token";
import { SignUpValues } from "@core/schemas";
import {
  memberSignUp,
  userLogin,
  logout as logoutApi,
} from "@/features/auth/api";
import { handleApiError } from "@core/utils/api-client";
import { cookies } from "next/headers";

/**
 * Google OAuth를 시작합니다.
 */
const signInWithGoogleRedirect = async (redirectTo: string) => {
  await signIn("google", { redirectTo });
};

export const signInWithGoogle = async () => {
  await signInWithGoogleRedirect("/auth/callback?flow=signin");
};

export const signUpWithGoogle = async () => {
  await signInWithGoogleRedirect("/auth/callback?flow=signup");
};

/**
 * Google OAuth 콜백 후 백엔드 로그인 처리
 *
 * @returns 로그인 완료 여부 또는 실패 사유
 */
export const handleGoogleCallback = async () => {
  const googleAccessToken = await getGoogleAccessToken();
  if (!googleAccessToken) {
    return {
      status: "failed" as const,
      message: "Google 인증 정보가 만료되었습니다. 다시 로그인해주세요.",
    };
  }

  try {
    const response = await userLogin({
      access_token: googleAccessToken,
    });
    if (response.data?.access_token) {
      await unstable_update({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        role: response.data.role,
        provider: "google",
      });

      return { status: "signed_in" as const };
    }

    throw new Error("Access Token을 받지 못했습니다.");
  } catch (error) {
    const { HTTPError } = await import("ky");
    if (error instanceof HTTPError && error.response.status === 404) {
      return { status: "not_registered" as const };
    }

    const errorMessage = await handleApiError(error);
    return { status: "failed" as const, message: errorMessage };
  }
};

export const signUp = async (data: SignUpValues) => {
  try {
    const googleAccessToken = await getGoogleAccessToken();
    if (!googleAccessToken) {
      throw new Error(
        "Google 인증 정보가 만료되었습니다. 다시 로그인해주세요.",
      );
    }

    const response = await memberSignUp({
      student_id: Number(data.id), // string을 number로 변환
      user_name: data.name,
      access_token: googleAccessToken,
      phone_num: data.phoneNumber,
      department: data.department,
    });

    // refreshToken은 HttpOnly 쿠키로 자동 저장됨
    // accessToken은 응답으로 반환하여 클라이언트에서 저장
    if (response.data?.access_token) {
      await unstable_update({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        role: response.data.role,
        provider: "google",
      });
    }

    return {
      success: true,
      accessToken: response.data?.access_token,
      role: response.data?.role,
    };
  } catch (error) {
    const errorMessage = await handleApiError(error);
    throw new Error(errorMessage);
  }
};

/**
 * 로그아웃
 *
 * 1. 백엔드 로그아웃 API 호출 (Refresh Token 쿠키 삭제)
 * 2. refreshToken 쿠키 삭제
 * 3. NextAuth 세션 종료
 * 4. 로그인 페이지로 리디렉션
 *
 * 참고: 메모리의 Access Token은 클라이언트에서 삭제해야 합니다.
 */
export const logout = async () => {
  try {
    // 백엔드 로그아웃 API 호출 (Refresh Token 쿠키 삭제)
    await logoutApi();
  } catch (error) {
    console.error("로그아웃 API 호출 실패:", error);
    // API 실패해도 세션은 종료
  } finally {
    // 이전 로그인 흐름에서 남았을 수 있는 refreshToken 쿠키도 함께 삭제한다.
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");

    // NextAuth 세션 종료 후 로그인 페이지로 리디렉션
    await signOut({ redirectTo: "/signin" });
  }
};

export { auth as getSession };
