import { Operator, OperatorListResult, OperatorSemesterLabel } from "./types";

interface ForifTeamItem {
  id: number;
  userId: number;
  userName: string;
  actYear: number;
  actSemester: number;
  userTitle: string;
  clubDepartment: string;
  introTag: string;
  selfIntro: string;
  profImgUrl: string;
  graduateYear: number;
}

interface FetchOperatorsParams {
  semester: OperatorSemesterLabel;
  accessToken: string;
}

interface ForifTeamResponse {
  timestamp: number;
  data: ForifTeamItem[];
  errorCode: string | null;
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://dev.forif.org";

function getOperatorsUrl(semester: OperatorSemesterLabel): string {
  if (semester === "전체" || semester === "그 외") {
    return `${BASE_URL}/api/v1/forif-team`;
  }

  const match = semester.match(/^(\d+)-(\d+)$/);

  if (!match) {
    return `${BASE_URL}/api/v1/forif-team`;
  }

  const year = Number(`20${match[1]}`);
  const sem = Number(match[2]);

  return `${BASE_URL}/api/v1/forif-team/${year}/${sem}`;
}

function mapToOperator(item: ForifTeamItem): Operator {
  return {
    user_id: item.userId,
    name: item.userName,
    affiliation: item.clubDepartment,
  };
}

export async function fetchOperators({
  semester,
  accessToken,
}: FetchOperatorsParams): Promise<OperatorListResult> {
  const url = getOperatorsUrl(semester);

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
    console.error("[Operators API] status:", response.status);
    console.error("[Operators API] body:", text);
    throw new Error(`운영진 목록 조회 실패 (${response.status})`);
  }

  const result = (await response.json()) as ForifTeamResponse;

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid API response structure");
  }

  const content = result.data.map(mapToOperator);

  return {
    content,
    nextCursor: null,
    hasNext: false,
    totalElements: content.length,
  };
}
