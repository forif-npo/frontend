/** @jest-environment jsdom */

import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { DataTable } from "./data-table";

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
});
