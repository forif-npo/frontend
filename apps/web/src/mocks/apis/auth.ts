import { delay, http, HttpResponse } from "msw";

/**
 * 부원 회원가입 Mock Handler
 */
export const memberSignUp = http.post(
  "https://api.forif.org/api/v1/users/signup",
  async ({ request }) => {
    await delay(1000);

    const body = (await request.json()) as {
      studentId: number;
      userName: string;
      email: string;
      phoneNum: string;
      department: string;
    };

    // 에러 케이스 시뮬레이션
    if (!body.email.endsWith("@hanyang.ac.kr")) {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR001-400",
          message: "한양대 이메일(@hanyang.ac.kr)만 가입 가능합니다.",
        },
        { status: 400 },
      );
    }

    if (body.studentId === 2021111111) {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR001-400",
          message: "이미 가입된 학번입니다.",
        },
        { status: 400 },
      );
    }

    if (body.email === "duplicate@hanyang.ac.kr") {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR001-400",
          message: "이미 가입된 이메일입니다.",
        },
        { status: 400 },
      );
    }

    // 성공 케이스
    const accessToken = "mock_access_token_" + Date.now();

    // Refresh Token을 HttpOnly 쿠키로 설정
    const response = HttpResponse.json(
      {
        timestamp: Date.now(),
        data: {
          accessToken,
          role: "USER" as const,
        },
        errorCode: null,
        message: "Success",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `refreshToken=mock_refresh_token_${Date.now()}; Path=/; HttpOnly; Secure; Max-Age=2592000`,
        },
      },
    );

    return response;
  },
);

/**
 * 부원 로그인 Mock Handler (Google OAuth)
 *
 * 🔥 테스트 모드: 현재 항상 404를 반환합니다 (회원가입 플로우 테스트용)
 * 로그인 테스트를 하려면 아래 주석을 해제하고 return 404 부분을 주석처리하세요
 */
export const userLogin = http.post(
  "https://api.forif.org/api/v1/users/signin",
  async ({ request }) => {
    await delay(800);

    const body = (await request.json()) as {
      accessToken: string;
    };

    // 에러 케이스: 한양대 이메일이 아닌 경우
    if (body.accessToken === "invalid_google_token") {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR001-400",
          message: "한양대 이메일(@hanyang.ac.kr)만 로그인 가능합니다.",
        },
        { status: 400 },
      );
    }

    // 에러 케이스: 등록되지 않은 사용자
    if (body.accessToken === "unregistered_user_token") {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR019-404",
          message: "등록되지 않은 사용자입니다. 먼저 회원가입을 진행해주세요.",
        },
        { status: 404 },
      );
    }

    // 에러 케이스: 유효하지 않은 Google OAuth Token
    if (body.accessToken === "expired_google_token") {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR013-401",
          message: "Google OAuth Token이 유효하지 않습니다.",
        },
        { status: 401 },
      );
    }

    // 성공 케이스 (기존 회원 로그인)
    const accessToken = "mock_user_jwt_token_" + Date.now();

    return HttpResponse.json(
      {
        timestamp: Date.now(),
        data: {
          accessToken,
          role: "USER" as const,
        },
        errorCode: null,
        message: "Success",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `refreshToken=mock_user_refresh_token_${Date.now()}; Path=/; HttpOnly; Secure; Max-Age=2592000`,
        },
      },
    );
  },
);

/**
 * 스태프(멘토/운영진) 로그인 Mock Handler
 */
export const staffLogin = http.post(
  "https://api.forif.org/api/v1/staff/signin",
  async ({ request }) => {
    await delay(800);

    const body = (await request.json()) as {
      user_id: number;
      password: string;
    };

    // 에러 케이스: 등록되지 않은 스태프
    if (body.user_id === 2021999999) {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR019-404",
          message: "등록되지 않은 스태프입니다.",
        },
        { status: 404 },
      );
    }

    // 에러 케이스: 비밀번호 불일치
    if (body.user_id !== 2021234567 || body.password !== "password123") {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR001-400",
          message: "비밀번호가 일치하지 않습니다.",
        },
        { status: 400 },
      );
    }

    // 성공 케이스
    const access_token = "mock_staff_jwt_token_" + Date.now();
    const role = body.user_id === 2021234567 ? "MENTOR" : "ADMIN";

    return HttpResponse.json(
      {
        timestamp: Date.now(),
        data: {
          access_token,
          role: role as "MENTOR" | "ADMIN",
        },
        errorCode: null,
        message: "Success",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `refreshToken=mock_staff_refresh_token_${Date.now()}; Path=/; HttpOnly; Secure; Max-Age=2592000`,
        },
      },
    );
  },
);

/**
 * @deprecated staffLogin을 사용하세요
 */
export const mentorLogin = staffLogin;

/**
 * 토큰 갱신 Mock Handler
 */
export const refreshToken = http.post(
  "https://api.forif.org/api/v1/users/refresh",
  async ({ cookies }) => {
    await delay(300);

    // Refresh Token 쿠키가 없는 경우
    if (!cookies.refreshToken) {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR013-401",
          message: "Refresh Token이 없습니다.",
        },
        { status: 401 },
      );
    }

    // 유효하지 않거나 만료된 Refresh Token
    if (cookies.refreshToken === "expired_refresh_token") {
      return HttpResponse.json(
        {
          timestamp: Date.now(),
          data: null,
          errorCode: "FOR001-400",
          message: "유효하지 않거나 만료된 Refresh Token입니다.",
        },
        { status: 400 },
      );
    }

    // 성공 케이스
    const access_token = "mock_refreshed_access_token_" + Date.now();

    return HttpResponse.json(
      {
        timestamp: Date.now(),
        data: {
          access_token,
        },
        errorCode: null,
        message: "Success",
      },
      { status: 200 },
    );
  },
);

/**
 * 로그아웃 Mock Handler
 */
export const logout = http.post(
  "https://api.forif.org/api/v1/users/logout",
  async () => {
    await delay(300);

    return HttpResponse.json(
      {
        timestamp: Date.now(),
        data: null,
        errorCode: null,
        message: "로그아웃되었습니다.",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": "refreshToken=; Path=/; HttpOnly; Secure; Max-Age=0",
        },
      },
    );
  },
);
