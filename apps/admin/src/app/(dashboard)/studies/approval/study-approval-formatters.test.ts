import { describe, expect, it } from "@jest/globals";
import type { AdminStudyDetail } from "../api";
import {
  formatDate,
  formatDateTime,
  formatLocation,
  formatStudyTime,
  getSafeExternalUrl,
  splitPlanContent,
} from "./study-approval-formatters";

const detail = {
  week_day: 3,
  start_time: "19:00",
  end_time: "21:00",
  is_online: false,
  location: "제1공학관",
  location_detail: "101호",
} as AdminStudyDetail;

describe("study approval formatters", () => {
  it("keeps the study schedule and location display format", () => {
    expect(formatStudyTime(detail)).toBe("수요일 19:00 ~ 21:00");
    expect(formatLocation(detail)).toBe("제1공학관 101호");
    expect(formatLocation({ ...detail, is_online: true })).toBe("온라인");
    expect(
      formatStudyTime({
        ...detail,
        week_day: null,
        start_time: null,
        end_time: null,
      }),
    ).toBe("-");
  });

  it("keeps date fallbacks and truncation", () => {
    expect(formatDate("2026-09-02T10:30:00")).toBe("2026-09-02");
    expect(formatDate(null)).toBe("-");
    expect(formatDateTime("2026-09-02T10:30:00")).toBe("2026-09-02 10:30");
    expect(formatDateTime()).toBe("일정 미정");
  });

  it("splits curriculum rows and preserves the empty value fallback", () => {
    expect(splitPlanContent("기초; 렌더링; 테스트")).toEqual([
      "기초",
      "렌더링",
      "테스트",
    ]);
    expect(splitPlanContent(null)).toEqual(["-"]);
    expect(splitPlanContent("  ")).toEqual(["-"]);
  });

  it("allows only http and https reference URLs", () => {
    expect(getSafeExternalUrl("https://forif.org/reference")).toBe(
      "https://forif.org/reference",
    );
    expect(getSafeExternalUrl("javascript:alert(1)")).toBeNull();
    expect(getSafeExternalUrl("/relative/path")).toBeNull();
  });
});
