import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { PaginationInterface } from "@/types/pagination";
import { paginateLocally } from "@/lib/paginate";
import { appendSortingParams, sortRecords } from "@/lib/list-sorting";
import type { SortingState } from "@tanstack/react-table";
import {
  buildSemesterEndpoint,
  getMainSemesterLabels,
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
  accessToken?: string;
  sorting?: SortingState;
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

async function filterOtherSemester(content: MentorWithSemester[]) {
  const mainLabels = await getMainSemesterLabels();
  return content.filter(
    (item) => !isMainSemester(mainLabels, item.actYear, item.actSemester),
  );
}

export async function fetchMentors({
  size,
  page = 0,
  search,
  semester,
  accessToken,
  sorting = [],
}: FetchMentorsParams): Promise<MentorListResult> {
  const endpoint = buildSemesterEndpoint("api/v1/admin/mentors", semester);

  const searchParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) {
    searchParams.set("search", search);
  }
  appendSortingParams(searchParams, sorting);

  if (semester === "그 외") {
    const allSearchParams = new URLSearchParams(searchParams);
    allSearchParams.set("page", "0");
    allSearchParams.set("size", "10000");
    const response = await apiClient
      .get(endpoint, {
        searchParams: allSearchParams,
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : undefined,
      })
      .json<ApiResponse<MentorPageData>>();

    if (!response.data || !Array.isArray(response.data.content)) {
      throw new Error("Invalid API response structure");
    }

    const otherSemester = await filterOtherSemester(
      response.data.content.map(mapToMentor),
    );

    return paginateLocally(
      sortRecords(
        otherSemester.map(stripSemester),
        sorting,
        (mentor, id) => mentor[id as keyof Mentor],
      ),
      page,
      size,
    );
  }

  const response = await apiClient
    .get(endpoint, {
      searchParams,
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
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
