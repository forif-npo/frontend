import type { SortingState } from "@tanstack/react-table";
import { sortRecords } from "../../../lib/list-sorting";
import type {
  Operator,
  OperatorListResult,
  OperatorSemesterLabel,
} from "./types";

interface ProcessOperatorsOptions {
  semester: OperatorSemesterLabel;
  page: number;
  size: number;
  search?: string;
  sorting: SortingState;
  mainSemesterLabels?: Set<string>;
}

function compareSemesterDesc(a: Operator, b: Operator) {
  const yearDiff = b.actYear - a.actYear;

  return yearDiff !== 0 ? yearDiff : b.actSemester - a.actSemester;
}

/** 운영진 API 결과를 탭·검색·정렬 기준으로 정규화한 뒤 페이지를 나눈다. */
export function processOperators(
  operators: Operator[],
  {
    semester,
    page,
    size,
    search,
    sorting,
    mainSemesterLabels = new Set<string>(),
  }: ProcessOperatorsOptions,
): OperatorListResult {
  let content = [...operators].sort(compareSemesterDesc);

  if (semester === "그 외") {
    content = content.filter((item) => {
      const label = `${String(item.actYear).slice(2)}-${item.actSemester}`;
      return !mainSemesterLabels.has(label);
    });
  }

  const normalizedSearch = search?.trim().toLowerCase();
  if (normalizedSearch) {
    content = content.filter((operator) =>
      [
        operator.userId,
        operator.department,
        operator.name,
        operator.phoneNum,
        operator.title,
      ]
        .map(String)
        .some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }

  content = sortRecords(content, sorting, (operator, id) => {
    const values: Record<string, unknown> = {
      userId: operator.userId,
      department: operator.department,
      title: operator.title,
      name: operator.name,
    };

    return values[id];
  });

  const currentPage = Math.max(page, 0);
  const pageSize = Math.max(size, 1);
  const totalElements = content.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const from = currentPage * pageSize;

  return {
    content: content.slice(from, from + pageSize),
    totalElements,
    currentPage,
    totalPages,
    pageSize,
  };
}
