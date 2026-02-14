import type {
  RecruitStatus,
  Study,
  StudyDifficulty,
} from "@repo/core/types/study";
import { Badge, Body, Label } from "@ui/components/server";
import Image from "next/image";
import Link from "next/link";

const DIFFICULTY_LABEL: Record<StudyDifficulty, string> = {
  EASY: "쉬움",
  SEMI_EASY: "조금 쉬움",
  NORMAL: "보통",
  SEMI_HARD: "조금 어려움",
  HARD: "어려움",
};

const DIFFICULTY_VARIANT: Record<
  StudyDifficulty,
  "success" | "info" | "warning" | "danger"
> = {
  EASY: "success",
  SEMI_EASY: "success",
  NORMAL: "info",
  SEMI_HARD: "warning",
  HARD: "danger",
};

const RECRUIT_STATUS_LABEL: Record<RecruitStatus, string> = {
  APPLICABLE: "모집 중",
  CLOSED: "모집 마감",
};

const RECRUIT_STATUS_VARIANT: Record<RecruitStatus, "primary" | "danger"> = {
  APPLICABLE: "primary",
  CLOSED: "danger",
};

interface StudyCardProps {
  study: Study;
}

export function StudyCard({ study }: StudyCardProps) {
  return (
    <Link
      href={`/studies/${study.id}`}
      className="rounded-3 border-border-gray-light bg-surface-white group flex flex-col overflow-hidden border transition-shadow hover:shadow-md"
    >
      <div className="relative h-[196px] w-full overflow-hidden">
        <Image
          src={study.img_url || "/images/default-study-img.png"}
          alt={study.study_name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge
            label={RECRUIT_STATUS_LABEL[study.recruit_status]}
            variant={RECRUIT_STATUS_VARIANT[study.recruit_status]}
            appearance="solid-pastel"
            size="medium"
          />
          <Badge
            label={DIFFICULTY_LABEL[study.difficulty]}
            variant={DIFFICULTY_VARIANT[study.difficulty]}
            appearance="solid-pastel"
            size="medium"
          />
          {study.tags.map((tag) => (
            <Badge
              key={tag}
              label={tag}
              variant="info"
              appearance="solid-pastel"
              size="medium"
            />
          ))}
        </div>
        <Body size="l" className="text-text-basic mb-2 line-clamp-1 font-bold">
          {study.study_name}
        </Body>
        <Body size="m" className="text-text-subtle mb-4 line-clamp-3">
          {study.one_liner}
        </Body>
        <div className="mt-auto flex items-center justify-between">
          <Body size="s" className="text-text-subtle">
            멘토: {study.primary_mentor_name}
            {study.secondary_mentor_name && `, ${study.secondary_mentor_name}`}
          </Body>
          <Label size="m" className="text-text-primary group-hover:underline">
            자세히보기 →
          </Label>
        </div>
      </div>
    </Link>
  );
}
