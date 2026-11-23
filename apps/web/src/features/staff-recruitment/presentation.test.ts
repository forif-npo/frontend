import { describe, expect, it } from "@jest/globals";
import { formatRecruitmentDatePeriod, formatRecruitmentPeriod, recruitmentStatusMessage } from "./presentation";

describe("staff recruitment presentation", () => {
  it("formats an offset timestamp in the contract timezone", () => {
    expect(
      formatRecruitmentPeriod(
        "2026-12-01T09:00:00+09:00",
        "2026-12-15T18:00:00+09:00",
      ),
    ).toContain("12월 1일");
  });

  it("shows only Seoul dates in the banner period", () => {
    expect(
      formatRecruitmentDatePeriod(
        "2026-12-01T23:30:00Z",
        "2026-12-15T18:00:00+09:00",
      ),
    ).toBe("12월 2일 ~ 12월 15일");
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
