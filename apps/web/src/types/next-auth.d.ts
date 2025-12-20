import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string; // 백엔드 JWT
    refreshToken: string;
    isSignUp: boolean;
    error?: string;
    role?: string;
    provider?: string;
  }

  /**
   * Staff Credentials 로그인 시 authorize에서 반환하는 사용자 타입
   */
  interface StaffUser {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    role: string;
  }

  /**
   * Google OAuth 로그인 시 signIn 콜백에서 확장한 Account 타입
   */
  interface ExtendedAccount {
    backendJwt: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendJwt?: string; // 백엔드에서 받은 JWT
    googleAccessToken?: string; // Google OAuth Access Token (참고용)
    googleRefreshToken?: string;
    role?: string;
    provider?: string;
    error?: string;
  }
}
