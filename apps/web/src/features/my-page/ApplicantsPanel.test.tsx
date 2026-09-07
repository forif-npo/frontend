/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ButtonHTMLAttributes, ReactNode } from "react";

jest.mock("@ui/components/client", () => ({
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Pagination: () => null,
  Select: () => null,
}));

jest.mock("@ui/components/server", () => ({
  Badge: ({ label }: { label: string }) => <span>{label}</span>,
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
  TableRow: ({
    children,
    interactive,
    ...props
  }: {
    children: ReactNode;
    interactive?: boolean;
  }) => (
    <tr data-interactive={interactive ? "true" : undefined} {...props}>
      {children}
    </tr>
  ),
}));

jest.mock("@/features/study-manage/api", () => ({
  acceptApplications: jest.fn(),
  getApplicationDetail: jest.fn(),
  getApplicants: jest.fn(),
  rejectApplications: jest.fn(),
}));

jest.mock("@/features/semester/schedule-api", () => ({
  getCurrentSemesterSchedules: jest.fn(),
}));

jest.mock("./ApplicantActionModal", () => ({
  ApplicantActionConfirmModal: () => null,
  ApplicantActionResultModal: ({ result }: { result: { message: string } }) => (
    <p>{result.message}</p>
  ),
  applicantActionLabel: { accept: "승낙", reject: "거절" },
}));

import {
  getApplicationDetail,
  getApplicants,
} from "@/features/study-manage/api";
import { getCurrentSemesterSchedules } from "@/features/semester/schedule-api";
import { ApplicantsPanel } from "./ApplicantsPanel";

const mockedGetApplicants = getApplicants as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: unknown) => void;
};
const mockedGetApplicationDetail = getApplicationDetail as unknown as {
  mockReset: () => void;
  mockRejectedValue: (value: unknown) => void;
};
const mockedGetSchedules = getCurrentSemesterSchedules as unknown as {
  mockReset: () => void;
  mockRejectedValue: (value: unknown) => void;
  mockResolvedValue: (value: unknown) => void;
};

const applicants = {
  total_pages: 1,
  total_elements: 1,
  content: [
    {
      apply_id: 3,
      applier_name: "홍길동",
      department: "컴퓨터소프트웨어학부",
      study_name: "React 심화",
      study_comment: "지원합니다.",
      apply_date: "2026-09-07T00:00:00Z",
      study_status: "대기중",
      priority: 1,
    },
  ],
};

describe("ApplicantsPanel", () => {
  beforeEach(() => {
    mockedGetApplicants.mockReset();
    mockedGetApplicationDetail.mockReset();
    mockedGetSchedules.mockReset();
    mockedGetApplicants.mockResolvedValue(applicants);
    mockedGetSchedules.mockResolvedValue([
      { phase: "MENTEE_REVIEW", open: true },
    ]);
  });

  it("keeps past-semester applications viewable but blocks their approval actions", async () => {
    render(<ApplicantsPanel studyId={10} readOnly />);

    await screen.findByText("홍길동");
    fireEvent.click(screen.getByText("홍길동"));

    const checkbox = screen.getByRole("checkbox", { name: "홍길동 선택" });
    const acceptButton = await screen.findByRole("button", { name: "승낙" });
    expect((checkbox as HTMLInputElement).disabled).toBe(true);
    expect((acceptButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("closes an application detail and reports an error when its full reason fails to load", async () => {
    mockedGetApplicationDetail.mockRejectedValue(new Error("network failure"));
    render(<ApplicantsPanel studyId={10} />);

    await screen.findByText("홍길동");
    fireEvent.click(screen.getByText("홍길동"));

    await waitFor(() => {
      expect(
        screen.getByText("지원 동기를 불러오지 못했습니다. 다시 시도해주세요."),
      ).toBeTruthy();
    });
    expect(getApplicationDetail).toHaveBeenCalledWith(10, 3);
    expect(screen.queryByText("불러오는 중...")).toBeNull();
  });

  it("fails closed when the mentee-review schedule cannot be loaded", async () => {
    mockedGetSchedules.mockRejectedValue(new Error("network failure"));
    render(<ApplicantsPanel studyId={10} />);

    await screen.findByText("홍길동");

    expect(
      (
        (await screen.findByRole("button", {
          name: "선택 승낙",
        })) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
