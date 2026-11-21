import type { StaffInterviewCard, StaffInterviewSlot, StaffInterviewStatus } from "@core/types/staff-recruitment";
import { formatSlotDate, formatSlotRange } from "@core/time-slot";

/** 보드의 열. 왼쪽에서 오른쪽으로 면접이 진행되는 순서다. */
export const INTERVIEW_COLUMNS: ReadonlyArray<{ status: StaffInterviewStatus; title: string }> = [
  { status: "BEFORE", title: "면접 전" },
  { status: "DONE", title: "면접 완료" },
  { status: "PASSED", title: "합격" },
  { status: "FAILED", title: "불합격" },
];

export function interviewStatusTitle(status: StaffInterviewStatus): string {
  return INTERVIEW_COLUMNS.find((column) => column.status === status)?.title ?? status;
}

function slotOrder(slot: StaffInterviewSlot | null): string {
  // 일정이 없는 카드는 맨 뒤로 보낸다.
  return slot ? `${slot.date}T${String(slot.start_minute).padStart(4, "0")}` : "9999";
}

/** 열마다 면접 시각이 빠른 순으로 카드를 나눈다. 같은 시각이면 이름순이다. */
export function groupInterviewCards(
  cards: StaffInterviewCard[],
): Record<StaffInterviewStatus, StaffInterviewCard[]> {
  const groups: Record<StaffInterviewStatus, StaffInterviewCard[]> = {
    BEFORE: [],
    DONE: [],
    PASSED: [],
    FAILED: [],
  };
  cards.forEach((card) => groups[card.status].push(card));
  Object.values(groups).forEach((group) =>
    group.sort(
      (a, b) =>
        slotOrder(a.assigned_slot).localeCompare(slotOrder(b.assigned_slot)) ||
        a.applicant_name.localeCompare(b.applicant_name, "ko"),
    ),
  );
  return groups;
}

/** "12/1(월) 오후 5:30 - 6:00". 일정이 없으면 "일정 미정". */
export function formatInterviewSlot(slot: StaffInterviewSlot | null, slotMinutes: number | null): string {
  if (!slot || !slotMinutes) return "일정 미정";
  const { label, weekday } = formatSlotDate(slot.date);
  return `${label}(${weekday}) ${formatSlotRange(slot.start_minute, slotMinutes)}`;
}

/** 카드를 다른 열로 옮긴 결과. 서버 응답을 기다리지 않고 먼저 보여 줄 때 쓴다. */
export function moveInterviewCard(
  cards: StaffInterviewCard[],
  applicationId: number,
  status: StaffInterviewStatus,
): StaffInterviewCard[] {
  return cards.map((card) => (card.application_id === applicationId ? { ...card, status } : card));
}

/**
 * 작업을 들어온 순서대로 하나씩 실행한다. 앞의 작업이 실패해도 다음 작업은 실행된다.
 *
 * 기록지의 저장 요청은 모두 기록지 전체를 돌려준다. 답변 칸을 벗어나며 저장하는 중에
 * 기타 질문을 추가하면 두 요청이 겹치고, 늦게 도착한 응답이 먼저 반영된 내용을 덮어쓴다.
 * 차례로 보내면 마지막 응답이 앞의 변경을 모두 담는다.
 */
export function createSerialQueue() {
  let tail: Promise<unknown> = Promise.resolve();
  return function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = tail.then(task, task);
    tail = result.catch(() => undefined);
    return result;
  };
}
