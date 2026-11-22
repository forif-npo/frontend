/** @jest-environment jsdom */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import type { StaffInterviewPlan } from "@core/types/staff-recruitment";
import { InterviewAvailabilityGrid } from "./InterviewAvailabilityGrid";

const plan: StaffInterviewPlan = {
  interview_plan_id: 1,
  recruitment_id: 7,
  dates: ["2026-12-01", "2026-12-02", "2026-12-03", "2026-12-04"],
  start_hour: 9,
  end_hour: 22,
  slot_minutes: 30,
  required: true,
  guide: "면접 가능 시간을 표시해주세요.",
  version: 0,
};

describe("InterviewAvailabilityGrid", () => {
  let onChange: jest.Mock;

  beforeEach(() => {
    onChange = jest.fn();
  });

  function renderGrid(value: Set<string> = new Set()) {
    return render(
      <InterviewAvailabilityGrid
        plan={plan}
        value={value}
        onChange={onChange as unknown as (next: Set<string>) => void}
      />,
    );
  }

  it("후보 날짜마다 칸 길이만큼 나눈 칸을 그린다", () => {
    renderGrid();

    // 9시부터 21:30까지 26칸 × 날짜 4개
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(104);
    expect(screen.getByRole("button", { name: "12/1 오전 9시" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "12/1 오전 9:30" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "12/4 오후 9:30" })).toBeTruthy();
  });

  it("칸 길이를 1시간으로 바꾸면 칸 수가 줄어든다", () => {
    render(
      <InterviewAvailabilityGrid
        plan={{ ...plan, slot_minutes: 60 }}
        value={new Set()}
        onChange={onChange as unknown as (next: Set<string>) => void}
      />,
    );

    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(52);
    expect(screen.queryByRole("button", { name: "12/1 오전 9:30" })).toBeNull();
  });

  it("맨 아래에 끝 시각 눈금을 붙인다", () => {
    renderGrid();

    // 21:30 칸의 끝이자 수집 범위의 끝이다. 칸은 아니고 눈금만 있다.
    expect(screen.getByText("오후 10시")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "12/1 오후 10시" })).toBeNull();
  });

  it("22시로 시작하는 칸은 없다", () => {
    renderGrid();

    expect(screen.queryByRole("button", { name: "12/1 오후 10시" })).toBeNull();
  });

  it("칸을 누르면 선택에 더한다", () => {
    renderGrid();

    fireEvent.click(screen.getByRole("button", { name: "12/1 오전 9시" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(Array.from(onChange.mock.calls[0]![0] as Set<string>)).toEqual([
      "2026-12-01T0540",
    ]);
  });

  it("포인터로 한 번 누르면 한 번만 켠다", () => {
    // pointerdown → pointerup → click 이 모두 발생한다.
    // 드래그 커밋과 click 이 각각 토글하면 두 번 뒤집혀 아무 일도 없던 것처럼 보인다.
    renderGrid();
    const cell = screen.getByRole("button", { name: "12/1 오전 9시" });

    fireEvent.pointerDown(cell);
    fireEvent.pointerUp(window);
    fireEvent.click(cell, { detail: 1 });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(Array.from(onChange.mock.calls[0]![0] as Set<string>)).toEqual([
      "2026-12-01T0540",
    ]);
  });

  it("포인터로 이미 고른 칸을 누르면 지운다", () => {
    renderGrid(new Set(["2026-12-01T0540"]));
    const cell = screen.getByRole("button", { name: "12/1 오전 9시" });

    fireEvent.pointerDown(cell);
    fireEvent.pointerUp(window);
    fireEvent.click(cell, { detail: 1 });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(Array.from(onChange.mock.calls[0]![0] as Set<string>)).toEqual([]);
  });

  it("이미 고른 칸을 누르면 지운다", () => {
    renderGrid(new Set(["2026-12-01T0540"]));

    expect(
      screen.getByRole("button", { name: "12/1 오전 9시", pressed: true }),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "12/1 오전 9시" }));

    expect(Array.from(onChange.mock.calls[0]![0] as Set<string>)).toEqual([]);
  });

  it("아래 칸만 칠하면 사이 선이 연한 회색 그대로다", () => {
    // 선까지 색이 바뀌면 위 칸까지 칠해진 것처럼 보인다.
    renderGrid(new Set(["2026-12-01T0570"]));

    const lower = screen.getByRole("button", { name: "12/1 오전 9:30" });
    expect(lower.className).toContain("border-t-gray-10");
  });

  it("위아래 두 칸이 모두 칠해지면 사이 선이 정각 선과 같은 회색이 된다", () => {
    renderGrid(new Set(["2026-12-01T0540", "2026-12-01T0570"]));

    const lower = screen.getByRole("button", { name: "12/1 오전 9:30" });
    expect(lower.className).toContain("border-t-gray-30");
  });

  it("날짜 머리글을 누르면 그 날짜를 통째로 고른다", () => {
    renderGrid();

    fireEvent.click(screen.getByRole("button", { name: "12/1 화 전체 선택" }));

    const next = onChange.mock.calls[0]![0] as Set<string>;
    expect(next.size).toBe(26);
    expect(next.has("2026-12-01T0540")).toBe(true);
    expect(next.has("2026-12-02T0540")).toBe(false);
  });

  it("전체 선택은 모든 칸을 고르고, 다시 누르면 비운다", () => {
    const { rerender } = renderGrid();

    fireEvent.click(screen.getByRole("button", { name: "전체 선택" }));
    const all = onChange.mock.calls[0]![0] as Set<string>;
    expect(all.size).toBe(104);

    rerender(
      <InterviewAvailabilityGrid
        plan={plan}
        value={all}
        onChange={onChange as unknown as (next: Set<string>) => void}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "전체 해제" }));
    expect((onChange.mock.calls[1]![0] as Set<string>).size).toBe(0);
  });

  it("오류 문구를 알림으로 전달한다", () => {
    render(
      <InterviewAvailabilityGrid
        plan={plan}
        value={new Set()}
        onChange={onChange as unknown as (next: Set<string>) => void}
        error="면접 가능 시간을 한 칸 이상 선택해주세요."
      />,
    );

    expect(screen.getByRole("alert").textContent).toBe(
      "면접 가능 시간을 한 칸 이상 선택해주세요.",
    );
  });
});
