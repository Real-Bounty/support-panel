import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTickets } from "@/lib/mock/hooks";
import { ticketsStore } from "@/lib/mock/tickets";
import { currentAgentId } from "@/lib/mock/agents";
import { StatusBadge } from "@/components/support/StatusBadge";
import { PriorityBadge } from "@/components/support/PriorityBadge";
import { SlaIndicator } from "@/components/support/SlaIndicator";
import {
  Inbox,
  UserCircle2,
  AlertOctagon,
  Timer,
  Hourglass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import type { TicketStatus } from "@/lib/mock/types";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · NavikX Support" }] }),
  component: Dashboard,
});

const STATUSES: TicketStatus[] = ["Open", "In Progress", "Waiting User", "Escalated", "Resolved", "Closed"];

function Dashboard() {
  const all = useTickets();
  const now = Date.now();

  const open = all.filter((t) => !["Resolved", "Closed"].includes(t.status)).length;
  const mine = all.filter((t) => t.assignedAgentId === currentAgentId && !["Resolved", "Closed"].includes(t.status)).length;
  const escalated = all.filter((t) => t.status === "Escalated").length;
  const breached = all.filter((t) => new Date(t.slaDueAt).getTime() < now && !["Resolved", "Closed"].includes(t.status));
  const resolvedToday = all.filter(
    (t) => t.status === "Resolved" && Date.now() - new Date(t.updatedAt).getTime() < 86_400_000
  ).length;

  const stats = [
    { label: "Open Tickets", value: open, delta: "+4 vs yesterday", icon: Inbox, tone: "text-status-open" },
    { label: "My Assigned", value: mine, delta: `${mine > 0 ? "Active" : "All clear"}`, icon: UserCircle2, tone: "text-primary" },
    { label: "Escalated", value: escalated, delta: "Needs attention", icon: AlertOctagon, tone: "text-status-escalated" },
    { label: "Avg Response", value: "1.8h", delta: "↓ 0.3h", icon: Timer, tone: "text-chart-2" },
    { label: "Avg Resolution", value: "7.4h", delta: "↓ 0.6h", icon: Hourglass, tone: "text-chart-3" },
    { label: "Resolved Today", value: resolvedToday, delta: "+2 vs yesterday", icon: CheckCircle2, tone: "text-status-resolved" },
  ];

  const myRecent = all
    .filter((t) => t.assignedAgentId === currentAgentId)
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of support workload and SLA health.</p>
      </div>

      {breached.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-sla-red/40 bg-sla-red/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sla-red text-white">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sla-red">
                {breached.length} ticket{breached.length === 1 ? "" : "s"} have breached SLA
              </p>
              <p className="text-xs text-muted-foreground">
                Address overdue tickets immediately to restore SLA compliance.
              </p>
            </div>
          </div>
          <Button asChild variant="destructive" size="sm">
            <Link to="/tickets">View breached <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums">{s.value}</p>
              </div>
              <s.icon className={`h-5 w-5 ${s.tone}`} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{s.delta}</p>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-base font-semibold">My recent tickets</h2>
            <p className="text-xs text-muted-foreground">5 most recently updated tickets assigned to you</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/tickets/mine">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <div className="divide-y">
          {myRecent.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center gap-3 p-4 hover:bg-muted/30">
              <Link
                to="/tickets/$ticketId"
                params={{ ticketId: t.id }}
                className="font-mono text-xs font-semibold text-primary hover:underline"
              >
                {t.id}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.subject}</p>
                <p className="truncate text-xs text-muted-foreground">{t.user.name} · {t.user.id}</p>
              </div>
              <PriorityBadge priority={t.priority} />
              <SlaIndicator slaDueAt={t.slaDueAt} createdAt={t.createdAt} />
              <Select
                value={t.status}
                onValueChange={(v) => ticketsStore.update(t.id, { status: v as TicketStatus })}
              >
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <StatusBadge status={t.status} />
            </div>
          ))}
          {myRecent.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No tickets assigned to you.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
