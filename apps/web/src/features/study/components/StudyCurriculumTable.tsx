"use client";

import { Fragment, type ReactNode } from "react";
import { CircleMinus, CirclePlus } from "@repo/assets/icons/lucide";

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
  onRemoveContent?: (weekIndex: number, contentIndex: number) => void;
  onAddWeek?: () => void;
  onRemoveWeek?: (weekIndex: number) => void;
  addContentLabel?: string;
  addWeekLabel?: string;
}

const HEADER_CELL_CLASS =
  "border-b border-secondary-10 bg-secondary-5 px-2 py-2 text-left text-[15px] font-bold leading-[1.5] text-text-bolder";
const SPANNED_BODY_CELL_CLASS =
  "border-b border-gray-20 bg-surface-white px-2 py-2 text-[15px] leading-[1.5] align-top";
const INPUT_CELL_CLASS =
  "border-b border-gray-20 bg-surface-white px-2 py-2 align-top";
const CONTENT_CELL_CLASS =
  "border-b border-gray-20 bg-surface-white px-2 py-2 align-top";
const CONTENT_ROW_CLASS = "flex items-start";
const TABLE_INPUT_CLASS =
  "block w-full rounded border border-transparent px-2 py-0 text-[15px] leading-[1.5] text-text-basic outline-none placeholder:text-text-disabled focus:border-primary-50";

const TABLE_COLUMN_COUNT = 5;

export function StudyCurriculumTable<TContent>({
  rows,
  renderDateInput,
  renderTopicInput,
  renderContentInput,
  onAddContent,
  onRemoveContent,
  onAddWeek,
  onRemoveWeek,
  addContentLabel = "+ 내용 추가",
  addWeekLabel = "+ 주차 추가",
}: StudyCurriculumTableProps<TContent>) {
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[24px]" />
          <col className="w-[36px]" />
          <col className="w-[100px]" />
          <col className="w-[240px]" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" colSpan={2} className={HEADER_CELL_CLASS}>
              주차
            </th>
            <th scope="col" className={HEADER_CELL_CLASS}>
              진행 날짜
            </th>
            <th scope="col" className={HEADER_CELL_CLASS}>
              주제
            </th>
            <th scope="col" className={HEADER_CELL_CLASS}>
              내용
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, weekIndex) => {
            const rowKey = row.id ?? weekIndex;
            const rowSpan = Math.max(row.contents.length, 1);
            const canRemoveContent =
              Boolean(onRemoveContent) && row.contents.length > 1;
            const canRemoveWeek = Boolean(onRemoveWeek) && weekIndex >= 8;

            return (
              <Fragment key={rowKey}>
                {row.contents.map((_, contentIndex) => {
                  const isLastContent =
                    contentIndex === row.contents.length - 1;

                  return (
                    <tr key={`${rowKey}-${contentIndex}`}>
                      {contentIndex === 0 && (
                        <>
                          <td
                            rowSpan={rowSpan}
                            className={SPANNED_BODY_CELL_CLASS}
                          >
                            {canRemoveWeek && (
                              <button
                                type="button"
                                onClick={() => onRemoveWeek?.(weekIndex)}
                                className="text-text-danger flex h-4 w-4 items-center justify-center"
                                aria-label={`${row.week}주차 삭제`}
                              >
                                <CircleMinus className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                          <td
                            rowSpan={rowSpan}
                            className={`${SPANNED_BODY_CELL_CLASS} text-text-basic text-center`}
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
                        <div className={`${CONTENT_ROW_CLASS} gap-2`}>
                          <div className="min-w-0 flex-1">
                            {renderContentInput(
                              weekIndex,
                              contentIndex,
                              TABLE_INPUT_CLASS,
                            )}
                          </div>
                          {canRemoveContent && (
                            <button
                              type="button"
                              onClick={() =>
                                onRemoveContent?.(weekIndex, contentIndex)
                              }
                              className="text-text-danger mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center"
                              aria-label={`${row.week}주차 ${contentIndex + 1}번째 내용 삭제`}
                            >
                              <CircleMinus className="h-4 w-4" />
                            </button>
                          )}
                          {isLastContent && (
                            <button
                              type="button"
                              onClick={() => onAddContent(weekIndex)}
                              className="text-text-primary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center"
                              aria-label={`${row.week}주차 ${addContentLabel.replace(/^\+\s*/, "")}`}
                              title={addContentLabel}
                            >
                              <CirclePlus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
          {onAddWeek && (
            <tr>
              <td
                colSpan={TABLE_COLUMN_COUNT}
                className="border-gray-10 bg-surface-white border-b px-4 py-0"
              >
                <div className="flex min-h-[40px] items-center justify-start">
                  <button
                    type="button"
                    onClick={onAddWeek}
                    className="text-text-secondary text-[13px] leading-[1.5] hover:underline"
                  >
                    {addWeekLabel}
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
