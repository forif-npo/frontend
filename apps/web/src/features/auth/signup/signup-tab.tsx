import { Tabs } from "@ui/components/client";
import { TabProps } from "@ui/components/client/Tab";
import { useTranslations } from "next-intl";
import EtcSignUp from "./etc-tab";
import MemberSignUp from "./member-tab";

export function SignUpTab() {
  const t = useTranslations("SignUpPage");
  const tabs: TabProps[] = [
    {
      label: t("member-signin.title"),
      content: <MemberSignUp />,
    },
    {
      label: t("operator-signin.title"),
      content: <EtcSignUp />,
    },
  ];

  return <Tabs tabs={tabs} />;
}
