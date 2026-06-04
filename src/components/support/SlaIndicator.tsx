import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/mock/hooks";

function fmt(ms: number) {
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h`;
  }
  return `${h}h ${m}m`;
}

export function SlaIndicator({
  slaDueAt,
  createdAt,
  className,
}: {
  slaDueAt: string;
  createdAt: string;
  className?: string;
}) {
  const now = useNow(30_000);
  const due = new Date(slaDueAt).getTime();
  const created = new Date(createdAt).getTime();
  const total = due - created || 1;
  const remaining = due - now;
  const pct = remaining / total;

  const breached = remaining < 0;
  const warning = !breached && pct < 0.4;

  const tone = breached
    ? "bg-sla-red text-white"
    : warning
    ? "bg-sla-amber/20 text-sla-amber border border-sla-amber/40"
    : "bg-sla-green/15 text-sla-green border border-sla-green/30";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold tabular-nums whitespace-nowrap",
        tone,
        breached && "animate-pulse",
        className
      )}
      title={`SLA due ${new Date(slaDueAt).toLocaleString()}`}
    >
      {breached ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
      {breached ? `Overdue ${fmt(remaining)}` : `${fmt(remaining)} left`}
    </span>
  );
}
