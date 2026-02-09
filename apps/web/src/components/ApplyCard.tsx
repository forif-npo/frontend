"use client";
import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { Button } from "@repo/ui/components/client";
import { Badge, Body, Heading } from "@repo/ui/components/server";
import {
  getDifficultyLabel,
  getDifficultyBadgeVariant,
} from "@/constants/study";

interface ApplyCardProps {
  title: string;
  description: string;
  status?: "신청중" | "신청 종료";
  language?: string;
  level?: string;
  difficulty?: string;
  schedule?: string;
  instructors?: string;
  imageUrl?: string;
  disabled?: boolean;
  onDetailClick?: () => void;
  onApplyClick?: () => void;
  className?: string;
}

const getStatusVariant = (status?: string) => {
  if (status === "신청 종료") return "disabled";
  return "primary";
};

export const ApplyCard: React.FC<ApplyCardProps> = ({
  title,
  description,
  status,
  language,
  level,
  difficulty,
  schedule,
  instructors,
  imageUrl = "/images/temp_python.png",
  disabled,
  onDetailClick,
  onApplyClick,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex w-full flex-col overflow-hidden rounded-b-xl border border-gray-200 bg-white",
        className,
      )}
    >
      <div className="relative h-[196px] w-full bg-[#DFE8F4]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-col gap-4 p-8">
        <div className="flex gap-1 overflow-x-auto text-nowrap">
          {status && (
            <Badge
              label={status}
              variant={getStatusVariant(status)}
              appearance="solid-pastel"
              size="small"
            />
          )}
          {language && (
            <Badge
              label={language}
              variant="danger"
              appearance="solid-pastel"
              size="small"
            />
          )}
          {level && (
            <Badge
              label={level}
              variant="primary"
              appearance="solid-pastel"
              size="small"
            />
          )}
          {difficulty && (
            <Badge
              label={getDifficultyLabel(difficulty)}
              variant={getDifficultyBadgeVariant(difficulty)}
              appearance="solid-pastel"
              size="small"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Heading size="xs" className="text-text-basic line-clamp-1">
            {title}
          </Heading>

          <Body size="m" className="text-text-subtle line-clamp-5 h-20">
            {description}
          </Body>

          <div className="text-text-basic flex items-center gap-2">
            <Body size="m" className="whitespace-nowrap">
              {schedule}
            </Body>
            <div className="h-[21px] w-[1px] bg-black" />
            <Body size="m" className="whitespace-nowrap">
              {instructors}
            </Body>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-end gap-4 self-stretch">
          <Button variant="tertiary" size="medium" onClick={onDetailClick}>
            자세히 보기
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={onApplyClick}
            disabled={disabled || status === "신청 종료"}
          >
            신청하기
          </Button>
        </div>
      </div>
    </div>
  );
};
