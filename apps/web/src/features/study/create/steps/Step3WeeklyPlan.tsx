"use client";

import { Button } from "@ui/components/client";
import { UseFormReturn } from "react-hook-form";
import type { StudyOpenValues } from "@core/schemas";

interface Step3WeeklyPlanProps {
  form: UseFormReturn<StudyOpenValues>;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

const curriculumGridColumns = "grid-cols-[120px_120px_320px_minmax(320px,1fr)]";
const tableHeaderCellClass =
  "text-text-bolder border-b border-[#d6e0eb] bg-[#eef2f7] px-4 py-2 text-[15px] font-bold leading-[1.5]";
const tableBodyCellClass =
  "flex min-h-[40px] items-center border-b border-[#cdd1d5] bg-white px-4 py-1.5 text-[17px] leading-[1.5]";
const tableInputCellClass =
  "flex min-h-[40px] items-center border-b border-[#cdd1d5] bg-white px-2 py-0";
const tableContentListClass = "border-b border-[#cdd1d5] bg-white";
const tableContentRowClass = "flex min-h-[40px] items-center px-2 py-0";
const tableInputClass =
  "text-text-basic placeholder:text-text-disabled w-full rounded border border-transparent px-2 py-1 text-[17px] leading-[1.5] outline-none focus:border-blue-500";

export function Step3WeeklyPlan({
  form,
  onPrevious,
  onNext,
  onSaveDraft,
}: Step3WeeklyPlanProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const curriculum = watch("curriculum");

  const addContent = (weekIndex: number) => {
    const updated = [...curriculum];
    updated[weekIndex] = {
      ...updated[weekIndex],
      contents: [...updated[weekIndex].contents, ""],
    };
    setValue("curriculum", updated);
  };

  return (
    <div className="flex w-full flex-col gap-12">
      {/* 제목 */}
      <p className="text-text-basic text-[24px] font-bold leading-[1.5]">
        주차별 계획
      </p>

      {/* 본문 */}
      <div className="flex flex-col gap-6">
        {/* 커리큘럼 라벨 */}
        <div className="flex flex-col gap-6">
          <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
            커리큘럼
          </h3>

          {/* 테이블 */}
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[880px]">
              {/* 테이블 헤더 */}
              <div className={`grid ${curriculumGridColumns}`}>
                <div className={tableHeaderCellClass}>주차</div>
                <div className={tableHeaderCellClass}>진행 날짜</div>
                <div className={tableHeaderCellClass}>주제</div>
                <div className={tableHeaderCellClass}>내용</div>
              </div>

              {/* 테이블 바디 */}
              {curriculum.map((week, weekIndex) => (
                <div key={weekIndex}>
                  <div
                    className={`grid ${curriculumGridColumns} items-stretch`}
                  >
                    {/* 주차 */}
                    <div className={`${tableBodyCellClass} text-text-disabled`}>
                      {week.week}
                    </div>

                    {/* 진행 날짜 */}
                    <div className={tableInputCellClass}>
                      <input
                        className={tableInputClass}
                        placeholder="25.09.07"
                        {...register(`curriculum.${weekIndex}.date`)}
                      />
                    </div>

                    {/* 주제 */}
                    <div className={tableInputCellClass}>
                      <input
                        className={tableInputClass}
                        placeholder={`${week.week}주차 주제를 입력해주세요.`}
                        {...register(`curriculum.${weekIndex}.topic`)}
                      />
                    </div>

                    {/* 내용 */}
                    <div className={tableContentListClass}>
                      {week.contents.map((_, contentIndex) => (
                        <div
                          key={`${weekIndex}-${contentIndex}`}
                          className={`${tableContentRowClass} ${
                            contentIndex < week.contents.length - 1
                              ? "border-b border-[#cdd1d5]"
                              : ""
                          }`}
                        >
                          <input
                            className={tableInputClass}
                            placeholder={`${week.week}주차 내용을 입력해주세요.`}
                            {...register(
                              `curriculum.${weekIndex}.contents.${contentIndex}`,
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* + 내용 추가 */}
                  <div
                    className={`grid ${curriculumGridColumns} border-b border-[#e5e8eb] bg-white`}
                  >
                    <div className="col-span-4 flex min-h-[40px] items-center justify-end px-4 py-0">
                      <button
                        type="button"
                        onClick={() => addContent(weekIndex)}
                        className="text-text-primary text-[15px] leading-[1.5] hover:underline"
                      >
                        + 내용 추가
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {errors.curriculum && (
            <p className="text-text-danger text-[14px]">
              {typeof errors.curriculum.message === "string"
                ? errors.curriculum.message
                : "커리큘럼을 모두 작성해주세요."}
            </p>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-start gap-4">
        <div className="flex flex-1 gap-4">
          <Button
            variant="secondary"
            size="large"
            onClick={onSaveDraft}
            className="h-14 min-w-[90px]"
            type="button"
          >
            임시저장
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={() => {}}
            className="h-14 min-w-[90px]"
            type="button"
          >
            미리보기
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="tertiary"
            size="large"
            onClick={onPrevious}
            className="h-14 min-w-[90px]"
            type="button"
          >
            이전
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={onNext}
            className="h-14 min-w-[90px]"
            type="button"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
