import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Member, MemberListResult, MemberSemesterLabel } from "./types";

interface FetchMembersParams {
  size: number;
  cursor?: number;
  search?: string;
  semester?: MemberSemesterLabel;
  accessToken: string;
}

interface MemberItem {
  [key: string]: unknown;
}

interface MemberPageData {
  content: MemberItem[];
  nextCursor?: number | null;
  next_cursor?: number | null;
  hasNext?: boolean;
  has_next?: boolean;
  totalElements?: number;
  total_elements?: number;
}

const MAIN_SEMESTERS = new Set([
  "25-2",
  "25-1",
  "24-2",
  "24-1",
  "23-2",
  "23-1",
]);

function getMembersEndpoint(semester?: MemberSemesterLabel): string {
  if (!semester || semester === "전체" || semester === "그 외") {
    return "api/v1/admin/users";
  }

  const match = semester.match(/^(\d+)-(\d+)$/);

  if (!match) {
    return "api/v1/admin/users";
  }

  const year = Number(`20${match[1]}`);
  const sem = Number(match[2]);

  return `api/v1/admin/users/${year}/${sem}`;
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

function pickBoolean(...values: unknown[]): boolean {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }
    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }
  }
  return false;
}

function mapToMember(
  item: MemberItem,
): Member & { actYear?: number; actSemester?: number } {
  return {
    userId: pickNumber(item.userId, item.user_id),
    department: pickString(item.department),
    userName: pickString(item.userName, item.user_name, item.name),
    phoneNum: pickString(item.phoneNum, item.phone_num, item.phone),
    isMentor: pickBoolean(item.isMentor, item.is_mentor),
    isAdmin: pickBoolean(item.isAdmin, item.is_admin),
    actYear: pickNumber(item.actYear, item.act_year, item.year),
    actSemester: pickNumber(item.actSemester, item.act_semester, item.semester),
  };
}

export async function fetchMembers({
  size,
  cursor,
  search,
  semester,
  accessToken,
}: FetchMembersParams): Promise<MemberListResult> {
  const endpoint = getMembersEndpoint(semester);

  const searchParams: Record<string, string> = {
    size: size.toString(),
  };

  if (cursor !== undefined) {
    searchParams.cursor = cursor.toString();
  }

  if (search) {
    searchParams.search = search;
  }

  console.log("[Members API] Fetching from API:", {
    endpoint,
    semester,
    searchParams,
  });

  const response = await apiClient
    .get(endpoint, {
      searchParams,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<ApiResponse<MemberPageData>>();

  if (!response.data || !Array.isArray(response.data.content)) {
    throw new Error("Invalid API response structure");
  }

  let content = response.data.content.map(mapToMember);

  if (semester === "그 외") {
    content = content.filter((item) => {
      const label = `${String(item.actYear ?? 0).slice(2)}-${item.actSemester ?? 0}`;
      return !MAIN_SEMESTERS.has(label);
    });
  }

  console.log("[Members API] first raw item:", response.data.content[0]);
  console.log("[Members API] first mapped item:", content[0]);

  return {
    content: content.map(
      ({ userId, department, userName, phoneNum, isMentor, isAdmin }) => ({
        userId,
        department,
        userName,
        phoneNum,
        isMentor,
        isAdmin,
      }),
    ),
    nextCursor: response.data.next_cursor ?? response.data.nextCursor ?? null,
    hasNext: response.data.has_next ?? response.data.hasNext ?? false,
    totalElements:
      response.data.total_elements ?? response.data.totalElements ?? 0,
  };
}
