import { InfoBox, Link } from "@ui/components/server";

const InfoBoxContent = () => {
  return (
    <div className="mx-1 sm:mx-7">
      <ul className="list-inside list-disc space-y-2">
        <li className="text-text-subtle">
          로그인{" "}
          <Link
            size="m"
            href="/support/faqs"
            className="underline underline-offset-2"
          >
            관련 도움말
          </Link>
          이나 다른 사용자가{" "}
          <Link
            size="m"
            href="/support/faqs"
            className="underline underline-offset-2"
          >
            자주 묻는 질문
          </Link>
          을 확인해보세요.
        </li>
        <li className="text-text-subtle">
          <Link
            size="m"
            href="https://pf.kakao.com/_xnRxhxmG"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            카카오톡 오픈 채널
          </Link>
          로 연락주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.
        </li>
      </ul>
    </div>
  );
};

export function SignInHelpInfo() {
  return (
    <InfoBox
      title="로그인에 어려움이 있으신가요?"
      variant="information"
      content={<InfoBoxContent />}
    />
  );
}
