import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  UserCircle2,
  AlertOctagon,
  CheckCircle2,
  BarChart3,
  LogOut,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { currentAgent } from "@/lib/mock/agents";
import { useNavigate } from "@tanstack/react-router";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "All Tickets", url: "/tickets", icon: Inbox },
  { title: "My Tickets", url: "/tickets/mine", icon: UserCircle2 },
  { title: "Escalated", url: "/tickets/escalated", icon: AlertOctagon },
  { title: "Resolved", url: "/tickets/resolved", icon: CheckCircle2 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const isActive = (url: string) =>
    url === "/tickets" ? path === "/tickets" : path === url;

  const logout = () => {
    localStorage.removeItem("navikx-auth");
    navigate({ to: "/login" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            N
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight">NavikX</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Support Panel
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 rounded-md border bg-card p-2">
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-xs font-semibold truncate">{currentAgent.name}</span>
            <span className="text-[10px] text-muted-foreground truncate">{currentAgent.role}</span>
          </div>
          <button
            onClick={logout}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
