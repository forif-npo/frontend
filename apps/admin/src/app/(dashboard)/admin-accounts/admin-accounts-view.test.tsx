/** @jest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";

jest.mock("@/components/ui/Toast", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock("@/components/ui/ConfirmDialog", () => ({
  confirmDialog: jest.fn(),
}));
jest.mock("@/components/page-header", () => ({ PageHeader: () => null }));
jest.mock("@/components/list/data-table", () => ({
  DataTable: ({
    data,
    renderRowActions,
  }: {
    data: Array<{ user_id: number }>;
    renderRowActions: (row: { user_id: number }) => ReactNode;
  }) => (
    <>
      {data.map((row) => (
        <div key={row.user_id}>{renderRowActions(row)}</div>
      ))}
    </>
  ),
}));
jest.mock("@/components/list/dropdown-menu", () => ({
  DropdownMenuItem: ({
    children,
    onSelect,
    disabled,
  }: {
    children: ReactNode;
    onSelect?: () => void;
    disabled?: boolean;
  }) => (
    <button disabled={disabled} onClick={onSelect}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => null,
}));
jest.mock("@/components/list/offset-pagination", () => ({
  OffsetPagination: () => null,
}));
jest.mock("@/components/list/search-bar", () => ({ SearchBar: () => null }));
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <>{children}</> : null,
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
jest.mock("@/components/ui/input", () => ({
  Input: (props: ComponentProps<"input">) => <input {...props} />,
}));
jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: ComponentProps<"label">) => (
    <label {...props}>{children}</label>
  ),
}));
jest.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: () => null,
}));
jest.mock("@core/utils/api-client", () => ({ handleApiError: jest.fn() }));
jest.mock("./api", () => ({
  getAdminAccounts: jest.fn(async () => ({
    content: [
      {
        user_id: 20260002,
        name: "운영진",
        department: "기획팀",
        phone_num: null,
        affiliation: "운영진",
        authority_affiliation: "운영진",
      },
    ],
    total_elements: 1,
    total_pages: 1,
  })),
  getCurrentTeamNames: jest.fn(async () => []),
  createAdminAccount: jest.fn(),
  updateAdminAccount: jest.fn(),
  deleteAdminAccount: jest.fn(),
  delegatePresidency: jest.fn(),
}));

import { AdminAccountsView } from "./admin-accounts-view";

describe("AdminAccountsView", () => {
  it("shows disabled delegation and password reset controls to the upcoming president", async () => {
    render(
      <AdminAccountsView
        myAffiliation="회장"
        isIncumbentPresident={false}
        myUserId={20260001}
      />,
    );

    expect(
      (
        (await screen.findByRole("button", {
          name: "회장 위임",
        })) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "부회장 임명" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "수정" }));
    expect(
      (screen.getByLabelText("새 비밀번호 (선택)") as HTMLInputElement)
        .disabled,
    ).toBe(true);
  });
});
