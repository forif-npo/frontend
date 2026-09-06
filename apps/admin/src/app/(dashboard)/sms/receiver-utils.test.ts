import { describe, expect, it } from "@jest/globals";

import {
  extractPhoneNumber,
  getUniqueReceiverPhoneNumbers,
} from "./receiver-utils";

describe("getUniqueReceiverPhoneNumbers", () => {
  it("removes duplicate phone numbers after extracting digits", () => {
    expect(
      getUniqueReceiverPhoneNumbers(
        "010-1111-2222\n01011112222\n김포리, 010-3333-4444, 컴퓨터소프트웨어학부",
      ),
    ).toEqual(["01011112222", "01033334444"]);
  });

  it("extracts a phone number from a receiver list line", () => {
    expect(
      extractPhoneNumber("김포리, 010-1111-2222, 컴퓨터소프트웨어학부"),
    ).toBe("01011112222");
  });
});
