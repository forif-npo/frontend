"use client";

import { GoogleButton } from "@/components/GoogleButton";
import { MemberEligibilityInfo } from "@/features/auth/member-eligibility-info";
import { signUpWithGoogle } from "@/features/auth/signin/actions";

export function SignUpStart() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-divider-gray-light rounded-3 flex flex-col gap-6 border px-6 py-6 shadow sm:px-10 sm:py-8">
        <form action={signUpWithGoogle} className="w-full">
          <GoogleButton type="submit" className="w-full" variant="secondary">
            한양대학교 이메일로 회원가입
          </GoogleButton>
        </form>
        <MemberEligibilityInfo />
      </div>
    </div>
  );
}
