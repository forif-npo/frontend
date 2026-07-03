import { AppSidebar } from "@/components/app-sidebar";
import { SessionExpiredGuard } from "@/components/session-expired-guard";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SessionExpiredGuard />
      <AppSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
