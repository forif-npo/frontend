import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { PaginationInterface } from "@/types/pagination";
import {
  buildSemesterEndpoint,
  isMainSemester,
  pickNumber,
  pickString,
} from "@/utils/roster";
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

interface MentorPageData extends PaginationInterface {
  content: MentorItem[];
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
  const endpoint = buildSemesterEndpoint("api/v1/admin/mentors", semester);

  const searchParams: Record<string, string> = {
    size: size.toString(),
  };

  if (cursor !== undefined) {
    searchParams.cursor = cursor.toString();
  }

  if (search) {
    searchParams.search = search;
  }

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
    content = content.filter(
      (item) => !isMainSemester(item.actYear, item.actSemester),
    );
  }

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
    nextCursor: response.data.next_cursor ?? null,
    hasNext: response.data.has_next ?? false,
    totalElements: response.data.total_elements ?? 0,
  };
}
