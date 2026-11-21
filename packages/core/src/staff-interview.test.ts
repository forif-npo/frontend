import { describe, expect, it } from "@jest/globals";
import {
  formatInterviewDate,
  formatInterviewTime,
  interviewSlotKey,
  interviewSlotStarts,
  interviewSlotsInRange,
  isHourStart,
  outOfRangeSlots,
  parseInterviewSlotKey,
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

describe("interviewSlotStarts", () => {
  it("30분이면 09:00부터 21:30까지 26칸을 만든다", () => {
    const starts = interviewSlotStarts(plan);

    expect(starts).toHaveLength(26);
    expect(starts[0]).toBe(9 * 60);
    expect(starts[1]).toBe(9 * 60 + 30);
    expect(starts.at(-1)).toBe(21 * 60 + 30);
  });

  it("칸 길이를 바꾸면 칸 수가 바뀐다", () => {
    expect(interviewSlotStarts({ ...plan, slot_minutes: 60 })).toHaveLength(13);
    expect(interviewSlotStarts({ ...plan, slot_minutes: 15 })).toHaveLength(52);
  });

  it("end_hour에 시작하는 칸은 만들지 않는다", () => {
    expect(interviewSlotStarts(plan)).not.toContain(22 * 60);
  });
});

describe("formatInterviewTime", () => {
  it("정각과 30분을 구분해 표기한다", () => {
    expect(formatInterviewTime(0)).toBe("오전 12시");
    expect(formatInterviewTime(9 * 60)).toBe("오전 9시");
    expect(formatInterviewTime(9 * 60 + 30)).toBe("오전 9:30");
    expect(formatInterviewTime(12 * 60)).toBe("오후 12시");
    expect(formatInterviewTime(21 * 60 + 30)).toBe("오후 9:30");
  });
});

describe("isHourStart", () => {
  it("정각만 눈금을 붙인다", () => {
    expect(isHourStart(9 * 60)).toBe(true);
    expect(isHourStart(9 * 60 + 30)).toBe(false);
  });
});

describe("formatInterviewDate", () => {
  it("월/일과 요일을 나눠 준다", () => {
    expect(formatInterviewDate("2026-12-01")).toEqual({
      label: "12/1",
      weekday: "화",
    });
  });

  it("날짜가 아니면 받은 값을 그대로 쓴다", () => {
    expect(formatInterviewDate("없는날짜")).toEqual({
      label: "없는날짜",
      weekday: "",
    });
  });
});

describe("interviewSlotKey", () => {
  it("키를 만들고 되돌릴 수 있다", () => {
    const key = interviewSlotKey("2026-12-01", 570);

    expect(key).toBe("2026-12-01T0570");
    expect(parseInterviewSlotKey(key)).toEqual({
      date: "2026-12-01",
      start_minute: 570,
    });
  });

  it("문자열 정렬이 날짜·시각 순이 된다", () => {
    const keys = [
      interviewSlotKey("2026-12-02", 9 * 60),
      interviewSlotKey("2026-12-01", 21 * 60 + 30),
      interviewSlotKey("2026-12-01", 9 * 60 + 30),
    ].sort();

    expect(keys).toEqual([
      "2026-12-01T0570",
      "2026-12-01T1290",
      "2026-12-02T0540",
    ]);
  });
});

describe("interviewSlotsInRange", () => {
  const starts = interviewSlotStarts(plan);

  it("드래그가 지나간 사각 영역을 모두 채운다", () => {
    const keys = interviewSlotsInRange(
      plan.dates,
      starts,
      { dateIndex: 0, slotIndex: 0 },
      { dateIndex: 1, slotIndex: 2 },
    );

    expect(keys).toHaveLength(6);
    expect(keys).toContain("2026-12-01T0540");
    expect(keys).toContain("2026-12-02T0600");
  });

  it("거꾸로 끌어도 같은 영역을 만든다", () => {
    const forward = interviewSlotsInRange(
      plan.dates,
      starts,
      { dateIndex: 0, slotIndex: 0 },
      { dateIndex: 2, slotIndex: 3 },
    );
    const backward = interviewSlotsInRange(
      plan.dates,
      starts,
      { dateIndex: 2, slotIndex: 3 },
      { dateIndex: 0, slotIndex: 0 },
    );

    expect(backward.sort()).toEqual(forward.sort());
  });

  it("범위를 벗어난 인덱스는 건너뛴다", () => {
    const keys = interviewSlotsInRange(
      plan.dates,
      starts,
      { dateIndex: 3, slotIndex: 25 },
      { dateIndex: 9, slotIndex: 99 },
    );

    expect(keys).toEqual(["2026-12-04T1290"]);
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
