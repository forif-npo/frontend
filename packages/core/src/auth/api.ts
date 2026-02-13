import type {
  ApiResponse,
  CertificateParams,
  CertificateResponse,
  RefreshTokenResponse,
  SemesterStudiesResponse,
  SignUpRequest,
  SignUpResponse,
  Staff,
  StaffLoginRequest,
  StaffLoginResponse,
  User,
  UserLoginRequest,
  UserLoginResponse,
} from "../types/api";
import { apiClient } from "../utils/api-client";

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
 * 사용자 정보 조회
 *
 * 로그인한 일반 사용자(부원)의 정보를 조회합니다.
 *
 * @param token 선택적 Bearer 토큰 (제공하지 않으면 자동 주입됨)
 * @returns 사용자 정보
 *
 * @example
 * const response = await getUser();
 */
export const getUser = async (token?: string): Promise<ApiResponse<User>> => {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  return await apiClient.get("api/v1/users/me", options).json();
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

/**
 * 수강 스터디 목록 조회
 *
 * 부원이 현재 수강중인 스터디와 역대 수강한 스터디를 학기별로 그룹화하여 조회합니다.
 *
 * @returns 학기별로 그룹화된 수강 스터디 목록
 *
 * @example
 * ```typescript
 * const response = await getEnrolledStudies();
 * response.data.forEach(semester => {
 *   console.log(`${semester.semester_label} (현재: ${semester.is_current})`);
 *   semester.studies.forEach(study => {
 *     console.log(`  - ${study.study_name} (수강중: ${study.is_current})`);
 *   });
 * });
 * ```
 */
export const getEnrolledStudies = async (): Promise<
  ApiResponse<SemesterStudiesResponse[]>
> => {
  return await apiClient
    .get("api/v1/users/me/studies")
    .json<ApiResponse<SemesterStudiesResponse[]>>();
};

/**
 * 인증서 조회
 *
 * 부원이 수강 완료한 스터디에 대한 인증서 URL을 조회합니다.
 * GCS(Google Cloud Storage)에 저장된 인증서 파일 링크를 반환합니다.
 *
 * @param params - 인증서 조회 파라미터
 * @param params.study_id - 스터디 ID
 * @returns 인증서 URL 및 정보
 *
 * @example
 * ```typescript
 * const response = await getCertificate({ study_id: 123 });
 * console.log(`인증서 URL: ${response.data.certificate_url}`);
 * console.log(`스터디명: ${response.data.study_name}`);
 * console.log(`발급일: ${response.data.issued_at}`);
 *
 * // 인증서 다운로드
 * window.open(response.data.certificate_url, '_blank');
 * ```
 */
export const getCertificate = async (
  params: CertificateParams,
): Promise<ApiResponse<CertificateResponse>> => {
  const searchParams = new URLSearchParams();
  searchParams.append("study_id", params.study_id.toString());

  return await apiClient
    .get(`api/v1/users/me/certificates?${searchParams.toString()}`)
    .json<ApiResponse<CertificateResponse>>();
};
