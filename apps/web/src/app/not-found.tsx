import { Button } from "@ui/components/client";
import { Link } from "@ui/components/server";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <p className="text-primary-50 text-[15px] font-bold leading-[1.5]">404</p>
      <h1 className="text-text-basic text-[28px] font-bold leading-[1.4] md:text-[32px]">
        페이지를 찾을 수 없어요
      </h1>
      <p className="text-text-subtle max-w-[420px] text-[16px] leading-[1.6]">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있어요.
      </p>
      <Link href="/" className="mt-2">
        <Button variant="primary" size="medium">
          홈으로 돌아가기
        </Button>
      </Link>
    </main>
  );
}
