import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Operator, OperatorListResult, OperatorSemesterLabel } from "./types";

interface ForifTeamItem {
  [key: string]: unknown;
}

interface FetchOperatorsParams {
  semester: OperatorSemesterLabel;
  page?: number;
  size: number;
  search?: string;
  accessToken: string;
}

type ForifTeamListResponse = ForifTeamItem[];

const MAIN_SEMESTERS = new Set([
  "26-1",
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

function compareSemesterDesc(a: Operator, b: Operator) {
  const yearDiff = b.actYear - a.actYear;

  if (yearDiff !== 0) {
    return yearDiff;
  }

  return b.actSemester - a.actSemester;
}

export async function fetchOperators({
  semester,
  page = 0,
  size,
  search,
  accessToken,
}: FetchOperatorsParams): Promise<OperatorListResult> {
  const endpoint = getOperatorsEndpoint(semester);

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

  let content = response.data.map(mapToOperator).sort(compareSemesterDesc);

  if (semester === "그 외") {
    content = content.filter((item) => {
      const label = `${String(item.actYear).slice(2)}-${item.actSemester}`;
      return !MAIN_SEMESTERS.has(label);
    });
  }

  const normalizedSearch = search?.trim().toLowerCase();
  if (normalizedSearch) {
    content = content.filter((operator) =>
      [
        operator.userId,
        operator.department,
        operator.name,
        operator.phoneNum,
        operator.title,
      ]
        .map(String)
        .some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }

  const currentPage = Math.max(page, 0);
  const pageSize = Math.max(size, 1);
  const totalElements = content.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const from = currentPage * pageSize;

  return {
    content: content.slice(from, from + pageSize),
    totalElements,
    currentPage,
    totalPages,
    pageSize,
  };
}
