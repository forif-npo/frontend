/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";

const mockRefresh = jest.fn();
const mockRouter = { push: jest.fn(), refresh: mockRefresh };
const mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  usePathname: () => "/dues",
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/list/data-table", () => ({
  DataTable: ({
    onRowSelectionChange,
  }: {
    onRowSelectionChange: (value: Record<string, boolean>) => void;
  }) => (
    <button onClick={() => onRowSelectionChange({ "20260001": true })}>
      첫 부원 선택
    </button>
  ),
}));

jest.mock("@/components/list/dropdown-menu", () => ({
  DropdownMenuItem: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/list/offset-pagination", () => ({
  OffsetPagination: () => null,
}));

jest.mock("@/components/list/search-bar", () => ({
  SearchBar: () => null,
}));

jest.mock("@/components/page-header", () => ({
  PageHeader: () => null,
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

jest.mock("./dues-columns", () => ({ duesColumns: [] }));

jest.mock("./api", () => ({
  updateDues: jest.fn(),
  withdrawRegistrations: jest.fn(),
}));

import { updateDues } from "./api";
import { DuesView } from "./dues-view";

const mockedUpdateDues = updateDues as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: undefined) => void;
};

describe("DuesView", () => {
  beforeEach(() => {
    mockRefresh.mockReset();
    mockedUpdateDues.mockReset();
    mockedUpdateDues.mockResolvedValue(undefined);
  });

  it("updates only the selected member when applying the bulk payment action", async () => {
    render(
      <DuesView
        initialData={{
          semester: { actYear: 2026, actSemester: 2, label: "2026-2학기" },
          summary: {
            totalCount: 1,
            duesPaidCount: 0,
            googleFormSubmittedCount: 0,
            completedCount: 0,
          },
          content: [
            {
              userId: 20260001,
              userName: "홍길동",
              department: "컴퓨터소프트웨어학부",
              duesPaid: false,
              googleFormSubmitted: false,
            },
          ],
          totalElements: 1,
          currentPage: 0,
          totalPages: 1,
          pageSize: 20,
        }}
        initialSearch=""
        initialSorting={[]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "첫 부원 선택" }));
    fireEvent.click(screen.getByRole("button", { name: "입금 확인 처리" }));

    await waitFor(() => {
      expect(updateDues).toHaveBeenCalledWith([
        { userId: 20260001, duesPaid: true },
      ]);
    });
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("0명 선택")).not.toBeNull();
  });
});
