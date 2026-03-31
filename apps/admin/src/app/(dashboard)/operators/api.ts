import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Operator, OperatorListResult, OperatorSemesterLabel } from "./types";

interface ForifTeamItem {
  [key: string]: unknown;
}

interface FetchOperatorsParams {
  semester: OperatorSemesterLabel;
  accessToken: string;
}

type ForifTeamListResponse = ForifTeamItem[];

const MAIN_SEMESTERS = new Set([
  "25-2",
  "25-1",
  "24-2",
  "24-1",
  "23-2",
  "23-1",
]);

function getOperatorsEndpoint(semester: OperatorSemesterLabel): string {
  if (semester === "전체" || semester === "그 외") {
    return "api/v1/forif-team";
  }

  const match = semester.match(/^(\d+)-(\d+)$/);

  if (!match) {
    return "api/v1/forif-team";
  }

  const year = Number(`20${match[1]}`);
  const sem = Number(match[2]);

  return `api/v1/forif-team/${year}/${sem}`;
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

function pickNumber(...values: unknown[]): number {
  for (const value of values) {
    if (typeof value === "number") {
      return value;
    }
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }
  return 0;
}

function mapToOperator(item: ForifTeamItem): Operator {
  return {
    userId: pickNumber(
      item.userId,
      item.user_id,
      item.studentId,
      item.student_id,
    ),
    department: pickString(
      item.clubDepartment,
      item.club_department,
      item.department,
      item.major,
    ),
    name: pickString(item.userName, item.user_name, item.name),
    phoneNum: pickString(item.phoneNum, item.phone_num, item.tel, item.phone),
    title: pickString(
      item.userTitle,
      item.user_title,
      item.title,
      item.role,
      item.position,
    ),
    actYear: pickNumber(item.actYear, item.act_year, item.year),
    actSemester: pickNumber(item.actSemester, item.act_semester, item.semester),
  };
}

export async function fetchOperators({
  semester,
  accessToken,
}: FetchOperatorsParams): Promise<OperatorListResult> {
  const endpoint = getOperatorsEndpoint(semester);

  console.log("[Operators API] Fetching from API:", {
    endpoint,
    semester,
  });

  const response = await apiClient
    .get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<ApiResponse<ForifTeamListResponse>>();

  if (!response.data || !Array.isArray(response.data)) {
    throw new Error("Invalid API response structure");
  }

  console.log("[Operators API] first raw item:", response.data[0]);

  let content = response.data.map(mapToOperator);

  if (semester === "그 외") {
    content = content.filter((item) => {
      const label = `${String(item.actYear).slice(2)}-${item.actSemester}`;
      return !MAIN_SEMESTERS.has(label);
    });
  }

  console.log("[Operators API] first mapped item:", content[0]);

  return {
    content,
    nextCursor: null,
    hasNext: false,
    totalElements: content.length,
  };
}
