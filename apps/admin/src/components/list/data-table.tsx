"use client";

import * as React from "react";
import type {
  ColumnDef,
  RowSelectionState,
  Table as ReactTable,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/list/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderRowActions?: (row: TData) => React.ReactNode;
  /** 드롭다운 대신 행 안에 직접 표시할 액션 UI */
  renderActionCell?: (row: TData) => React.ReactNode;
  actionColumnSize?: number;
  showPagination?: boolean;
  /** 선택 결과를 사용하는 화면에서만 선택 열을 노출한다. */
  enableRowSelection?: boolean;
  getRowId?: (row: TData, index: number) => string;
  onSelectedRowsChange?: (rows: TData[]) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  renderSelectionHeader?: (table: ReactTable<TData>) => React.ReactNode;
  emptyMessage?: React.ReactNode;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** 목록 맥락이 바뀌면 비제어 정렬을 초기화할 식별자 */
  resetSortingKey?: string | number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderRowActions,
  renderActionCell,
  actionColumnSize,
  showPagination = true,
  enableRowSelection = false,
  getRowId,
  onSelectedRowsChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: controlledOnRowSelectionChange,
  renderSelectionHeader,
  emptyMessage = "No results.",
  sorting: controlledSorting,
  onSortingChange: controlledOnSortingChange,
  resetSortingKey,
}: DataTableProps<TData, TValue>) {
  const [localSorting, setLocalSorting] = React.useState<SortingState>([]);
  const [localRowSelection, setLocalRowSelection] =
    React.useState<RowSelectionState>({});
  const sorting = controlledSorting ?? localSorting;
  const onSortingChange = controlledOnSortingChange ?? setLocalSorting;
  const isExternallySorted = controlledSorting !== undefined;
  const rowSelection = controlledRowSelection ?? localRowSelection;
  const onRowSelectionChange =
    controlledOnRowSelectionChange ?? setLocalRowSelection;

  const displayColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const selectionColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          {renderSelectionHeader?.(table) ?? (
            <input
              type="checkbox"
              aria-label="모든 행 선택"
              className="h-4 w-4 cursor-pointer"
              checked={table.getIsAllPageRowsSelected()}
              ref={(el) => {
                if (!el) return;
                el.indeterminate =
                  !table.getIsAllPageRowsSelected() &&
                  table.getIsSomePageRowsSelected();
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                table.toggleAllPageRowsSelected(e.target.checked)
              }
            />
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            aria-label="행 선택"
            className="h-4 w-4 cursor-pointer"
            checked={row.getIsSelected()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              row.toggleSelected(e.target.checked)
            }
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 52,
    };

    const actionColumn: ColumnDef<TData, TValue> = {
      id: "actions",
      header: () => <div className="w-10" />,
      cell: ({ row }) =>
        renderActionCell ? (
          <div className="flex items-center justify-end gap-1">
            {renderActionCell(row.original)}
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">행 액션 열기</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="z-50 w-44">
                {renderRowActions?.(row.original)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      enableSorting: false,
      enableHiding: false,
      size: actionColumnSize ?? (renderActionCell ? 320 : 56),
    };

    const columnsWithSelection = enableRowSelection
      ? [selectionColumn, ...columns]
      : columns;

    return renderRowActions || renderActionCell
      ? [...columnsWithSelection, actionColumn]
      : columnsWithSelection;
  }, [
    actionColumnSize,
    columns,
    enableRowSelection,
    renderActionCell,
    renderRowActions,
    renderSelectionHeader,
  ]);

  const table = useReactTable({
    data,
    columns: displayColumns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection,
    enableMultiSort: true,
    onSortingChange,
    onRowSelectionChange,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    // 제어형 목록은 페이지가 요청한 정렬 결과를 그대로 표시한다.
    // 비제어형 표에서만 현재 브라우저의 행을 정렬한다.
    manualSorting: isExternallySorted,
    ...(!isExternallySorted ? { getSortedRowModel: getSortedRowModel() } : {}),
    ...(showPagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
  });

  const selectedRows = React.useMemo(
    () =>
      data.filter((row, index) =>
        Boolean(rowSelection[getRowId?.(row, index) ?? String(index)]),
      ),
    [data, getRowId, rowSelection],
  );

  React.useEffect(() => {
    onSelectedRowsChange?.(selectedRows);
  }, [onSelectedRowsChange, selectedRows]);

  React.useEffect(() => {
    if (controlledRowSelection === undefined) {
      setLocalRowSelection({});
    }
  }, [controlledRowSelection, data]);

  React.useEffect(() => {
    if (controlledSorting === undefined) {
      setLocalSorting([]);
    }
  }, [controlledSorting, resetSortingKey]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || sorting.length === 0) return;

      const target = event.target;
      if (!(target instanceof Element) || !target.closest("table")) return;

      event.preventDefault();
      onSortingChange([]);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSortingChange, sorting.length]);

  return (
    <div>
      <div className="text-muted-foreground mb-1 flex justify-end px-1 text-[10px]">
        Esc 키를 누르면 정렬이 해제됩니다.
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize()
                        ? `${header.getSize()}px`
                        : undefined,
                    }}
                    className={
                      header.column.id === "actions" ? "text-center" : ""
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="hover:bg-muted/40 h-12"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "actions"
                          ? "h-12 px-4 py-0 text-center"
                          : "h-12 px-4 py-0"
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={displayColumns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
