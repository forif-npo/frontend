import { describe, expect, it } from "@jest/globals";
import {
  interviewSlotRange,
  interviewSlotStarts,
  outOfRangeSlots,
  toInterviewSlotKeys,
  toInterviewSlotRequest,
} from "./staff-interview";
import type { StaffInterviewPlan } from "./types/staff-recruitment";

const plan: StaffInterviewPlan = {
  interview_plan_id: 1,
  recruitment_id: 12,
  dates: ["2026-12-01", "2026-12-02", "2026-12-03", "2026-12-04"],
  start_hour: 9,
  end_hour: 22,
  slot_minutes: 30,
  required: true,
  guide: "면접 가능 시간을 표시해주세요.",
  version: 0,
};

describe("면접 일정 → 시간표 범위", () => {
  it("서버 필드를 시간표가 받는 형태로 바꾼다", () => {
    expect(interviewSlotRange(plan)).toEqual({
      startHour: 9,
      endHour: 22,
      slotMinutes: 30,
    });
  });

  it("칸 시작 시각을 칸 길이대로 만든다", () => {
    expect(interviewSlotStarts(plan)).toHaveLength(26);
    expect(interviewSlotStarts({ ...plan, slot_minutes: 60 })).toHaveLength(13);
  });
});

describe("제출 변환", () => {
  it("선택을 날짜·시각 순으로 정렬해 보낸다", () => {
    const slots = toInterviewSlotRequest(
      new Set(["2026-12-04T1290", "2026-12-01T0570"]),
    );

    expect(slots).toEqual([
      { date: "2026-12-01", start_minute: 570 },
      { date: "2026-12-04", start_minute: 1290 },
    ]);
  });

  it("서버가 준 선택을 화면 상태로 되돌린다", () => {
    const keys = toInterviewSlotKeys([
      { date: "2026-12-01", start_minute: 570 },
    ]);

    expect(keys.has("2026-12-01T0570")).toBe(true);
  });

  it("보낸 값과 되돌린 값이 같다", () => {
    const original = [
      { date: "2026-12-01", start_minute: 540 },
      { date: "2026-12-03", start_minute: 1230 },
    ];

    expect(toInterviewSlotRequest(toInterviewSlotKeys(original))).toEqual(
      original,
    );
  });
});

describe("outOfRangeSlots", () => {
  it("빠진 날짜·범위 밖 시각·칸 경계에 맞지 않는 시각을 찾아낸다", () => {
    const stale = outOfRangeSlots(plan, [
      { date: "2026-12-01", start_minute: 9 * 60 },
      { date: "2026-11-30", start_minute: 10 * 60 },
      { date: "2026-12-02", start_minute: 23 * 60 },
      { date: "2026-12-02", start_minute: 9 * 60 + 10 },
    ]);

    expect(stale).toEqual([
      { date: "2026-11-30", start_minute: 600 },
      { date: "2026-12-02", start_minute: 1380 },
      { date: "2026-12-02", start_minute: 550 },
    ]);
  });
});
