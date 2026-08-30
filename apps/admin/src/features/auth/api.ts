import type {
  ApiResponse,
  RefreshTokenResponse,
  Staff,
  StaffLoginRequest,
  StaffLoginResponse,
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
  const response = await apiClient.post("api/v1/staff/signin", {
    json: data,
  });

  return await withRefreshToken<StaffLoginResponse>(response);
};

/**
 * 스태프 정보 조회
 *
 * 로그인한 스태프(멘토/운영진)의 정보를 조회합니다.
 *
 * @param token 선택적 Bearer 토큰 (제공하지 않으면 자동 주입됨)
 * @returns 스태프 정보
 *
 * @example
 * const response = await getStaff();
 */
export const getStaff = async (token?: string): Promise<ApiResponse<Staff>> => {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  return await apiClient.get("api/v1/staff/me", options).json();
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
