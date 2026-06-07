import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  UserCircle2,
  AlertOctagon,
  CheckCircle2,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { canAccess, type SupportModule } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const items: { title: string; url: string; icon: typeof LayoutDashboard; module: SupportModule }[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, module: "dashboard" },
  { title: "All Tickets", url: "/tickets", icon: Inbox, module: "tickets" },
  { title: "My Tickets", url: "/tickets/mine", icon: UserCircle2, module: "tickets" },
  { title: "Escalated", url: "/tickets/escalated", icon: AlertOctagon, module: "tickets" },
  { title: "Resolved", url: "/tickets/resolved", icon: CheckCircle2, module: "tickets" },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const visibleItems = items.filter((item) => canAccess(user?.role, item.module));

  const isActive = (url: string) =>
    url === "/tickets" ? path === "/tickets" : path === url || path.startsWith(`${url}/`);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <div className="grid size-9 place-items-center rounded-lg bg-sidebar-primary font-bold text-sidebar-primary-foreground">
          <LifeBuoy className="size-5" />
        </div>
        <div>
          <div className="text-base font-bold leading-none">Real Bounty</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Support</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleItems.map((item) => {
          const active = isActive(item.url);
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                active
                  ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/90 hover:text-sidebar-foreground hover:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.08)]",
              )}
            >
              {active && (
                <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-white/80" />
              )}
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-lg transition-all duration-200",
                  active
                    ? "bg-white/15"
                    : "bg-sidebar-foreground/5 group-hover:bg-sidebar-primary/25 group-hover:shadow-[0_0_12px_oklch(0.42_0.16_28/0.3)]",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 transition-colors duration-200",
                    active ? "text-white" : "text-sidebar-foreground/65 group-hover:text-sidebar-primary",
                  )}
                />
              </span>
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0 leading-tight">
            <div className="truncate text-xs font-semibold">{user?.name ?? "Agent"}</div>
            <div className="truncate text-[10px] text-sidebar-foreground/60">{user?.role ?? ""}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            title="Log out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
        <div className="text-[11px] text-sidebar-foreground/50">
          v1.0.0 • {new Date().getFullYear()} Real Bounty
        </div>
      </div>
    </aside>
  );
}
