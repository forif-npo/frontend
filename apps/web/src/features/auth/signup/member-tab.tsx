import { signInWithGoogle } from "@/app/actions";
import { InformationIcon } from "@repo/assets/icons/krds";
import { Button } from "@ui/components/client";
import { Body, InfoBox, Link } from "@ui/components/server";
import { useTranslations } from "next-intl";

export default function MemberSignUp() {
  const t = useTranslations("SignInPage.member-signin");
  return (
    <div className="mt-10 flex flex-col gap-10">
      <Body className="text-text-basic">{t("description")}</Body>
      <div className="border-divider-gray-light rounded-3 flex flex-col gap-6 border px-10 py-8 shadow">
        <Button onClick={signInWithGoogle} className="w-full">
          {t("sign_in_with_hyu_email")}
        </Button>
        <Link href="/signup" className="w-full">
          <Button variant="text" className="w-full">
            {t("sign_up")}
          </Button>
        </Link>
        <div className="flex flex-row items-start gap-1">
          <span className="h-[20px] w-[20px]">
            <InformationIcon
              width={20}
              height={20}
              className="text-text-secondary"
            />
          </span>
          <Body size="s" className="text-text-basic">
            {t("info_section.text_0")}{" "}
            <Link
              size="s"
              href="https://hanyang.ac.kr"
              rel="noopener noreferrer"
              target="_blank"
              className="text-text-primary"
            >
              {t("info_section.text_1")}
            </Link>
            {t("info_section.text_2")}
          </Body>
        </div>
      </div>
      <InfoBox
        title={t("help_section.title")}
        variant="information"
        content={<InfoBoxContent />}
      />
    </div>
  );
}

const InfoBoxContent = ({}: {}) => {
  const t = useTranslations("SignInPage.member-signin");
  return (
    <ul className="list-inside list-disc">
      <li className="text-text-subtle">
        <Link size="m" href="" className="underline underline-offset-2">
          {t("help_section.text_0")}
        </Link>{" "}
        {t("help_section.text_1")}{" "}
        <Link size="m" href="" className="underline underline-offset-2">
          {t("help_section.text_2")}
        </Link>
        {t("help_section.text_3")}
      </li>
      <li className="text-text-subtle">
        <Link size="m" href="" className="underline underline-offset-2">
          {t("help_section.text_4")}
        </Link>{" "}
        {t("help_section.text_5")}
      </li>
    </ul>
  );
};
