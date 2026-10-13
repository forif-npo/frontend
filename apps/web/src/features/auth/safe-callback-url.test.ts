import { describe, expect, it } from "@jest/globals";
import { getSafeCallbackUrl } from "./safe-callback-url";

describe("getSafeCallbackUrl", () => {
  it("keeps an internal path with its query", () => {
    expect(getSafeCallbackUrl("/club/recruit/12/apply?from=notice")).toBe(
      "/club/recruit/12/apply?from=notice",
    );
  });

  it.each([
    "https://evil.example/path",
    "//evil.example/path",
    "javascript:alert(1)",
    undefined,
  ])("rejects an external or invalid callback: %s", (value) => {
    expect(getSafeCallbackUrl(value)).toBe("/");
  });
});
