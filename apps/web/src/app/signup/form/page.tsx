import { auth } from "@/auth";
import { SignOutButton } from "@/components/SignOutButton";
import { signUp } from "@/features/auth/signin/actions";
import { SignUpForm } from "@/features/auth/signup/signup-form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { Body, Heading } from "@ui/components/server";
import { redirect } from "next/navigation";
import { z } from "zod/v4";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: z.infer<typeof signUpSchema>;
  success?: boolean;
  accessToken?: string;
};

const submitForm = async (_: ActionState, formData: FormData) => {
  "use server";
  const values: SignUpValues = {
    name: String(formData.get("name") || ""),
    department: String(formData.get("department") || ""),
    email: String(formData.get("email") || ""),
    id: String(formData.get("id") || ""),
    phoneNumber: String(formData.get("phoneNumber") || ""),
    serviceTermAgree:
      formData.get("serviceTermAgree") === "on" ||
      formData.get("serviceTermAgree") === "true",
    privacyPolicyAgree:
      formData.get("privacyPolicyAgree") === "on" ||
      formData.get("privacyPolicyAgree") === "true",
  };

  const { error: parseError } = signUpSchema.safeParse(values);
  const errors: ActionState["errors"] = {};
  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }
  if (Object.keys(errors).length > 0) {
    return { values, errors };
  }

  try {
    const result = await signUp(values);

    if (result.success && result.accessToken) {
      return {
        values: {
          name: "",
          department: "",
          email: "",
          id: "",
          phoneNumber: "",
          serviceTermAgree: false,
          privacyPolicyAgree: false,
        },
        errors: {},
        success: true,
        accessToken: result.accessToken,
      };
    }
  } catch (error) {
    errors.root = {
      message:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
    return { values, errors };
  }

  return { values, errors };
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/signup");
  }
  if (session.isSignUp) {
    redirect("/");
  }

  return (
    <div className="min-h-viewport mx-auto mb-16 mt-8 max-w-[800px] px-5 sm:px-6 lg:px-0">
      <Heading size="l" className="text-text-basic text-left">
        회원가입
      </Heading>
      <Body size="m" className="text-text-subtle mt-4">
        FORIF 부원을 위한 서비스 회원가입입니다.
        <br />
        스터디 신청, 스터디 개설, 해커톤 참여 등 더 많은 기능을 이용해보세요.
      </Body>
      <section className="mt-12 w-full">
        <SignOutButton callbackUrl="/signup" label="다른 이메일로 인증" />
      </section>
      <section className="mb-10 w-full">
        <SignUpForm action={submitForm} email={session.user.email} />
      </section>
    </div>
  );
}
