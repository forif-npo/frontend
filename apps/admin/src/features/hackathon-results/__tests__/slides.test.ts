import { describe, expect, it } from "@jest/globals";
import { createEmptyRow } from "../schema";
import { generateSlides } from "../slides";
import type { AwardResult, HackathonResultDraft, ResultTrack } from "../types";

function row(
  track: ResultTrack,
  rank: number | null,
  teamName: string,
  order: number,
): AwardResult {
  return createEmptyRow(track, order, { rank, teamName });
}

function draft(results: AwardResult[]): HackathonResultDraft {
  return {
    version: 1,
    hackathonId: 1,
    eventTitle: "2026 FORIF 해커톤",
    updatedAt: "2026-06-21T00:00:00.000Z",
    results,
  };
}

describe("generateSlides", () => {
  it("결과가 없으면 커버 슬라이드만 만든다", () => {
    const slides = generateSlides(draft([]));
    expect(slides).toHaveLength(1);
    expect(slides[0]).toEqual({ type: "COVER", title: "2026 FORIF 해커톤" });
  });

  it("팀명이 없는 행은 발표 대상에서 제외한다", () => {
    const slides = generateSlides(
      draft([row("IDEATHON", 1, "", 0), row("HACKATHON", 1, "", 1)]),
    );
    expect(slides).toHaveLength(1);
    expect(slides[0].type).toBe("COVER");
  });

  it("빈 부문은 intro와 award 슬라이드를 만들지 않는다", () => {
    const slides = generateSlides(draft([row("HACKATHON", 1, "팀A", 0)]));
    const types = slides.map((s) => s.type);
    // COVER, TRACK_INTRO(HACKATHON), AWARD, FINALE
    expect(types).toEqual(["COVER", "TRACK_INTRO", "AWARD", "FINALE"]);
    const intro = slides[1];
    expect(intro.type === "TRACK_INTRO" && intro.track).toBe("HACKATHON");
  });

  it("아이디어톤을 해커톤보다 먼저 공개한다", () => {
    const slides = generateSlides(
      draft([row("HACKATHON", 1, "해A", 0), row("IDEATHON", 1, "아A", 1)]),
    );
    const introTracks = slides
      .filter((s) => s.type === "TRACK_INTRO")
      .map((s) => (s.type === "TRACK_INTRO" ? s.track : null));
    expect(introTracks).toEqual(["IDEATHON", "HACKATHON"]);
  });

  it("특별상을 먼저, 순위상은 큰 숫자부터 공개한다", () => {
    const slides = generateSlides(
      draft([
        row("IDEATHON", 1, "1위팀", 0),
        row("IDEATHON", 3, "3위팀", 1),
        row("IDEATHON", null, "특별상팀", 2),
        row("IDEATHON", 2, "2위팀", 3),
      ]),
    );
    const awardTeams = slides
      .filter((s) => s.type === "AWARD")
      .map((s) => (s.type === "AWARD" ? s.result.teamName : ""));
    expect(awardTeams).toEqual(["특별상팀", "3위팀", "2위팀", "1위팀"]);
  });

  it("피날레는 모든 발표 대상 팀을 포함한다", () => {
    const slides = generateSlides(
      draft([row("IDEATHON", 1, "아A", 0), row("HACKATHON", 1, "해A", 1)]),
    );
    const finale = slides[slides.length - 1];
    expect(finale.type).toBe("FINALE");
    if (finale.type === "FINALE") {
      expect(finale.results.map((r) => r.teamName).sort()).toEqual([
        "아A",
        "해A",
      ]);
    }
  });
});
