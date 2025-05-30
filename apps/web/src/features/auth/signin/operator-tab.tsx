import { Button } from "@ui/components/client";
import { Body } from "@ui/components/server";
import { useTranslations } from "next-intl";

export default function OperatorLogin() {
  const t = useTranslations("SignInPage.operator-signin");
  return (
    <div className="mt-10 flex flex-col gap-10">
      <Body className="text-text-basic">{t("description")}</Body>
      <div className="border-divider-gray-light rounded-3 flex flex-col gap-6 border px-10 py-8 shadow">
        <Button>한양대학교 이메일로 로그인</Button>
        <Button variant="text">회원가입</Button>
      </div>
    </div>
  );
}
