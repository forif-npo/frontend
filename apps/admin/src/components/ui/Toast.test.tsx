/** @jest-environment jsdom */
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Toast, toast } from "./Toast";

describe("Toast", () => {
  beforeEach(() => toast.clear());
  afterEach(() => {
    jest.useRealTimers();
  });

  it("상태를 색에 의존하지 않고 텍스트와 아이콘 의미로 알린다", () => {
    render(<Toast />);

    act(() => {
      toast.success("저장했습니다.");
      toast.error("저장하지 못했습니다.");
    });

    expect(screen.getByRole("status").textContent).toContain("저장했습니다.");
    expect(screen.getByRole("alert").textContent).toContain("저장하지 못했습니다.");
    fireEvent.click(screen.getAllByRole("button", { name: "알림 닫기" })[0]);
    expect(screen.queryByText("저장했습니다.")).toBeNull();
  });

  it("같은 알림을 중복 표시하지 않고 최대 세 개를 유지한다", () => {
    render(<Toast />);

    act(() => {
      toast.info("첫 알림");
      toast.info("첫 알림");
      toast.info("둘째 알림");
      toast.info("셋째 알림");
      toast.info("넷째 알림");
    });

    expect(screen.getAllByRole("status")).toHaveLength(3);
    expect(screen.queryByText("첫 알림")).toBeNull();
  });

  it("일정 시간이 지나면 알림을 닫는다", () => {
    jest.useFakeTimers();
    render(<Toast />);

    act(() => toast.success("저장했습니다."));
    act(() => jest.advanceTimersByTime(5000));

    expect(screen.queryByText("저장했습니다.")).toBeNull();
  });
});
