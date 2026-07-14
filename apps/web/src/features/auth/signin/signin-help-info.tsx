import { InfoBox, Link } from "@ui/components/server";

const InfoBoxContent = () => {
  return (
    <div className="mx-1 sm:mx-7">
      <ul className="list-inside list-disc space-y-2">
        <li className="text-text-subtle text-body-s-mobile sm:text-body-s">
          <Link
            size="s"
            href="https://pf.kakao.com/_xnRxhxmG"
            className="text-body-s-mobile sm:text-body-s underline underline-offset-2"
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
