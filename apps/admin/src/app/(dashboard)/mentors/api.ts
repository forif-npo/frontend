import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { PaginationInterface } from "@/types/pagination";
import { paginateLocally } from "@/lib/paginate";
import {
  buildSemesterEndpoint,
  isMainSemester,
  pickNumber,
  pickString,
} from "@/utils/roster";
import { Mentor, MentorListResult, MentorSemesterLabel } from "./types";

interface FetchMentorsParams {
  size: number;
  page?: number;
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

type MentorWithSemester = Mentor & { actYear?: number; actSemester?: number };

function mapToMentor(item: MentorItem): MentorWithSemester {
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

function stripSemester({
  userId,
  name,
  department,
  phoneNum,
  studyName,
}: MentorWithSemester): Mentor {
  return {
    userId,
    name,
    department,
    phoneNum,
    studyName,
  };
}

function filterOtherSemester(content: MentorWithSemester[]) {
  return content.filter(
    (item) => !isMainSemester(item.actYear, item.actSemester),
  );
}

export async function fetchMentors({
  size,
  page = 0,
  search,
  semester,
  accessToken,
}: FetchMentorsParams): Promise<MentorListResult> {
  const endpoint = buildSemesterEndpoint("api/v1/admin/mentors", semester);

  const searchParams: Record<string, string> = {
    page: page.toString(),
    size: size.toString(),
  };

  if (search) {
    searchParams.search = search;
  }

  if (semester === "그 외") {
    const response = await apiClient
      .get(endpoint, {
        searchParams: {
          ...searchParams,
          page: "0",
          size: "10000",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .json<ApiResponse<MentorPageData>>();

    if (!response.data || !Array.isArray(response.data.content)) {
      throw new Error("Invalid API response structure");
    }

    return paginateLocally(
      filterOtherSemester(response.data.content.map(mapToMentor)).map(
        stripSemester,
      ),
      page,
      size,
    );
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

  const content = response.data.content.map(mapToMentor);
  const totalElements = response.data.total_elements ?? content.length;

  return {
    content: content.map(stripSemester),
    totalElements,
    currentPage: response.data.current_page ?? page,
    totalPages: response.data.total_pages ?? Math.ceil(totalElements / size),
    pageSize: size,
  };
}
