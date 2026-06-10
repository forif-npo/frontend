import { Button } from "@ui/components/client";
import { Link } from "@ui/components/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "운영진 모집 안내",
  description: "현재는 FORIF 운영진 모집 기간이 아닙니다.",
};

export default function StaffRecruitPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <p className="text-primary-50 text-[15px] font-bold leading-[1.5]">
        운영진 모집
      </p>
      <h1 className="text-text-basic text-[28px] font-bold leading-[1.4] md:text-[32px]">
        지금은 운영진 모집 기간이 아니에요
      </h1>
      <p className="text-text-subtle max-w-[460px] text-[16px] leading-[1.6]">
        운영진 모집은 매 학기 정해진 기간에만 진행됩니다.
        <br />
        다음 모집 일정은 공지사항을 통해 안내드릴게요.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link href="/support/announcements">
          <Button variant="primary" size="medium" className="w-full sm:w-auto">
            공지사항 보러가기
          </Button>
        </Link>
        <Link href="/">
          <Button variant="tertiary" size="medium" className="w-full sm:w-auto">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </main>
  );
}
