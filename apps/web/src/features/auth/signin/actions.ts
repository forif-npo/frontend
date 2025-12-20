"use server";

import { auth, signIn, signOut } from "@/auth";
import {
  staffLoginSchema,
  StaffLoginValues,
  SignUpValues,
} from "@core/schemas";
import {
  memberSignUp,
  userLogin,
  staffLogin,
  logout as logoutApi,
} from "@core/auth/api";
import { handleApiError } from "@core/utils/api-client";
import { cookies } from "next/headers";

/**
 * Google OAuth를 통한 부원 로그인
 *
 * 플로우:
 * 1. NextAuth를 통해 Google OAuth 인증
 * 2. Google Access Token을 백엔드로 전송
 * 3. 백엔드에서 Google API로 이메일 검증 후 JWT 발급
 * 4. JWT Access Token을 메모리(전역)에 저장
 * 5. Refresh Token은 HttpOnly 쿠키로 자동 관리
 */
export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

/**
 * Google OAuth 콜백 후 백엔드 로그인 처리
 *
 * @param googleAccessToken - Google OAuth에서 받은 Access Token
 * @returns 백엔드 JWT Access Token과 사용자 역할
 */
export const handleGoogleCallback = async (googleAccessToken: string) => {
  try {
    const response = await userLogin({
      accessToken: googleAccessToken,
    });

    if (response.data?.accessToken) {
      // JWT Access Token을 메모리(전역)에 저장 (클라이언트에서 실행됨)
      // Refresh Token은 HttpOnly 쿠키로 자동 저장됨
      return {
        success: true,
        accessToken: response.data.accessToken,
        role: response.data.role,
      };
    }

    throw new Error("Access Token을 받지 못했습니다.");
  } catch (error) {
    const errorMessage = await handleApiError(error);
    throw new Error(errorMessage);
  }
};

export const signUp = async (data: SignUpValues) => {
  try {
    const response = await memberSignUp({
      studentId: Number(data.id), // string을 number로 변환
      userName: data.name,
      email: data.email,
      phoneNum: data.phoneNumber,
      department: data.department,
    });

    // refreshToken은 HttpOnly 쿠키로 자동 저장됨
    // accessToken은 응답으로 반환하여 클라이언트에서 저장
    return {
      success: true,
      accessToken: response.data?.accessToken,
      role: response.data?.role,
    };
  } catch (error) {
    const errorMessage = await handleApiError(error);
    throw new Error(errorMessage);
  }
};

// /**
//  * 스태프(멘토/운영진) 로그인 Server Action
//  *
//  */
// export const staffSignIn = async (
//   _: {
//     errors: Record<string, { message: string }>;
//     values: StaffLoginValues;
//   },
//   formData: FormData,
// ) => {
//   const values: StaffLoginValues = {
//     userId: String(formData.get("userId") || ""),
//     password: String(formData.get("password") || ""),
//   };

//   const { error: parseError } = staffLoginSchema.safeParse(values);
//   const errors: Record<string, { message: string }> = {};

//   for (const { path, message } of parseError?.issues || []) {
//     errors[path.join(".")] = { message };
//   }

//   if (Object.keys(errors).length > 0) {
//     return {
//       values,
//       errors,
//     };
//   }

//   try {
//     const response = await staffLoginApi({
//       userId: Number(values.userId),
//       password: values.password,
//     });

//     if (response.data?.accessToken) {
//       // MSW 환경에서는 refreshToken 쿠키를 수동으로 설정
//       // (서버 액션에서 API 호출 시 MSW의 Set-Cookie가 브라우저에 전달되지 않음)
//       const cookieStore = await cookies();
//       cookieStore.set("refreshToken", `mock_refresh_token_${Date.now()}`, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         maxAge: 60 * 60 * 24 * 30, // 30일
//         path: "/",
//       });

//       // JWT Access Token을 반환하여 클라이언트에서 저장 및 리디렉션
//       return {
//         values: { userId: "", password: "" },
//         errors: {},
//         accessToken: response.data.accessToken,
//         role: response.data.role,
//         success: true,
//       };
//     }

//     throw new Error("로그인에 실패했습니다.");
//   } catch (error) {
//     const errorMessage = await handleApiError(error);
//     errors["root"] = { message: errorMessage };

//     return {
//       values,
//       errors,
//     };
//   }
// };

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
    // refreshToken 쿠키 삭제 (멘토 로그인 시 수동으로 설정한 쿠키)
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");

    // NextAuth 세션 종료 후 로그인 페이지로 리디렉션
    await signOut({ redirectTo: "/signin" });
  }
};

export { auth as getSession };
