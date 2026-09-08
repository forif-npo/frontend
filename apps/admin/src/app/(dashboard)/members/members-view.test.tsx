/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ComponentProps, ReactNode } from "react";

const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: mockRefresh }),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("xlsx", () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

jest.mock("@core/utils/api-client", () => ({
  handleApiError: jest.fn(),
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
    renderRowActions: (member: { userId: number }) => ReactNode;
  }) => <>{renderRowActions(data[0])}</>,
}));

jest.mock("@/components/list/dropdown-menu", () => ({
  DropdownMenuItem: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/list/offset-pagination", () => ({
  OffsetPagination: () => null,
}));

jest.mock("@/components/list/search-bar", () => ({
  SearchBar: () => null,
}));

jest.mock("@/components/list/semester-tabs", () => ({
  SemesterTabs: () => null,
}));

jest.mock("@/components/page-header", () => ({
  PageHeader: () => null,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
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

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: ComponentProps<"label">) => (
    <label {...props}>{children}</label>
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

jest.mock("./columns", () => ({ columns: [] }));
jest.mock("./member-history-dialog", () => ({
  MemberHistoryDialog: () => null,
}));
jest.mock("./api", () => ({
  deleteCurrentSemesterMember: jest.fn(),
  fetchMemberHistory: jest.fn(),
  fetchMembers: jest.fn(),
  updateMemberInfo: jest.fn(),
}));

import { toast } from "sonner";
import { deleteCurrentSemesterMember, updateMemberInfo } from "./api";
import { MembersView } from "./members-view";

const member = {
  userId: 20260001,
  departmentId: 1,
  department: "컴퓨터소프트웨어학부",
  userName: "홍길동",
  currentStudyName: "React 심화",
  phoneNum: "01011112222",
  isMentor: false,
  isAdmin: false,
};

const mockedDeleteCurrentSemesterMember =
  deleteCurrentSemesterMember as unknown as {
    mockReset: () => void;
    mockResolvedValue: (value: undefined) => void;
  };
const mockedUpdateMemberInfo = updateMemberInfo as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: undefined) => void;
};
const mockedToastError = toast.error as unknown as { mockReset: () => void };

function renderMembersView(currentSemester = "26-2") {
  return render(
    <MembersView
      initialData={[member]}
      currentSemester={currentSemester as "26-2" | "26-1"}
      activeSemesterLabel="26-2"
      departments={[
        {
          department_id: 1,
          department: "컴퓨터소프트웨어학부",
          college_id: 1,
          college: "공과대학",
        },
        {
          department_id: 2,
          department: "정보시스템학과",
          college_id: 1,
          college: "공과대학",
        },
      ]}
    />,
  );
}

describe("MembersView", () => {
  beforeEach(() => {
    mockRefresh.mockReset();
    mockedDeleteCurrentSemesterMember.mockReset();
    mockedDeleteCurrentSemesterMember.mockResolvedValue(undefined);
    mockedUpdateMemberInfo.mockReset();
    mockedUpdateMemberInfo.mockResolvedValue(undefined);
    mockedToastError.mockReset();
  });

  it("does not request withdrawal when the confirmation is cancelled", () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);
    renderMembersView();

    fireEvent.click(
      screen.getByRole("button", { name: "현재 학기 등록 철회" }),
    );

    expect(window.confirm).toHaveBeenCalledWith(
      "홍길동(20260001)님의 현재 학기 등록을 철회할까요?\n합격 및 신청 이력은 유지되며, 회비 관리 대상에서는 제외됩니다.",
    );
    expect(deleteCurrentSemesterMember).not.toHaveBeenCalled();
  });

  it("withdraws only the row member from the active semester", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    renderMembersView();

    fireEvent.click(
      screen.getByRole("button", { name: "현재 학기 등록 철회" }),
    );

    await waitFor(() => {
      expect(deleteCurrentSemesterMember).toHaveBeenCalledWith(20260001);
    });
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("hides withdrawal for a non-active semester", () => {
    renderMembersView("26-1");

    expect(
      screen.queryByRole("button", { name: "현재 학기 등록 철회" }),
    ).toBeNull();
  });

  it("edits the selected member with a department id and trimmed phone number", async () => {
    renderMembersView();

    fireEvent.click(screen.getByRole("button", { name: "부원 정보 수정" }));
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("1");
    expect(screen.getByDisplayValue("01011112222")).not.toBeNull();

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("전화번호"), {
      target: { value: " 010-3333-4444 " },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(updateMemberInfo).toHaveBeenCalledWith(20260001, {
        departmentId: 2,
        phoneNum: "010-3333-4444",
      });
    });
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("blocks an incomplete member edit before requesting the API", () => {
    renderMembersView();

    fireEvent.click(screen.getByRole("button", { name: "부원 정보 수정" }));
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(updateMemberInfo).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "학과와 전화번호를 모두 입력해주세요.",
    );
  });
});
