/** @jest-environment jsdom */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { HallOfFameEntry } from "@core/types/hall-of-fame";
import { HallOfFameListView } from "./HallOfFameListView";

jest.mock("@ui/components/server", () => ({
  EmptyState: ({ title }: { title: string }) => <p>{title}</p>,
}));

jest.mock("./HallOfFameCard", () => ({
  HallOfFameCard: ({ entry }: { entry: HallOfFameEntry }) => (
    <article>{entry.member_name}</article>
  ),
}));

const entry = (
  entryId: number,
  name: string,
  actYear: number,
  actSemester: number,
): HallOfFameEntry => ({
  entry_id: entryId,
  slug: `member-${entryId}`,
  member_name: name,
  act_year: actYear,
  act_semester: actSemester,
  semester_label: `${actYear}년 ${actSemester}학기`,
  headline: null,
  introduction: null,
  achievements: [],
  badges: [],
  image_url: null,
  published_at: "2026-10-17T00:00:00+09:00",
});

describe("HallOfFameListView", () => {
  it("shows an explicit empty state when nothing is published", () => {
    render(<HallOfFameListView entries={[]} />);

    expect(
      screen.getByText("아직 공개된 명예의 전당 이야기가 없습니다"),
    ).toBeTruthy();
  });

  it("filters cards using the selected season", () => {
    render(
      <HallOfFameListView
        entries={[entry(1, "김포리", 2026, 1), entry(2, "이프리", 2025, 2)]}
      />,
    );

    fireEvent.change(screen.getByLabelText("활동 학기"), {
      target: { value: "2025-2" },
    });

    expect(screen.getByText("이프리")).toBeTruthy();
    expect(screen.queryByText("김포리")).toBeNull();
    expect(
      screen.getByText("총 1명의 이야기를 확인할 수 있어요."),
    ).toBeTruthy();
  });
});
