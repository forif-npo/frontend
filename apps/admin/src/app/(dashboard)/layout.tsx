import { AppSidebar } from "@/components/app-sidebar";
import { MobileDashboardHeader } from "@/components/layout/mobile-dashboard-header";
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
      <main className="flex min-w-0 flex-1 flex-col">
        <MobileDashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
