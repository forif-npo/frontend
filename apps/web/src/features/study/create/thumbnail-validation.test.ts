import { describe, expect, it } from "@jest/globals";
import { getThumbnailValidationMessage } from "./thumbnail-validation";

describe("getThumbnailValidationMessage", () => {
  it("accepts jpeg and png files up to 5MB", () => {
    expect(
      getThumbnailValidationMessage({
        type: "image/jpeg",
        size: 5 * 1024 * 1024,
      }),
    ).toBeNull();
    expect(
      getThumbnailValidationMessage({ type: "image/png", size: 1 }),
    ).toBeNull();
  });

  it("keeps the existing unsupported format message", () => {
    expect(getThumbnailValidationMessage({ type: "image/gif", size: 1 })).toBe(
      "jpg, jpeg, png 형식의 이미지만 업로드할 수 있습니다.",
    );
  });

  it("keeps the existing size limit message", () => {
    expect(
      getThumbnailValidationMessage({
        type: "image/png",
        size: 5 * 1024 * 1024 + 1,
      }),
    ).toBe("이미지 파일은 최대 5MB까지 업로드할 수 있습니다.");
  });
});
