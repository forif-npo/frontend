import type { StaffRecruitmentRound } from "@core/types/staff-recruitment";
import { Button } from "@ui/components/client";
import { Body, Display } from "@ui/components/server";
import Link from "next/link";
import {
  APPLICATION_STATUS_LABELS,
  formatRecruitmentPeriod,
} from "./presentation";

export function StaffRecruitmentBanner({
  recruitment,
}: {
  recruitment: StaffRecruitmentRound;
}) {
  return (
    <div className="from-primary-70 via-primary-60 to-primary-40 relative h-full w-full overflow-hidden bg-gradient-to-br text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] opacity-20 [background-size:22px_22px]" />
      <div className="absolute inset-0 z-10 flex items-center justify-between gap-4 px-5 py-4 md:px-12 md:py-9 xl:px-28">
        <div className="min-w-0">
          <Body
            size="l"
            className="mb-1 text-[12px] font-semibold leading-none text-white/85 md:mb-3 md:text-[16px]"
          >
            {recruitment.semester_label} ·{" "}
            {formatRecruitmentPeriod(
              recruitment.starts_at,
              recruitment.ends_at,
            )}
          </Body>
          <Display
            size="s"
            className="truncate text-[22px] leading-tight text-white md:text-[40px]"
          >
            {recruitment.title}
          </Display>
          <p className="mt-2 hidden max-w-2xl text-sm text-white/80 md:block">
            {recruitment.summary ??
              "FORIF를 함께 운영할 새로운 운영진을 모집합니다."}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
            {APPLICATION_STATUS_LABELS[recruitment.application_status]}
          </span>
          <Link href="/club/recruit">
            <Button
              variant="secondary"
              className="!min-h-[40px] px-4 md:!min-h-[52px]"
            >
              자세히 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
