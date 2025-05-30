import { InformationIcon } from "@repo/assets/icons/krds";
import { Button } from "@ui/components/client";
import { Body, InfoBox, Link } from "@ui/components/server";

export default function MemberLogin() {
  return (
    <div className="mt-10 flex flex-col gap-10">
      <Body className="text-text-basic">
        부원 회원을 위한 통합 로그인입니다. 로그인을 하시면 보다 더 많은 정보와
        서비스를 이용하실 수 있습니다.
      </Body>
      <div className="border-divider-gray-light rounded-3 flex flex-col gap-6 border px-10 py-8 shadow">
        <Button>한양대학교 이메일로 로그인</Button>
        <Button variant="text">회원가입</Button>
        <div className="flex flex-row items-start gap-1">
          <span className="h-[20px] w-[20px]">
            <InformationIcon
              width={20}
              height={20}
              className="text-text-secondary"
            />
          </span>
          <Body size="s" className="text-text-basic">
            회칙 2장 제4조(자격과 구성)에 의거하여 부원 가입대상을 한양대학교
            재·휴·졸업생으로 한정함에 따라 한양대학교 이메일을 통한
            로그인/회원가입을 진행하고 있습니다. 아직 한양메일을 만드시지
            않았다면{" "}
            <Link
              size="s"
              href="https://hanyang.ac.kr"
              className="text-text-primary"
            >
              다음 링크
            </Link>
            를 따라 만드실 수 있습니다.
          </Body>
        </div>
      </div>
      <InfoBox
        title="로그인에 어려움이 있으신가요?"
        variant="information"
        content={<InfoBoxContent />}
      />
    </div>
  );
}

const InfoBoxContent = () => {
  return (
    <ul className="list-inside list-disc">
      <li className="text-text-subtle">
        로그인{" "}
        <Link size="m" href="" className="underline underline-offset-2">
          관련 도움말
        </Link>
        이나 다른 사용자가{" "}
        <Link size="m" href="" className="underline underline-offset-2">
          자주 묻는 질문
        </Link>
        을 확인해보세요.
      </li>
      <li className="text-text-subtle">
        <Link size="m" href="" className="underline underline-offset-2">
          카카오톡 오픈 채널
        </Link>
        로 연락주세요. 서비스에 로그인할 수 있도록 도와드리겠습니다.
      </li>
    </ul>
  );
};
