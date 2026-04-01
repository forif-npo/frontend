import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import { Mentor, MentorListResult, MentorSemesterLabel } from "./types";

interface FetchMentorsParams {
  size: number;
  cursor?: number;
  search?: string;
  semester?: MentorSemesterLabel;
  accessToken: string;
}

interface MentorItem {
  [key: string]: unknown;
}

interface MentorPageData {
  content: MentorItem[];
  nextCursor: number | null;
  hasNext: boolean;
  totalElements: number;
}

const MAIN_SEMESTERS = new Set([
  "25-2",
  "25-1",
  "24-2",
  "24-1",
  "23-2",
  "23-1",
]);

function getMentorsEndpoint(semester?: MentorSemesterLabel): string {
  if (!semester || semester === "전체" || semester === "그 외") {
    return "api/v1/admin/mentors";
  }

  const match = semester.match(/^(\d+)-(\d+)$/);

  if (!match) {
    return "api/v1/admin/mentors";
  }

  const year = Number(`20${match[1]}`);
  const sem = Number(match[2]);

  return `api/v1/admin/mentors/${year}/${sem}`;
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

function mapToMentor(
  item: MentorItem,
): Mentor & { actYear?: number; actSemester?: number } {
  return {
    userId: pickNumber(item.userId, item.user_id),
    name: pickString(item.name, item.userName, item.user_name),
    department: pickString(item.department),
    phoneNum: pickString(item.phoneNum, item.phone_num, item.phone),
    studyName: pickString(
      item.studyName,
      item.study_name,
      item.currentStudyName,
    ),
    actYear: pickNumber(item.actYear, item.act_year, item.year),
    actSemester: pickNumber(item.actSemester, item.act_semester, item.semester),
  };
}

export async function fetchMentors({
  size,
  cursor,
  search,
  semester,
  accessToken,
}: FetchMentorsParams): Promise<MentorListResult> {
  const endpoint = getMentorsEndpoint(semester);

  const searchParams: Record<string, string> = {
    size: size.toString(),
  };

  if (cursor !== undefined) {
    searchParams.cursor = cursor.toString();
  }

  if (search) {
    searchParams.search = search;
  }

  console.log("[Mentors API] Fetching from API:", {
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
    .json<ApiResponse<MentorPageData>>();

  if (!response.data || !Array.isArray(response.data.content)) {
    throw new Error("Invalid API response structure");
  }

  let content = response.data.content.map(mapToMentor);

  if (semester === "그 외") {
    content = content.filter((item) => {
      const label = `${String(item.actYear ?? 0).slice(2)}-${item.actSemester ?? 0}`;
      return !MAIN_SEMESTERS.has(label);
    });
  }

  console.log("[Mentors API] first raw item:", response.data.content[0]);
  console.log("[Mentors API] first mapped item:", content[0]);

  return {
    content: content.map(
      ({ userId, name, department, phoneNum, studyName }) => ({
        userId,
        name,
        department,
        phoneNum,
        studyName,
      }),
    ),
    nextCursor: response.data.nextCursor,
    hasNext: response.data.hasNext,
    totalElements: response.data.totalElements,
  };
}
