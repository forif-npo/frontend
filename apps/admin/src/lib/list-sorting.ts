import type { SortingState } from "@tanstack/react-table";

export type SortSearchParam = string | string[] | undefined;

export function parseSortingParams(sort: SortSearchParam): SortingState {
  const values = Array.isArray(sort) ? sort : sort ? [sort] : [];
  const value = values[0];

  if (!value) return [];

  const [id, direction] = value.split(":");

  if (
    !/^[A-Za-z][A-Za-z0-9_]*$/.test(id) ||
    !["asc", "desc"].includes(direction)
  ) {
    return [];
  }

  return [{ id, desc: direction === "desc" }];
}

export function appendSortingParams(
  params: URLSearchParams,
  sorting: SortingState,
) {
  const criterion = sorting[0];
  if (criterion) {
    params.set("sort", `${criterion.id}:${criterion.desc ? "desc" : "asc"}`);
  }
}

function compareValues(left: unknown, right: unknown) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  return String(left).localeCompare(String(right), "ko");
}

function isEmpty(value: unknown) {
  return value === null || value === undefined || value === "";
}

/** 전체 결과를 정렬한 뒤 호출자가 페이지를 나누도록 하는 공통 비교기다. */
export function sortRecords<T>(
  records: T[],
  sorting: SortingState,
  getValue: (record: T, columnId: string) => unknown,
): T[] {
  if (sorting.length === 0) return records;

  return [...records].sort((left, right) => {
    const criterion = sorting[0];
    if (!criterion) return 0;

    const leftValue = getValue(left, criterion.id);
    const rightValue = getValue(right, criterion.id);

    if (isEmpty(leftValue) && isEmpty(rightValue)) return 0;
    if (isEmpty(leftValue)) return 1;
    if (isEmpty(rightValue)) return -1;

    const result = compareValues(leftValue, rightValue);
    return criterion.desc ? -result : result;
  });
}
