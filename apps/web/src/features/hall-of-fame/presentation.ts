import type { HallOfFameEntry } from "@core/types/hall-of-fame";

export interface HallOfFameSeason {
  act_year: number;
  act_semester: number;
  label: string;
  value: string;
}

export function getSeasonValue(actYear: number, actSemester: number) {
  return `${actYear}-${actSemester}`;
}

export function getHallOfFameSeasons(
  entries: HallOfFameEntry[],
): HallOfFameSeason[] {
  const seasons = new Map<string, HallOfFameSeason>();

  entries.forEach((entry) => {
    const value = getSeasonValue(entry.act_year, entry.act_semester);
    if (!seasons.has(value)) {
      seasons.set(value, {
        act_year: entry.act_year,
        act_semester: entry.act_semester,
        label: entry.semester_label,
        value,
      });
    }
  });

  return Array.from(seasons.values()).sort(
    (a, b) => b.act_year - a.act_year || b.act_semester - a.act_semester,
  );
}

export function filterHallOfFameEntries(
  entries: HallOfFameEntry[],
  season: string,
) {
  if (season === "ALL") return entries;

  return entries.filter(
    (entry) => getSeasonValue(entry.act_year, entry.act_semester) === season,
  );
}
