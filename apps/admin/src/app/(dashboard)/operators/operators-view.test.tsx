/** @jest-environment jsdom */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock("lucide-react", () => ({
  Download: () => null,
  UserPlus: () => null,
}));

jest.mock("xlsx", () => ({
  utils: {},
  writeFile: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@core/utils/api-client", () => ({ handleApiError: jest.fn() }));
jest.mock("@core/utils/phone-number", () => ({
  formatPhoneNumber: (value: string) => value,
}));

jest.mock("@/hooks/use-list-view-filters", () => ({
  useListViewFilters: () => ({
    searchQuery: "",
    setSearchQuery: jest.fn(),
    handleSemesterChange: jest.fn(),
    handleSearch: jest.fn(),
    handlePageChange: jest.fn(),
    handleSortingChange: jest.fn(),
    sorting: [],
  }),
}));

jest.mock("@/components/list/data-table", () => ({
  DataTable: ({
    data,
    renderRowActions,
  }: {
    data: Array<{ userId: number }>;
    renderRowActions: (row: { userId: number }) => ReactNode;
  }) => <>{renderRowActions(data[0] as { userId: number })}</>,
}));

jest.mock("@/components/list/dropdown-menu", () => ({
  DropdownMenuItem: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/list/offset-pagination", () => ({
  OffsetPagination: () => null,
}));
jest.mock("@/components/list/search-bar", () => ({ SearchBar: () => null }));
jest.mock("@/components/list/semester-tabs", () => ({
  SemesterTabs: () => null,
}));
jest.mock("@/components/page-header", () => ({ PageHeader: () => null }));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/components/ui/input", () => ({
  Input: (props: ComponentProps<"input">) => <input {...props} />,
}));
jest.mock("@/components/ui/label", () => ({
  Label: ({ children }: { children: ReactNode }) => <label>{children}</label>,
}));
jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: ComponentProps<"textarea">) => <textarea {...props} />,
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

jest.mock("./add-operator-dialog", () => ({ AddOperatorDialog: () => null }));
jest.mock("./api", () => ({
  deleteOperator: jest.fn(),
  fetchOperators: jest.fn(),
  updateOperator: jest.fn(),
  updateOperatorProfileImage: jest.fn(),
}));
jest.mock("./columns", () => ({ columns: [] }));

import { OperatorsView } from "./operators-view";

describe("OperatorsView", () => {
  it("opens the edit dialog when a regular operator edits their own row", () => {
    render(
      <OperatorsView
        initialData={[
          {
            id: 1,
            userId: 20260001,
            name: "홍길동",
            title: "팀원",
            department: "개발팀",
            phoneNum: "01011112222",
            profImgUrl: "",
            introTag: "백엔드",
            selfIntro: "안녕하세요.",
            graduateYear: 2027,
            actYear: 2026,
            actSemester: 2,
          },
        ]}
        currentSemester="2026-2"
        canManageOperators={false}
        currentUserId={20260001}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "운영진 정보 수정" }));

    expect(
      screen.getByRole("heading", { name: "운영진 정보 수정" }),
    ).not.toBeNull();
    expect(
      (screen.getByDisplayValue("팀원") as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByDisplayValue("백엔드") as HTMLInputElement).disabled,
    ).toBe(false);
  });
});
