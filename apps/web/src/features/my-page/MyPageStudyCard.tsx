import { Button } from "@ui/components/client";
import Image from "next/image";
import Link from "next/link";

interface MyPageStudyCardProps {
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

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function MyPageStudyCard({
  study,
  semesterLabel,
  isCurrent = false,
  onDownloadCertificate,
}: MyPageStudyCardProps) {
  const mentorNames = [study.primary_mentor_name, study.secondary_mentor_name]
    .filter(Boolean)
    .join("·");

  return (
    <div className="flex min-w-[240px] flex-col overflow-clip">
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
      <div className="flex flex-col gap-4 rounded-b-[12px] border-b border-l border-r border-[#b1b8be] bg-white px-8 py-8">
        {/* Badge + Title + Description */}
        <div className="flex flex-col gap-4">
          <span className="inline-flex h-[24px] w-fit items-center justify-center rounded-[4px] bg-[#ecf2fe] px-2 text-[15px] leading-[1.5] text-[#0b50d0]">
            {semesterLabel}
          </span>

          <p className="text-text-basic whitespace-nowrap text-[17px] font-bold leading-[1.5]">
            {study.study_name}
          </p>

          <p className="text-text-subtle h-[80px] overflow-hidden text-[17px] leading-[1.5]">
            {study.one_liner}
          </p>
        </div>

        {/* Schedule + Mentor */}
        <div className="flex items-center gap-2 text-[17px] leading-[1.5]">
          <span className="whitespace-nowrap">
            {WEEKDAY_LABELS[study.week_day]} {study.start_time} -{" "}
            {study.end_time}
          </span>
          <span className="h-[21px] w-px bg-[#b1b8be]" />
          <span className="whitespace-nowrap">{mentorNames}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link href={`/studies/detail/${study.study_id}`}>
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
            disabled={isCurrent}
            onClick={onDownloadCertificate}
          >
            인증서 다운로드
          </Button>
        </div>
      </div>
    </div>
  );
}
