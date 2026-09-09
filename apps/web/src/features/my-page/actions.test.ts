import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/features/my-page/api", () => ({
  updateUserPhoneNumber: jest.fn(),
  updateUserProfile: jest.fn(),
}));

import { auth } from "@/auth";
import {
  updateUserPhoneNumber,
  updateUserProfile,
} from "@/features/my-page/api";
import { updateMyProfile } from "./actions";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedUpdateUserPhoneNumber =
  updateUserPhoneNumber as jest.MockedFunction<typeof updateUserPhoneNumber>;
const mockedUpdateUserProfile = updateUserProfile as jest.MockedFunction<
  typeof updateUserProfile
>;

describe("updateMyProfile", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedUpdateUserPhoneNumber.mockReset();
    mockedUpdateUserProfile.mockReset();
  });

  it("rejects unauthenticated updates before calling profile APIs", async () => {
    mockedAuth.mockResolvedValue(null as never);

    await expect(
      updateMyProfile({ phone_num: "010-1234-5678" }),
    ).rejects.toThrow("로그인이 필요합니다.");

    expect(mockedUpdateUserProfile).not.toHaveBeenCalled();
    expect(mockedUpdateUserPhoneNumber).not.toHaveBeenCalled();
  });

  it("keeps the existing profile and phone update payloads", async () => {
    const profile = {
      department_id: 1,
      profile_image: null,
    };
    mockedAuth.mockResolvedValue({ accessToken: "access-token" } as never);

    await updateMyProfile({ profile, phone_num: "010-1234-5678" });

    expect(mockedUpdateUserProfile).toHaveBeenCalledWith(
      profile,
      "access-token",
    );
    expect(mockedUpdateUserPhoneNumber).toHaveBeenCalledWith(
      { phone_num: "010-1234-5678" },
      "access-token",
    );
  });
});
