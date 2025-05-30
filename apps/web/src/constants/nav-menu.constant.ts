import { NavMenu } from "@ui/features/common/navigation";

export const NAV_MENUS: NavMenu[] = [
  {
    label: "club.label",
    navigate: "club.navigate",
    title: "club.title",
    href: "/club",
    subMenus: [
      {
        label: "club.subMenu.intro",
        href: "/club/about",
      },
      {
        label: "club.subMenu.operator_intro",
        href: "/club/members",
      },
      {
        label: "club.subMenu.history",
        href: "/club/activities",
      },
      {
        label: "club.subMenu.rule",
        href: "/club/activities",
      },
      {
        label: "club.subMenu.accounting",
        href: "/club/activities",
      },
    ],
  },
  {
    label: "study.label",
    title: "study.title",
    href: "/studies",
    subMenus: [
      {
        label: "study.subMenu.list",
        href: "/studies/about",
      },
      {
        label: "study.subMenu.guide",
        href: "/studies/members",
      },
    ],
  },
];
