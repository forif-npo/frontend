import { describe, expect, it } from "@jest/globals";
import { createEmptyDraft, createEmptyRow, parseDraft } from "../schema";

describe("createEmptyDraft", () => {
  it("빈 결과 목록으로 시작한다", () => {
    const draft = createEmptyDraft(1, "테스트 해커톤");
    expect(draft.version).toBe(1);
    expect(draft.hackathonId).toBe(1);
    expect(draft.eventTitle).toBe("테스트 해커톤");
    expect(draft.results).toHaveLength(0);
  });
});

describe("parseDraft", () => {
  it("유효한 초안을 복원한다", () => {
    const original = createEmptyDraft(2, "복원 테스트");
    original.results.push(
      createEmptyRow("IDEATHON", 0, {
        hackathonTeamId: 10,
        teamName: "팀A",
        rank: 1,
        members: ["김철수", "이영희"],
      }),
    );
    const roundTripped: unknown = JSON.parse(JSON.stringify(original));
    const result = parseDraft(roundTripped);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.draft.hackathonId).toBe(2);
      expect(result.draft.results).toHaveLength(1);
      expect(result.draft.results[0].teamName).toBe("팀A");
      expect(result.draft.results[0].members).toEqual(["김철수", "이영희"]);
    }
  });

  it("손상된 데이터는 실패로 처리한다", () => {
    const result = parseDraft({ version: 2, foo: "bar" });
    expect(result.success).toBe(false);
  });

  it("객체가 아닌 입력도 안전하게 실패한다", () => {
    expect(parseDraft(null).success).toBe(false);
    expect(parseDraft("string").success).toBe(false);
    expect(parseDraft(42).success).toBe(false);
  });
});
