/** @jest-environment jsdom */
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import { ConfirmDialog, confirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("취소와 확인을 구분하고 대기 중인 요청을 순서대로 보여준다", async () => {
    render(<ConfirmDialog />);

    let first!: Promise<boolean>;
    let second!: Promise<boolean>;
    act(() => {
      first = confirmDialog({
        title: "첫 번째 작업",
        description: "첫 번째 작업을 진행할까요?",
        confirmLabel: "진행",
      });
      second = confirmDialog({
        title: "두 번째 작업",
        description: "두 번째 작업을 진행할까요?",
        confirmLabel: "진행",
      });
    });

    expect(screen.getByRole("dialog").textContent).toContain("첫 번째 작업");
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    await expect(first).resolves.toBe(false);

    expect(screen.getByRole("dialog").textContent).toContain("두 번째 작업");
    fireEvent.click(screen.getByRole("button", { name: "진행" }));
    await expect(second).resolves.toBe(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
