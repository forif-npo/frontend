import { SignInTab } from "@/features/auth/signin/signin-tab";
import { Heading } from "@ui/components/server";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("SignInPage");
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
