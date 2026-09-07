import { describe, expect, it } from "@jest/globals";

import { buildListViewParams } from "./list-view-params";

describe("buildListViewParams", () => {
  it("preserves explicit params while normalizing default semester, search, sorting, and page", () => {
    const params = buildListViewParams({
      currentSemester: "26-2",
      searchQuery: "  홍길동  ",
      sorting: [{ id: "name", desc: false }],
      preservedParams: { tab: "members", ignored: undefined },
      overrides: {},
    });

    expect(params.toString()).toBe(
      "tab=members&semester=26-2&search=%ED%99%8D%EA%B8%B8%EB%8F%99&sort=name%3Aasc&page=0",
    );
  });

  it("gives explicit overrides precedence, including clearing the inherited sorting", () => {
    const params = buildListViewParams({
      currentSemester: "26-2",
      searchQuery: "기존 검색",
      sorting: [{ id: "name", desc: false }],
      overrides: {
        semester: "전체",
        search: "새 검색",
        page: 3,
        sorting: [],
      },
    });

    expect(params.toString()).toBe(
      "semester=%EC%A0%84%EC%B2%B4&search=%EC%83%88+%EA%B2%80%EC%83%89&page=3",
    );
  });
});
