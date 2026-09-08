import { describe, expect, it } from "@jest/globals";
import { passwordSchema, signUpSchema } from "./auth";

const validSignUp = {
  email: "member@forif.org",
  id: "2026000001",
  name: "홍길동",
  departmentId: "1",
  phoneNumber: "010-1234-5678",
  serviceTermAgree: true,
  privacyPolicyAgree: true,
};

describe("signUpSchema", () => {
  it("accepts the existing required signup fields", () => {
    expect(signUpSchema.safeParse(validSignUp).success).toBe(true);
  });

  it("requires both mandatory agreements and a hyphenated phone number", () => {
    const result = signUpSchema.safeParse({
      ...validSignUp,
      phoneNumber: "01012345678",
      serviceTermAgree: false,
      privacyPolicyAgree: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ["phoneNumber"] }),
          expect.objectContaining({ path: ["serviceTermAgree"] }),
          expect.objectContaining({ path: ["privacyPolicyAgree"] }),
        ]),
      );
    }
  });
});

describe("passwordSchema", () => {
  it("accepts an 8-20 character password using two character groups", () => {
    expect(passwordSchema.safeParse("password1").success).toBe(true);
    expect(passwordSchema.safeParse("Password!").success).toBe(true);
  });

  it("rejects a one-group or too-short password", () => {
    expect(passwordSchema.safeParse("password").success).toBe(false);
    expect(passwordSchema.safeParse("Pass1!").success).toBe(false);
  });
});
