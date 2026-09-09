import { describe, expect, it } from "@jest/globals";
import { eventSchema } from "./schemas";

const validEvent = {
  user: "홍길동",
  title: "운영 회의",
  description: "주간 운영 회의",
  startDate: new Date("2026-09-07T00:00:00"),
  startTime: { hour: 10, minute: 0 },
  endDate: new Date("2026-09-07T00:00:00"),
  endTime: { hour: 11, minute: 0 },
  color: "blue" as const,
};

describe("eventSchema", () => {
  it("accepts an event whose end time is after its start time", () => {
    expect(eventSchema.safeParse(validEvent).success).toBe(true);
  });

  it("rejects an event ending at or before its start time", () => {
    const result = eventSchema.safeParse({
      ...validEvent,
      endTime: { hour: 10, minute: 0 },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["startDate"],
            message: "종료 일시는 시작 일시보다 늦어야 합니다.",
          }),
        ]),
      );
    }
  });
});
