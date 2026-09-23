import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as XLSX from "xlsx";
import { apiClient } from "@core/utils/api-client";
import { createReturningMemberWorkbook, fetchReturningMemberRoster, type ReturningMemberRoster } from "./returning-member-roster";

jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn() },
}));

const roster: ReturningMemberRoster = {
  act_year: 2026,
  act_semester: 1,
  members: [
    {
      user_id: "00123456",
      user_name: "가상부원",
      college: "가상대학",
      department: "가상학과",
      phone_num: "01000000000",
    },
    {
      user_id: "910002",
      user_name: "=가상문자열",
      college: null,
      department: "기존학과",
      phone_num: null,
    },
  ],
};

describe("재등록원 명부", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the active-semester endpoint without list filters or pagination", async () => {
    jest.mocked(apiClient.get).mockReturnValue({
      json: async () => ({ data: roster }),
    } as ReturnType<typeof apiClient.get>);
    expect(await fetchReturningMemberRoster()).toEqual(roster);
    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/admin/users/returning-members",
    );
  });

  it("rejects a malformed response instead of exporting an empty roster", async () => {
    jest.mocked(apiClient.get).mockReturnValue({
      json: async () => ({ data: null }),
    } as ReturnType<typeof apiClient.get>);
    await expect(fetchReturningMemberRoster()).rejects.toThrow(
      "재등록원 명부 응답",
    );
  });

  it("preserves column order, numbering, text IDs and phone numbers after XLSX round-trip", () => {
    const bytes = XLSX.write(createReturningMemberWorkbook(roster), {
      type: "buffer",
      bookType: "xlsx",
    });
    const saved = XLSX.read(bytes, { type: "buffer" });
    const sheet = saved.Sheets["재등록원 명부"]!;
    expect(XLSX.utils.sheet_to_json(sheet, { header: 1 })).toEqual([
      ["인덱스", "이름", "소속 단과대", "학과", "학번", "전화번호"],
      [1, "가상부원", "가상대학", "가상학과", "00123456", "010-0000-0000"],
      [2, "=가상문자열", "", "기존학과", "910002", ""],
    ]);
    expect(sheet.E2.t).toBe("s");
    expect(sheet.F2.t).toBe("s");
    expect(sheet.B3.f).toBeUndefined();
  });
});
