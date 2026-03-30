import type { ApiResponse } from "@core/types/api";
import { MentorListResult, MentorSemesterLabel } from "./types";

interface FetchMentorsParams {
  size: number;
  cursor?: number;
  search?: string;
  semester?: MentorSemesterLabel;
  accessToken: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://dev.forif.org";

function buildMentorsUrl(
  semester: MentorSemesterLabel | undefined,
  searchParams: URLSearchParams,
): string {
  if (!semester || semester === "전체" || semester === "그 외") {
    return `${BASE_URL}/api/v1/admin/mentors?${searchParams.toString()}`;
  }

  const match = semester.match(/^(\d+)-(\d+)$/);

  if (!match) {
    return `${BASE_URL}/api/v1/admin/mentors?${searchParams.toString()}`;
  }

  const year = Number(`20${match[1]}`);
  const sem = Number(match[2]);

  return `${BASE_URL}/api/v1/admin/mentors/${year}/${sem}?${searchParams.toString()}`;
}

export async function fetchMentors({
  size,
  cursor,
  search,
  semester,
  accessToken,
}: FetchMentorsParams): Promise<MentorListResult> {
  const searchParams = new URLSearchParams();
  searchParams.set("size", size.toString());

  if (cursor !== undefined) {
    searchParams.set("cursor", cursor.toString());
  }

  if (search) {
    searchParams.set("search", search);
  }

  const url = buildMentorsUrl(semester, searchParams);

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
    console.error("[Mentors API] status:", response.status);
    console.error("[Mentors API] body:", text);
    throw new Error(`멘토 목록 조회 실패 (${response.status})`);
  }

  const result = (await response.json()) as ApiResponse<MentorListResult>;

  if (!result.data || !result.data.content) {
    throw new Error("Invalid API response structure");
  }

  return result.data;
}
