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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryBadge } from "./CategoryBadge";
import { SlaIndicator } from "./SlaIndicator";
import { ListCard } from "./list-card";
import { UserAvatar } from "./user-avatar";
import { useTickets } from "@/lib/mock/hooks";
import { agentById } from "@/lib/mock/agents";
import type { Ticket, TicketCategory, TicketPriority, TicketStatus } from "@/lib/mock/types";
import { PageHeader, EmptyState, MESSAGES, useDebounce } from "@/shared";

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
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const rows = useMemo(() => {
    let list = filter ? all.filter(filter) : all;
    if (status !== "all") list = list.filter((t) => t.status === status);
    if (priority !== "all") list = list.filter((t) => t.priority === priority);
    if (category !== "all") list = list.filter((t) => t.category === category);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.user.id.toLowerCase().includes(q) ||
          t.user.name.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [all, filter, status, priority, category, debouncedSearch]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setCategory("all");
  };

  return (
    <div className="space-y-4">
      <PageHeader title={title} description={description} />

      <ListCard
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by Ticket ID, User ID, or name…"
        onReset={clearFilters}
        filters={
          <>
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
          </>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subject</TableHead>
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
                <TableCell colSpan={8} className="p-0 border-0">
                  <EmptyState title={MESSAGES.EMPTY.NO_RESULTS} description="Try adjusting your filters." />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((t) => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={t.user.name} />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-sm font-medium">{t.user.name}</span>
                        <Link
                          to="/tickets/$ticketId"
                          params={{ ticketId: t.id }}
                          className="font-mono text-xs text-muted-foreground hover:text-primary"
                        >
                          {t.id}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><CategoryBadge category={t.category} variant="chip" /></TableCell>
                  <TableCell className="max-w-[340px]">
                    <span className="line-clamp-1 text-sm">{t.subject}</span>
                  </TableCell>
                  <TableCell><StatusBadge status={t.status} variant="chip" /></TableCell>
                  <TableCell><PriorityBadge priority={t.priority} variant="chip" /></TableCell>
                  <TableCell className="text-sm">{agentById(t.assignedAgentId)?.name ?? "-"}</TableCell>
                  <TableCell><SlaIndicator slaDueAt={t.slaDueAt} createdAt={t.createdAt} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {timeAgo(t.updatedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ListCard>

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
