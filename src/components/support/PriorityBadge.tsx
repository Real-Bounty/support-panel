import { cn } from "@/lib/utils";
import type { TicketPriority } from "@/lib/mock/types";

const DEFAULT_CLASSES: Record<TicketPriority, string> = {
  Critical: "bg-priority-critical text-white",
  High: "bg-priority-high text-white",
  Medium: "bg-priority-medium text-white",
  Low: "bg-priority-low/20 text-priority-low border border-priority-low/40",
};

const CHIP_CLASSES: Record<TicketPriority, string> = {
  Critical: "chip-priority-critical",
  High: "chip-priority-high",
  Medium: "chip-priority-medium",
  Low: "chip-priority-low",
};

const CHIP_BASE = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap";
const DEFAULT_BASE = "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap";

export function PriorityBadge({
  priority,
  className,
  variant = "default",
}: {
  priority: TicketPriority;
  className?: string;
  variant?: "default" | "chip";
}) {
  const isChip = variant === "chip";

  return (
    <span
      className={cn(
        isChip ? CHIP_BASE : DEFAULT_BASE,
        isChip ? CHIP_CLASSES[priority] : DEFAULT_CLASSES[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}
