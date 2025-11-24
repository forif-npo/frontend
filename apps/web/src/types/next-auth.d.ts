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
