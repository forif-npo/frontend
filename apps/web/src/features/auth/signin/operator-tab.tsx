import { Button } from "@ui/components/client";
import { Body } from "@ui/components/server";

export default function OperatorLogin() {
  return (
    <div className="mt-10 flex flex-col gap-10">
      <Body className="text-text-basic">
        운영진을 위한 통합 로그인입니다. 로그인 후 운영진 페이지로 이동합니다.
      </Body>
      <div className="border-divider-gray-light rounded-3 flex flex-col gap-6 border px-10 py-8 shadow">
        <Button>한양대학교 이메일로 로그인</Button>
      </div>
    </div>
  );
}
