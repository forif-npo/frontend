import { describe, expect, it } from "@jest/globals";
import type { Hackathon } from "./types";
import { filterHackathons } from "./utils";

const hackathons: Hackathon[] = [
  {
    hackathon_id: 1,
    held_year: 2026,
    held_semester: 1,
    event_round: 12,
    title: "FORIF Hackathon",
    location: "ITBT관",
    status: "RECRUITING",
    starts_at: "2026-05-01T10:00:00",
    ends_at: "2026-05-01T18:00:00",
  },
  {
    hackathon_id: 2,
    held_year: 2025,
    held_semester: 2,
    event_round: 11,
    title: "겨울 아이디어톤",
    location: "온라인",
    status: "ENDED",
    starts_at: "2025-12-01T10:00:00",
    ends_at: "2025-12-01T18:00:00",
  },
];

describe("filterHackathons", () => {
  it("returns the original list for an empty search", () => {
    expect(filterHackathons(hackathons, "  ")).toBe(hackathons);
  });

  it.each([
    ["title", "hackathon", [1]],
    ["location", "온라인", [2]],
    ["semester", "2026-1", [1]],
    ["round", "11", [2]],
  ])(
    "filters by %s without changing the current search rule",
    (_, query, ids) => {
      expect(
        filterHackathons(hackathons, query).map(
          (hackathon) => hackathon.hackathon_id,
        ),
      ).toEqual(ids);
    },
  );
});
