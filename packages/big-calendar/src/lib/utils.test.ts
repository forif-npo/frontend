import { describe, expect, it } from "@jest/globals";
import { cn } from "./utils";

describe("cn", () => {
  it("removes falsy values and resolves conflicting Tailwind utilities", () => {
    expect(cn("px-2", false, "px-4", undefined, "text-sm")).toBe(
      "px-4 text-sm",
    );
  });
});
