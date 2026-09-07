import { describe, expect, it, jest } from "@jest/globals";
import type { Study } from "@/types/study";

jest.mock("@/constants/study", () => ({
  getDifficultyBadgeVariant: (difficulty: Study["difficulty"]) =>
    difficulty === "SEMI_HARD" ? "warning" : "primary",
}));

import { getStudyBadgeTags } from "./utils";

const study: Study = {
  id: 1,
  act_year: 2026,
  act_semester: 1,
  study_name: "React",
  primary_mentor_name: "Mentor",
  secondary_mentor_name: null,
  tags: ["frontend", "typescript"],
  recruit_status: "APPLICABLE",
  one_liner: "React study",
  explanation: "",
  start_time: null,
  end_time: null,
  week_day: 1,
  location: "Online",
  location_detail: null,
  difficulty: "SEMI_HARD",
  img_url: "",
  thumbnail_image: null,
  autonomous_study: false,
  is_online: true,
  goal: null,
  selection_criteria: null,
  capacity: null,
  requires_interview: null,
  plans: [],
  references: [],
  mentors: [],
};

describe("getStudyBadgeTags", () => {
  it("returns status, localized tag, and difficulty badges in display order", () => {
    expect(getStudyBadgeTags(study)).toEqual([
      { label: "모집중", variant: "info" },
      { label: "프론트엔드", variant: "info" },
      { label: "TypeScript", variant: "info" },
      { label: "조금 어려움", variant: "warning" },
    ]);
  });

  it("marks closed studies as disabled", () => {
    expect(
      getStudyBadgeTags({ ...study, recruit_status: "CLOSED" })[0],
    ).toEqual({ label: "모집마감", variant: "disabled" });
  });
});
