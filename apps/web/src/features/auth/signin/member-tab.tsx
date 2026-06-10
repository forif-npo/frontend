"use client";
import { signInWithGoogle } from "@/features/auth/signin/actions";
import { Body, InfoText, Link } from "@ui/components/server";
import { GoogleButton } from "../../../components/GoogleButton";

export default function MemberLogin() {
  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="mt-10 flex flex-col gap-6">
      <Body className="text-text-basic">
        부원을 위한 통합 로그인입니다.
        <br />
        로그인을 하시면 보다 더 많은 정보와 서비스를 이용하실 수 있습니다.
      </Body>
      <div className="border-divider-gray-light rounded-3 flex flex-col gap-6 border px-6 py-6 shadow sm:px-10 sm:py-8">
        <form action={handleSignIn} className="w-full">
          <GoogleButton type="submit" className="w-full" variant="secondary">
            한양대학교 이메일로 로그인
          </GoogleButton>
        </form>
        <InfoText>
          회칙 2장 제4조(자격과 구성)에 의거하여 부원 가입대상을 한양대학교
          재·휴·졸업생으로 한정함에 따라 한양대학교 이메일을 통한
          로그인/회원가입을 진행하고 있습니다. 아직 한양메일을 만드시지 않았다면{" "}
          <Link
            size="s"
            href="https://hanyang.ac.kr"
            rel="noopener noreferrer"
            target="_blank"
            className="text-text-primary"
          >
            다음 링크
          </Link>
          를 따라 만드실 수 있습니다.
        </InfoText>
      </div>
    </div>
  );
}
