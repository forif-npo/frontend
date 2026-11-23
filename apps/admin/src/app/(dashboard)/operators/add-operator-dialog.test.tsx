/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";

jest.mock("@/components/ui/Toast", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: ReactNode }) => <>{children}</>,
  DialogContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}));
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/components/ui/input", () => ({
  Input: (props: ComponentProps<"input">) => <input {...props} />,
}));
jest.mock("@/components/ui/label", () => ({
  Label: (props: ComponentProps<"label">) => <label {...props} />,
}));
jest.mock("@/features/semester/api", () => ({ getCurrentSemester: jest.fn() }));
jest.mock("@core/utils/api-client", () => ({ handleApiError: jest.fn() }));
jest.mock("./api", () => ({ addOperator: jest.fn(async () => undefined) }));

import { addOperator } from "./api";
import { AddOperatorDialog } from "./add-operator-dialog";

describe("AddOperatorDialog", () => {
  it("adds the selected next semester president to that semester", async () => {
    render(
      <AddOperatorDialog
        open
        onOpenChange={jest.fn()}
        onAdded={() => undefined}
        targetSemesterLabel="27-1"
        isIncumbentPresident
      />,
    );

    fireEvent.change(screen.getByLabelText("학번"), {
      target: { value: "20260002" },
    });
    fireEvent.change(screen.getByLabelText("소속 팀"), {
      target: { value: "회장단" },
    });
    fireEvent.change(screen.getByLabelText("직책 (선택)"), {
      target: { value: "회장" },
    });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    await waitFor(() =>
      expect(addOperator).toHaveBeenCalledWith({
        user_id: 20260002,
        act_year: 2027,
        act_semester: 1,
        club_department: "회장단",
        user_title: "회장",
      }),
    );
  });

  it("keeps the add button visible but disabled for an upcoming president appointing leadership", () => {
    jest.mocked(addOperator).mockClear();
    render(
      <AddOperatorDialog
        open
        onOpenChange={jest.fn()}
        onAdded={() => undefined}
        targetSemesterLabel="27-1"
        isIncumbentPresident={false}
      />,
    );

    fireEvent.change(screen.getByLabelText("직책 (선택)"), {
      target: { value: "회장" },
    });

    const addButton = screen.getByRole("button", {
      name: "추가",
    }) as HTMLButtonElement;
    expect(addButton.disabled).toBe(true);
    fireEvent.click(addButton);
    expect(addOperator).not.toHaveBeenCalled();
  });

  it("keeps SW team assignment disabled for a non-incumbent", () => {
    jest.mocked(addOperator).mockClear();
    render(
      <AddOperatorDialog
        open
        onOpenChange={jest.fn()}
        onAdded={() => undefined}
        targetSemesterLabel="26-2"
        isIncumbentPresident={false}
      />,
    );

    fireEvent.change(screen.getByLabelText("소속 팀"), {
      target: { value: "SW팀" },
    });

    const addButton = screen.getByRole("button", {
      name: "추가",
    }) as HTMLButtonElement;
    expect(addButton.disabled).toBe(true);
    fireEvent.click(addButton);
    expect(addOperator).not.toHaveBeenCalled();
  });

  it("sends a team name without its display suffix", async () => {
    jest.mocked(addOperator).mockClear();
    render(
      <AddOperatorDialog
        open
        onOpenChange={jest.fn()}
        onAdded={() => undefined}
        targetSemesterLabel="27-1"
        isIncumbentPresident
      />,
    );

    fireEvent.change(screen.getByLabelText("학번"), {
      target: { value: "20260002" },
    });
    fireEvent.change(screen.getByLabelText("소속 팀"), {
      target: { value: "SW팀" },
    });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    await waitFor(() =>
      expect(addOperator).toHaveBeenCalledWith(
        expect.objectContaining({ club_department: "SW" }),
      ),
    );
  });
});
