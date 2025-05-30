"use client";

import { Tabs } from "@ui/components/client";
import { TabProps } from "@ui/components/client/Tab";
import { useTranslations } from "next-intl";
import MemberLogin from "./member-tab";
import OperatorLogin from "./operator-tab";

export function SignInTab() {
  const t = useTranslations("SignInPage");
  const tabs: TabProps[] = [
    {
      label: t("member-signin.title"),
      content: <MemberLogin />,
    },
    {
      label: t("operator-signin.title"),
      content: <OperatorLogin />,
    },
  ];

  return <Tabs tabs={tabs} />;
}
