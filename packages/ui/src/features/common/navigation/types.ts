import { ReactNode } from "react";

export type NavMenu = {
  label: string;
  title?: string;
  href: string;
  subMenus?: NavMenu[];
};

export interface NavigationBarProps {
  logo?: ReactNode;
  items: NavMenu[];
  rightSlot?: ReactNode;
}
