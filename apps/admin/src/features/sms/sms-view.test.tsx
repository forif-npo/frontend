/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";
import { Controller as mockController } from "react-hook-form";

jest.mock("@/components/page-header", () => ({
  PageHeader: () => null,
}));

jest.mock("@core/utils/api-client", () => ({
  handleApiError: jest.fn(),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: ComponentProps<"input">) => <input {...props} />,
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: ComponentProps<"textarea">) => <textarea {...props} />,
}));

jest.mock("@/components/ui/single-day-picker", () => ({
  SingleDayPicker: ({
    onSelect,
    onTimeChange,
  }: {
    onSelect: (date: Date | undefined) => void;
    onTimeChange?: (time: string) => void;
  }) => (
    <>
      <button
        type="button"
        onClick={() => onSelect(new Date("2026-09-08T00:00:00"))}
      >
        날짜 선택
      </button>
      {onTimeChange && (
        <input
          type="time"
          aria-label="시간 (선택)"
          onChange={(event) => onTimeChange(event.target.value)}
        />
      )}
    </>
  ),
}));

jest.mock("@/components/ui/form", () => {
  return {
    Form: ({ children }: { children: ReactNode }) => <>{children}</>,
    FormControl: ({ children }: { children: ReactNode }) => <>{children}</>,
    FormDescription: ({ children }: { children: ReactNode }) => (
      <p>{children}</p>
    ),
    FormField: mockController,
    FormItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    FormLabel: ({ children }: { children: ReactNode }) => (
      <label>{children}</label>
    ),
    FormMessage: () => null,
  };
});

jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    defaultValue,
    disabled,
    onValueChange,
  }: {
    children: ReactNode;
    defaultValue?: string;
    disabled?: boolean;
    onValueChange: (value: string) => void;
  }) => (
    <select
      value={defaultValue ?? ""}
      disabled={disabled}
      onChange={(event) => onValueChange(event.target.value)}
    >
      <option value="" />
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectItem: ({ children, value }: { children: ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectValue: () => null,
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

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

jest.mock("./alimtalk-preview", () => ({
  AlimTalkPreview: () => null,
}));

jest.mock("./alimtalk-history", () => ({
  AlimTalkHistory: () => null,
}));

jest.mock("./receiver-selector-dialog", () => ({
  ReceiverSelectorDialog: () => null,
}));

jest.mock("./api", () => ({
  getAlimTalkTemplates: jest.fn(),
  sendAlimTalk: jest.fn(),
}));

import { getAlimTalkTemplates, sendAlimTalk } from "./api";
import { SmsView } from "./sms-view";

const template = {
  templateId: "template-1",
  name: "스터디 안내",
  content: "#{이름}님, #{스터디명} 안내입니다.",
  status: "APPROVED",
  messageType: "BA",
  dateCreated: null,
  dateUpdated: null,
  variables: ["#{이름}", "#{스터디명}"],
  buttonLinks: [],
};

const mockedGetTemplates = getAlimTalkTemplates as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: (typeof template)[]) => void;
};
const mockedSendAlimTalk = sendAlimTalk as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: { data: unknown }) => void;
};

describe("SmsView", () => {
  beforeEach(() => {
    mockedGetTemplates.mockReset();
    mockedGetTemplates.mockResolvedValue([template]);
    mockedSendAlimTalk.mockReset();
    mockedSendAlimTalk.mockResolvedValue({
      data: {
        templateId: "template-1",
        totalCount: 1,
        successCount: 1,
        failureCount: 0,
        results: [],
      },
    });
  });

  async function selectTemplateAndReceiver() {
    render(<SmsView />);
    await screen.findByRole("option", { name: "스터디 안내" });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "template-1" },
    });
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "01011112222" },
    });

    return screen.findByPlaceholderText("스터디명을 입력해주세요.");
  }

  it("blocks confirmation when a required template variable is blank", async () => {
    await selectTemplateAndReceiver();

    fireEvent.click(screen.getByRole("button", { name: "알림톡 발송" }));

    expect(
      await screen.findByText("스터디명 항목을 입력해주세요."),
    ).not.toBeNull();
    expect(sendAlimTalk).not.toHaveBeenCalled();
  });

  it("sends normalized recipients and trimmed required variables after confirmation", async () => {
    const studyNameInput = await selectTemplateAndReceiver();
    fireEvent.change(studyNameInput, { target: { value: " React 심화 " } });

    fireEvent.click(screen.getByRole("button", { name: "알림톡 발송" }));
    expect(await screen.findByText("알림톡 발송 확인")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "발송" }));

    await waitFor(() => {
      expect(sendAlimTalk).toHaveBeenCalledWith({
        receivers: ["01011112222"],
        templateCode: "template-1",
        variables: { "#{스터디명}": "React 심화" },
      });
    });
  });

  it("includes a selected time in the schedule variable and omits it when cleared", async () => {
    mockedGetTemplates.mockResolvedValue([
      {
        ...template,
        content: "일시는 #{일시}입니다.",
        variables: ["#{일시}"],
      },
    ]);

    render(<SmsView />);
    await screen.findByRole("option", { name: "스터디 안내" });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "template-1" },
    });
    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "01011112222" },
    });
    fireEvent.click(screen.getByRole("button", { name: "날짜 선택" }));
    fireEvent.change(screen.getByLabelText("시간 (선택)"), {
      target: { value: "19:30" },
    });

    fireEvent.click(screen.getByRole("button", { name: "알림톡 발송" }));
    fireEvent.click(await screen.findByRole("button", { name: "발송" }));

    await waitFor(() => {
      expect(sendAlimTalk).toHaveBeenCalledWith({
        receivers: ["01011112222"],
        templateCode: "template-1",
        variables: { "#{일시}": "2026-09-08 19:30" },
      });
    });

    fireEvent.change(screen.getByLabelText("시간 (선택)"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "알림톡 발송" }));
    fireEvent.click(await screen.findByRole("button", { name: "발송" }));

    await waitFor(() => {
      expect(sendAlimTalk).toHaveBeenLastCalledWith({
        receivers: ["01011112222"],
        templateCode: "template-1",
        variables: { "#{일시}": "2026-09-08" },
      });
    });
  });
});
