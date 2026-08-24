import { describe, expect, it } from "@jest/globals";

import { buildListViewParams } from "../../lib/list-view-params";
import {
  parseSortingParams,
  serializeSortingParams,
} from "../../lib/list-sorting";

describe("buildListViewParams", () => {
  it("정렬 요청에도 화면별 보존 파라미터를 유지한다", () => {
    const params = buildListViewParams({
      currentSemester: "26-1",
      searchQuery: "",
      sorting: [{ id: "created_at", desc: false }],
      preservedParams: { include_processed: "true" },
      overrides: { page: 0 },
    });

    expect(params.toString()).toBe(
      "include_processed=true&semester=26-1&sort=created_at%3Aasc&page=0",
    );
  });

  it("서버에서 받은 다중 정렬 상태를 다시 파싱해도 보존한다", () => {
    const initialSorting = [
      { id: "primary_mentor_name", desc: false },
      { id: "study_name", desc: true },
    ];
    const sortingKey = serializeSortingParams(initialSorting).join(",");

    expect(parseSortingParams(sortingKey.split(","))).toEqual(initialSorting);
  });
});
