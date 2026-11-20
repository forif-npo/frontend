import { describe, expect, it } from "@jest/globals";
import type { HallOfFameEntry } from "@core/types/hall-of-fame";
import { filterHallOfFameEntries, getHallOfFameSeasons } from "./presentation";

const entry = (
  entryId: number,
  actYear: number,
  actSemester: number,
): HallOfFameEntry => ({
  entry_id: entryId,
  slug: `member-${entryId}`,
  member_name: `테스트 회원 ${entryId}`,
  act_year: actYear,
  act_semester: actSemester,
  semester_label: `${actYear}-${actSemester}`,
  headline: null,
  introduction: null,
  achievements: [],
  badges: [],
  image_url: null,
  published_at: "2026-10-17T00:00:00+09:00",
});

describe("hall of fame presentation", () => {
  const entries = [entry(1, 2025, 2), entry(2, 2026, 1), entry(3, 2025, 2)];

  it("builds unique seasons in newest-first order", () => {
    expect(getHallOfFameSeasons(entries)).toEqual([
      {
        act_year: 2026,
        act_semester: 1,
        label: "2026-1",
        value: "2026-1",
      },
      {
        act_year: 2025,
        act_semester: 2,
        label: "2025-2",
        value: "2025-2",
      },
    ]);
  });

  it("filters entries by activity season without changing the full list", () => {
    expect(filterHallOfFameEntries(entries, "2025-2")).toHaveLength(2);
    expect(filterHallOfFameEntries(entries, "ALL")).toBe(entries);
  });
});
