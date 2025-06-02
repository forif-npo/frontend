import { signUp } from "@/app/actions";
import { auth, signOut } from "@/auth";
import { SignUpForm } from "@/features/auth/signup/signup-form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { ArrowLeft } from "@repo/assets/icons/lucide";
import { Button } from "@ui/components/client";
import { Heading } from "@ui/components/server";
import { HTTPError } from "ky";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import z from "zod/v4";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: z.infer<typeof signUpSchema>;
};

const submitForm = async (_: ActionState, formData: FormData) => {
  "use server";
  let redirectPath: string | null = null;
  const values: SignUpValues = {
    name: String(formData.get("name") || ""),
    department: String(formData.get("department") || ""),
    email: String(formData.get("email") || ""),
    id: String(formData.get("id") || ""),
    phoneNumber: String(formData.get("phoneNumber") || ""),
    referralSource: String(formData.get("referralSource") || ""),
    serviceTermAgree: Boolean(formData.get("serviceTermAgree") || false),
    privacyPolicyAgree: Boolean(formData.get("privacyPolicyAgree") || false),
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
    await signUp(values);
    redirectPath = "/signup/complete";
  } catch (error) {
    if (error instanceof HTTPError) {
      errors["root"] = { message: error.message };
    } else {
      errors["root"] = {
        message: `알 수 없는 오류가 발생했습니다: ${(error as Error).message}`,
      };
    }
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
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
  const t = await getTranslations("SignUpPage");
  return (
    <div className="mx-auto mt-8 min-h-screen max-w-[800px]">
      <Heading size="s" className="text-text-basic text-left">
        {t("title")}
      </Heading>
      <Heading size="l" className="text-text-basic text-left">
        {t("description")}
      </Heading>
      <section className="mt-12 w-full">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/signin" });
          }}
          className="mb-2 flex cursor-pointer flex-row items-center"
        >
          <Button variant="text" size="medium">
            <span className="flex flex-row items-center gap-2">
              <ArrowLeft size={20} className="text-text-basic" />
              {t("signup_with_another")}
            </span>
          </Button>
        </form>
        <SignUpForm action={submitForm} email={session.user.email} />
      </section>
    </div>
  );
}
