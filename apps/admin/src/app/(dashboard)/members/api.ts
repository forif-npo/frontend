import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { PaginationInterface } from "@/types/pagination";
import { paginateLocally } from "@/lib/paginate";
import {
  buildSemesterEndpoint,
  isMainSemester,
  pickBoolean,
  pickNumber,
  pickString,
} from "@/utils/roster";
import { Member, MemberListResult, MemberSemesterLabel } from "./types";

interface FetchMembersParams {
  size: number;
  page?: number;
  search?: string;
  semester?: MemberSemesterLabel;
  accessToken: string;
}

interface MemberItem {
  [key: string]: unknown;
}

interface MemberPageData extends PaginationInterface {
  content: MemberItem[];
}

type MemberWithSemester = Member & { actYear?: number; actSemester?: number };

function mapToMember(item: MemberItem): MemberWithSemester {
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

function stripSemester({
  userId,
  department,
  userName,
  phoneNum,
  isMentor,
  isAdmin,
}: MemberWithSemester): Member {
  return {
    userId,
    department,
    userName,
    phoneNum,
    isMentor,
    isAdmin,
  };
}

function filterOtherSemester(content: MemberWithSemester[]) {
  return content.filter(
    (item) => !isMainSemester(item.actYear, item.actSemester),
  );
}

export async function fetchMembers({
  size,
  page = 0,
  search,
  semester,
  accessToken,
}: FetchMembersParams): Promise<MemberListResult> {
  const endpoint = buildSemesterEndpoint("api/v1/admin/users", semester);

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
      .json<ApiResponse<MemberPageData>>();

    if (!response.data || !Array.isArray(response.data.content)) {
      throw new Error("Invalid API response structure");
    }

    return paginateLocally(
      filterOtherSemester(response.data.content.map(mapToMember)).map(
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
    .json<ApiResponse<MemberPageData>>();

  if (!response.data || !Array.isArray(response.data.content)) {
    throw new Error("Invalid API response structure");
  }

  const content = response.data.content.map(mapToMember);
  const totalElements = response.data.total_elements ?? content.length;

  return {
    content: content.map(stripSemester),
    totalElements,
    currentPage: response.data.current_page ?? page,
    totalPages: response.data.total_pages ?? Math.ceil(totalElements / size),
    pageSize: size,
  };
}
