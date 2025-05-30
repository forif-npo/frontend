"use client";

import { Tabs } from "@ui/components/client";
import { TabProps } from "@ui/components/client/Tab";
import MemberLogin from "./member-tab";
import OperatorLogin from "./operator-tab";

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

export function SignInTab() {
  return <Tabs tabs={tabs} />;
}
