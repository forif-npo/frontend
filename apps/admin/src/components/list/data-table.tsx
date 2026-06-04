"use client";

import * as React from "react";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
  showPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderRowActions,
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const displayColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const selectionColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
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
      cell: ({ row }) => (
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
      size: 56,
    };

    return renderRowActions
      ? [selectionColumn, ...columns, actionColumn]
      : [selectionColumn, ...columns];
  }, [columns, renderRowActions]);

  const table = useReactTable({
    data,
    columns: displayColumns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(showPagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
  });

  return (
    <div>
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
                  className="hover:bg-muted/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "actions" ? "text-center" : ""
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
                  No results.
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
