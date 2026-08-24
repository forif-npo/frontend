import {
  type ColumnDef,
  type SortingState,
  createTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { describe, expect, it } from "@jest/globals";
import {
  appendSortingParams,
  parseSortingParams,
} from "../../../lib/list-sorting";

type Row = { userId: number };

describe("DataTable 단일 정렬 흐름", () => {
  it("클릭마다 asc, desc, 해제 순서로 행 모델을 전환한다", () => {
    const rows: Row[] = [{ userId: 20 }, { userId: 10 }, { userId: 30 }];
    const columns: ColumnDef<Row>[] = [{ accessorKey: "userId" }];
    let sorting: SortingState = [];

    const table = createTable({
      data: rows,
      columns,
      state: { sorting },
      onStateChange: () => undefined,
      onSortingChange: (updater) => {
        sorting = typeof updater === "function" ? updater(sorting) : updater;
        table.setOptions((previous) => ({
          ...previous,
          state: { ...previous.state, sorting },
        }));
      },
      renderFallbackValue: null,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      enableMultiSort: true,
    });

    const column = table.getColumn("userId")!;
    const clickHeader = () => {
      const direction = column.getIsSorted();
      if (direction === "desc") {
        column.clearSorting();
        return;
      }
      column.toggleSorting(direction === "asc");
    };

    clickHeader();
    expect(table.getRowModel().rows.map((row) => row.original.userId)).toEqual([
      10, 20, 30,
    ]);

    clickHeader();
    expect(table.getRowModel().rows.map((row) => row.original.userId)).toEqual([
      30, 20, 10,
    ]);

    clickHeader();
    expect(table.getState().sorting).toEqual([]);
    expect(table.getRowModel().rows.map((row) => row.original.userId)).toEqual([
      20, 10, 30,
    ]);
  });

  it("다른 열을 클릭하면 보조 정렬을 추가하고 다시 해제한다", () => {
    type MultiRow = { userId: number; department: string };
    const rows: MultiRow[] = [
      { userId: 20, department: "다" },
      { userId: 10, department: "나" },
      { userId: 20, department: "가" },
    ];
    const columns: ColumnDef<MultiRow>[] = [
      { accessorKey: "userId" },
      { accessorKey: "department" },
    ];
    let sorting: SortingState = [];

    const table = createTable({
      data: rows,
      columns,
      state: { sorting },
      onStateChange: () => undefined,
      onSortingChange: (updater) => {
        sorting = typeof updater === "function" ? updater(sorting) : updater;
        table.setOptions((previous) => ({
          ...previous,
          state: { ...previous.state, sorting },
        }));
      },
      renderFallbackValue: null,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      enableMultiSort: true,
    });

    const userId = table.getColumn("userId")!;
    const department = table.getColumn("department")!;
    const click = (column: typeof userId) => {
      const direction = column.getIsSorted();
      if (direction === "desc") {
        column.clearSorting();
        return;
      }
      column.toggleSorting(direction === "asc", true);
    };

    click(userId);
    click(department);
    expect(table.getState().sorting).toEqual([
      { id: "userId", desc: false },
      { id: "department", desc: false },
    ]);
    expect(
      table.getRowModel().rows.map((row) => row.original.department),
    ).toEqual(["나", "가", "다"]);

    click(department);
    expect(
      table.getRowModel().rows.map((row) => row.original.department),
    ).toEqual(["나", "다", "가"]);

    click(department);
    expect(table.getState().sorting).toEqual([{ id: "userId", desc: false }]);
  });

  it("다중 sort 쿼리를 만들고 해제되면 제거한다", () => {
    const params = new URLSearchParams({ semester: "26-1", page: "0" });
    const sorting = parseSortingParams(["userId:asc", "department:desc"]);

    appendSortingParams(params, sorting);
    expect(params.toString()).toBe(
      "semester=26-1&page=0&sort=userId%3Aasc&sort=department%3Adesc",
    );

    params.delete("sort");
    appendSortingParams(params, []);
    expect(params.has("sort")).toBe(false);
  });
});
