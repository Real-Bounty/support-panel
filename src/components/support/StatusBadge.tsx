import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/lib/mock/types";

const map: Record<TicketStatus, string> = {
  "Open": "bg-status-open/15 text-status-open border-status-open/30",
  "In Progress": "bg-status-progress/15 text-status-progress border-status-progress/30",
  "Waiting User": "bg-status-waiting/20 text-status-waiting border-status-waiting/40",
  "Escalated": "bg-status-escalated/15 text-status-escalated border-status-escalated/40",
  "Resolved": "bg-status-resolved/15 text-status-resolved border-status-resolved/30",
  "Closed": "bg-status-closed/15 text-status-closed border-status-closed/30",
};

export function StatusBadge({ status, className }: { status: TicketStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        map[status],
        className
      )}
    >
      {status}
    </span>
  );
}
