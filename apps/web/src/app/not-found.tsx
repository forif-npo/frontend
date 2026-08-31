import { Button } from "@ui/components/client";
import { Link, PageState } from "@ui/components/server";

export default function NotFoundPage() {
  return (
    <PageState
      eyebrow="404"
      title="페이지를 찾을 수 없어요"
      description="요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있어요."
      actions={
        <Link href="/">
          <Button variant="primary" size="medium">
            홈으로 돌아가기
          </Button>
        </Link>
      }
    />
  );
}
