import { apiClient } from "../utils/api-client";
import type {
  RefreshTokenResponse,
  SignUpRequest,
  SignUpResponse,
  StaffLoginRequest,
  StaffLoginResponse,
  UserLoginRequest,
  UserLoginResponse,
} from "../types/api";

/**
 * 부원 회원가입
 *
 * @param data 회원가입 정보
 * @returns 회원가입 응답 (accessToken, role 포함)
 *
 * @example
 * const response = await memberSignUp({
 *   studentId: 2021234567,
 *   userName: "홍길동",
 *   email: "hong@hanyang.ac.kr",
 *   phoneNum: "010-1234-5678",
 *   department: "컴퓨터소프트웨어학부"
 * });
 */
export const memberSignUp = async (
  data: SignUpRequest,
): Promise<SignUpResponse> => {
  return await apiClient
    .post("api/v1/users/signup", {
      json: data,
    })
    .json<SignUpResponse>();
};

/**
 * 부원 로그인
 *
 * Google OAuth를 통해 받은 Access Token을 백엔드로 전송하여 로그인합니다.
 * Refresh Token은 HttpOnly 쿠키로 자동 설정됩니다.
 *
 * @param data Google OAuth Access Token
 * @returns 로그인 응답 (JWT accessToken, role 포함)
 *
 * @example
 * const response = await userLogin({
 *   accessToken: "google-oauth-access-token"
 * });
 */
export const userLogin = async (
  data: UserLoginRequest,
): Promise<UserLoginResponse> => {
  return await apiClient
    .post("api/v1/users/signin", {
      json: data,
    })
    .json<UserLoginResponse>();
};

/**
 * 스태프(멘토/운영진) 로그인
 *
 * 학번(userId)과 비밀번호로 로그인합니다.
 * Refresh Token은 HttpOnly 쿠키로 자동 설정됩니다.
 *
 * @param data 스태프 로그인 정보 (학번, 비밀번호)
 * @returns 로그인 응답 (JWT accessToken, role 포함)
 *
 * @example
 * const response = await staffLogin({
 *   userId: 2021234567,
 *   password: "password123"
 * });
 */
export const staffLogin = async (
  data: StaffLoginRequest,
): Promise<StaffLoginResponse> => {
  return await apiClient
    .post("api/v1/staff/signin", {
      json: data,
    })
    .json<StaffLoginResponse>();
};

/**
 * 토큰 갱신
 *
 * Refresh Token은 HttpOnly 쿠키로 자동 전송되므로 별도 파라미터 불필요
 *
 * @returns 갱신된 accessToken
 *
 * @example
 * const response = await refreshToken();
 */
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  return await apiClient
    .post("api/v1/users/refresh")
    .json<RefreshTokenResponse>();
};

/**
 * 로그아웃
 *
 * 서버의 Refresh Token 쿠키를 삭제합니다.
 *
 * @example
 * await logout();
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("api/v1/users/logout");
};
