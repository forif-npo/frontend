import { FORIF_EXTERNAL_LINKS } from "@/constants/external-links";
import { InfoText, Link } from "@ui/components/server";

export function MemberEligibilityInfo() {
  return (
    <InfoText>
      회칙 2장 제4조(자격과 구성)에 의거하여 부원 가입대상을{" "}
      <span className="font-bold">한양대학교 재·휴·졸업생</span>으로 한정함에
      따라 한양대학교 이메일을 통한 로그인/회원가입을 진행하고 있습니다. 아직
      한양메일을 만드시지 않았다면{" "}
      <Link
        size="s"
        href={FORIF_EXTERNAL_LINKS.hanyangPortal}
        rel="noopener noreferrer"
        target="_blank"
        className="text-text-primary underline-offset-4 hover:underline"
      >
        한양인포털
      </Link>
      에서 만드실 수 있습니다.
    </InfoText>
  );
}
