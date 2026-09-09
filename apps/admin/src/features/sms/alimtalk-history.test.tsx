/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";
jest.mock("lucide-react", () => ({
  Loader2: () => null,
  RefreshCw: () => null,
}));
jest.mock("@core/utils/api-client", () => ({
  handleApiError: jest.fn(),
}));
jest.mock("@core/utils/phone-number", () => ({
  formatPhoneNumber: (phoneNumber: string) => phoneNumber,
}));
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/components/ui/table", () => ({
  Table: ({ children }: { children: ReactNode }) => <table>{children}</table>,
  TableBody: ({ children }: { children: ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableCell: ({ children }: { children: ReactNode }) => <td>{children}</td>,
  TableHead: ({ children }: { children: ReactNode }) => <th>{children}</th>,
  TableHeader: ({ children }: { children: ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableRow: ({ children }: { children: ReactNode }) => <tr>{children}</tr>,
}));
jest.mock("./api", () => ({
  getAlimTalkHistory: jest.fn(),
}));
import { getAlimTalkHistory } from "./api";
import { AlimTalkHistory } from "./alimtalk-history";

const mockedGetAlimTalkHistory = getAlimTalkHistory as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

describe("AlimTalkHistory", () => {
  beforeEach(() => {
    mockedGetAlimTalkHistory.mockReset();
  });

  it("lists history pages and lets the operator load every older page", async () => {
    mockedGetAlimTalkHistory.mockResolvedValueOnce({
      content: [
        {
          messageId: "message-1",
          templateId: "template-1",
          receiver: "01011112222",
          status: "SENT",
          statusCode: "2000",
          createdAt: "2026-09-08T10:00:00",
          processedAt: null,
          reportedAt: null,
          updatedAt: null,
        },
      ],
      nextCursor: "next-key",
      hasNext: true,
    });
    mockedGetAlimTalkHistory.mockResolvedValueOnce({
      content: [
        {
          messageId: "message-2",
          templateId: "deleted-template",
          receiver: "01033334444",
          status: "SENT",
          statusCode: "2000",
          createdAt: "2026-08-08T10:00:00",
          processedAt: null,
          reportedAt: null,
          updatedAt: null,
        },
      ],
      nextCursor: null,
      hasNext: false,
    });

    render(
      <AlimTalkHistory
        templates={[
          {
            templateId: "template-1",
            name: "[26-2] 합격 문자",
            content: "",
            status: "APPROVED",
            messageType: "BA",
            dateCreated: null,
            dateUpdated: null,
            variables: [],
            buttonLinks: [],
          },
        ]}
      />,
    );

    expect(await screen.findByText("[26-2] 합격 문자")).not.toBeNull();
    expect(getAlimTalkHistory).toHaveBeenCalledWith({ cursor: undefined });

    fireEvent.click(screen.getByRole("button", { name: "더 불러오기" }));

    await waitFor(() => {
      expect(getAlimTalkHistory).toHaveBeenLastCalledWith({
        cursor: "next-key",
      });
    });
    expect(await screen.findByText("deleted-template")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "더 불러오기" })).toBeNull();
  });
});
