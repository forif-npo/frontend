import { delay, http, HttpResponse } from "msw";
import type {
  SignInResponse,
  RefreshTokenResponse,
  LogoutResponse,
  MemberSignInRequest,
  StaffSignInRequest,
} from "@core/types/auth";

const API_BASE_URL = "https://api.forif.org";

// Mock JWT tokens
const mockAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const mockRefreshToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicmVmcmVzaCI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.refreshTokenExample";

// Member Sign In (Google OAuth)
export const memberSignIn = http.post(
  `${API_BASE_URL}/api/v1/users/signin`,
  async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as MemberSignInRequest;
    const { accessToken } = body;

    // Simulate validation
    if (!accessToken) {
      const errorResponse: SignInResponse = {
        timestamp: Date.now(),
        data: null,
        errorCode: "FOR013-401",
        message: "Google OAuth Token이 유효하지 않습니다.",
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    // Simulate email validation (check if it's a Hanyang email)
    // In real scenario, we would decode the Google token
    // For mock purposes, we'll accept any non-empty token
    const isHanyangEmail = true; // Mock: assume token is valid Hanyang email

    if (!isHanyangEmail) {
      const errorResponse: SignInResponse = {
        timestamp: Date.now(),
        data: null,
        errorCode: "FOR001-400",
        message: "한양대 이메일(@hanyang.ac.kr)만 로그인 가능합니다.",
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    // Simulate user not found (uncomment to test)
    // const userExists = false;
    const userExists = true;

    if (!userExists) {
      const errorResponse: SignInResponse = {
        timestamp: Date.now(),
        data: null,
        errorCode: "FOR019-404",
        message: "등록되지 않은 사용자입니다. 먼저 회원가입을 진행해주세요.",
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    // Success response
    const successResponse: SignInResponse = {
      timestamp: Date.now(),
      data: {
        accessToken: mockAccessToken,
        role: "USER",
      },
      errorCode: null,
      message: "Success",
    };

    return HttpResponse.json(successResponse, {
      status: 200,
      headers: {
        "Set-Cookie": `refreshToken=${mockRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`,
      },
    });
  },
);

// Staff Sign In (Mentor/Admin)
export const staffSignIn = http.post(
  `${API_BASE_URL}/api/v1/staff/signin`,
  async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as StaffSignInRequest;
    const { userId, password } = body;

    // Simulate validation
    if (!userId || !password) {
      const errorResponse: SignInResponse = {
        timestamp: Date.now(),
        data: null,
        errorCode: "FOR001-400",
        message: "학번과 비밀번호를 입력해주세요.",
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    // Mock credentials - for testing
    const validStaff = {
      userId: 2021234567,
      password: "securePassword123!",
      role: "MENTOR" as const,
    };

    // Check if user exists
    const staffExists = userId === validStaff.userId;

    if (!staffExists) {
      const errorResponse: SignInResponse = {
        timestamp: Date.now(),
        data: null,
        errorCode: "FOR019-404",
        message: "등록되지 않은 스태프입니다.",
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    // Check password
    const passwordMatch = password === validStaff.password;

    if (!passwordMatch) {
      const errorResponse: SignInResponse = {
        timestamp: Date.now(),
        data: null,
        errorCode: "FOR001-400",
        message: "비밀번호가 일치하지 않습니다.",
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    // Success response
    const successResponse: SignInResponse = {
      timestamp: Date.now(),
      data: {
        accessToken: mockAccessToken,
        role: validStaff.role,
      },
      errorCode: null,
      message: "Success",
    };

    return HttpResponse.json(successResponse, {
      status: 200,
      headers: {
        "Set-Cookie": `refreshToken=${mockRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`,
      },
    });
  },
);

// Refresh Access Token
export const refreshToken = http.post(
  `${API_BASE_URL}/api/v1/users/refresh`,
  async ({ cookies }) => {
    await delay(300);

    const refreshToken = cookies.refreshToken;

    // Check if refresh token exists
    if (!refreshToken) {
      const errorResponse: RefreshTokenResponse = {
        timestamp: Date.now(),
        data: null,
        errorCode: "FOR013-401",
        message: "Refresh Token이 없습니다.",
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    // Validate refresh token (mock validation)
    const isValidToken = refreshToken === mockRefreshToken;

    if (!isValidToken) {
      const errorResponse: RefreshTokenResponse = {
        timestamp: Date.now(),
        data: null,
        errorCode: "FOR001-400",
        message: "유효하지 않거나 만료된 Refresh Token입니다.",
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    // Success response
    const successResponse: RefreshTokenResponse = {
      timestamp: Date.now(),
      data: {
        accessToken: mockAccessToken,
      },
      errorCode: null,
      message: "Success",
    };

    return HttpResponse.json(successResponse, { status: 200 });
  },
);

// Logout
export const logout = http.post(
  `${API_BASE_URL}/api/v1/users/logout`,
  async () => {
    await delay(200);

    const successResponse: LogoutResponse = {
      timestamp: Date.now(),
      data: null,
      errorCode: null,
      message: "로그아웃되었습니다.",
    };

    return HttpResponse.json(successResponse, {
      status: 200,
      headers: {
        "Set-Cookie": `refreshToken=; Path=/; HttpOnly; Secure; Max-Age=0`,
      },
    });
  },
);
