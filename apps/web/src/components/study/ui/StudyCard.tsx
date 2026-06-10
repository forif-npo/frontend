"use client";

import {
  formatStudyTimeRange,
  getDifficultyBadgeVariant,
  getDifficultyLabel,
  getRecruitStatusBadgeVariant,
  getRecruitStatusLabel,
  getWeekDayLabel,
} from "@/constants/study";
import type { Study, RecruitStatus, StudyDifficulty } from "@/types/study";
import { Button } from "@ui/components/client";
import { Badge, Body, Heading, Label } from "@ui/components/server";
import Link from "next/link";
import { StudyImage } from "./StudyImage";

// ── Variant-specific props ──────────────────────────────────────────

interface HomeVariantProps {
  variant: "home";
  study: Study;
}

interface ListVariantProps {
  variant: "list";
  study: Study;
  onDetailClick?: () => void;
  onApplyClick?: () => void;
}

interface MyPageVariantProps {
  variant: "mypage";
  study: {
    study_id: number;
    study_name: string;
    one_liner: string;
    img_url: string;
    primary_mentor_name: string;
    secondary_mentor_name: string | null;
    start_time: string;
    end_time: string;
    week_day: number;
    location: string;
  };
  semesterLabel: string;
  isCurrent?: boolean;
  onDownloadCertificate: () => void;
}

export type StudyCardProps =
  | HomeVariantProps
  | ListVariantProps
  | MyPageVariantProps;

// ── Helpers ─────────────────────────────────────────────────────────

function getMentorText(
  primary: string,
  secondary: string | null,
  separator = ", ",
) {
  return secondary ? `${primary}${separator}${secondary}` : primary;
}

// ── Component ───────────────────────────────────────────────────────

export function StudyCard(props: StudyCardProps) {
  const { variant, study } = props;

  const studyName = study.study_name;
  const oneLiner = study.one_liner;
  const imgUrl = study.img_url;
  const primaryMentor = study.primary_mentor_name;
  const secondaryMentor = study.secondary_mentor_name;

  // ── Image ──
  const imageSection = (
    <div className="relative h-[176px] w-full overflow-hidden bg-[#DFE8F4] md:h-[196px]">
      <StudyImage
        src={imgUrl}
        alt={studyName}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );

  if (variant === "home") {
    const s = study as Study;
    return (
      <Link
        href={`/studies/detail/${s.id}`}
        className="rounded-3 border-border-gray-light bg-surface-white group flex flex-row overflow-hidden border transition-shadow hover:shadow-md md:flex-col"
      >
        {/* Mobile: small thumbnail / Desktop: full-width image */}
        <div className="relative h-auto w-[120px] shrink-0 bg-[#DFE8F4] md:hidden">
          <StudyImage
            src={imgUrl}
            alt={studyName}
            fill
            className="object-cover"
            sizes="120px"
          />
        </div>
        <div className="hidden md:block">{imageSection}</div>

        <div className="flex flex-1 flex-col p-4 md:p-8">
          <div className="mb-2 flex flex-wrap gap-1 md:mb-4 md:gap-2">
            <Badge
              label={getRecruitStatusLabel(s.recruit_status)}
              variant={getRecruitStatusBadgeVariant(s.recruit_status)}
              appearance="solid-pastel"
              size="small"
            />
            {s.tags.slice(0, 1).map((tag) => (
              <Badge
                key={tag}
                label={tag}
                variant="info"
                appearance="solid-pastel"
                size="small"
              />
            ))}
            <span className="md:hidden" />
            <Badge
              label={getDifficultyLabel(s.difficulty)}
              variant={getDifficultyBadgeVariant(s.difficulty)}
              appearance="solid-pastel"
              size="small"
              // hide on mobile to save space — shown in desktop below
            />
          </div>
          <Body
            size="l"
            className="text-text-basic mb-1 line-clamp-1 font-bold md:mb-2"
          >
            {studyName}
          </Body>
          <Body
            size="m"
            className="text-text-subtle mb-2 line-clamp-2 md:mb-4 md:line-clamp-3"
          >
            {oneLiner}
          </Body>
          <div className="mt-auto flex items-center justify-between">
            <Body size="s" className="text-text-subtle truncate">
              멘토: {getMentorText(primaryMentor, secondaryMentor)}
            </Body>
            <Label size="m" className="ml-2 shrink-0 group-hover:underline">
              자세히 보기 →
            </Label>
          </div>
        </div>
      </Link>
    );
  }

  // ── List variant ──
  if (variant === "list") {
    const s = study as Study;
    const schedule = formatStudyTimeRange(s.start_time, s.end_time);
    const instructors = getMentorText(primaryMentor, secondaryMentor, "·");

    return (
      <div className="flex w-full flex-col overflow-hidden rounded-b-xl border border-gray-200 bg-white">
        {imageSection}
        <div className="flex flex-col gap-4 p-8">
          <div className="flex gap-1 overflow-x-auto text-nowrap">
            <Badge
              label={getRecruitStatusLabel(s.recruit_status)}
              variant={getRecruitStatusBadgeVariant(s.recruit_status)}
              appearance="solid-pastel"
              size="small"
            />
            {s.tags[0] && (
              <Badge
                label={s.tags[0]}
                variant="danger"
                appearance="solid-pastel"
                size="small"
              />
            )}
            {s.tags[1] && (
              <Badge
                label={s.tags[1]}
                variant="primary"
                appearance="solid-pastel"
                size="small"
              />
            )}
            <Badge
              label={getDifficultyLabel(s.difficulty)}
              variant={getDifficultyBadgeVariant(s.difficulty)}
              appearance="solid-pastel"
              size="small"
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Heading size="xs" className="text-text-basic line-clamp-1">
              {studyName}
            </Heading>
            <Body size="m" className="text-text-subtle line-clamp-5 h-20">
              {oneLiner}
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
            <Button
              variant="tertiary"
              size="medium"
              onClick={props.onDetailClick}
            >
              자세히 보기
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={props.onApplyClick}
              disabled={s.recruit_status === "CLOSED"}
            >
              신청하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── MyPage variant ──
  const mentorNames = getMentorText(primaryMentor, secondaryMentor, "·");

  return (
    <div className="flex min-w-[240px] flex-col overflow-clip">
      <div className="relative h-[196px] w-full rounded-t-[12px] border border-[#c6c6c6] bg-[#dfe8f4]">
        <StudyImage
          src={imgUrl}
          alt={studyName}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 rounded-b-[12px] border-b border-l border-r border-[#b1b8be] bg-white px-8 py-8">
        <div className="flex flex-col gap-4">
          <span className="inline-flex h-[24px] w-fit items-center justify-center rounded-[4px] bg-[#ecf2fe] px-2 text-[15px] leading-[1.5] text-[#0b50d0]">
            {props.semesterLabel}
          </span>
          <p className="text-text-basic whitespace-nowrap text-[17px] font-bold leading-[1.5]">
            {studyName}
          </p>
          <p className="text-text-subtle h-[80px] overflow-hidden text-[17px] leading-[1.5]">
            {oneLiner}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[17px] leading-[1.5]">
          <span className="whitespace-nowrap">
            {getWeekDayLabel(study.week_day)}{" "}
            {formatStudyTimeRange(study.start_time, study.end_time)}
          </span>
          <span className="h-[21px] w-px bg-[#b1b8be]" />
          <span className="whitespace-nowrap">{mentorNames}</span>
        </div>
        <div className="flex items-center justify-end gap-4">
          <Link
            href={`/studies/detail/${(study as MyPageVariantProps["study"]).study_id}`}
          >
            <Button
              variant="tertiary"
              size="medium"
              className="min-w-[78px] whitespace-nowrap"
            >
              자세히 보기
            </Button>
          </Link>
          <Button
            variant="primary"
            size="medium"
            className="min-w-[78px] whitespace-nowrap"
            disabled={props.isCurrent}
            onClick={props.onDownloadCertificate}
          >
            인증서 다운로드
          </Button>
        </div>
      </div>
    </div>
  );
}
