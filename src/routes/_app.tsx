import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/support/AppSidebar";
import { Bell } from "lucide-react";
import { ticketsStore } from "@/lib/mock/tickets";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("navikx-auth") !== "1") {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const unread = ticketsStore.getAll().reduce((n, t) => n + t.unreadCount, 0);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium text-muted-foreground">Internal Support Console</span>
            </div>
            <Link
              to="/tickets"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
              title={`${unread} unread messages`}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {unread}
                </span>
              )}
            </Link>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
