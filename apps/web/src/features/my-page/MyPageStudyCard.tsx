import { Badge, Body } from "@ui/components/server";
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
  onDownloadCertificate: () => void;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function MyPageStudyCard({
  study,
  semesterLabel,
  onDownloadCertificate,
}: MyPageStudyCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Study Image */}
      <div className="relative h-48 w-full bg-blue-50">
        <Image
          src={study.img_url || "/images/default-study-img.png"}
          alt={study.study_name}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3 p-6">
        {/* Semester Badge */}
        <Badge
          label={semesterLabel}
          variant="info"
          appearance="solid-pastel"
          size="medium"
        />

        {/* Study Title */}
        <Body size="l" className="line-clamp-2 font-bold text-gray-900">
          {study.study_name}
        </Body>

        {/* Study Description */}
        <Body size="m" className="line-clamp-3 text-gray-600">
          {study.one_liner}
        </Body>

        {/* Study Info */}
        <Body size="s" className="text-gray-500">
          {WEEKDAY_LABELS[study.week_day]} {study.start_time} - {study.end_time}{" "}
          | {study.location}
        </Body>

        {/* Action Buttons */}
        <div className="mt-2 flex gap-2">
          <Link href={`/studies/${study.study_id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              자세히 보기
            </Button>
          </Link>
          <Button
            variant="primary"
            className="flex-1"
            onClick={onDownloadCertificate}
          >
            인증서 다운로드
          </Button>
        </div>
      </div>
    </div>
  );
}
