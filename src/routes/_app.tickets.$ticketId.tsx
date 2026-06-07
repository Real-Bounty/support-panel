import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/support/StatusBadge";
import { PriorityBadge } from "@/components/support/PriorityBadge";
import { CategoryBadge } from "@/components/support/CategoryBadge";
import { SlaIndicator } from "@/components/support/SlaIndicator";
import { useTicket } from "@/lib/mock/hooks";
import { ticketsStore } from "@/lib/mock/tickets";
import { agents, agentById, currentAgent } from "@/lib/mock/agents";
import type { TicketStatus } from "@/lib/mock/types";
import {
  Phone,
  Mail,
  TrendingUp,
  ShoppingBag,
  History,
  Building2,
  Paperclip,
  PlayCircle,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
  Send,
  ChevronLeft,
} from "lucide-react";
import { notify, MESSAGES, useConfirm } from "@/shared";
import { runMockAction } from "@/lib/mock-api";
import { PermissionButton } from "@/components/permission-gate";

const STATUSES: TicketStatus[] = ["Open", "In Progress", "Waiting User", "Escalated", "Resolved", "Closed"];

export const Route = createFileRoute("/_app/tickets/$ticketId")({
  head: ({ params }) => ({ meta: [{ title: `${params.ticketId} · Real Bounty Support` }] }),
  component: TicketDetail,
});

function TicketDetail() {
  const { confirm } = useConfirm();
  const { ticketId } = Route.useParams();
  const ticket = useTicket(ticketId);
  if (!ticket) throw notFound();

  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [escOpen, setEscOpen] = useState(false);
  const [escLevel, setEscLevel] = useState<"Level 2 Senior Support" | "Level 3 Admin">("Level 2 Senior Support");
  const [escReason, setEscReason] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [ticket.messages.length]);

  const send = () => {
    if (!message.trim()) return;
    ticketsStore.addMessage(ticket.id, {
      id: `m${Date.now()}`,
      author: "agent",
      agentId: currentAgent.id,
      text: message.trim(),
      timestamp: new Date().toISOString(),
      internal: isInternal,
    });
    setMessage("");
    runMockAction(null, isInternal ? MESSAGES.SUCCESS.SAVED : MESSAGES.SUCCESS.SENT);
  };

  const confirmEscalate = () => {
    if (!escReason.trim()) {
      notify.error(MESSAGES.ERROR.REASON_REQUIRED);
      return;
    }
    ticketsStore.addEscalation(ticket.id, {
      by: currentAgent.name,
      level: escLevel,
      reason: escReason.trim(),
    });
    setEscOpen(false);
    setEscReason("");
    runMockAction(null, MESSAGES.SUCCESS.ESCALATED);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/tickets"><ChevronLeft className="mr-1 h-4 w-4" /> Back to tickets</Link>
        </Button>
        <SlaIndicator slaDueAt={ticket.slaDueAt} createdAt={ticket.createdAt} />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* LEFT COLUMN */}
        <div className="space-y-4 lg:col-span-7">
          <Card className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-primary">{ticket.id}</span>
                  <CategoryBadge category={ticket.category} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <h1 className="mt-2 text-lg font-bold leading-tight">{ticket.subject}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{ticket.summary}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  value={ticket.status}
                  onValueChange={(v) => {
                    ticketsStore.update(ticket.id, { status: v as TicketStatus });
                    runMockAction(null, MESSAGES.INFO.STATUS_UPDATED);
                  }}
                >
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select
                  value={ticket.assignedAgentId}
                  onValueChange={(v) => {
                    ticketsStore.update(ticket.id, { assignedAgentId: v });
                    runMockAction(null, MESSAGES.SUCCESS.ASSIGNED);
                  }}
                >
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold">User details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{ticket.user.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{ticket.user.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="flex items-center gap-1.5 font-medium"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{ticket.user.phone}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{ticket.user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="text-xs text-muted-foreground">Referrals</p>
                  <p className="font-semibold">{ticket.user.referralCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Purchases</p>
                  <p className="font-semibold">{ticket.user.purchaseCount}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <Link to="/tickets" className="text-sm font-medium text-primary hover:underline">
                  {ticket.user.previousTicketCount} previous ticket{ticket.user.previousTicketCount === 1 ? "" : "s"}
                </Link>
              </div>
            </div>
          </Card>

          {ticket.relatedProperty && (
            <Card className="p-4">
              <h2 className="mb-2 text-sm font-semibold flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Related property</h2>
              <p className="text-sm font-medium">{ticket.relatedProperty.name}</p>
              <p className="text-xs text-muted-foreground">{ticket.relatedProperty.location} · {ticket.relatedProperty.id}</p>
            </Card>
          )}

          {ticket.relatedLead && (
            <Card className="p-4">
              <h2 className="mb-3 text-sm font-semibold">Related lead</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{ticket.relatedLead.status}</span>
                <span className="text-xs text-muted-foreground">Agent: <span className="font-medium text-foreground">{ticket.relatedLead.agent}</span></span>
                <span className="font-mono text-xs text-muted-foreground">{ticket.relatedLead.id}</span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent interactions</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {ticket.relatedLead.interactions.map((i, idx) => (
                    <li key={idx} className="flex gap-2"><span className="text-muted-foreground">·</span>{i}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Call recordings</p>
                <ul className="mt-2 space-y-1.5">
                  {ticket.relatedLead.callRecordings.map((r) => (
                    <li key={r.id} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2"><PlayCircle className="h-4 w-4 text-primary" /> {r.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">{r.duration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {ticket.escalation && ticket.escalation.length > 0 && (
            <Card className="border-status-escalated/30 bg-status-escalated/5 p-4">
              <h2 className="mb-3 text-sm font-semibold text-status-escalated flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4" /> Escalation history
              </h2>
              <ul className="space-y-3">
                {ticket.escalation.map((e) => (
                  <li key={e.id} className="rounded-md border bg-card p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{e.level}</span>
                      <span className="text-xs text-muted-foreground">{new Date(e.at).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Escalated by {e.by}</p>
                    <p className="mt-2 text-sm">{e.reason}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN - CHAT */}
        <div className="lg:col-span-5">
          <Card className="flex h-[calc(100vh-9rem)] flex-col p-0">
            <div className="flex items-center justify-between border-b p-3">
              <div>
                <h2 className="text-sm font-semibold">Conversation</h2>
                <p className="text-xs text-muted-foreground">{ticket.messages.length} messages</p>
              </div>
              <StatusBadge status={ticket.status} />
            </div>

            <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef as never}>
              <div className="space-y-3">
                {ticket.messages.map((m) => {
                  if (m.internal) {
                    return (
                      <div key={m.id} className="rounded-lg border border-priority-medium/40 bg-priority-medium/10 p-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-semibold text-priority-medium">Internal Note</span>
                          <span className="text-muted-foreground">{new Date(m.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm">{m.text}</p>
                      </div>
                    );
                  }
                  const isAgent = m.author === "agent";
                  return (
                    <div key={m.id} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${isAgent ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                        {m.attachment && (
                          <div className={`mt-2 flex items-center gap-1.5 rounded border px-2 py-1 text-xs ${isAgent ? "border-primary-foreground/30" : "border-border"}`}>
                            <Paperclip className="h-3 w-3" />
                            <span className="truncate">{m.attachment.name}</span>
                          </div>
                        )}
                        <p className={`mt-1 text-[10px] ${isAgent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {isAgent ? agentById(m.agentId ?? "")?.name ?? "Agent" : ticket.user.name} · {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch id="internal" checked={isInternal} onCheckedChange={setIsInternal} />
                  <Label htmlFor="internal" className="text-xs">
                    {isInternal ? "Internal note (not visible to user)" : "Reply to user"}
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{message.length} / 2000</span>
              </div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                placeholder={isInternal ? "Add a note for the support team…" : "Type your reply to the user…"}
                className={`min-h-[80px] resize-none ${isInternal ? "bg-priority-medium/5" : ""}`}
              />
              <div className="mt-2 flex items-center justify-between">
                <Button variant="ghost" size="sm" type="button">
                  <Paperclip className="mr-1 h-4 w-4" /> Attach
                </Button>
                <PermissionButton module="tickets" action="edit" onClick={send} size="sm" disabled={!message.trim()}>
                  <Send className="mr-1 h-4 w-4" /> Send
                </PermissionButton>
              </div>
            </div>
          </Card>

          {/* Action row */}
          <div className="mt-3 flex flex-wrap gap-2">
            <PermissionButton module="tickets" action="edit" variant="outline" size="sm" onClick={() => setEscOpen(true)} className="text-status-escalated border-status-escalated/40 hover:bg-status-escalated/10 hover:text-status-escalated">
              <ArrowUpCircle className="mr-1 h-4 w-4" /> Escalate
            </PermissionButton>
            <PermissionButton
              module="tickets"
              action="edit"
              variant="outline"
              size="sm"
              onClick={() =>
                confirm({
                  title: "Mark resolved?",
                  description: "The user will be notified that this ticket is resolved.",
                  confirmLabel: "Resolve",
                  onConfirm: () => {
                    ticketsStore.update(ticket.id, { status: "Resolved" });
                    runMockAction(null, MESSAGES.SUCCESS.RESOLVED);
                  },
                })
              }
            >
              <CheckCircle2 className="mr-1 h-4 w-4" /> Mark Resolved
            </PermissionButton>
            <PermissionButton
              module="tickets"
              action="delete"
              variant="outline"
              size="sm"
              onClick={() =>
                confirm({
                  title: "Close ticket?",
                  description: "This ticket will be archived and cannot receive new replies.",
                  confirmLabel: "Close",
                  variant: "destructive",
                  onConfirm: () => {
                    ticketsStore.update(ticket.id, { status: "Closed" });
                    runMockAction(null, MESSAGES.SUCCESS.CLOSED);
                  },
                })
              }
            >
              <XCircle className="mr-1 h-4 w-4" /> Mark Closed
            </PermissionButton>
          </div>
        </div>
      </div>

      <Dialog open={escOpen} onOpenChange={setEscOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalate ticket</DialogTitle>
            <DialogDescription>
              Route this ticket to a higher tier of support with full context.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Escalate to level</Label>
              <Select value={escLevel} onValueChange={(v) => setEscLevel(v as typeof escLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Level 2 Senior Support">Level 2 - Senior Support</SelectItem>
                  <SelectItem value="Level 3 Admin">Level 3 - Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Textarea
                value={escReason}
                onChange={(e) => setEscReason(e.target.value)}
                placeholder="Why does this need escalation?"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscOpen(false)}>Cancel</Button>
            <Button
              onClick={() =>
                confirm({
                  title: "Confirm escalation?",
                  description: `Escalate ${ticket.id} to level ${escLevel}?`,
                  confirmLabel: "Escalate",
                  variant: "destructive",
                  onConfirm: confirmEscalate,
                })
              }
            >
              Confirm escalation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
