import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Operator, OperatorListResult, OperatorSemesterLabel } from "./types";
import { loadSemesterOptions } from "@/lib/semester";
import { sortRecords } from "@/lib/list-sorting";
import type { SortingState } from "@tanstack/react-table";

interface ForifTeamItem {
  [key: string]: unknown;
}

interface FetchOperatorsParams {
  semester: OperatorSemesterLabel;
  page?: number;
  size: number;
  search?: string;
  accessToken: string;
  sorting?: SortingState;
}

type ForifTeamListResponse = ForifTeamItem[];

/** "그 외" 판정 기준은 학기 탭에 노출되는 목록과 동일하게 서버에서 받는다 */
async function getMainSemesterLabels(): Promise<Set<string>> {
  const { recentLabels } = await loadSemesterOptions();
  return new Set(recentLabels);
}

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
export interface AddOperatorBody {
  user_id: number;
  /** 미지정 시 현재 활동 학기 */
  act_year?: number;
  act_semester?: number;
  club_department: string;
  user_title?: string;
}

/** 운영진 명단에 추가 (회장단 전용) */
export async function addOperator(body: AddOperatorBody): Promise<void> {
  await apiClient.post("api/v1/admin/forif-team", { json: body }).json();
}

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
  sorting = [],
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
    const mainSemesters = await getMainSemesterLabels();
    content = content.filter((item) => {
      const label = `${String(item.actYear).slice(2)}-${item.actSemester}`;
      return !mainSemesters.has(label);
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

  content = sortRecords(content, sorting, (operator, id) => {
    const values: Record<string, unknown> = {
      userId: operator.userId,
      department: operator.department,
      title: operator.title,
      name: operator.name,
    };

    return values[id];
  });

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
