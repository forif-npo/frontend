"use client";

import {
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type WheelEvent,
} from "react";
import {
  formatStudyTimeRange,
  getDifficultyBadgeVariant,
  getDifficultyLabel,
  getNumericDifficultyBadgeVariant,
  getRecruitStatusBadgeVariant,
  getRecruitStatusLabel,
  getWeekDayLabel,
  NUMERIC_DIFFICULTY_LABELS,
} from "@/constants/study";
import { getStudyTagLabel } from "@/constants/study-tags";
import type { Study } from "@/types/study";
import { Button } from "@ui/components/client";
import { Badge, Body, Heading } from "@ui/components/server";
import { useRouter } from "next/navigation";
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
    start_time: string | null;
    end_time: string | null;
    week_day: number;
    location: string;
    certificate_issued: boolean;
    tags: string[];
    difficulty: number;
    thumbnail_image: string | null;
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

function getVisibleTagLabels(tags: unknown) {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter(Boolean)
    .map(getStudyTagLabel);
}

function getVisibleDifficultyLabel(difficulty: unknown) {
  if (typeof difficulty !== "string") return "";

  return getDifficultyLabel(difficulty).trim();
}

function SemesterBadge({ label }: { label: string }) {
  return (
    <Badge
      label={label}
      variant="info"
      appearance="solid-pastel"
      size="small"
    />
  );
}

function StudyTags({ children }: { children: React.ReactNode }) {
  const tagsRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const tags = tagsRef.current;
    if (!tags || event.deltaY === 0 || tags.scrollWidth <= tags.clientWidth) {
      return;
    }

    const maxScrollLeft = tags.scrollWidth - tags.clientWidth;
    const nextScrollLeft = tags.scrollLeft + event.deltaY;
    const canScrollFurther =
      (event.deltaY < 0 && tags.scrollLeft > 0) ||
      (event.deltaY > 0 && tags.scrollLeft < maxScrollLeft);

    if (!canScrollFurther) return;

    event.preventDefault();
    tags.scrollLeft = Math.max(0, Math.min(nextScrollLeft, maxScrollLeft));
  };

  return (
    <div
      ref={tagsRef}
      className="scrollbar-hidden flex min-w-0 gap-2 overflow-x-auto text-nowrap [&>*]:shrink-0"
      onWheel={handleWheel}
      onTouchStart={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
      onTouchCancel={(event) => event.stopPropagation()}
      tabIndex={0}
      aria-label="스터디 태그"
    >
      {children}
    </div>
  );
}

interface StandardStudyCardProps {
  study: Study;
  imageSection: React.ReactNode;
  onCardClick?: () => void;
  onDetailClick?: () => void;
  onApplyClick?: () => void;
}

function StandardStudyCard({
  study,
  imageSection,
  onCardClick,
  onDetailClick,
  onApplyClick,
}: StandardStudyCardProps) {
  const schedule = formatStudyTimeRange(study.start_time, study.end_time);
  const instructors = getMentorText(
    study.primary_mentor_name,
    study.secondary_mentor_name,
    "·",
  );
  const tagLabels = getVisibleTagLabels(study.tags);
  const difficultyLabel = getVisibleDifficultyLabel(study.difficulty);
  const hasSchedule = schedule !== "";
  const isClickable = onCardClick !== undefined;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable || (event.key !== "Enter" && event.key !== " ")) return;

    event.preventDefault();
    onCardClick();
  };

  const handleActionClick = (
    event: MouseEvent<HTMLButtonElement>,
    action?: () => void,
  ) => {
    event.stopPropagation();
    action?.();
  };

  return (
    <div
      className={`rounded-3 border-border-gray-light bg-surface-white flex w-full flex-col overflow-hidden border ${
        isClickable ? "cursor-pointer" : ""
      }`}
      onClick={onCardClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? "link" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {imageSection}
      <div className="flex flex-col gap-4 p-8">
        <StudyTags>
          <Badge
            label={getRecruitStatusLabel(study.recruit_status)}
            variant={getRecruitStatusBadgeVariant(study.recruit_status)}
            appearance="solid-pastel"
            size="small"
          />
          <SemesterBadge label={`${study.act_year}-${study.act_semester}`} />
          {tagLabels.map((tag) => (
            <Badge
              key={tag}
              label={tag}
              variant="info"
              appearance="solid-pastel"
              size="small"
            />
          ))}
          {difficultyLabel && (
            <Badge
              label={difficultyLabel}
              variant={getDifficultyBadgeVariant(study.difficulty)}
              appearance="solid-pastel"
              size="small"
            />
          )}
        </StudyTags>
        <div className="flex flex-1 flex-col gap-4">
          <Heading size="xs" className="text-text-basic line-clamp-1">
            {study.study_name}
          </Heading>
          <Body size="m" className="text-text-subtle line-clamp-5 h-20">
            {study.one_liner}
          </Body>
          <div className="text-text-basic flex items-center gap-2">
            {hasSchedule && (
              <>
                <Body size="m" className="whitespace-nowrap">
                  {schedule}
                </Body>
                <div className="h-[21px] w-[1px] bg-black" />
              </>
            )}
            <Body size="m" className="whitespace-nowrap">
              {instructors}
            </Body>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-4 self-stretch">
          <Button
            variant="tertiary"
            size="medium"
            onClick={(event) => handleActionClick(event, onDetailClick)}
          >
            자세히 보기
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={(event) => handleActionClick(event, onApplyClick)}
            disabled={study.recruit_status !== "APPLICABLE"}
          >
            신청하기
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────────

export function StudyCard(props: StudyCardProps) {
  const { variant, study } = props;
  const router = useRouter();

  const studyName = study.study_name;
  const oneLiner = study.one_liner;
  const imgUrl =
    variant === "mypage"
      ? study.thumbnail_image || study.img_url
      : study.thumbnail_image || study.img_url;
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
      <StandardStudyCard
        study={s}
        imageSection={imageSection}
        onCardClick={() => router.push(`/studies/detail/${s.id}`)}
        onDetailClick={() => router.push(`/studies/detail/${s.id}`)}
        onApplyClick={() => router.push(`/studies/apply?study_id=${s.id}`)}
      />
    );
  }

  // ── List variant ──
  if (variant === "list") {
    const s = study as Study;

    return (
      <StandardStudyCard
        study={s}
        imageSection={imageSection}
        onDetailClick={props.onDetailClick}
        onApplyClick={props.onApplyClick}
      />
    );
  }

  // ── MyPage variant ──
  const mentorNames = getMentorText(primaryMentor, secondaryMentor, "·");
  const tagLabels = getVisibleTagLabels(study.tags);
  const difficultyLabel = NUMERIC_DIFFICULTY_LABELS[study.difficulty] ?? "보통";
  const schedule = formatStudyTimeRange(study.start_time, study.end_time);

  return (
    <div className="rounded-3 border-border-gray-light bg-surface-white flex min-w-[240px] flex-col overflow-hidden border">
      <div className="relative h-[196px] w-full bg-[#dfe8f4]">
        <StudyImage
          src={imgUrl}
          alt={studyName}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 px-8 py-8">
        <div className="flex flex-col gap-4">
          <StudyTags>
            <Badge
              label={props.isCurrent ? "수강 중" : "수료"}
              variant={props.isCurrent ? "success" : "disabled"}
              appearance="solid-pastel"
              size="small"
            />
            <SemesterBadge label={props.semesterLabel} />
            {tagLabels.map((tag) => (
              <Badge
                key={tag}
                label={tag}
                variant="info"
                appearance="solid-pastel"
                size="small"
              />
            ))}
            <Badge
              label={difficultyLabel}
              variant={getNumericDifficultyBadgeVariant(study.difficulty)}
              appearance="solid-pastel"
              size="small"
            />
          </StudyTags>
          <p className="text-text-basic whitespace-nowrap text-[17px] font-bold leading-[1.5]">
            {studyName}
          </p>
          <p className="text-text-subtle h-[80px] overflow-hidden text-[17px] leading-[1.5]">
            {oneLiner}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[17px] leading-[1.5]">
          {schedule && (
            <>
              <span className="whitespace-nowrap">
                {getWeekDayLabel(study.week_day)} {schedule}
              </span>
              <span className="h-[21px] w-px bg-[#b1b8be]" />
            </>
          )}
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
            disabled={
              !(study as MyPageVariantProps["study"]).certificate_issued
            }
            onClick={props.onDownloadCertificate}
          >
            인증서 다운로드
          </Button>
        </div>
      </div>
    </div>
  );
}
