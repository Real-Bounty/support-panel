import { StatusBadge as SharedStatusBadge } from "@/shared";
import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/lib/mock/types";

const TICKET_STATUS_CLASSES: Record<TicketStatus, string> = {
  Open: "bg-status-open/15 text-status-open border-status-open/30",
  "In Progress": "bg-status-progress/15 text-status-progress border-status-progress/30",
  "Waiting User": "bg-status-waiting/20 text-status-waiting border-status-waiting/40",
  Escalated: "bg-status-escalated/15 text-status-escalated border-status-escalated/40",
  Resolved: "bg-status-resolved/15 text-status-resolved border-status-resolved/30",
  Closed: "bg-status-closed/15 text-status-closed border-status-closed/30",
};

const CHIP_STATUS_CLASSES: Record<TicketStatus, string> = {
  Open: "chip-status-open",
  "In Progress": "chip-status-progress",
  "Waiting User": "chip-status-waiting",
  Escalated: "chip-status-escalated",
  Resolved: "chip-status-resolved",
  Closed: "chip-status-closed",
};

const CHIP_BASE = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap";

export function StatusBadge({
  status,
  className,
  variant = "default",
}: {
  status: TicketStatus;
  className?: string;
  variant?: "default" | "chip";
}) {
  if (variant === "chip") {
    return (
      <span className={cn(CHIP_BASE, CHIP_STATUS_CLASSES[status], className)}>
        {status}
      </span>
    );
  }

  return (
    <SharedStatusBadge
      value={status}
      classNameMap={TICKET_STATUS_CLASSES}
      rounded="full"
      className={className}
    />
  );
}
