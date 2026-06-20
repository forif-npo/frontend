import { z } from "zod";
import type { AwardResult, HackathonResultDraft, ResultTrack } from "./types";

export const awardResultSchema = z.object({
  id: z.string(),
  track: z.enum(["HACKATHON", "IDEATHON"]),
  hackathonTeamId: z.number().nullable(),
  teamName: z.string(),
  rank: z.number().nullable(),
  members: z.array(z.string()),
  presentationOrder: z.number(),
});

export const hackathonResultDraftSchema = z.object({
  version: z.literal(1),
  hackathonId: z.number(),
  eventTitle: z.string(),
  updatedAt: z.string(),
  results: z.array(awardResultSchema),
});

/** 브라우저의 randomUUID를 우선 사용하고, 없으면 테스트용 fallback을 쓴다. */
export function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyRow(
  track: ResultTrack,
  presentationOrder: number,
  partial?: Partial<AwardResult>,
): AwardResult {
  return {
    id: generateId(),
    track,
    hackathonTeamId: null,
    teamName: "",
    rank: null,
    members: [],
    presentationOrder,
    ...partial,
  };
}

export function createEmptyDraft(
  hackathonId: number,
  eventTitle: string,
): HackathonResultDraft {
  // 수상 팀은 운영진이 직접 추가하므로 기본 행은 두지 않는다.
  return {
    version: 1,
    hackathonId,
    eventTitle,
    updatedAt: new Date().toISOString(),
    results: [],
  };
}

export type ParseResult =
  | { success: true; draft: HackathonResultDraft }
  | { success: false; error: string };

/** 알 수 없는 입력(파일/스토리지)을 안전하게 검증한다. */
export function parseDraft(raw: unknown): ParseResult {
  const parsed = hackathonResultDraftSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "지원하지 않는 형식이거나 손상된 결과 데이터입니다.",
    };
  }
  return { success: true, draft: parsed.data };
}
