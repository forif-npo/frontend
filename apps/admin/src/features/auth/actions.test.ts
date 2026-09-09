import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/auth", () => ({ signOut: jest.fn() }));

import { signOut } from "@/auth";
import { signOutAction } from "./actions";

describe("signOutAction", () => {
  it("keeps the operator sign-out redirect destination", async () => {
    await signOutAction();

    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/signin" });
  });
});
