import { SlideTabProps, SlideTabs } from "@ui/components/client/SlideTab";
import MemberLogin from "./member-tab";
import MentorLogin from "./mentor-tab";

export function SignInTab() {
  const tabs: SlideTabProps[] = [
    {
      label: "부원 로그인",
      content: <MemberLogin />,
    },
    {
      label: "멘토 로그인",
      content: <MentorLogin />,
    },
  ];

  return <SlideTabs tabs={tabs} />;
}
