import { cn } from "@/lib/utils";
import type { TicketPriority } from "@/lib/mock/types";

const map: Record<TicketPriority, string> = {
  Critical: "bg-priority-critical text-white",
  High: "bg-priority-high text-white",
  Medium: "bg-priority-medium text-white",
  Low: "bg-priority-low/20 text-priority-low border border-priority-low/40",
};

export function PriorityBadge({ priority, className }: { priority: TicketPriority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        map[priority],
        className
      )}
    >
      {priority}
    </span>
  );
}
