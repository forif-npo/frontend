import type { ApiResponse } from "@core/types/api";
import { apiClient } from "@core/utils/api-client";
import { formatPhoneNumber } from "@core/utils/phone-number";
import * as XLSX from "xlsx";

export interface ReturningMemberRoster {
  act_year: number;
  act_semester: number;
  members: {
    user_id: string;
    user_name: string | null;
    college: string | null;
    department: string | null;
    phone_num: string | null;
  }[];
}

export async function fetchReturningMemberRoster(): Promise<ReturningMemberRoster> {
  const response = await apiClient
    .get("api/v1/admin/users/returning-members")
    .json<ApiResponse<ReturningMemberRoster>>();

  if (!response.data || !Array.isArray(response.data.members)) {
    throw new Error("재등록원 명부 응답이 올바르지 않습니다.");
  }
  return response.data;
}

export function createReturningMemberWorkbook(roster: ReturningMemberRoster) {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["인덱스", "이름", "소속 단과대", "학과", "학번", "전화번호"],
    ...roster.members.map((member, index) => [
      index + 1,
      member.user_name ?? "",
      member.college ?? "",
      member.department ?? "",
      String(member.user_id),
      formatPhoneNumber(member.phone_num),
    ]),
  ]);
  worksheet["!cols"] = [8, 16, 24, 30, 18, 20].map((wch) => ({ wch }));
  worksheet["!autofilter"] = { ref: worksheet["!ref"]! };
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "재등록원 명부");
  return workbook;
}

export function downloadReturningMemberRoster(roster: ReturningMemberRoster) {
  XLSX.writeFile(
    createReturningMemberWorkbook(roster),
    `재등록원_명부_${roster.act_year}-${roster.act_semester}.xlsx`,
  );
}
