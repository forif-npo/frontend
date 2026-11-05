"use client";

import { useMemo, useState } from "react";
import type { HallOfFameEntry } from "@core/types/hall-of-fame";
import { EmptyState } from "@ui/components/server";
import { HallOfFameCard } from "./HallOfFameCard";
import { filterHallOfFameEntries, getHallOfFameSeasons } from "./presentation";

export function HallOfFameListView({
  entries,
}: {
  entries: HallOfFameEntry[];
}) {
  const [season, setSeason] = useState("ALL");
  const seasons = useMemo(() => getHallOfFameSeasons(entries), [entries]);
  const visibleEntries = useMemo(
    () => filterHallOfFameEntries(entries, season),
    [entries, season],
  );

  if (entries.length === 0) {
    return (
      <EmptyState
        className="py-24"
        title="아직 공개된 명예의 전당 이야기가 없습니다"
        titleClassName="text-lg"
      />
    );
  }

  return (
    <section aria-labelledby="hall-of-fame-list-title">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="hall-of-fame-list-title"
            className="text-title-l-mobile sm:text-title-l text-text-basic font-bold"
          >
            역대 활동 이야기
          </h2>
          <p className="text-text-subtle mt-1 text-sm">
            총 {visibleEntries.length}명의 이야기를 확인할 수 있어요.
          </p>
        </div>
        <div className="w-full sm:w-48">
          <label
            htmlFor="hall-of-fame-season"
            className="text-text-basic mb-1.5 block text-sm font-semibold"
          >
            활동 학기
          </label>
          <select
            id="hall-of-fame-season"
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="border-border-gray text-text-basic focus:border-primary-50 focus:ring-primary-20 h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:ring-2"
          >
            <option value="ALL">전체 학기</option>
            {seasons.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visibleEntries.length === 0 ? (
        <EmptyState
          className="py-20"
          title="해당 학기에 공개된 이야기가 없습니다"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {visibleEntries.map((entry) => (
            <HallOfFameCard key={entry.entry_id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
