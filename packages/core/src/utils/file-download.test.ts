import { describe, expect, it } from "@jest/globals";
import { toFileDownloadUrl } from "./file-download";

describe("toFileDownloadUrl", () => {
  it("adds the attachment query only to local file API URLs", () => {
    expect(
      toFileDownloadUrl(
        "https://api.forif.org/api/v1/files/certificate.png?token=abc",
      ),
    ).toBe(
      "https://api.forif.org/api/v1/files/certificate.png?token=abc&download=true",
    );
  });

  it("preserves external URLs, existing download URLs, and non-URL values", () => {
    expect(toFileDownloadUrl("https://example.com/reference.pdf")).toBe(
      "https://example.com/reference.pdf",
    );
    expect(
      toFileDownloadUrl(
        "https://api.forif.org/api/v1/files/a.pdf?download=true",
      ),
    ).toBe("https://api.forif.org/api/v1/files/a.pdf?download=true");
    expect(toFileDownloadUrl("파일 이름.pdf")).toBe("파일 이름.pdf");
  });
});
