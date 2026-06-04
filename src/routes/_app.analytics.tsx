import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Bar,
  BarChart,
  Legend,
} from "recharts";
import {
  responseTimeTrend,
  categoryDistribution,
  openVsResolvedDaily,
  agentPerformance,
} from "@/lib/mock/analytics";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · NavikX Support" }] }),
  component: Analytics,
});

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--muted-foreground)"];

function Analytics() {
  const [range, setRange] = useState("30");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Team performance and SLA insights.</p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
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
            <LineChart data={responseTimeTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="responseHours" stroke="var(--color-responseHours)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="resolutionHours" stroke="var(--color-resolutionHours)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold">Category distribution</h2>
          <p className="mb-3 text-xs text-muted-foreground">Tickets by category</p>
          <ChartContainer config={{}} className="h-[260px] w-full">
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
                {categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
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
          <BarChart data={openVsResolvedDaily}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="opened" fill="var(--color-opened)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolved" fill="var(--color-resolved)" radius={[4, 4, 0, 0]} />
          </BarChart>
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
            {agentPerformance.map((a) => (
              <TableRow key={a.agentId}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell className="text-right tabular-nums">{a.handled}</TableCell>
                <TableCell className="text-right tabular-nums">{a.avgResponseH.toFixed(1)}</TableCell>
                <TableCell className="text-right tabular-nums">{a.avgResolutionH.toFixed(1)}</TableCell>
                <TableCell className="text-right">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${a.resolutionRate >= 0.9 ? "bg-sla-green/15 text-sla-green" : "bg-sla-amber/15 text-sla-amber"}`}>
                    {(a.resolutionRate * 100).toFixed(0)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
