/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ButtonHTMLAttributes, ReactNode } from "react";

jest.mock("@ui/components/client", () => ({
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@ui/components/server", () => ({
  EmptyState: ({ title }: { title: string }) => <p>{title}</p>,
  InlineLoadingState: ({ message }: { message: string }) => <p>{message}</p>,
  Table: ({ children }: { children: ReactNode }) => <table>{children}</table>,
  TableBody: ({ children }: { children: ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableCell: ({ children, ...props }: { children: ReactNode }) => (
    <td {...props}>{children}</td>
  ),
  TableHead: ({ children, ...props }: { children: ReactNode }) => (
    <th {...props}>{children}</th>
  ),
  TableHeader: ({ children }: { children: ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableRow: ({ children, ...props }: { children: ReactNode }) => (
    <tr {...props}>{children}</tr>
  ),
}));

jest.mock("@/components/ActionConfirmModal", () => ({
  ActionConfirmModal: ({
    isOpen,
    onConfirm,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
  }) => (isOpen ? <button onClick={onConfirm}>확인</button> : null),
}));

jest.mock("@/features/study-manage/api", () => ({
  getAttendance: jest.fn(),
  getMentorConfirmation: jest.fn(),
  updateAttendance: jest.fn(),
}));

import { getAttendance, updateAttendance } from "@/features/study-manage/api";
import { AttendancePanel } from "./AttendancePanel";

const mockedGetAttendance = getAttendance as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: unknown) => void;
};
const mockedUpdateAttendance = updateAttendance as unknown as {
  mockReset: () => void;
};

const attendance = {
  study_id: 10,
  study_name: "React 심화",
  mentees: [
    {
      user_id: 20260001,
      user_name: "김철수",
      department: "컴퓨터소프트웨어학부",
      records: [],
    },
  ],
};

describe("AttendancePanel", () => {
  beforeEach(() => {
    mockedGetAttendance.mockReset();
    mockedUpdateAttendance.mockReset();
  });

  it("shows the empty state after a successful attendance lookup with no mentees", async () => {
    mockedGetAttendance.mockResolvedValue({
      study_id: 10,
      study_name: "React 심화",
      mentees: [],
    });
    render(<AttendancePanel studyId={10} />);

    await screen.findByText("출석을 기록할 멘티가 없습니다");

    expect(getAttendance).toHaveBeenCalledWith(10);
  });

  it("saves a changed attendance cell only after confirmation and refreshes the matrix", async () => {
    mockedGetAttendance.mockResolvedValue(attendance);
    render(<AttendancePanel studyId={10} />);

    await screen.findByText("김철수");
    fireEvent.click(
      screen.getByRole("button", { name: "김철수 1주차 출석 상태 변경" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "저장 (1)" }));
    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() => {
      expect(updateAttendance).toHaveBeenCalledWith(10, [
        { user_id: 20260001, week_num: 1, status: "present" },
      ]);
    });
    await waitFor(() => {
      expect(getAttendance).toHaveBeenCalledTimes(2);
    });
  });
});
