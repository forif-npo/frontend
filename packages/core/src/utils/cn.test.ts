import { describe, expect, it } from "@jest/globals";
import { cn } from "./cn";

describe("cn", () => {
  it("removes falsy values and resolves conflicting Tailwind utilities", () => {
    expect(cn("p-2", false, "p-4", undefined, "text-sm")).toBe("p-4 text-sm");
  });
});
