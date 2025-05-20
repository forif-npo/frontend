import { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
};

export interface NavigationBarProps {
  logo?: ReactNode;
  items: NavItem[];
  rightSlot?: ReactNode;
  className?: string;
}
