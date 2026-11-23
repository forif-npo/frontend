/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { StaffApplicationDetail } from "@core/types/staff-recruitment";

const push = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
jest.mock("./api", () => ({ getMyStaffApplication: jest.fn() }));
jest.mock("./application-error", () => ({
  getStaffApplicationErrorInfo: jest.fn(),
}));
jest.mock("@ui/components/client", () => ({
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  AlertModal: ({
    isOpen,
    description,
    confirmLabel,
    onConfirm,
    onClose,
  }: {
    isOpen: boolean;
    description: ReactNode;
    confirmLabel?: string;
    onConfirm?: () => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div role="dialog">
        <p>{description}</p>
        <button
          type="button"
          onClick={() => {
            onConfirm?.();
            onClose();
          }}
        >
          {confirmLabel ?? "확인"}
        </button>
      </div>
    ) : null,
}));

import { getMyStaffApplication } from "./api";
import { getStaffApplicationErrorInfo } from "./application-error";
import { StaffApplicationEntryButton } from "./StaffApplicationEntryButton";

describe("StaffApplicationEntryButton", () => {
  beforeEach(() => {
    push.mockClear();
    jest.mocked(getMyStaffApplication).mockReset();
    jest.mocked(getStaffApplicationErrorInfo).mockReset();
  });

  it("shows a modal instead of opening the form when already submitted", async () => {
    jest
      .mocked(getMyStaffApplication)
      .mockResolvedValue({} as StaffApplicationDetail);
    render(<StaffApplicationEntryButton recruitmentId={7} />);

    fireEvent.click(screen.getByRole("button", { name: "지원서 작성" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog.textContent).toContain("이미 지원서를 제출했습니다.");
    expect(push).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "마이페이지에서 확인" }),
    );
    expect(push).toHaveBeenCalledWith(
      "/my?section=staff-applications&recruitment_id=7",
    );
  });

  it("opens the form only when the application does not exist", async () => {
    jest
      .mocked(getMyStaffApplication)
      .mockRejectedValue(new Error("not found"));
    jest.mocked(getStaffApplicationErrorInfo).mockResolvedValue({
      code: "FOR155-404",
      message: "제출한 지원서를 찾을 수 없습니다.",
    });
    render(<StaffApplicationEntryButton recruitmentId={7} />);

    fireEvent.click(screen.getByRole("button", { name: "지원서 작성" }));

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/club/recruit/7/apply"),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
