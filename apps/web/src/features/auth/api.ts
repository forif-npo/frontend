import type {
  ApiResponse,
  RefreshTokenResponse,
  SignUpRequest,
  SignUpResponse,
  UserLoginData,
  UserLoginRequest,
  UserLoginResponse,
} from "@core/types/api";
import { apiClient } from "@core/utils/api-client";

const extractRefreshToken = (setCookie: string | null): string | undefined => {
  if (!setCookie) return undefined;
  const match = setCookie.match(/(?:^|,\s*)refreshToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
};

const withRefreshToken = async <T extends ApiResponse<unknown>>(
  response: Response,
): Promise<T> => {
  const json = (await response.json()) as T;
  const refreshToken = extractRefreshToken(response.headers.get("set-cookie"));

  if (refreshToken && json.data && typeof json.data === "object") {
    Object.assign(json.data, { refresh_token: refreshToken });
  }

  return json;
};

/**
 * 부원 회원가입
 *
 * @param data 회원가입 정보
 * @returns 회원가입 응답 (accessToken, role 포함)
 *
 * @example
 * const response = await memberSignUp({
 *   student_id: 2021234567,
 *   user_name: "홍길동",
 *   access_token: "google-oauth-access-token",
 *   phone_num: "010-1234-5678",
 *   department: "컴퓨터소프트웨어학부"
 * });
 */
export const memberSignUp = async (
  data: SignUpRequest,
): Promise<SignUpResponse> => {
  const response = await apiClient.post("api/v1/users/signup", {
    json: data,
  });

  return await withRefreshToken<SignUpResponse>(response);
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
  const response = await apiClient.post("api/v1/users/signin", {
    json: data,
  });

  return await withRefreshToken<ApiResponse<UserLoginData>>(response);
};

/**
 * 서버에서 보관 중인 refresh token으로 백엔드 access token을 갱신합니다.
 */
export const refreshTokenWithCookie = async (
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post("api/v1/users/refresh", {
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  return await withRefreshToken<RefreshTokenResponse>(response);
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
