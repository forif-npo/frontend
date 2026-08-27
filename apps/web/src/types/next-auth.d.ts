import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string; // 백엔드 JWT
    refreshToken?: string;
    forceRefresh?: boolean;
    isSignUp: boolean;
    error?: string;
    role?: string;
    provider?: string;
  }

  /**
   * Google OAuth 로그인 시 signIn 콜백에서 확장한 Account 타입
   */
  interface ExtendedAccount {
    backendJwt: string;
    backendRefreshToken?: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendJwt?: string; // 백엔드에서 받은 JWT
    backendRefreshToken?: string;
    googleAccessToken?: string; // Google OAuth Access Token (참고용)
    googleRefreshToken?: string;
    role?: string;
    provider?: string;
    error?: string;
  }
}
