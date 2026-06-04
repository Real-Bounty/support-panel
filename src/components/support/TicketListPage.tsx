import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryBadge } from "./CategoryBadge";
import { SlaIndicator } from "./SlaIndicator";
import { useTickets } from "@/lib/mock/hooks";
import { agentById } from "@/lib/mock/agents";
import type { Ticket, TicketCategory, TicketPriority, TicketStatus } from "@/lib/mock/types";
import { Search, X } from "lucide-react";

const STATUSES: TicketStatus[] = ["Open", "In Progress", "Waiting User", "Escalated", "Resolved", "Closed"];
const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High", "Critical"];
const CATEGORIES: TicketCategory[] = ["Payment", "Commission", "KYC", "Referral", "Technical", "General"];

export interface TicketListPageProps {
  title: string;
  description?: string;
  filter?: (t: Ticket) => boolean;
}

export function TicketListPage({ title, description, filter }: TicketListPageProps) {
  const all = useTickets();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const rows = useMemo(() => {
    let list = filter ? all.filter(filter) : all;
    if (status !== "all") list = list.filter((t) => t.status === status);
    if (priority !== "all") list = list.filter((t) => t.priority === priority);
    if (category !== "all") list = list.filter((t) => t.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.user.id.toLowerCase().includes(q) ||
          t.user.name.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [all, filter, status, priority, category, search]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setCategory("all");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Ticket ID, User ID, or name…"
              className="pl-8"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[110px]">Ticket</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                  No tickets match these filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((t) => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-semibold">
                    <Link to="/tickets/$ticketId" params={{ ticketId: t.id }} className="hover:text-primary">
                      {t.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{t.user.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{t.user.id}</span>
                    </div>
                  </TableCell>
                  <TableCell><CategoryBadge category={t.category} /></TableCell>
                  <TableCell className="max-w-[280px]">
                    <span className="line-clamp-1 text-sm">{t.subject}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{t.summary}</span>
                  </TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                  <TableCell className="text-sm">{agentById(t.assignedAgentId)?.name ?? "—"}</TableCell>
                  <TableCell><SlaIndicator slaDueAt={t.slaDueAt} createdAt={t.createdAt} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {timeAgo(t.updatedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <p className="text-xs text-muted-foreground">{rows.length} ticket{rows.length === 1 ? "" : "s"}</p>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
