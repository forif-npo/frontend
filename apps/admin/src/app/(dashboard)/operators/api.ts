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
    id: pickNumber(item.id, item.forif_team_id),
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
    introTag: pickString(item.introTag, item.intro_tag),
    selfIntro: pickString(item.selfIntro, item.self_intro),
    profImgUrl: pickString(item.profImgUrl, item.prof_img_url),
    graduateYear:
      typeof item.graduate_year === "number"
        ? item.graduate_year
        : typeof item.graduateYear === "number"
          ? item.graduateYear
          : null,
  };
}

function compareSemesterDesc(a: Operator, b: Operator) {
  const yearDiff = b.actYear - a.actYear;

  if (yearDiff !== 0) {
    return yearDiff;
  }

  return b.actSemester - a.actSemester;
}

/**
 * 운영진 이력 수정 (PATCH /api/v1/admin/forif-team/{id})
 * null이 아닌 필드만 반영된다.
 */
export async function updateOperator(
  forifTeamId: number,
  body: {
    user_title?: string;
    club_department?: string;
    intro_tag?: string;
    self_intro?: string;
    prof_img_url?: string;
    graduate_year?: number;
  },
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/forif-team/${forifTeamId}`, { json: body })
    .json<ApiResponse<ForifTeamItem>>();
}

/**
 * 운영진 이력 삭제 (DELETE /api/v1/admin/forif-team/{id})
 */
export async function deleteOperator(forifTeamId: number): Promise<void> {
  await apiClient
    .delete(`api/v1/admin/forif-team/${forifTeamId}`)
    .json<ApiResponse<null>>();
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
