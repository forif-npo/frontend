import { describe, expect, it } from "@jest/globals";
import {
  formatRecruitmentPeriod,
  recruitmentStatusMessage,
} from "./presentation";

describe("staff recruitment presentation", () => {
  it("formats an offset timestamp in the contract timezone", () => {
    expect(
      formatRecruitmentPeriod(
        "2026-12-01T09:00:00+09:00",
        "2026-12-15T18:00:00+09:00",
      ),
    ).toContain("12월 1일");
  });

  it("uses the server unavailable reason before a client-derived message", () => {
    expect(
      recruitmentStatusMessage("OPEN", "정회원만 지원할 수 있습니다."),
    ).toBe("정회원만 지원할 수 있습니다.");
  });

  it("keeps canceled and closed copy distinct", () => {
    expect(recruitmentStatusMessage("CANCELED", null)).toContain("취소");
    expect(recruitmentStatusMessage("CLOSED", null)).toContain("마감");
  });
});
