import { describe, expect, it } from "@jest/globals";

import { buildListViewParams } from "../../lib/list-view-params";

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
});
