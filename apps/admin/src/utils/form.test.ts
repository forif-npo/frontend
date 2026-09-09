import { describe, expect, it, jest } from "@jest/globals";
import { autoHyphenPhoneNumber } from "./form";

describe("autoHyphenPhoneNumber", () => {
  it.each([
    ["010", "010"],
    ["010123", "010-123"],
    ["0101234567", "010-1234-567"],
    ["010-1234-5678", "010-1234-5678"],
    ["010123456789", "010-1234-5678"],
  ])("formats %s as %s", (input, expected) => {
    const setValue = jest.fn();

    autoHyphenPhoneNumber(
      { target: { value: input } } as React.ChangeEvent<HTMLInputElement>,
      setValue,
    );

    expect(setValue).toHaveBeenCalledWith("phoneNumber", expected);
  });
});
