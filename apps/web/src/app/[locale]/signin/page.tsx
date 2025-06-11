import { auth } from "@/auth";
import { SignInTab } from "@/features/auth/signin/signin-tab";
import { Heading } from "@ui/components/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session && !session.isSignUp) {
    redirect("/signup");
  }
  const t = await getTranslations("SignInPage");
  return (
    <div className="mx-auto mt-8 min-h-screen max-w-[800px]">
      <Heading size="s" className="text-text-basic text-left">
        {t("title")}
      </Heading>
      <Heading size="l" className="text-text-basic text-left">
        {t("description")}
      </Heading>
      <section className="mt-12 w-full">
        <SignInTab />
      </section>
    </div>
  );
}
