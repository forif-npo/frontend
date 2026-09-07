import { describe, expect, it } from "@jest/globals";
import { getCalendarCells, navigateDate } from "./helpers";

describe("calendar helpers", () => {
  it("fills a month grid with adjacent-month cells to complete its weeks", () => {
    const cells = getCalendarCells(new Date(2026, 3, 1));

    expect(cells).toHaveLength(35);
    expect(
      cells.slice(0, 3).map((cell) => [cell.day, cell.currentMonth]),
    ).toEqual([
      [29, false],
      [30, false],
      [31, false],
    ]);
    expect(
      cells.slice(-2).map((cell) => [cell.day, cell.currentMonth]),
    ).toEqual([
      [1, false],
      [2, false],
    ]);
  });

  it("moves by the unit associated with each calendar view", () => {
    const date = new Date(2026, 8, 7);

    expect(navigateDate(date, "day", "next")).toEqual(new Date(2026, 8, 8));
    expect(navigateDate(date, "week", "previous")).toEqual(
      new Date(2026, 7, 31),
    );
    expect(navigateDate(date, "month", "next")).toEqual(new Date(2026, 9, 7));
  });
});
