import { apiClient } from "@core/utils/api-client";
import type { ApiResponse } from "@core/types/api";
import type { PaginationInterface } from "@/types/pagination";
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
  cursor?: number;
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
  const endpoint = buildSemesterEndpoint("api/v1/admin/users", semester);

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
    .json<ApiResponse<MemberPageData>>();

  if (!response.data || !Array.isArray(response.data.content)) {
    throw new Error("Invalid API response structure");
  }

  let content = response.data.content.map(mapToMember);

  if (semester === "그 외") {
    content = content.filter(
      (item) => !isMainSemester(item.actYear, item.actSemester),
    );
  }

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
    nextCursor: response.data.next_cursor ?? null,
    hasNext: response.data.has_next ?? false,
    totalElements: response.data.total_elements ?? 0,
  };
}
