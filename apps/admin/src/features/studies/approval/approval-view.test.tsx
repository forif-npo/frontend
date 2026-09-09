/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type {
  ButtonHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
const mockRefresh = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => new URLSearchParams(),
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
    onSelectedRowsChange,
    renderRowActions,
  }: {
    data: unknown[];
    onSelectedRowsChange: (rows: unknown[]) => void;
    renderRowActions: (row: unknown) => ReactNode;
  }) => (
    <div>
      <button onClick={() => onSelectedRowsChange(data)}>테스트 선택</button>
      {data.map((row, index) => (
        <div key={index}>{renderRowActions(row)}</div>
      ))}
    </div>
  ),
}));
jest.mock("@/components/list/dropdown-menu", () => ({
  DropdownMenuItem: ({
    children,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement>) => (
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
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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
jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
}));
jest.mock("./study-approval-detail-dialog", () => ({
  StudyApprovalDetailDialog: () => null,
}));
jest.mock("../api", () => ({
  approveStudy: jest.fn(),
  fetchStudyDetail: jest.fn(),
  rejectStudy: jest.fn(),
}));
jest.mock("@core/utils/api-client", () => ({ handleApiError: jest.fn() }));
import { handleApiError } from "@core/utils/api-client";
import { approveStudy, fetchStudyDetail, rejectStudy } from "../api";
const mockedRejectStudy = rejectStudy as unknown as {
  mockReset: () => void;
};
import { ApprovalView } from "./approval-view";

const mockedApproveStudy = approveStudy as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => unknown;
  mockRejectedValueOnce: (value: unknown) => unknown;
};
const mockedFetchStudyDetail = fetchStudyDetail as unknown as {
  mockReset: () => void;
  mockRejectedValue: (value: unknown) => void;
};
const mockedHandleApiError = handleApiError as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: string) => void;
};

const studies = [
  {
    id: 10,
    study_name: "React 심화",
    primary_mentor_name: "홍길동",
    secondary_mentor_name: null,
    tags: ["React"],
    one_liner: "React를 학습합니다.",
    mentee_count: 0,
    has_applications: false,
    recruit_status: "APPLICABLE" as const,
    week_day: 1,
    difficulty: "NORMAL" as const,
    study_status: "PENDING" as const,
    reject_reason: null,
    autonomous_study: false,
    created_at: "2026-09-07T00:00:00Z",
  },
  {
    id: 20,
    study_name: "TypeScript 심화",
    primary_mentor_name: "김철수",
    secondary_mentor_name: null,
    tags: ["TypeScript"],
    one_liner: "TypeScript를 학습합니다.",
    mentee_count: 0,
    has_applications: false,
    recruit_status: "APPLICABLE" as const,
    week_day: 2,
    difficulty: "NORMAL" as const,
    study_status: "PENDING" as const,
    reject_reason: null,
    autonomous_study: false,
    created_at: "2026-09-07T00:00:00Z",
  },
];

function renderApprovalView(includeProcessed = false) {
  return render(
    <ApprovalView
      initialData={studies}
      currentSemester="26-2"
      includeProcessed={includeProcessed}
    />,
  );
}

describe("ApprovalView", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => undefined);
    mockRefresh.mockReset();
    mockPush.mockReset();
    mockedApproveStudy.mockReset();
    mockedFetchStudyDetail.mockReset();
    mockedRejectStudy.mockReset();
    mockedHandleApiError.mockReset();
    mockedHandleApiError.mockResolvedValue("서버 오류");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("refreshes and reports a partial failure after batch approval", async () => {
    mockedApproveStudy.mockResolvedValueOnce(undefined);
    mockedApproveStudy.mockRejectedValueOnce(new Error("network failure"));
    renderApprovalView();

    fireEvent.click(screen.getByRole("button", { name: "테스트 선택" }));
    fireEvent.click(screen.getByRole("button", { name: "선택 승낙" }));

    await waitFor(() => {
      expect(approveStudy).toHaveBeenCalledWith(10);
      expect(approveStudy).toHaveBeenCalledWith(20);
    });
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(
      "일부 요청을 처리하지 못했습니다. 서버 오류",
    );
  });

  it("does not submit a rejection without a reason", () => {
    renderApprovalView();

    fireEvent.click(screen.getByRole("button", { name: "반려" }));

    expect(window.alert).toHaveBeenCalledWith("반려 사유를 입력해주세요.");
    expect(rejectStudy).not.toHaveBeenCalled();
  });

  it("disables batch approval when processed studies are included", () => {
    renderApprovalView(true);

    fireEvent.click(screen.getByRole("button", { name: "테스트 선택" }));

    expect(
      (
        screen.getByRole("button", {
          name: "선택 승낙",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
  it("reports a detail-loading failure without submitting an approval", async () => {
    mockedFetchStudyDetail.mockRejectedValue(new Error("network failure"));
    renderApprovalView();

    fireEvent.click(screen.getAllByRole("button", { name: "상세 검토" })[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("서버 오류");
    });
    expect(approveStudy).not.toHaveBeenCalled();
  });
});
