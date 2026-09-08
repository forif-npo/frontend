import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  unstable_update: jest.fn(),
}));

jest.mock("@/features/auth/signup/get-google-access-token", () => ({
  getGoogleAccessToken: jest.fn(),
}));

jest.mock("@/features/auth/api", () => ({
  memberSignUp: jest.fn(),
  userLogin: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("@core/utils/api-client", () => ({
  handleApiError: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { unstable_update } from "@/auth";
import { memberSignUp } from "@/features/auth/api";
import { getGoogleAccessToken } from "@/features/auth/signup/get-google-access-token";
import { signUp } from "./actions";

const mockedGetGoogleAccessToken = getGoogleAccessToken as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: string | null) => void;
};
const mockedMemberSignUp = memberSignUp as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: unknown) => void;
};
const mockedSessionUpdate = unstable_update as unknown as {
  mockReset: () => void;
};

describe("signUp", () => {
  beforeEach(() => {
    mockedGetGoogleAccessToken.mockReset();
    mockedMemberSignUp.mockReset();
    mockedSessionUpdate.mockReset();
  });

  it("sends a digit-only phone number and department id in the Google signup request", async () => {
    mockedGetGoogleAccessToken.mockResolvedValue("google-access-token");
    mockedMemberSignUp.mockResolvedValue({
      data: {
        access_token: "forif-access-token",
        refresh_token: "refresh-token",
        role: "USER",
      },
    });

    await expect(
      signUp({
        email: "user@forif.org",
        id: "20260001",
        name: "홍길동",
        departmentId: "1",
        phoneNumber: "010-1234-5678",
        serviceTermAgree: true,
        privacyPolicyAgree: true,
      }),
    ).resolves.toEqual({
      success: true,
      accessToken: "forif-access-token",
      role: "USER",
    });

    expect(memberSignUp).toHaveBeenCalledWith({
      student_id: 20260001,
      user_name: "홍길동",
      access_token: "google-access-token",
      phone_num: "01012345678",
      department_id: 1,
    });
    expect(unstable_update).toHaveBeenCalledWith({
      accessToken: "forif-access-token",
      refreshToken: "refresh-token",
      role: "USER",
      provider: "google",
    });
  });
});
