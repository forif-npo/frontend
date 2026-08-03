import { FORIF_EXTERNAL_LINKS } from "@/constants/external-links";
import { InfoBox, Link } from "@ui/components/server";

type AuthAction = "로그인" | "회원가입";

interface AuthHelpInfoProps {
  action: AuthAction;
}

export function AuthHelpInfo({ action }: AuthHelpInfoProps) {
  return (
    <InfoBox
      title={`${action}에 어려움이 있으신가요?`}
      variant="information"
      content={
        <div className="mx-1 sm:mx-7">
          <ul className="list-inside list-disc space-y-2">
            <li className="text-text-subtle text-body-s-mobile sm:text-body-s">
              <Link
                size="s"
                href={FORIF_EXTERNAL_LINKS.channelTalk}
                className="text-text-primary underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                FORIF 공식 채널톡
              </Link>
              을 통해 문의 남겨주세요. 서비스에 {action}할 수 있도록
              도와드리겠습니다.
            </li>
          </ul>
        </div>
      }
    />
  );
}
