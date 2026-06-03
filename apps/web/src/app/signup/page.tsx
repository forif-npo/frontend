import { signUp } from "@/features/auth/signin/actions";
import { auth, signOut } from "@/auth";
import { SignOutButton } from "@/components/SignOutButton";
import { SignUpForm } from "@/features/auth/signup/signup-form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { Body, Heading, InfoBox, Link } from "@ui/components/server";
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
    return {
      values,
      errors,
    };
  }
  try {
    const result = await signUp(values);

    // 회원가입 성공 시 accessToken을 클라이언트로 반환
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
        accessToken: result.accessToken, // 토큰을 클라이언트로 전달
      };
    }
  } catch (error) {
    errors["root"] = {
      message:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
    return {
      values,
      errors,
    };
  }

  return {
    values,
    errors,
  };
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) {
    await signOut();
    redirect("/signin");
  }
  if (session.isSignUp) {
    redirect("/");
  }

  return (
    <div className="min-h-viewport mx-auto mb-16 mt-8 max-w-[800px]">
      <Heading size="xxs" className="text-text-subtle text-left">
        포리프 부원 회원가입
      </Heading>
      <Heading size="l" className="text-text-basic mt-4 text-left">
        회원가입
      </Heading>
      <Body size="m" className="text-text-subtle mt-12">
        포리프 부원을 위한 회원가입입니다.
        <br />
        회원가입을 하시면 스터디 신청 / 회계 공시 서비스를 이용하실 수 있습니다.
      </Body>
      <section className="mt-12 w-full">
        <SignOutButton />
      </section>
      <section className="mb-10 w-full">
        <SignUpForm action={submitForm} email={session.user.email} />
      </section>
      <InfoBox
        title="회원가입에 어려움이 있으신가요?"
        variant="information"
        content={<InfoBoxContent />}
      />
    </div>
  );
}
const InfoBoxContent = () => {
  return (
    <div className="mx-7">
      <ul className="list-inside list-disc space-y-2">
        <li className="text-text-subtle">
          회원가입{" "}
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
          로 연락주세요. 서비스에 회원가입할 수 있도록 도와드리겠습니다.
        </li>
      </ul>
    </div>
  );
};
