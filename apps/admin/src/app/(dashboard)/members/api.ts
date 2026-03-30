import type { ApiResponse } from "@core/types/api";
import { MemberListResult, MemberSemesterLabel } from "./types";

interface FetchMembersParams {
  size: number;
  cursor?: number;
  search?: string;
  semester?: MemberSemesterLabel;
  accessToken: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://dev.forif.org";

function buildMembersUrl(
  semester: MemberSemesterLabel | undefined,
  searchParams: URLSearchParams,
): string {
  if (!semester || semester === "전체" || semester === "그 외") {
    return `${BASE_URL}/api/v1/admin/users?${searchParams.toString()}`;
  }

  const match = semester.match(/^(\d+)-(\d+)$/);

  if (!match) {
    return `${BASE_URL}/api/v1/admin/users?${searchParams.toString()}`;
  }

  const year = Number(`20${match[1]}`);
  const sem = Number(match[2]);

  return `${BASE_URL}/api/v1/admin/users/${year}/${sem}?${searchParams.toString()}`;
}

export async function fetchMembers({
  size,
  cursor,
  search,
  semester,
  accessToken,
}: FetchMembersParams): Promise<MemberListResult> {
  const searchParams = new URLSearchParams();
  searchParams.set("size", size.toString());

  if (cursor !== undefined) {
    searchParams.set("cursor", cursor.toString());
  }

  if (search) {
    searchParams.set("search", search);
  }

  const url = buildMembersUrl(semester, searchParams);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[Members API] status:", response.status);
    console.error("[Members API] body:", text);
    throw new Error(`부원 목록 조회 실패 (${response.status})`);
  }

  const result = (await response.json()) as ApiResponse<MemberListResult>;

  if (!result.data || !result.data.content) {
    throw new Error("Invalid API response structure");
  }

  return result.data;
}
