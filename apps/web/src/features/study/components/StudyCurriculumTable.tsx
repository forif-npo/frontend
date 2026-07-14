"use client";

import { Fragment, type ReactNode } from "react";

interface StudyCurriculumTableRow<TContent> {
  id?: string | number;
  week: ReactNode;
  contents: readonly TContent[];
}

interface StudyCurriculumTableProps<TContent> {
  rows: readonly StudyCurriculumTableRow<TContent>[];
  renderDateInput: (weekIndex: number, inputClassName: string) => ReactNode;
  renderTopicInput: (weekIndex: number, inputClassName: string) => ReactNode;
  renderContentInput: (
    weekIndex: number,
    contentIndex: number,
    inputClassName: string,
  ) => ReactNode;
  onAddContent: (weekIndex: number) => void;
  addContentLabel?: string;
}

const HEADER_CELL_CLASS =
  "border-b border-secondary-10 bg-secondary-5 px-2 py-2 text-left text-[15px] font-bold leading-[1.5] text-text-bolder";
const SPANNED_BODY_CELL_CLASS =
  "border-b border-gray-20 bg-surface-white px-2 py-1.5 text-[14px] leading-[1.5] align-middle";
const INPUT_CELL_CLASS =
  "border-b border-gray-20 bg-surface-white px-2 py-0 align-middle";
const CONTENT_CELL_CLASS =
  "border-b border-gray-20 bg-surface-white px-2 py-0 align-middle";
const CONTENT_ROW_CLASS = "flex min-h-[40px] items-center";
const TABLE_INPUT_CLASS =
  "w-full rounded border border-transparent px-2 py-1 text-[15px] leading-[1.5] text-text-basic outline-none placeholder:text-text-disabled focus:border-primary-50";

const TABLE_HEADERS = ["주차", "진행 날짜", "주제", "내용"] as const;

export function StudyCurriculumTable<TContent>({
  rows,
  renderDateInput,
  renderTopicInput,
  renderContentInput,
  onAddContent,
  addContentLabel = "+ 내용 추가",
}: StudyCurriculumTableProps<TContent>) {
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[60px]" />
          <col className="w-[100px]" />
          <col className="w-[240px]" />
          <col />
        </colgroup>
        <thead>
          <tr>
            {TABLE_HEADERS.map((header) => (
              <th key={header} scope="col" className={HEADER_CELL_CLASS}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, weekIndex) => {
            const rowKey = row.id ?? weekIndex;
            const rowSpan = Math.max(row.contents.length, 1);

            return (
              <Fragment key={rowKey}>
                {row.contents.map((_, contentIndex) => (
                  <tr key={`${rowKey}-${contentIndex}`}>
                    {contentIndex === 0 && (
                      <>
                        <td
                          rowSpan={rowSpan}
                          className={`${SPANNED_BODY_CELL_CLASS} text-text-disabled`}
                        >
                          {row.week}
                        </td>
                        <td rowSpan={rowSpan} className={INPUT_CELL_CLASS}>
                          {renderDateInput(weekIndex, TABLE_INPUT_CLASS)}
                        </td>
                        <td rowSpan={rowSpan} className={INPUT_CELL_CLASS}>
                          {renderTopicInput(weekIndex, TABLE_INPUT_CLASS)}
                        </td>
                      </>
                    )}
                    <td className={CONTENT_CELL_CLASS}>
                      <div className={CONTENT_ROW_CLASS}>
                        {renderContentInput(
                          weekIndex,
                          contentIndex,
                          TABLE_INPUT_CLASS,
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr key={`${rowKey}-add`}>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="border-gray-10 bg-surface-white border-b px-4 py-0"
                  >
                    <div className="flex min-h-[40px] items-center justify-end">
                      <button
                        type="button"
                        onClick={() => onAddContent(weekIndex)}
                        className="text-text-primary text-[13px] leading-[1.5] hover:underline"
                      >
                        {addContentLabel}
                      </button>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
