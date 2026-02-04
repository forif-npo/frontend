"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle,
  ChevronDown,
  CircleDollarSign,
  Code2,
  FileText,
  HelpCircle,
  Home,
  LayoutGrid,
  MessageSquare,
  Settings,
  Users,
  Users2,
} from "lucide-react";
import Link from "next/link";

const menuItems = {
  dashboard: {
    title: "대시보드",
    url: "/",
    icon: LayoutGrid,
  },
  studyManagement: {
    label: "스터디 관리",
    items: [
      { title: "스터디 목록", url: "/studies", icon: BookOpen },
      { title: "스터디 승인", url: "/studies/approval", icon: CheckCircle },
      { title: "인증서 발급", url: "/certificates", icon: Award },
    ],
  },
  memberManagement: {
    label: "부원 관리",
    items: [
      { title: "부원", url: "/members", icon: Users },
      { title: "웹사이트 회원", url: "/users", icon: Users2 },
      { title: "운영진", url: "/operators", icon: Settings },
    ],
  },
  postManagement: {
    label: "게시물 관리",
    items: [
      { title: "공지사항", url: "/notices", icon: FileText },
      { title: "Q & A", url: "/qna", icon: HelpCircle },
      { title: "회계 공시", url: "/accounting", icon: CircleDollarSign },
      { title: "폼", url: "/forms", icon: Home },
    ],
  },
  others: {
    label: "그 외",
    items: [
      { title: "문자 발송 서비스", url: "/sms", icon: MessageSquare },
      { title: "동아리방 관리", url: "/room", icon: Building2 },
      { title: "회비 관리", url: "/dues", icon: CircleDollarSign },
      { title: "해커톤", url: "/hackathon", icon: Code2 },
    ],
  },
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="scrollbar-hidden">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
            <Users className="h-5 w-5 text-gray-600 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
          </div>
          <div className="flex flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1 text-sm font-medium">
              <span>표준성</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">SW팀</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">팀장</span>
            </div>
            <span className="text-muted-foreground text-xs">
              standardstar@hanyang.ac.kr
            </span>
          </div>
          <ChevronDown className="text-muted-foreground h-4 w-4 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* 대시보드 */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href={menuItems.dashboard.url}>
                  <menuItems.dashboard.icon />
                  <span>{menuItems.dashboard.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 스터디 관리 */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {menuItems.studyManagement.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.studyManagement.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 부원 관리 */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {menuItems.memberManagement.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.memberManagement.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 게시물 관리 */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {menuItems.postManagement.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.postManagement.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 그 외 */}
        <SidebarGroup>
          <SidebarGroupLabel>{menuItems.others.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.others.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 설정 푸터 */}
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings />
                <span>설정</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <SidebarTrigger className="w-full justify-start" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
