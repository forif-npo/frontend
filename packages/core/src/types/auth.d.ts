// Authentication API Response Types

export type UserRole = "USER" | "MENTOR" | "ADMIN";

// Base API Response
export interface ApiResponse<T = unknown> {
  timestamp: number;
  data: T | null;
  errorCode: string | null;
  message: string;
}

// Sign In Response Data
export interface SignInResponseData {
  accessToken: string;
  role: UserRole;
}

// Refresh Token Response Data
export interface RefreshTokenResponseData {
  accessToken: string;
}

// Sign In Request (Member)
export interface MemberSignInRequest {
  accessToken: string; // Google OAuth Access Token
}

// Sign In Request (Staff)
export interface StaffSignInRequest {
  userId: number; // Student ID
  password: string;
}

// API Response Types
export type SignInResponse = ApiResponse<SignInResponseData>;
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;
export type LogoutResponse = ApiResponse<null>;
