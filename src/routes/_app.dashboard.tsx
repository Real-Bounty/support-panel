import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Bar,
  ComposedChart,
  Line,
  Legend,
} from "recharts";
import { useTickets } from "@/lib/mock/hooks";
import { currentAgentId } from "@/lib/mock/agents";
import {
  responseTimeTrend,
  categoryDistribution,
  openVsResolvedDaily,
  agentPerformance,
} from "@/lib/mock/analytics";
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
import { StatCard } from "@/shared";
import { UserAvatar } from "@/components/support/user-avatar";

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--muted-foreground)"];

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Real Bounty Support" }] }),
  component: Dashboard,
});

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
    { label: "Open Tickets", value: open, delta: "+4 vs yesterday", icon: Inbox, tone: "info" },
    { label: "My Assigned", value: mine, delta: mine > 0 ? "Active" : "All clear", icon: UserCircle2, tone: "primary" },
    { label: "Escalated", value: escalated, delta: "Needs attention", icon: AlertOctagon, tone: "destructive" },
    { label: "Avg Response", value: "1.8h", delta: "↓ 0.3h", icon: Timer, tone: "accent" },
    { label: "Avg Resolution", value: "7.4h", delta: "↓ 0.6h", icon: Hourglass, tone: "warning" },
    { label: "Resolved Today", value: resolvedToday, delta: "+2 vs yesterday", icon: CheckCircle2, tone: "success" },
  ] as const;

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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            hint={s.delta}
            tone={s.tone}
            icon={<s.icon className="size-5" />}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold">Response time trend</h2>
          <p className="mb-3 text-xs text-muted-foreground">Average first-response time (hours), past 30 days</p>
          <ChartContainer
            config={{
              responseHours: { label: "Response (h)", color: "var(--chart-1)" },
              resolutionHours: { label: "Resolution (h)", color: "var(--chart-2)" },
            }}
            className="h-[260px] w-full"
          >
            <AreaChart data={responseTimeTrend}>
              <defs>
                <linearGradient id="respFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-responseHours)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-responseHours)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="resFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-resolutionHours)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-resolutionHours)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)" }} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="responseHours" stroke="var(--color-responseHours)" strokeWidth={2.5} fill="url(#respFill)" activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="resolutionHours" stroke="var(--color-resolutionHours)" strokeWidth={2.5} fill="url(#resFill)" activeDot={{ r: 4 }} />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold">Category distribution</h2>
          <p className="mb-3 text-xs text-muted-foreground">Tickets by category</p>
          <ChartContainer config={{}} className="h-[260px] w-full">
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={2} stroke="var(--card)" strokeWidth={2}>
                {categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ChartContainer>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold">Open vs Resolved (daily)</h2>
        <p className="mb-3 text-xs text-muted-foreground">Tickets opened and resolved per day</p>
        <ChartContainer
          config={{
            opened: { label: "Opened", color: "var(--chart-1)" },
            resolved: { label: "Resolved", color: "var(--chart-4)" },
          }}
          className="h-[280px] w-full"
        >
          <ComposedChart data={openVsResolvedDaily}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)" }} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)" }} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "var(--color-muted)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="opened" fill="var(--color-opened)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          </ComposedChart>
        </ChartContainer>
      </Card>

      <Card className="p-0">
        <div className="border-b p-4">
          <h2 className="text-sm font-semibold">Agent performance</h2>
          <p className="text-xs text-muted-foreground">Per-agent productivity and SLA metrics</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Tickets handled</TableHead>
              <TableHead className="text-right">Avg response (h)</TableHead>
              <TableHead className="text-right">Avg resolution (h)</TableHead>
              <TableHead className="text-right">Resolution rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentPerformance.map((a) => {
              const pct = Math.round(a.resolutionRate * 100);
              const rateColor =
                a.resolutionRate >= 0.9 ? "var(--sla-green)" : a.resolutionRate >= 0.75 ? "var(--sla-amber)" : "var(--sla-red)";
              return (
                <TableRow key={a.agentId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={a.name} />
                      <span className="font-medium">{a.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{a.handled}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.avgResponseH.toFixed(1)}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.avgResolutionH.toFixed(1)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: rateColor }} />
                      </div>
                      <span className="w-9 text-right text-xs font-semibold tabular-nums" style={{ color: rateColor }}>
                        {pct}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
