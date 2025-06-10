import { getSession } from "@/app/actions";
import { signOut } from "@/auth";
import { SignUpForm } from "@/features/auth/signup/signup-form";
import { signUpSchema, SignUpValues } from "@core/schemas";
import { ArrowLeft } from "@repo/assets/icons/lucide";
import { Button } from "@ui/components/client";
import { Heading } from "@ui/components/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import z from "zod/v4";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: z.infer<typeof signUpSchema>;
};

const submitForm = async (initialState: ActionState, formData: FormData) => {
  "use server";
  const values: SignUpValues = {
    name: String(formData.get("name") || ""),
    department: String(formData.get("department") || ""),
    email: String(formData.get("email") || ""),
    id: String(formData.get("id") || ""),
    phoneNumber: String(formData.get("phoneNumber") || ""),
    referralSource: String(formData.get("referralSource") || ""),
  };

  const { error: parseError } = signUpSchema.safeParse(values);
  const errors: ActionState["errors"] = {};
  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }

  return {
    values,
    errors,
  };
};
export default async function Page() {
  const session = await getSession();
  const isMember = false; // await checkMember();
  if (!session?.user?.email) {
    await signOut();
    redirect("/signin");
  }
  if (isMember) {
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
          <ArrowLeft size={20} />
          <Button variant="text" size="medium">
            다른 이메일 계정으로 회원가입
          </Button>
        </form>
        <SignUpForm action={submitForm} email={session.user.email} />
      </section>
    </div>
  );
}
