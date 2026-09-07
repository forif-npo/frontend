import { describe, expect, it } from "@jest/globals";

import {
  appendSortingParams,
  parseSortingParams,
  serializeSortingParams,
  sortRecords,
} from "./list-sorting";
import { paginateLocally } from "./paginate";

describe("list sorting", () => {
  it("serializes sorting for URL params and discards unsafe query values", () => {
    const sorting = [
      { id: "userName", desc: false },
      { id: "createdAt", desc: true },
    ];
    const params = new URLSearchParams();

    expect(serializeSortingParams(sorting)).toEqual([
      "userName:asc",
      "createdAt:desc",
    ]);
    appendSortingParams(params, sorting);
    expect(params.toString()).toBe("sort=userName%3Aasc&sort=createdAt%3Adesc");
    expect(
      parseSortingParams(["userName:asc", "name:invalid", "<script>:desc"]),
    ).toEqual([{ id: "userName", desc: false }]);
  });

  it("sorts by multiple fields without mutating the original records", () => {
    const records = [
      { name: "가", score: 1, active: true },
      { name: "나", score: 2, active: false },
      { name: "다", score: 2, active: true },
      { name: "미정", score: null, active: false },
    ];

    const sorted = sortRecords(
      records,
      [
        { id: "score", desc: true },
        { id: "active", desc: false },
      ],
      (record, id) => record[id as keyof typeof record],
    );

    expect(sorted.map((record) => record.name)).toEqual([
      "나",
      "다",
      "가",
      "미정",
    ]);
    expect(records.map((record) => record.name)).toEqual([
      "가",
      "나",
      "다",
      "미정",
    ]);
  });
});

describe("paginateLocally", () => {
  it("normalizes invalid page inputs before slicing the local result", () => {
    expect(paginateLocally([1, 2, 3], -1, 0)).toEqual({
      content: [1],
      totalElements: 3,
      currentPage: 0,
      totalPages: 3,
      pageSize: 1,
    });
  });
});
