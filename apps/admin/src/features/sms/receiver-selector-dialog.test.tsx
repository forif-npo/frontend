/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";
jest.mock("lucide-react", () => ({ Users: () => null }));
jest.mock("@core/utils/api-client", () => ({
  handleApiError: jest.fn(),
}));
jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
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
jest.mock("@/components/ui/input", () => ({
  Input: (props: ComponentProps<"input">) => <input {...props} />,
}));
jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <select
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectItem: ({ children, value }: { children: ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
}));
jest.mock("./api", () => ({
  getAllReceivers: jest.fn(),
  getReceiverPage: jest.fn(),
}));
import { getReceiverPage } from "./api";
import { ReceiverSelectorDialog } from "./receiver-selector-dialog";

const mockedGetReceiverPage = getReceiverPage as unknown as {
  mockResolvedValue: (value: unknown) => void;
};

describe("ReceiverSelectorDialog", () => {
  it("puts current-semester applicants first and loads them by default", async () => {
    mockedGetReceiverPage.mockResolvedValue({
      receivers: [],
      nextCursor: null,
      hasNext: false,
      totalElements: 0,
    });

    render(
      <ReceiverSelectorDialog
        open
        onOpenChange={jest.fn()}
        onApply={jest.fn()}
      />,
    );

    await screen.findByText("조건에 맞는 부원이 없습니다.");

    const targetSelect = screen.getByRole("combobox") as HTMLSelectElement;
    expect(targetSelect.value).toBe("CURRENT_SEMESTER_APPLICANTS");
    expect(screen.getAllByRole("option")[0]?.textContent).toBe(
      "현재 학기 신청자",
    );
    expect(getReceiverPage).toHaveBeenCalledWith({
      search: "",
      target: "CURRENT_SEMESTER_APPLICANTS",
    });
  });
});
