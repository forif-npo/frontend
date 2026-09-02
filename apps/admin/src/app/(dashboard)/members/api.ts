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
  pickBoolean,
  pickNumber,
  pickString,
} from "@/utils/roster";
import { Member, MemberListResult, MemberSemesterLabel } from "./types";

export type MentorHistory = {
  actYear: number;
  actSemester: number;
  studyName: string;
};

export type OperatorHistory = {
  actYear: number;
  actSemester: number;
  team: string;
  title: string;
};

export type MemberHistory = {
  mentors: MentorHistory[];
  operators: OperatorHistory[];
};

interface FetchMembersParams {
  size: number;
  page?: number;
  search?: string;
  semester?: MemberSemesterLabel;
  accessToken?: string;
  sorting?: SortingState;
}

interface MemberItem {
  [key: string]: unknown;
}

interface MemberPageData extends PaginationInterface {
  content: MemberItem[];
}

interface MentorHistoryPageData extends PaginationInterface {
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

async function filterOtherSemester(content: MemberWithSemester[]) {
  const mainLabels = await getMainSemesterLabels();
  return content.filter(
    (item) => !isMainSemester(mainLabels, item.actYear, item.actSemester),
  );
}

export async function fetchMembers({
  size,
  page = 0,
  search,
  semester,
  accessToken,
  sorting = [],
}: FetchMembersParams): Promise<MemberListResult> {
  const endpoint = buildSemesterEndpoint("api/v1/admin/users", semester);

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
      .json<ApiResponse<MemberPageData>>();

    if (!response.data || !Array.isArray(response.data.content)) {
      throw new Error("Invalid API response structure");
    }

    const otherSemester = await filterOtherSemester(
      response.data.content.map(mapToMember),
    );

    return paginateLocally(
      sortRecords(
        otherSemester.map(stripSemester),
        sorting,
        (member, id) => member[id as keyof Member],
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

/** 현재 활동 학기 부원 삭제 (DELETE /api/v1/admin/users/{userId}) */
export async function deleteCurrentSemesterMember(
  userId: number,
): Promise<void> {
  await apiClient
    .delete(`api/v1/admin/users/${userId}`)
    .json<ApiResponse<null>>();
}

export async function updateMemberInfo(
  userId: number,
  info: Pick<Member, "department" | "phoneNum">,
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/users/${userId}`, { json: info })
    .json<ApiResponse<null>>();
}

/**
 * 부원별 멘토·운영진 이력.
 * 각 목록 API는 전체 이력을 반환하므로, 상세 팝업을 열 때만 해당 부원의 기록을 추린다.
 */
export async function fetchMemberHistory(
  userId: number,
): Promise<MemberHistory> {
  const [mentorResponse, operatorResponse] = await Promise.all([
    apiClient
      .get("api/v1/admin/mentors", {
        searchParams: { page: "0", size: "10000" },
      })
      .json<ApiResponse<MentorHistoryPageData>>(),
    apiClient.get("api/v1/forif-team").json<ApiResponse<MemberItem[]>>(),
  ]);

  const mentors = (mentorResponse.data?.content ?? [])
    .filter(
      (item) =>
        pickNumber(
          item.userId,
          item.user_id,
          item.studentId,
          item.student_id,
        ) === userId,
    )
    .map((item) => ({
      actYear: pickNumber(item.actYear, item.act_year, item.year),
      actSemester: pickNumber(
        item.actSemester,
        item.act_semester,
        item.semester,
      ),
      studyName: pickString(
        item.studyName,
        item.study_name,
        item.currentStudyName,
      ),
    }))
    .sort(compareHistoryBySemester);

  const operators = (operatorResponse.data ?? [])
    .filter(
      (item) =>
        pickNumber(
          item.userId,
          item.user_id,
          item.studentId,
          item.student_id,
        ) === userId,
    )
    .map((item) => ({
      actYear: pickNumber(item.actYear, item.act_year, item.year),
      actSemester: pickNumber(
        item.actSemester,
        item.act_semester,
        item.semester,
      ),
      team: pickString(
        item.clubDepartment,
        item.club_department,
        item.department,
      ),
      title: pickString(
        item.userTitle,
        item.user_title,
        item.title,
        item.role,
        item.position,
      ),
    }))
    .sort(compareHistoryBySemester);

  return { mentors, operators };
}

function compareHistoryBySemester(
  first: { actYear: number; actSemester: number },
  second: { actYear: number; actSemester: number },
) {
  return (
    second.actYear - first.actYear || second.actSemester - first.actSemester
  );
}
