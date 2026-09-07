import { describe, expect, it } from "@jest/globals";

import { safeImageSrc } from "./image";

describe("safeImageSrc", () => {
  it.each([
    ["/images/logo.png", "/images/logo.png"],
    [" https://cdn.forif.org/image.png ", "https://cdn.forif.org/image.png"],
    ["http://localhost:3000/image.png", "http://localhost:3000/image.png"],
    ["", null],
    ["images/logo.png", null],
    ["javascript:alert(1)", null],
    ["ftp://forif.org/image.png", null],
  ])("returns %s as %s", (value, expected) => {
    expect(safeImageSrc(value)).toBe(expected);
  });
});
