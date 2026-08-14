import { SuccessFillIcon } from "@repo/assets/icons/krds";
import { Button } from "@ui/components/client";
import Link from "next/link";

export function ProductApplyComplete() {
  return (
    <div className="mx-auto flex w-full max-w-[792px] flex-col items-center gap-8 pb-16">
      <SuccessFillIcon
        width={116}
        height={116}
        backgroundColor="var(--color-primary-50)"
      />

      <h1 className="text-center text-[26px] font-bold leading-[1.5] sm:text-[32px]">
        <span className="text-text-primary">서비스 등록 신청</span>
        <span className="text-text-bolder">이 완료되었습니다.</span>
      </h1>

      <p className="text-text-subtle -mt-6 text-center text-[17px] leading-[1.5]">
        운영진 검토 후 결과를 알려드릴게요. 진행 상황은 마이페이지의
        &lsquo;서비스 관리&rsquo;에서 확인할 수 있습니다.
      </p>

      <div className="flex gap-4">
        <Link href="/products">
          <Button variant="secondary" size="large" className="h-16 px-6">
            서비스 목록
          </Button>
        </Link>
        <Link href="/my?section=service-manage">
          <Button variant="primary" size="large" className="h-16 px-6">
            서비스 관리
          </Button>
        </Link>
      </div>
    </div>
  );
}
