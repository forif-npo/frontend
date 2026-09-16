/** @jest-environment jsdom */
import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "./data-table";
import { SortableHeader } from "./sortable-header";

type Row = {
  id: number;
  name: string;
  canEdit: boolean;
};

const rows: Row[] = [
  { id: 1, name: "내 정보", canEdit: true },
  { id: 2, name: "다른 운영진", canEdit: false },
];

const columns: ColumnDef<Row>[] = [{ accessorKey: "name", header: "이름" }];

const sortableColumns: ColumnDef<Row>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader column={column}>번호</SortableHeader>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>이름</SortableHeader>,
  },
];

describe("DataTable", () => {
  it("행별 액션이 없으면 해당 행의 액션 메뉴를 렌더링하지 않는다", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        showPagination={false}
        renderRowActions={(row) =>
          row.canEdit ? <button type="button">수정</button> : null
        }
      />,
    );

    expect(
      screen.getAllByRole("button", { name: "행 액션 열기" }),
    ).toHaveLength(1);
    expect(screen.getByRole("table").parentElement?.className).toContain(
      "overflow-x-auto",
    );
  });

  it("행 선택을 부모에게 전달하고 반복 상태 갱신 없이 화면을 유지한다", () => {
    function SelectionHarness() {
      const [selectedRows, setSelectedRows] = useState<Row[]>([]);

      return (
        <>
          <output>{selectedRows.length}</output>
          <DataTable
            columns={columns}
            data={rows}
            showPagination={false}
            enableRowSelection
            getRowId={(row) => String(row.id)}
            onSelectedRowsChange={setSelectedRows}
          />
        </>
      );
    }

    render(<SelectionHarness />);

    expect(screen.getByRole("status").textContent).toBe("0");

    fireEvent.click(screen.getAllByRole("checkbox", { name: "행 선택" })[0]);

    expect(screen.getByRole("status").textContent).toBe("1");
  });

  it("정렬 상태를 열 헤더의 접근성 속성으로 노출한다", () => {
    const renderTable = (sorting: SortingState) => (
      <DataTable
        columns={columns}
        data={rows}
        showPagination={false}
        sorting={sorting}
        onSortingChange={() => undefined}
      />
    );
    const { rerender } = render(renderTable([{ id: "name", desc: false }]));

    expect(
      screen.getByRole("columnheader", { name: "이름" }).getAttribute("aria-sort"),
    ).toBe("ascending");

    rerender(renderTable([{ id: "name", desc: true }]));

    expect(
      screen.getByRole("columnheader", { name: "이름" }).getAttribute("aria-sort"),
    ).toBe("descending");

    rerender(renderTable([]));

    expect(
      screen.getByRole("columnheader", { name: "이름" }).hasAttribute("aria-sort"),
    ).toBe(false);
  });

  it("새 열을 정렬하면 이전 열의 정렬을 해제한다", () => {
    render(<DataTable columns={sortableColumns} data={rows} showPagination={false} />);

    fireEvent.click(screen.getByRole("button", { name: "이름" }));
    fireEvent.click(screen.getByRole("button", { name: "번호" }));

    expect(
      screen.getByRole("columnheader", { name: "이름" }).hasAttribute("aria-sort"),
    ).toBe(false);
    expect(
      screen.getByRole("columnheader", { name: "번호" }).getAttribute("aria-sort"),
    ).toBe("ascending");
  });
});
