/**
 * API 공통 응답 타입
 */
export interface ApiResponse<T> {
  timestamp: number;
  data: T | null;
  errorCode: string | null;
  message: string;
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  timestamp: number;
  data: null;
  errorCode: string;
  message: string;
}

/**
 * 회원가입 요청 타입
 */
export interface SignUpRequest {
  studentId: number;
  userName: string;
  email: string;
  phoneNum: string;
  department: string;
}

/**
 * 회원가입 응답 데이터 타입
 */
export interface SignUpData {
  accessToken: string;
  role: "USER" | "MENTOR";
}

/**
 * 회원가입 응답 타입
 */
export type SignUpResponse = ApiResponse<SignUpData>;

/**
 * 부원 로그인 요청 타입
 * Google OAuth Access Token을 백엔드로 전송
 */
export interface UserLoginRequest {
  accessToken: string;
}

/**
 * 부원 로그인 응답 데이터 타입
 */
export interface UserLoginData {
  accessToken: string;
  role: "USER";
}

/**
 * 부원 로그인 응답 타입
 */
export type UserLoginResponse = ApiResponse<UserLoginData>;

/**
 * 스태프(멘토/운영진) 로그인 요청 타입
 */
export interface StaffLoginRequest {
  user_id: number;
  password: string;
}

export interface Staff {
  user_id: number;
  user_name: string;
  email: string;
  phone_num: string;
  department: string;
  img_url: string | null;
  role: "MENTOR" | "ADMIN";
}

/**
 * 스태프 로그인 응답 데이터 타입
 */
export interface StaffLoginData {
  access_token: string;
  role: "MENTOR" | "ADMIN";
}

/**
 * 스태프 로그인 응답 타입
 */
export type StaffLoginResponse = ApiResponse<StaffLoginData>;

/**
 * 토큰 갱신 응답 데이터 타입
 */
export interface RefreshTokenData {
  access_token: string;
}

/**
 * 토큰 갱신 응답 타입
 */
export type RefreshTokenResponse = ApiResponse<RefreshTokenData>;

/**
 * @deprecated 스태프 로그인은 StaffLoginRequest를 사용하세요
 */
export interface MentorLoginRequest {
  student_id: string;
  password: string;
}

/**
 * @deprecated 스태프 로그인은 StaffLoginData를 사용하세요
 */
export interface MentorLoginData {
  access_token: string;
  role: "MENTOR";
}

/**
 * @deprecated 스태프 로그인은 StaffLoginResponse를 사용하세요
 */
export type MentorLoginResponse = ApiResponse<MentorLoginData>;
