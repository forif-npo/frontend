import { NavMenu } from "@/features/navigation/nav-bar";

export const NAV_MENUS: NavMenu[] = [
  {
    label: "동아리",
    navigate: "바로 가기",
    title: "한양대학교 중앙 프로그래밍 동아리, FORIF를 소개합니다.",
    href: "/club",
    subMenus: [
      {
        label: "동아리 소개",
        href: "/club/about",
      },
      {
        label: "운영진 소개",
        href: "/club/members",
      },
      {
        label: "연혁",
        href: "/club/activities",
      },
      {
        label: "회칙",
        href: "/club/activities",
      },
      {
        label: "회계",
        href: "/club/activities",
      },
    ],
  },
  {
    label: "스터디",
    title:
      "매 학기 다양한 주제, 다양한 언어로 진행되는 FORIF의 스터디를 소개합니다.",
    href: "/studies",
    subMenus: [
      {
        label: "스터디 목록",
        href: "/studies/list",
      },
      {
        label: "스터디 가이드",
        href: "/studies/members",
      },
    ],
  },
  {
    label: "지원",
    title: "FORIF 지원 관련 정보를 확인할 수 있습니다.",
    href: "/support",
    subMenus: [
      { label: "자주 묻는 질문", href: "/support/faqs" },
      { label: "공지사항", href: "/support/announcements" },
    ],
  },
];
