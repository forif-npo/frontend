import { describe, expect, it } from "@jest/globals";
import type { StaffInterviewCard } from "@core/types/staff-recruitment";
import {
  createSerialQueue,
  formatInterviewSlot,
  groupInterviewCards,
  interviewStatusTitle,
  moveInterviewCard,
  passDepartmentOptions,
} from "./interview-board";

function card(overrides: Partial<StaffInterviewCard>): StaffInterviewCard {
  return {
    application_id: 1,
    applicant_name: "가",
    assigned_slot: null,
    first_department: null,
    second_department: null,
    status: "BEFORE",
    passed_department: null,
    ...overrides,
  };
}

describe("interview-board", () => {
  it("열마다 면접 시각이 빠른 순으로 나누고 일정 없는 카드는 뒤에 둔다", () => {
    const groups = groupInterviewCards([
      card({ application_id: 1, applicant_name: "다", assigned_slot: null }),
      card({ application_id: 2, applicant_name: "나", assigned_slot: { date: "2026-12-02", start_minute: 540 } }),
      card({ application_id: 3, applicant_name: "가", assigned_slot: { date: "2026-12-01", start_minute: 1050 } }),
      card({ application_id: 4, status: "PASSED" }),
    ]);

    expect(groups.BEFORE.map((item) => item.application_id)).toEqual([3, 2, 1]);
    expect(groups.PASSED.map((item) => item.application_id)).toEqual([4]);
    expect(groups.DONE).toEqual([]);
    expect(groups.FAILED).toEqual([]);
  });

  it("같은 시각이면 이름순이다", () => {
    const slot = { date: "2026-12-01", start_minute: 600 };
    const groups = groupInterviewCards([
      card({ application_id: 1, applicant_name: "하", assigned_slot: slot }),
      card({ application_id: 2, applicant_name: "가", assigned_slot: slot }),
    ]);

    expect(groups.BEFORE.map((item) => item.applicant_name)).toEqual(["가", "하"]);
  });

  it("면접 시각을 칸 길이만큼의 범위로 보여 준다", () => {
    expect(formatInterviewSlot({ date: "2026-12-01", start_minute: 1050 }, 30)).toBe(
      "12/1(화) 오후 5:30 - 6:00",
    );
    expect(formatInterviewSlot(null, 30)).toBe("일정 미정");
    expect(formatInterviewSlot({ date: "2026-12-01", start_minute: 1050 }, null)).toBe("일정 미정");
  });

  it("옮긴 카드만 상태가 바뀐다", () => {
    const cards = [card({ application_id: 1 }), card({ application_id: 2 })];

    const moved = moveInterviewCard(cards, 2, "DONE");

    expect(moved.map((item) => item.status)).toEqual(["BEFORE", "DONE"]);
    expect(cards[1]!.status).toBe("BEFORE");
  });

  it("상태 이름을 열 제목으로 바꾼다", () => {
    expect(interviewStatusTitle("DONE")).toBe("면접 완료");
    expect(interviewStatusTitle("FAILED")).toBe("불합격");
  });
});

describe("createSerialQueue", () => {
  it("앞의 작업이 끝난 뒤에 다음 작업을 시작한다", async () => {
    const enqueue = createSerialQueue();
    const log: string[] = [];
    let finishFirst: () => void = () => undefined;

    const first = enqueue(
      () =>
        new Promise<void>((resolve) => {
          log.push("first:start");
          finishFirst = () => {
            log.push("first:end");
            resolve();
          };
        }),
    );
    const second = enqueue(async () => {
      log.push("second:start");
    });

    await Promise.resolve();
    expect(log).toEqual(["first:start"]);
    finishFirst();
    await Promise.all([first, second]);
    expect(log).toEqual(["first:start", "first:end", "second:start"]);
  });

  it("앞의 작업이 실패해도 다음 작업은 실행하고 실패는 그 작업에만 돌려준다", async () => {
    const enqueue = createSerialQueue();

    const failed = enqueue(() => Promise.reject(new Error("boom")));
    const next = enqueue(() => Promise.resolve("ok"));

    await expect(failed).rejects.toThrow("boom");
    await expect(next).resolves.toBe("ok");
  });
});

describe("passDepartmentOptions", () => {
  it("지원자가 고른 부서를 1지망, 2지망 순서로 돌려준다", () => {
    expect(
      passDepartmentOptions({
        first_department: { department_id: 31, department_name: "SW팀", questions: [] },
        second_department: { department_id: 32, department_name: "기획팀", questions: [] },
      }),
    ).toEqual([
      { department_id: 31, department_name: "SW팀", priority: 1 },
      { department_id: 32, department_name: "기획팀", priority: 2 },
    ]);
  });

  it("지망이 하나면 하나만 돌려준다", () => {
    expect(
      passDepartmentOptions({
        first_department: { department_id: 33, department_name: "디자인팀", questions: [] },
        second_department: null,
      }),
    ).toEqual([{ department_id: 33, department_name: "디자인팀", priority: 1 }]);
  });
});
