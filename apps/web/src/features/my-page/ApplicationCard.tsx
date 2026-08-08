import { Button } from "@ui/components/client";
import { Badge } from "@ui/components/server";
import type { ApplicationDetail } from "@core/my-page/api";
import { StudyImage } from "@/components/study/ui/StudyImage";

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
    <div className="rounded-3 border-border-gray-light bg-surface-white flex h-full min-w-[240px] flex-col overflow-hidden border">
      {/* Study Image */}
      <div className="bg-surface-gray-subtle relative h-[196px] w-full">
        <StudyImage
          src={study.img_url}
          alt={study.study_name}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-4 px-8 py-8">
        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          <Badge
            label={semesterLabel}
            variant="info"
            appearance="solid-pastel"
            size="small"
          />
          <Badge
            label={priorityLabel}
            variant="info"
            appearance="solid-pastel"
            size="small"
          />
          <Badge
            label={difficultyLabel}
            variant="primary"
            appearance="solid-pastel"
            size="small"
          />
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
