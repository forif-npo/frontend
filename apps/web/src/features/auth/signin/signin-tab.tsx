"use client";

import { Tabs } from "@ui/components/client";
import { TabProps } from "@ui/components/client/Tab";
import MemberLogin from "./member-tab";
import OperatorLogin from "./operator-tab";

export function SignInTab() {
  const tabs: TabProps[] = [
    {
      label: "부원 로그인",
      content: <MemberLogin />,
    },
    {
      label: "운영진 로그인",
      content: <OperatorLogin />,
    },
  ];

  return <Tabs tabs={tabs} />;
}
