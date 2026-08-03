"use client";
import { signInWithGoogle } from "@/features/auth/signin/actions";
import { MemberEligibilityInfo } from "@/features/auth/member-eligibility-info";
import { Body } from "@ui/components/server";
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
        <MemberEligibilityInfo />
      </div>
    </div>
  );
}
