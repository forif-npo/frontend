import { Badge, Body, Label } from "@ui/components/server";
import { Button } from "@ui/components/client";
import Image from "next/image";
import Link from "next/link";
import type { ApplicationDetail } from "@core/my-page/api";

interface ApplicationCardProps {
  application: ApplicationDetail;
  semesterLabel: string;
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
}: ApplicationCardProps) {
  const { study, priority, intro } = application;
  const priorityLabel = priority === "PRIMARY" ? "1순위" : "2순위";
  const difficultyLabel = DIFFICULTY_LABELS[study.difficulty] || "보통";

  return (
    <div className="flex w-full max-w-[384px] flex-col overflow-hidden rounded-xl border border-gray-300">
      {/* Study Image */}
      <div className="relative h-[196px] w-full bg-blue-50">
        <Image
          src={study.img_url || "/images/default-study-img.png"}
          alt={study.study_name}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-4 bg-white p-8">
        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          <Badge
            label={semesterLabel}
            variant="primary"
            appearance="solid-pastel"
            size="medium"
          />
          <Badge
            label={priorityLabel}
            variant="info"
            appearance="solid-pastel"
            size="medium"
          />
          <Badge
            label={difficultyLabel}
            variant="primary"
            appearance="solid-pastel"
            size="medium"
          />
        </div>

        {/* Study Title */}
        <Label size="l" className="font-bold text-gray-900">
          {study.study_name}
        </Label>

        {/* Application Intro */}
        <Body
          size="m"
          className="line-clamp-3 h-20 overflow-hidden text-gray-600"
        >
          {intro}
        </Body>

        {/* Action Button */}
        <div className="mt-2 flex w-full justify-end">
          <Link href={`/studies/${study.study_id}`}>
            <Button
              variant="secondary"
              className="min-w-[100px] whitespace-nowrap"
            >
              자세히 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
