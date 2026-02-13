import { delay, http, HttpResponse } from "msw";

// Mock user data
const mockUser = {
  studentId: "2023063845",
  name: "표준성",
  department: "정보시스템학과",
  phone: "010-2078-9868",
};

// GET /api/v1/user/me - 사용자 정보 조회
export const getUserInfo = http.get(
  "https://api.forif.org/api/v1/user/me",
  async () => {
    await delay(300);

    return HttpResponse.json({
      success: true,
      data: mockUser,
      error: null,
    });
  },
);
