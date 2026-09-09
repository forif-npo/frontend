import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { patch: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import { changeAdminPassword } from "./api";

const mockedPatch = apiClient.patch as unknown as {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

describe("settings api", () => {
  beforeEach(() => {
    mockedPatch.mockReset();
  });

  it("sends the current and new password with the existing snake_case contract", async () => {
    mockedPatch.mockReturnValue({
      json: <T>() => Promise.resolve({ data: null } as T),
    });

    await changeAdminPassword({
      current_password: "Current1!",
      new_password: "NewPassword1!",
    });

    expect(apiClient.patch).toHaveBeenCalledWith("api/v1/staff/me/password", {
      json: {
        current_password: "Current1!",
        new_password: "NewPassword1!",
      },
    });
  });
});
