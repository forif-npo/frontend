import { describe, expect, it } from "@jest/globals";
import {
  clockTimeToMinute,
  datesInRange,
  formatSlotDate,
  formatSlotRange,
  formatSlotTime,
  isHourStart,
  minuteToClockTime,
  parseTimeSlotKey,
  timeSlotKey,
  timeSlotStarts,
  timeSlotsInRange,
} from "./time-slot";

const range = { startHour: 9, endHour: 22, slotMinutes: 30 };
const dates = ["2026-12-01", "2026-12-02", "2026-12-03", "2026-12-04"];

describe("timeSlotStarts", () => {
  it("30분이면 09:00부터 21:30까지 26칸을 만든다", () => {
    const starts = timeSlotStarts(range);

    expect(starts).toHaveLength(26);
    expect(starts[0]).toBe(9 * 60);
    expect(starts[1]).toBe(9 * 60 + 30);
    expect(starts.at(-1)).toBe(21 * 60 + 30);
  });

  it("칸 길이를 바꾸면 칸 수가 바뀐다", () => {
    expect(timeSlotStarts({ ...range, slotMinutes: 60 })).toHaveLength(13);
    expect(timeSlotStarts({ ...range, slotMinutes: 20 })).toHaveLength(39);
    expect(timeSlotStarts({ ...range, slotMinutes: 15 })).toHaveLength(52);
    expect(timeSlotStarts({ ...range, slotMinutes: 10 })).toHaveLength(78);
  });

  it("끝 시각에 시작하는 칸은 만들지 않는다", () => {
    expect(timeSlotStarts(range)).not.toContain(22 * 60);
  });
});

describe("formatSlotTime", () => {
  it("정각과 정각이 아닌 시각을 구분해 표기한다", () => {
    expect(formatSlotTime(0)).toBe("오전 12시");
    expect(formatSlotTime(9 * 60)).toBe("오전 9시");
    expect(formatSlotTime(9 * 60 + 30)).toBe("오전 9:30");
    expect(formatSlotTime(12 * 60)).toBe("오후 12시");
    expect(formatSlotTime(16 * 60 + 20)).toBe("오후 4:20");
    expect(formatSlotTime(22 * 60)).toBe("오후 10시");
  });
});

describe("isHourStart", () => {
  it("정각만 눈금을 붙인다", () => {
    expect(isHourStart(9 * 60)).toBe(true);
    expect(isHourStart(9 * 60 + 30)).toBe(false);
  });
});

describe("formatSlotDate", () => {
  it("월/일과 요일을 나눠 준다", () => {
    expect(formatSlotDate("2026-12-01")).toEqual({
      label: "12/1",
      weekday: "화",
    });
  });

  it("날짜가 아니면 받은 값을 그대로 쓴다", () => {
    expect(formatSlotDate("없는날짜")).toEqual({
      label: "없는날짜",
      weekday: "",
    });
  });
});

describe("timeSlotKey", () => {
  it("키를 만들고 되돌릴 수 있다", () => {
    const key = timeSlotKey("2026-12-01", 570);

    expect(key).toBe("2026-12-01T0570");
    expect(parseTimeSlotKey(key)).toEqual({
      date: "2026-12-01",
      startMinute: 570,
    });
  });

  it("문자열 정렬이 날짜·시각 순이 된다", () => {
    const keys = [
      timeSlotKey("2026-12-02", 9 * 60),
      timeSlotKey("2026-12-01", 21 * 60 + 30),
      timeSlotKey("2026-12-01", 9 * 60 + 30),
    ].sort();

    expect(keys).toEqual([
      "2026-12-01T0570",
      "2026-12-01T1290",
      "2026-12-02T0540",
    ]);
  });
});

describe("timeSlotsInRange", () => {
  const starts = timeSlotStarts(range);

  it("드래그가 지나간 사각 영역을 모두 채운다", () => {
    const keys = timeSlotsInRange(
      dates,
      starts,
      { dateIndex: 0, slotIndex: 0 },
      { dateIndex: 1, slotIndex: 2 },
    );

    expect(keys).toHaveLength(6);
    expect(keys).toContain("2026-12-01T0540");
    expect(keys).toContain("2026-12-02T0600");
  });

  it("거꾸로 끌어도 같은 영역을 만든다", () => {
    const forward = timeSlotsInRange(
      dates,
      starts,
      { dateIndex: 0, slotIndex: 0 },
      { dateIndex: 2, slotIndex: 3 },
    );
    const backward = timeSlotsInRange(
      dates,
      starts,
      { dateIndex: 2, slotIndex: 3 },
      { dateIndex: 0, slotIndex: 0 },
    );

    expect(backward.sort()).toEqual(forward.sort());
  });

  it("범위를 벗어난 인덱스는 건너뛴다", () => {
    const keys = timeSlotsInRange(
      dates,
      starts,
      { dateIndex: 3, slotIndex: 25 },
      { dateIndex: 9, slotIndex: 99 },
    );

    expect(keys).toEqual(["2026-12-04T1290"]);
  });
});

describe("datesInRange", () => {
  it("시작일과 종료일을 포함해 하루씩 만든다", () => {
    expect(datesInRange("2026-12-01", "2026-12-04")).toEqual(dates);
  });

  it("월과 연을 넘어가도 이어진다", () => {
    expect(datesInRange("2026-12-30", "2027-01-02")).toEqual([
      "2026-12-30",
      "2026-12-31",
      "2027-01-01",
      "2027-01-02",
    ]);
  });

  it("하루짜리 기간도 만든다", () => {
    expect(datesInRange("2026-12-01", "2026-12-01")).toEqual(["2026-12-01"]);
  });

  it("시작이 종료보다 늦거나 형식이 틀리면 빈 목록이다", () => {
    expect(datesInRange("2026-12-04", "2026-12-01")).toEqual([]);
    expect(datesInRange("", "2026-12-01")).toEqual([]);
    expect(datesInRange("2026/12/01", "2026-12-04")).toEqual([]);
  });
});

describe("formatSlotRange", () => {
  it("시작에 칸 길이를 더해 끝 시각을 붙인다", () => {
    expect(formatSlotRange(17 * 60 + 30, 30)).toBe("오후 5:30 - 6:00");
    expect(formatSlotRange(16 * 60 + 20, 20)).toBe("오후 4:20 - 4:40");
    expect(formatSlotRange(9 * 60, 60)).toBe("오전 9:00 - 10:00");
  });

  it("오전에서 오후로 넘어가면 끝에도 오후를 붙인다", () => {
    expect(formatSlotRange(11 * 60 + 30, 30)).toBe("오전 11:30 - 오후 12:00");
  });
});

describe("clockTimeToMinute", () => {
  it("HH:MM을 자정부터의 분으로 바꾼다", () => {
    expect(clockTimeToMinute("00:00")).toBe(0);
    expect(clockTimeToMinute("11:30")).toBe(690);
    expect(clockTimeToMinute("23:59")).toBe(1439);
  });

  it("빈 값이나 범위를 벗어난 값은 null이다", () => {
    expect(clockTimeToMinute("")).toBeNull();
    expect(clockTimeToMinute("9:30")).toBeNull();
    expect(clockTimeToMinute("24:00")).toBeNull();
    expect(clockTimeToMinute("12:60")).toBeNull();
  });
});

describe("minuteToClockTime", () => {
  it("분을 두 자리 HH:MM으로 바꾼다", () => {
    expect(minuteToClockTime(0)).toBe("00:00");
    expect(minuteToClockTime(570)).toBe("09:30");
    expect(minuteToClockTime(1290)).toBe("21:30");
  });

  it("clockTimeToMinute와 왕복한다", () => {
    expect(clockTimeToMinute(minuteToClockTime(735))).toBe(735);
  });
});
