import { Button } from "@ui/components/client";
import Image from "next/image";
import type { ApplicationDetail } from "@core/my-page/api";

interface ApplicationCardProps {
  application: ApplicationDetail;
  semesterLabel: string;
  onViewDetail: () => void;
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "매우 쉬움",
  2: "쉬움",
  3: "보통",
  4: "어려움",
  5: "매우 어려움",
};

export function ApplicationCard({
  application,
  semesterLabel,
  onViewDetail,
}: ApplicationCardProps) {
  const { study, priority, intro } = application;
  const priorityLabel = priority === "PRIMARY" ? "1순위" : "2순위";
  const difficultyLabel = DIFFICULTY_LABELS[study.difficulty] ?? "보통";

  return (
    <div className="flex h-full min-w-[240px] flex-col overflow-clip">
      {/* Study Image */}
      <div className="relative h-[196px] w-full rounded-t-[12px] border border-[#c6c6c6] bg-[#dfe8f4]">
        <Image
          src={study.img_url || "/images/default-study-img.png"}
          alt={study.study_name}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-4 rounded-b-[12px] border-b border-l border-r border-[#b1b8be] bg-white px-8 py-8">
        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex h-[24px] items-center justify-center rounded-[4px] bg-[#ecf2fe] px-2 text-[15px] leading-[1.5] text-[#0b50d0]">
            {semesterLabel}
          </span>
          <span className="inline-flex h-[24px] items-center justify-center rounded-[4px] bg-[#e7f4fe] px-2 text-[15px] leading-[1.5] text-[#096ab3]">
            {priorityLabel}
          </span>
          <span className="inline-flex h-[24px] items-center justify-center rounded-[4px] bg-[#ecf2fe] px-2 text-[15px] leading-[1.5] text-[#0b50d0]">
            {difficultyLabel}
          </span>
        </div>

        {/* Study Title */}
        <p className="text-text-basic text-[17px] font-bold leading-[1.5]">
          {study.study_name}
        </p>

        {/* Intro */}
        <p className="text-text-subtle h-[80px] overflow-hidden text-[17px] leading-[1.5]">
          {intro}
        </p>

        {/* Action Button */}
        <div className="mt-auto flex items-center justify-end">
          <Button
            variant="tertiary"
            size="medium"
            className="min-w-[78px] whitespace-nowrap"
            onClick={onViewDetail}
          >
            자세히 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
